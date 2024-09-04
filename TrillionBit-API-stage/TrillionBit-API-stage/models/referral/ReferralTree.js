const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ReferralTreeSchema = new Schema({
	referralId: {
		type: String,
		require: true
	},
	referredUser: {
		type: String,
		require: false
	},
	referredUserEarning: {
		type: String,
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

module.exports = ReferralTree = mongoose.model("referralTrees", ReferralTreeSchema);