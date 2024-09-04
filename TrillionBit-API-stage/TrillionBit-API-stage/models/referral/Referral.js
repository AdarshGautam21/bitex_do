const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ReferralSchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	uniquId: {
		type: String,
		require: false
	},
	referralCode: {
		type: String,
		require: false
	},
	numberOfReferrals: {
		type: Number,
		require: false
	},
	totalReferralEarnings: {
		type: String,
		default: false,
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

module.exports = Referral = mongoose.model("referrals", ReferralSchema);