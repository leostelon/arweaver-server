const { default: axios } = require("axios");

function timeout(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

class Subscribe {
	_currentBlock = 1233889;
	_indexingCycle;

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
				console.log(
					`INDEXING CYCLE: ${this._indexingCycle}; NETWORK CYCLE: ${this._currentCycle}`
				);

				if (this._indexingCycle < this._currentCycle) {
					this._indexingCycle += 1;
				}

				if (this._indexingCycle >= this._currentCycle) {
					await timeout(60 * 1000);
				}
			}
		} catch (error) {
			console.log(error);
			console.log({ LISTENER_LISTEN: error.message });
			if (this._indexingCycle >= this._currentCycle) {
				await timeout(60 * 1000);
			}
			this._listenForCycle();
		}
	}

	async _getCurrentCycle() {
		let cycle = await axios.get("https://arweave.net/height");
		this._currentCycle = cycle.data;
		return this._currentCycle;
	}
}

module.exports = { Subscribe };
