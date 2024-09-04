const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Create Schema
const BankDetailSchema = new Schema({
	type: {
		type: String,
		require: true,
	},
	bankName: {
		type: String,
		require: true,
	},
	accountName: {
		type: String,
		require: true,
	},
	accountNumber: {
		type: String,
		require: true,
	},
	accountType: {
		type: String,
		default: null,
	},
	swiftCode: {
		type: String,
		default: null,
	},
	ifscCode: {
		type: String,
		default: null,
	},
	IBAN: {
		type: String,
		default: null,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = BankDetail = mongoose.model("bankDetails", BankDetailSchema);
