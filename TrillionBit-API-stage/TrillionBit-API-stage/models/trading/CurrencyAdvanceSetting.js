const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const CurrencyAdvanceSettingSchema = new Schema({
	settingName: {
		type: String,
		require: true
	},
	value: {
		type: String,
		require: true
	},
});

module.exports = CurrencyAdvanceSetting = mongoose.model("currencyAdvanceSettings", CurrencyAdvanceSettingSchema);
