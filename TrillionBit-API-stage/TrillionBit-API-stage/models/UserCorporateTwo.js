const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserCorporateTwoSchema = new Schema({
	userIdentityId: {
		type: String,
		require: true
	},
	fullLegleName: {
		type: String,
		require: false
	},
	numberOfDirectors: {
		type: String,
		require: false
	},
	incorporationDate: {
		type: String,
		require: false
	},
	nationality: {
		type: String,
		require: false
	},
	businessType: {
		type: String,
		require: false
	},
	registrationNumber: {
		type: String,
		require: false
	},
	bankName: {
		type: String,
		require: false
    },
    bankAccountNumber: {
		type: String,
		require: false
    },
    bankAccountHolderName: {
		type: String,
		require: false
    },
    bankCountry: {
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
	}
});

module.exports = UserCorporateTwo = mongoose.model("userCorporateTwos", UserCorporateTwoSchema);