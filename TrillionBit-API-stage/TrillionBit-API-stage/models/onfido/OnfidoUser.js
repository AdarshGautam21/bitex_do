const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const OnfidoUserSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	applicantId: {
		type: String,
		require: true
	},
	checksId: {
		type: String,
		require: false,
	},
	resultsUri: {
		type: String,
		require: false,
	},
	reportIds: {
		type: String,
		require: false,
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = OnfidoUser = mongoose.model("onfidoUsers", OnfidoUserSchema);