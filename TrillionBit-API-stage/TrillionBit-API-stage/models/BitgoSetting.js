const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BitgoSettingSchema = new Schema({
	live: {
		type: Boolean,
		default: false
	},
	accessKey: {
		type: String,
		require: false
	},
	walletId: {
		type: String,
		require: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = BitgoSetting = mongoose.model("bitgoSettings", BitgoSettingSchema);