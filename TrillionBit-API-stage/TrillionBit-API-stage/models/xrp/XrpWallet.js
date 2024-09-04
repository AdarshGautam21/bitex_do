const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const XrpWalletSchema = new Schema({
	clientId: {
		type: String,
		default: false
	},
	secret: {
		type: String,
		require: false
	},
	address: {
		type: String,
		require: false
	},
	live: {
		type: Boolean,
		default: true
	},
	lastDestinationTag: {
		type: Number,
		default: 100000000
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = XrpWallet = mongoose.model("xrpWallets", XrpWalletSchema);