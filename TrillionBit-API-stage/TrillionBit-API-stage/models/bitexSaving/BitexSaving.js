const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

// Create Schema
const bitexSavingSchema = new Schema({

	totalLendAmount: {
		type: String,
		require: false
	},
	coin: {
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


module.exports = bitexSaving = mongoose.model("bitexSaving", bitexSavingSchema);