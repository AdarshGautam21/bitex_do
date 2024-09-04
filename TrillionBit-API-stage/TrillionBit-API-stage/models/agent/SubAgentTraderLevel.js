const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SubAgentTraderLevelSchema = new Schema({
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

module.exports = SubAgentTraderLevel = mongoose.model("subAgentTraderLevels", SubAgentTraderLevelSchema);
