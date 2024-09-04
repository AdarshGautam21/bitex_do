const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const bankUtrDetailSchema = new Schema({
	UTR: {
		type: String,
		require: false
	},
	MODE: {
		type: String,
		require: false
	},
	SENDERREMARK: {
		type: String,
		require: false
	},
	customerAccountNo: {
		type: String,
		require: false
	},
	amount: {
		type: Number,
		require: false
	},
	payeeName: {
		type: String,
		require: false
	},
	payeeAccountNumber: {
		type: String,
		require: false
	},
	bankPostalCode: {
		type: Number,
		require: false
	},
	payeeBankIFSC: {
		type: String,
		require: false
	},
	PayeePaymentDate: {
		type: String,
		default: null
	},
	bankInternalTransactionNumber: {
		type: String,
		default: null
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

module.exports = bankUtrDetail = mongoose.model("bankUtrDetail", bankUtrDetailSchema);