const router = require("express").Router();

router.use("/test", async (req, res) => {
	try {
		res.send({ mesage: "Hello" });
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

module.exports = router;
