const ArLocal = require("arlocal");
const Arweave = require("arweave");

async function initiateArServer() {
	const arLocal = new ArLocal.default();
	await arLocal.start();
}

initiateArServer();

module.exports = { initiateArServer };
