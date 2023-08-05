const ArLocal = require("arlocal");

async function initiateArServer() {
	const arLocal = new ArLocal.default();
	await arLocal.start();
}

initiateArServer();

module.exports = { initiateArServer };
