const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const WalletUsdtTransactionSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	txid: {
		type: String,
		require: false
	},
	receiverAddress: {
		type: String,
		require: false
	},
	destinationTag: {
		type: String,
		require: false
	},
	senderAddress: {
		type: String,
		require: false
	},
	confirmations: {
		type: Number,
		require: false
	},
	type: {
		type: String,
		require: true
	},
	rate: {
		type: String,
		require: true
	},
	value: {
		type: String,
		require: true
	},
	fees: {
		type: String,
		require: true
	},
	coin: {
		type: String,
		require: false
	},
	state: {
		type: String,
		require: false
	},
	notes: {
		type: String,
		require: false
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = WalletUsdtTransaction = mongoose.model("walletUsdtTransactions", WalletUsdtTransactionSchema);