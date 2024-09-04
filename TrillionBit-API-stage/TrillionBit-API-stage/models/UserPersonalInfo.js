const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserPersonalInfoSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	streetAddress: {
		type: String,
		require: false
	},
	postalCode: {
		type: String,
		require: false
	},
	city: {
		type: String,
		require: false
	},
	country: {
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

module.exports = UserPersonalInfo = mongoose.model("userPersonalInfos", UserPersonalInfoSchema);