const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ReferralSettingSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	commissionPercentage: {
		type: Number,
		require: false
	},
	btxCommissionPercentage: {
		type: Number,
		require: false
	},
	earningPeriod: {
		type: Number,
		require: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = ReferralSetting = mongoose.model("referralSettings", ReferralSettingSchema);