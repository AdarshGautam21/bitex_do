const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserMarginWalletSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	walletId: {
		type: String,
		require: true
	},
	viabtcWalletId: {
		type: Number,
		require: true
	},
	destinationTag: {
		type: Number,
		require: false,
	},
	coin: {
		type: String,
		require: true
	},
	fiat: {
		type: Boolean,
		default: false
	},
	bitgo: {
		type: Boolean,
		default: false
	},
	label: {
		type: String,
		require: true
	},
	walletAddress: {
		type: String,
		require: false
	},
	walletXAddress: {
		type: String,
		require: false,
	},
	walletAmount: {
		type: String,
		require: true
	},
	availableBorrowAmount: {
		type: String,
		require: false
    },
    borrowAmount: {
		type: String,
		require: false
	},
	borrowIntrestAmount: {
		type: String,
		require: false,
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

module.exports = UserMarginWallet = mongoose.model("userMarginWallets", UserMarginWalletSchema);