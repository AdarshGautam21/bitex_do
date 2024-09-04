const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const VortexUserSchema = new Schema({
	name: {
		type: String,
		require: false
	},
	email: {
		type: String,
		require: true
	},
	phone: {
		type: String,
		require: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
	
});

module.exports = VortexUser = mongoose.model("vortexUsers", VortexUserSchema);