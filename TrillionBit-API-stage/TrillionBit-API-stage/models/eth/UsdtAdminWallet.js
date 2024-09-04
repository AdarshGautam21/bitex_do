const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UsdtAdminWalletSchema = new Schema({
	clientId: {
		type: String,
		default: false
	},
	privateKey: {
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
	createdAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = UsdtAdminWalletWallet = mongoose.model("usdtAdminWallet", UsdtAdminWalletSchema);