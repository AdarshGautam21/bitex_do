const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const VortexUserDepositRequestSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	type: {
		type: String,
		default: 'Deposite'
	},
	amount: {
		type: String,
		require: false
	},
	coin: {
		type: String,
		require: false
	},
	address: {
		type: String,
		require: false
	},
	timeSlot: {
		type: String,
		require: false
	},
	pickupDate: {
		type: String,
		require: false
	},
	fees: {
		type: String,
		default: '0',
	},
	status: {
		type: String,
		default: 'Pending'
	},
	approve: {
		type: Boolean,
		default: false,
	},
	noteNumber: {
		type: String,
		require: false,
	},
	referenceNumber: {
		type: String,
		require: false,
	},
	transactionId: {
		type: String,
		default: null
	},
	paymentType: {
		type: String,
		default: null
	},
	paymentStatus: {
		type: String,
		default: null
	},
	responseMsg: {
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

module.exports = VortexUserDepositRequest = mongoose.model("vortexUserDepositRequests", VortexUserDepositRequestSchema);