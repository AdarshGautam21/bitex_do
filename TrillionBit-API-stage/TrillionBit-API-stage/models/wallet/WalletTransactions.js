const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

// Create Schema
const WalletTransactionSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	txid: {
		type: String,
		require: false,
		unique: true
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

WalletTransactionSchema.virtual('txid_short').get(function() {
	return (this.txid) ? this.txid.substr(1, 8) : '';
});
WalletTransactionSchema.plugin(mongoosePaginate);
module.exports = WalletTransaction = mongoose.model("walletTransactions", WalletTransactionSchema);