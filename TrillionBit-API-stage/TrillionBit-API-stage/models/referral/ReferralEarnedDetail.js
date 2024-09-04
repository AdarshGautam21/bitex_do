const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

// Create Schema
const referralEarnedDetailSchema = new Schema({
	
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users"
	},

	ReferralUser: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users"
	},

	coin: {
		type: String,
		require: true
	},

	earnedAmount: {
		type: String,
		require: true
	},

	earnedMarket: {
		type: String,
		require: false
	},

	earnedPercentage: {
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

referralEarnedDetailSchema.set('timestamps', true); 
referralEarnedDetailSchema.plugin(mongoosePaginate);
module.exports = referralEarnedDetail = mongoose.model("referralEarnedDetails", referralEarnedDetailSchema);