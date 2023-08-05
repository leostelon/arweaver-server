const mongoose = require("mongoose");
const validator = require("validator");
const { utils } = require("web3");

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
			validate(value) {
				if (!validator.isEthereumAddress(value.toString())) {
					throw new Error("Invalid user address");
				}
			},
		},
	},
	{ timestamps: true }
);

// Pre and Post Check
// Checksum conversion
UserSchema.pre("save", function (next) {
	if (this.isModified("address")) {
		this.address = utils.toChecksumAddress(this.address);
	}
	next();
});

const User = new mongoose.model("User", UserSchema);

module.exports = { User };
