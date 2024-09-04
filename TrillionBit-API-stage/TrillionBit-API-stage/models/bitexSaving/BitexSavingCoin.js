const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

// Create Schema
const bitexSavingCoinSchema = new Schema({
	
	coin: {
		type: String,
		require: true
	},

	name: {
		type: String,
		require: false
	},

	days: [{
		numberOfDays: {
			type: String,
			default: false
		},
		interestRate: {
			type: String,
			default: false
		},
	}],

	annualizedInterestRate: {
		type: String,
		require: true
	},

	active: {
		type: Boolean,
		require: false,
		default: true
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

bitexSavingCoinSchema.set('timestamps', true); 
bitexSavingCoinSchema.plugin(mongoosePaginate);
module.exports = referralEarnedDetail = mongoose.model("bitexSavingCoin", bitexSavingCoinSchema);