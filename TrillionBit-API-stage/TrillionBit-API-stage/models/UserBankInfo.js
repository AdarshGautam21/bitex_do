const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserBankInfoSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	beneficiaryName: {
		type: String,
		require: false
	},
	bankName: {
		type: String,
		require: false
	},
	bankAccount: {
		type: String,
		require: false
	},
	bankAddress: {
		type: String,
		require: false
	},
	bankSwift: {
		type: String,
		require: false
	},
	bankIban: {
		type: String,
		require: false
	},
	bankPostalCode: {
		type: Number,
		require: false
	},
	bankCurrency: {
		type: String,
		require: false
	},
	bankCity: {
		type: String,
		require: false
	},
	varification: {
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

module.exports = UserBankInfo = mongoose.model("userBankInfos", UserBankInfoSchema);