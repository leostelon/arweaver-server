const router = require("express").Router();

router.post("/", async (req, res) => {
	try {
		const notification = 
		res.send({ mesage: "Hello" });
	} catch (error) {
		res.status(500).send({ message: error.message });
	}
});

module.exports = router;
