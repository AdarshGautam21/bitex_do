const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const OrderbookStreamSchema = new Schema({
    coin: {
        type: String,
        require: true,
    },
    stream: {
        type: String,
        require: true,
    },
});

module.exports = OrderbookStream = mongoose.model("orderbookStream", OrderbookStreamSchema);
