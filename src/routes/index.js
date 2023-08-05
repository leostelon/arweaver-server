const router = require("express").Router();
const user = require("./user");
const notification = require("./notification");
const kwil = require("./kwil");

router.use("/user", user);
router.use("/notification", notification);
router.use("/kwil", kwil);

module.exports = router;
