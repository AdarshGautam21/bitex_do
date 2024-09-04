const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserOpenMarginSchema = new Schema({
    userId: {
        type: String,
        require: true,
	},
	coin: {
		type: String,
		require: false
	},
	market: {
		type: String,
		require: false
	},
	type: {
		type: String,
		require: false
	},
	totalOpenMargins: {
		type: String,
		require: false
	},
	lastExecutedPrice: {
		type: String,
		require: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = UserOpenMargin = mongoose.model("userOpenMargins", UserOpenMarginSchema);