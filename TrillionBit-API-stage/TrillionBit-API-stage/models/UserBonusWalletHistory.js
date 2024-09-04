const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserBonusWalletHistorySchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	bonusType: {
		type: String,
		default: null
	},
	coin: {
		type: String,
		default: 'USD'
	},
	bonusAmount: {
		type: String,
		default: '0'
	},
	freezAmount: {
		type: Boolean,
		default: false,
	},
	approved: {
		type: Boolean,
		default: false
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

module.exports = userBonusWalletHistory = mongoose.model("userBonusWalletHistory", UserBonusWalletHistorySchema);