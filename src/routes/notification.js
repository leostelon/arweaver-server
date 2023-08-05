const { Notification } = require("../models/notification");

const router = require("express").Router();

router.post("/", async (req, res) => {
	try {
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
			user_address: req.params.address,
		});
		res.send(notifications);
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

module.exports = router;
