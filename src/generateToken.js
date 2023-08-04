const Arweave = require("arweave");

async function generateTokens() {
	const arweave = Arweave.init({
		host: "localhost",
		port: 1984,
		protocol: "http",
	});

	await arweave.api.get(
		`mint/TdI0_fJdea2fVHWDDxbl1IhZaqTZjeBdWrtD5MeMqXc/10000000000000000`
	);
}

// generateTokens();
