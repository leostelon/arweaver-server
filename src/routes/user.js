const { User } = require("../models/user");
const router = require("express").Router();

router.post("/", async (req, res) => {
	try {
		if (!req.body.address)
			return res.status(500).send({ message: "Please send address" });
		const userExist = await User.findOne({ address: req.body.address });
		if (userExist)
			return res.status(401).send({ message: "User already exists" });
		const user = await new User(req.body);
		user.save();
		res.send(user);
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

router.get("/:address", async (req, res) => {
	try {
		const user = await User.findOne({ address: req.params.address });
		if (!user)
			return res
				.status(404)
				.send({ message: "User not found with given address" });

		res.send(user);
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

module.exports = router;
