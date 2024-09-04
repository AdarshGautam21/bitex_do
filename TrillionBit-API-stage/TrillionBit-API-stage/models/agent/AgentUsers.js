const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AgentUsersSchema = new Schema({
	agentId: {
		type: String,
		require: true,
	},
	userId: {
		type: String,
		require: true,
    },
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = AgentUsers = mongoose.model("agentUsers", AgentUsersSchema);