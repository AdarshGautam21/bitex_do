const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const SubAgentSchema = new Schema({
	agentId: {
		type: String,
		require: true,
	},
	subAgentId: {
		type: String,
		require: true,
    },
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = SubAgent = mongoose.model("subAgents", SubAgentSchema);