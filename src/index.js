const fs = require("fs");
const path = require("path");
// Import env
require("dotenv").config({
	path: path.join(__dirname, "../.env"),
});

const express = require("express");
const routes = require("./routes");

const app = express();
app.use(express.static(__dirname));

// Database
require("./database/mongoose");

const models = path.join(__dirname, "models");
fs.readdirSync(models)
	.filter((file) => ~file.search(/^[^.].*\.js$/))
	.forEach((file) => require(path.join(models, file)));

const { Subscribe } = require("./subscriber.js");
new Subscribe({ indexingCycle: 0 });

// CORS
app.use(function (req, res, next) {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Methods",
		" GET, POST, PATCH, PUT, DELETE, OPTIONS"
	);
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	next();
});
app.use(express.json());

// Routes
app.use(routes);

app.get("/", (req, res) => {
	res.send({ message: "Arweave mail notification server📨" });
});

app.listen(3001, () => {
	console.log("App listening on port 3001");
});
