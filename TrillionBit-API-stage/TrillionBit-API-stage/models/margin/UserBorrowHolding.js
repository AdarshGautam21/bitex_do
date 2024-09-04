const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserMarginWalletSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	userMarginWalletId: {
		type: String,
		require: true
	},
    borrowAmount: {
		type: String,
		require: false
    },
    borrowIntrestAmount: {
		type: String,
		require: false
    },
    active: {
		type: Boolean,
		default: true
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = UserMarginWallet = mongoose.model("userBorrowHoldings", UserMarginWalletSchema);