const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongoosePaginate = require("mongoose-paginate-v2");
const aggregatePaginate = require("mongoose-aggregate-paginate-v2");

// Create Schema
const UserWalletSchema = new Schema({
	userId: {
		type: String,
		require: true,
	},
	walletId: {
		type: String,
		require: true,
	},
	viabtcWalletId: {
		type: Number,
		require: true,
	},
	destinationTag: {
		type: Number,
		require: false,
	},
	coin: {
		type: String,
		require: true,
	},
	fiat: {
		type: Boolean,
		default: false,
	},
	bitgo: {
		type: Boolean,
		default: false,
	},
	label: {
		type: String,
		require: true,
	},
	walletAddress: {
		type: String,
		require: false,
	},
	walletXAddress: {
		type: String,
		require: false,
	},
	walletTrxAddress: {
		type: String,
		require: false,
	},
	walletTrxId: {
		type: String,
		require: false,
	},
	walletAmount: {
		type: String,
		require: true,
	},
	walletFreezAmount: {
		type: String,
		required: false,
	},
	bonusWalletAmount: {
		type: String,
		default: "0",
	},
	active: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

UserWalletSchema.plugin(mongoosePaginate);
UserWalletSchema.plugin(aggregatePaginate);
module.exports = UserWallet = mongoose.model("userWallet", UserWalletSchema);
