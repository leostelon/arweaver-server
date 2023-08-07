const formData = require("form-data");
const Mailgun = require("mailgun.js");
const mailgun = new Mailgun(formData);
const mg = mailgun.client({
	username: "api",
	key: process.env.MAILGUN_API_KEY,
});

async function sendMail(walletAddress, txHash, toEmail, lastMail) {
	try {
		mg.messages
			.create("arweaver.xyz", {
				from: "Arweaver <postmaster@arweaver.xyz>",
				to: [toEmail],
				subject: "Transaction alert⚠️",
				text: "Transaction Notification",
				html: `There was a transaction related to ${walletAddress}, you can check the
                    transaction by click this
                    <span>
                        <a
                            class="ulink"
                            href="https://viewblock.io/arweave/tx/${txHash}"
                            target="_blank"
                            >link</a
                        >
                    </span>
                    <br>
                    ${
											lastMail
												? "<h6>Daily qoute limit of 5 has been touched, this is the last notification email for today.</h6>"
												: ""
										}`,
			})
			.then((msg) => console.log(msg)) // logs response data
			.catch((err) => console.log(err)); // logs any error
	} catch (error) {
		console.log({ UTIL_SES: error.message });
	}
}

module.exports = { sendMail };
