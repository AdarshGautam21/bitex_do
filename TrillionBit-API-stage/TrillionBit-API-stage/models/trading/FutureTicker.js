const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const FutureTickerSchema = new Schema({
    tag: {
        type: String,
        require: true,
    },
    name: {
		type: String,
		require: true
	},
    stock: {
		type: String,
		require: true
    },
    money: {
		type: String,
		require: true
	},
	pair: {
		type: String,
		require: true
	},
	symbol: {
        type: String,
        require: true
    },
    markPrice: {
        type: String,
        require: true
    },
    bid: {
        type: String,
        require: true
    },
    bidSize: {
        type: String,
        require: true
    },
    ask: {
        type: String,
        require: true
    },
    askSize: {
        type: String,
        require: true
    },
    vol24h: {
        type: String,
        require: true
    },
    openInterest: {
        type: String,
        require: true
    },
    open24h: {
        type: String,
        require: true
    },
    last: {
        type: String,
        require: true
    },
    lastTime: {
        type: String,
        require: true
    },
    lastSize: {
        type: String,
        require: true
    },
    suspended: {
        type: Boolean,
        require: false
    },
});

module.exports = FutureTicker = mongoose.model("futureTickers", FutureTickerSchema);
