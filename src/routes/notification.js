const { Notification } = require("../models/notification");
const { User } = require("../models/user");

const router = require("express").Router();

router.post("/", async (req, res) => {
	try {
		const user = await User.findOne({ address: req.body.creator_address });
		if (!user)
			return res.status(404).send({ message: "Invalid user address!" });

		const notificationExist = await Notification.findOne({
			creator_address: req.body.creator_address,
			address: req.body.address,
			tx_type: req.body.tx_type,
		});
		if (notificationExist)
			return res.status(500).send({ message: "Notification already exists." });

		const notification = new Notification(req.body);
		await notification.save();
		res.send(notification);
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

router.get("/:address", async (req, res) => {
	try {
		const notifications = await Notification.find({
			creator_address: req.params.address,
		});
		res.send(notifications);
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

router.delete("/:id", async (req, res) => {
	try {
		const notification = await Notification.deleteOne({
			_id: req.params.id,
		});
		res.send(notification);
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

module.exports = router;
