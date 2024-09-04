const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CryptoHistorySchema = new Schema({
	name: {
		type: String,
		require: true,
	},
	currency: {
		type: String,
		require: false,
	},
	history: {
		type: String,
		require: true,
	},
});

module.exports = CryptoHistory = mongoose.model("cryptoHistories", CryptoHistorySchema);
