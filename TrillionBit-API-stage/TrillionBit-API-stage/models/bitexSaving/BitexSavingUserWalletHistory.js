const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const mongoosePaginate = require('mongoose-paginate-v2');


// Create Schema
const BitexSavingUserWalletHistorySchema = new Schema({

	userId: {
		type: String,
		require: true
	},

	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users"
	},
	
	coin: {
		type: String,
		require: true
	},

	annualizedInterestRate: {
		type: String,
		require: true
	},

	amount: {
		type: String,
		require: true
	},

	interestAmount: {
		type: String,
		require: true
	},

	totalAmount: {
		type: String,
		require: true
	},
	
	durationDay: {
		type: String,
		require: true
	},

	lockDay: {
		type: String,
		require: true
	},

	redemptionDate: {
		type: Date,
		default: Date.now
	},
	
	status: {
		type: String,
		default: 'transfer'
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

BitexSavingUserWalletHistorySchema.plugin(mongoosePaginate);
module.exports = BitexSavingUserWalletHistory = mongoose.model("BitexSavingUserWalletHistory", BitexSavingUserWalletHistorySchema);