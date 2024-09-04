const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AdminSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	currentVersion: {
		type: String,
		require: true
	},
	previousVersion: {
		type: String,
		require: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Admin = mongoose.model("appVersions", AdminSchema);