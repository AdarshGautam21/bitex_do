const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// Create Schema
const AssetsSchema = new Schema({
	userId: {
		type: String,
		require: true,
	},
	availableCount: {
		type: String,
		require: true,
	},
	name: {
		type: String,
		require: true,
	},
	alias: {
		type: String,
		require: false,
	},
	displayName: {
		type: String,
		require: false,
	},
	totalBalance: {
		type: String,
		require: true,
	},
	availableBalance: {
		type: String,
		require: true,
	},
	freezeCount: {
		type: String,
		require: false,
	},
	freezeBalance: {
		type: String,
		require: false,
	},
	fiat: {
		type: Boolean,
		default: false,
	},
	bitgo: {
		type: Boolean,
		default: false,
	},
	active: {
		type: Boolean,
		default: false,
	},
	depositFee: {
		type: String,
		require: false,
	},
	withdrawalFee: {
		type: String,
		require: false,
	},
	withdrawalFeeERC20: {
		type: String,
		require: false,
	},
	description: {
		type: String,
		require: false,
	},
	createTime: {
		type: Date,
		default: Date.now,
	},
	updateDate: {
		type: Date,
		default: Date.now,
	},
});

AssetsSchema.plugin(mongoosePaginate);
module.exports = Assets = mongoose.model("assets", AssetsSchema);
