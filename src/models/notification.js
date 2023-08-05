const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
	{
		tx_type: {
			type: String,
			required: true,
			default: " ",
		},
		user_id: {
			type: mongoose.Types.ObjectId,
			required: true,
		},
	},
	{ timestamps: true }
);

const Notification = new mongoose.model("Notification", NotificationSchema);

module.exports = { Notification };
