const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const DocumentEmailSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	content: {
		type: String,
		require: true
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = DocumentEmail = mongoose.model("documentEmails", DocumentEmailSchema);