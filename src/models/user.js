const mongoose = require("mongoose");
const validator = require("validator");

const UserSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			trim: true,
			validate(value) {
				if (!validator.isEmail(value.toString())) {
					throw new Error("Invalid email.");
				}
			},
		},
		notifications_sent: {
			type: Number,
			required: true,
			trim: true,
			default: 0,
		},
		address: {
			type: String,
			required: true,
			unique: true,
			trim: true,
		},
	},
	{ timestamps: true }
);

// Pre and Post Check
const User = new mongoose.model("User", UserSchema);

module.exports = { User };
