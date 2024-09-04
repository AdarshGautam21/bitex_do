const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserPaymentSchema = new Schema({
	userId: {
		type: String,
		require: true
	},

	transactionId: {
		type: String,
		default: null
	},
	amount: {
		type: Number,
		default: null
	},
	coin: {
		type: String,
		default: null
	},
	fees: {
		type: Number,
		default: null
	},
	paymentType: {
		type: String,
		default: null
	},
	status: {
		type: String,
		default: null
	},
	orderId: {
		type: String,
		default: null
	},
	hash: {
		type: String,
		default: null
	},
	responseCode: {
		type: Number,
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

module.exports = UserPayment = mongoose.model("userPayment", UserPaymentSchema);