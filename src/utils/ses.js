var AWS = require("aws-sdk");
require("aws-sdk/lib/maintenance_mode_message").suppress = true;

AWS.config.update({
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	},
	region: "eu-north-1",
});
var ses = new AWS.SES();

async function sendMailSes(walletAddress, txHash, toEmail) {
	try {
		ses.sendEmail(
			{
				Destination: {
					ToAddresses: [toEmail],
				},
				Source: "leostelon17@gmail.com",
				Message: {
					Subject: { Data: "Transaction alert⚠️" },
					Body: {
						Html: {
							Charset: "UTF-8",
							Data: `There was a transaction related to ${walletAddress}, you can check the transaction by click this <a class="ulink" href="https://viewblock.io/arweave/tx/${txHash}" target="_blank">link</a>.`,
						},
					},
				},
			},
			function (err, data) {
				if (err) console.log(err, err.stack);
				else return data;
			}
		);
	} catch (error) {
		console.log({ UTIL_SES: error.message });
	}
}

module.exports = { sendMailSes };
