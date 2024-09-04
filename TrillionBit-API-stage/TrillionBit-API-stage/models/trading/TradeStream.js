const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const TradeStreamSchema = new Schema({
    coin: {
        type: String,
        require: true,
    },
    stream: {
        type: String,
        require: true,
    },
});

module.exports = TradeStream = mongoose.model("tradeStream", TradeStreamSchema);
