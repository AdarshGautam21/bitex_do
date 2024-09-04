const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AdminSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	password: {
		type: String,
		require: true
	},
	avatar: {
		type: String
	},
	roles: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: "roles",
		default: null
	}],
	permissions: {
		type: String,
		require: false,
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Admin = mongoose.model("admins", AdminSchema);