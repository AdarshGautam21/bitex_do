const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AgentCommissonSchema = new Schema({
	agentId: {
		type: String,
		require: true,
    },
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

module.exports = AgentCommisson = mongoose.model("agentCommissons", AgentCommissonSchema);