const mongoose = require("mongoose");

const MailSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
		},
		user_address: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Mail = new mongoose.model("Mail", MailSchema);

module.exports = { Mail };
