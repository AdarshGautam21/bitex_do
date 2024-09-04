const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AgentDefaultSettingSchema = new Schema({
	makerFee: {
		type: String,
		require: true,
    },
    takerFee: {
		type: String,
		require: true,
    },
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = AgentDefaultSetting = mongoose.model("agentDefaultSettings", AgentDefaultSettingSchema);