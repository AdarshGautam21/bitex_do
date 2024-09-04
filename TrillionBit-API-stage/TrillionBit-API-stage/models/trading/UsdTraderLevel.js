const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UsdTraderLevelSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	fromAmount: {
		type: String,
		require: true
	},
	toAmount: {
		type: String,
		require: true
	},
	maker_fee: {
		type: String,
		require: true
	},
	taker_fee: {
		type: String,
		require: false
	},
	active: {
		type: Boolean,
		default: true
	},
	createTime: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	}
});

module.exports = UsdTraderLevel = mongoose.model("usdTraderLevels", UsdTraderLevelSchema);
