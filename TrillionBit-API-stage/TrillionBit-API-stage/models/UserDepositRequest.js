const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;
// Create Schema
const UserDepositRequestSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	type: {
		type: String,
		require: true
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

UserDepositRequestSchema.plugin(mongoosePaginate);
module.exports = UserDepositRequest = mongoose.model("userDepositRequests", UserDepositRequestSchema);