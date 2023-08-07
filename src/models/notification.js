const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
	{
		tx_type: {
			type: String,
			required: true,
			default: " ",
		},
		creator_address: {
			type: String,
			required: true,
		},
		address: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

const Notification = new mongoose.model("Notification", NotificationSchema);

module.exports = { Notification };
