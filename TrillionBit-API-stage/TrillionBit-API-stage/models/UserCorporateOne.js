const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserCorporateOneSchema = new Schema({
	userIdentityId: {
		type: String,
		require: true
	},
	firstname: {
		type: String,
		require: false
	},
	lastname: {
		type: String,
		require: false
	},
	dateOfBirth: {
		type: String,
		require: false
	},
	email: {
		type: String,
		require: false
	},
	nationality: {
		type: String,
		require: false
	},
	phone: {
		type: String,
		require: false
	},
	officeAddress: {
		type: String,
		require: false
    },
    officeCity: {
		type: String,
		require: false
    },
    officeContry: {
		type: String,
		require: false
    },
    officeZip: {
		type: Number,
		require: false
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

module.exports = UserCorporateOne = mongoose.model("userCorporateOnes", UserCorporateOneSchema);