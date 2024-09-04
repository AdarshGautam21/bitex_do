const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// Create Schema
const MarketsSchema = new Schema({
	name: {
		type: String,
		require: true,
	},
	displayName: {
		type: String,
		require: false,
	},
	min_amount: {
		type: String,
		require: true,
	},
	money: {
		type: String,
		require: true,
	},
	stock: {
		type: String,
		require: true,
	},
	fee_prec: {
		type: String,
		require: false,
	},
	money_prec: {
		type: String,
		require: false,
	},
	stock_prec: {
		type: String,
		require: false,
	},
	active: {
		type: Boolean,
		default: true,
	},
	priority: {
		type: Number,
		require: false,
	},
	limitOrderRange: {
		min: {
			type: String,
			require: false,
		},
		max: {
			type: String,
			require: false,
		},
	},
	marketOrderRange: {
		min: {
			type: String,
			require: false,
		},
		max: {
			type: String,
			require: false,
		},
	},
	quantityRange: {
		min: {
			type: String,
			require: false,
		},
		max: {
			type: String,
			require: false,
		},
	},
	priceRange: {
		min: {
			type: String,
			require: false,
		},
		max: {
			type: String,
			require: false,
		},
	},
	spreadBid: {
		type: String,
		require: false,
	},
	spreadAsk: {
		type: String,
		require: false,
	},
	createTime: {
		type: Date,
		default: Date.now,
	},
	updateDate: {
		type: Date,
		default: Date.now,
	},
});

MarketsSchema.plugin(mongoosePaginate);
module.exports = Markets = mongoose.model("markets", MarketsSchema);
