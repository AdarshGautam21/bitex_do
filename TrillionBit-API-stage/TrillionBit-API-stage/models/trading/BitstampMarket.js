const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BitstampMarketSchema = new Schema({
    market: {
        type: String,
        require: false,
    },
    currency: {
      type: String,
      require: false,
    },
    high: {
      type: String,
      require: false
    },
    low: {
      type: String,
      require: false
    },
    last: {
      type: String,
      require: false
    },
    open: {
      type: String,
      require: false
    },
    volume: {
      type: String,
      require: false
    },
    bid: {
      type: String,
      require: false
    },
    ask: {
      type: String,
      require: false
    },
    timestamp: {
      type: String,
	  	require: false
    }
});

module.exports = BitstampMarket = mongoose.model("bitstampMarkets", BitstampMarketSchema);
