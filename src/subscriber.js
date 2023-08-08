const { default: axios } = require("axios");
const Arweave = require("arweave");
const { Notification } = require("./models/notification");
const { User } = require("./models/user");
const { Mail } = require("./models/mail");
const { sendMail } = require("./utils/mailgun");
const arweave = Arweave.init({
	host: "arweave.net",
	port: 443,
	protocol: "https",
});

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

class Subscribe {
	_currentBlock = 1233889;
	_indexingCycle;
	_lastIndexedCycle;

	constructor({ indexingCycle = 0 }) {
		this._initiate(indexingCycle);
	}

	async _initiate(indexingCycle) {
		if (!indexingCycle || parseInt(indexingCycle) === 0) {
			indexingCycle = await this._getCurrentCycle();
		}
		this._indexingCycle = parseInt(indexingCycle);
		this._listenForCycle();
	}

	async _listenForCycle() {
		try {
			while (true) {
				this._currentCycle = await this._getCurrentCycle();

				if (this._indexingCycle < this._currentCycle) {
					this._indexingCycle += 1;
				}
				console.log(
					`INDEXING CYCLE: ${this._indexingCycle}; NETWORK CYCLE: ${this._currentCycle}`
				);

				if (this._lastIndexedCycle === this._indexingCycle) {
					console.log("LAST INDEXED:", this._indexingCycle);
					await timeout(10 * 1000);
				} else {
					// Get current block details
					const block = await arweave.blocks.getByHeight(this._indexingCycle);

					// Get transactions details
					const txs = await this._getTransactions(block.txs);
					var nextDay = new Date();
					nextDay.setDate(nextDay.getDate() + 1);
					console.log(txs.length);

					// Transmit Notifications
					for (var i = 0; i < txs.length; i++) {
						const notifications = await Notification.find({
							$or: [
								{ address: txs[i].node.recipient },
								{ address: txs[i].node.owner.address },
							],
						});
						for (var j = 0; j < notifications.length; j++) {
							const mailCountPerDay = await Mail.find({
								user_address: notifications[j].creator_address,
								createdAt: {
									$gt: new Date(new Date().toDateString()),
									$lt: new Date(nextDay.toDateString()),
								},
							});

							if (mailCountPerDay.length > 4) {
								console.log(
									"User exceeded mail count",
									notifications[j].creator_address
								);
							} else {
								const user = await User.findOne({
									address: notifications[j].creator_address,
								});
								await new Mail({
									email: user.email,
									user_address: user.address,
								}).save();
								sendMail(
									notifications[j].address,
									txs[i].node.id,
									user.email,
									mailCountPerDay.length === 4
								);
								if (mailCountPerDay.length === 4) {
									console.log("Sending last mail to", notifications[j].address);
								} else console.log("Sending mail to", notifications[j].address);
							}
						}
					}

					this._lastIndexedCycle = this._indexingCycle;

					if (this._indexingCycle >= this._currentCycle) {
						await timeout(10 * 1000);
					}
				}
			}
		} catch (error) {
			console.log({ LISTENER_LISTEN: error.message });
			if (this._indexingCycle >= this._currentCycle) {
				await timeout(10 * 1000);
			}
			this._listenForCycle();
		}
	}

	async _getCurrentCycle() {
		let cycle = await axios.get("https://arweave.net/height");
		this._currentCycle = cycle.data;
		return this._currentCycle;
	}

	async _getTransactions(transactions) {
		try {
			let txs = [];
			for (var i = 0; i < transactions.length / 100; i++) {
				let ar = transactions.slice(i * 100, (i + 1) * 100);
				let data = JSON.stringify({
					query: `query getEntity($ids: [ID!]) {
						transactions(ids: $ids, first: 100) {
							edges {
								node {
									id,
									recipient,
									__typename,
									tags{
										name,
										value
									},
									owner{
										address
									}
								}
							}
						}
					}`,
					variables: { ids: ar },
				});

				let config = {
					method: "post",
					maxBodyLength: Infinity,
					url: "https://arweave.net/graphql",
					headers: {
						"Content-Type": "application/json",
					},
					data: data,
				};
				const response = await axios.request(config);

				txs.push(...response.data.data.transactions.edges);
			}
			return txs;
		} catch (error) {
			console.log({ LISTENER_TRANSACTIONS: error.message });
		}
	}
}

module.exports = { Subscribe };
