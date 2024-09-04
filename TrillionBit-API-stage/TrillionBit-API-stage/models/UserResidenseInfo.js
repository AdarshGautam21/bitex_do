const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserResidenseInfoSchema = new Schema({
	userIdentityId: {
		type: String,
		require: true
	},
	address: {
		type: String,
		require: false
	},
	documentFile: {
		type: String,
		require: false
	},
	city: {
		type: String,
		require: false
	},
	zipcode: {
		type: Number,
		require: false,
	},
	country: {
		type: String,
		require: false,
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

module.exports = UserResidenseInfo = mongoose.model("userResidenseInfos", UserResidenseInfoSchema);