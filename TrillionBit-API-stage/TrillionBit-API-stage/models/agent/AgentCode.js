const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AgentCodeSchema = new Schema({
    agentCode: {
		type: Number,
		require: true,
	},
});

module.exports = AgentCode = mongoose.model("agentCodes", AgentCodeSchema);