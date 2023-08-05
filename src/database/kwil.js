const { Wallet, JsonRpcProvider } = require("ethers");
const kwiljs = require("kwil");
const Utils = kwiljs.Utils;

// provider and dbid are initialized here since they are used throughout the examples
// to be used for funding and signing transactions
// instead of a provider, nodeJS requires a wallet
const provider = new Wallet(
	process.env.ETH_PVT_KEY,
	new JsonRpcProvider(process.env.INFURA_ID)
);

// dbid is a unique database identifier generated from a database deployer and name
const dbid = Utils.generateDBID(
	"0x3b18dCa02FA6945aCBbE2732D8942781B410E0F9",
	"arweave"
);

const kwil = new kwiljs.NodeKwil({
	kwilProvider: "https://provider.kwil.com",
});

module.exports = { kwil, dbid, provider };
