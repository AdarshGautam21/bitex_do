const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const WalletBonusSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	type: {
		type: String,
		default: null
	},
	couponCode: {
		type: String,
		default: null
    },
	value: {
		type: String,
		default: ''
	},
	coin: {
		type: String,
		default: ''
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

module.exports = walletBonus = mongoose.model("walletBonus", WalletBonusSchema);