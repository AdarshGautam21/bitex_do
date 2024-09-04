const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserDocumentSchema = new Schema({
	userIdentityId: {
		type: String,
		require: true
	},
	documentType: {
		type: String,
		require: false
	},
	documentFile: {
		type: String,
		require: false
	},
	documentName: {
		type: String,
		require: false
	},
	verification: {
		type: Boolean,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = UserDocument = mongoose.model("userDocuments", UserDocumentSchema);