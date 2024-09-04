const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const OrderSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	orderId: {
		type: String,
		require: true
	},
	side: {
		type: Number,
		require: true
	},
	type: {
		type: Number,
		require: true
	},
	market: {
		type: String,
		require: true
	},
	takerFee: {
		type: String,
		require: false
	},
	makerFee: {
		type: String,
		require: false
	},
	amount: {
		type: String,
		require: true
	},
	price: {
		type: Number,
		require: false
	},
	source: {
		type: String,
		require: false
	},
	dealStock: {
		type: String,
		require: false
	},
	dealMoney: {
		type: Number,
		require: false
	},
	dealFee: {
		type: String,
		require: false
	},
	mTime: {
		type: String,
		require: true
	},
	cTime: {
		type: String,
		require: true
	},
	status: {
		type: String,
		default: 'Open'
	},
	margin: {
		type: Boolean,
		default: false
	},
	future: {
		type: Boolean,
		default: false
	},
	createTime: {
		type: Date,
		default: Date.now
	},
	updateDate: {
		type: Date,
		default: Date.now
	}
});

module.exports = Order = mongoose.model("orders", OrderSchema);
