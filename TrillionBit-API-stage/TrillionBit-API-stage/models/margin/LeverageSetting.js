const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const LeverageSettingSchema = new Schema({
    assetsId: {
        type: String,
        require: true,
    },
	maxLeverageLevel: {
		type: String,
		require: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = LeverageSetting = mongoose.model("leverageSettings", LeverageSettingSchema);