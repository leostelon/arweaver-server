const router = require("express").Router();
const notification = require("./notification");
const kwil = require("./kwil");

router.use("/notification", notification);
router.use("/kwil", kwil);

module.exports = router;
