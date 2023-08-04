const router = require("express").Router();
const notification = require("./notification");

router.use("/notification", notification);

module.exports = router;
