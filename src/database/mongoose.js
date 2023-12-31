const mongoose = require("mongoose");
const url = process.env.MONGODB_URL || "mongodb://0.0.0.0:27017/arweave";

mongoose.set("strictQuery", true); // TODO

mongoose.connect(url, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

mongoose.connection.once("open", async () => {
	console.log("Connected to the Database.");
});
