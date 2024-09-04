const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BitgoWalletIdentifierSchema = new Schema({
	name: {
		type: String,
		default: false
	},
	identifier: {
		type: String,
		require: false
	},
	type: {
		type: String,
		require: false,
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = BitgoWalletIdentifier = mongoose.model("bitgoWalletIdentifiers", BitgoWalletIdentifierSchema);