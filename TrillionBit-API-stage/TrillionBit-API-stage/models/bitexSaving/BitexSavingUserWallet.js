const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BitexSavingUserWalletSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users"
	},
	walletId: {
		type: String,
		require: false
	},
	coin: {
		type: String,
		require: true
	},

	fiat: {
		type: Boolean,
		default: false
	},
	
	walletAmount: {
		type: String,
		require: true
	},
	walletFreezAmount: {
		type: String,
		required: false,
	},
	
	active: {
		type: Boolean,
		default: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = BitexSavingUserWallet = mongoose.model("BitexSavingUserWallet", BitexSavingUserWalletSchema);