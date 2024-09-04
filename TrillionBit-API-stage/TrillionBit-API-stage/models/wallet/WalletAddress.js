const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const WalletAddressSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	userWalletId: {
		type: String,
		require: true
	},
	walletAddress: {
		type: String,
		require: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = WalletAddress = mongoose.model("walletAddresses", WalletAddressSchema);