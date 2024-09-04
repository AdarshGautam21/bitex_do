const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CurrencySettingSchema = new Schema({
    assetsId: {
        type: String,
        require: true,
    },
	name: {
		type: String,
		require: true
	},
	currency: {
        type: String,
        require: true
    },
    value: {
        type: Number,
        require: true
    },
    premium: {
        type: String,
        require: false
    },
    discount: {
        type: String,
        require: false
    },
    spread: {
        type: String,
        require: false
    },
});

module.exports = CurrencySetting = mongoose.model("currencySettings", CurrencySettingSchema);
