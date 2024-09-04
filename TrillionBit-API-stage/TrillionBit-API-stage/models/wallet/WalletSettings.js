const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const WalletSettingsSchema = new Schema({
	walletLastId: {
		type: Number,
		require: true
	},
	marginWalletLastId: {
		type: Number,
		require: true
	},
});

module.exports = WalletSettings = mongoose.model("walletSettings", WalletSettingsSchema);
