const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const FcmTokenSchema = new Schema({
	token: {
		type: String,
		require: true
	},
});

module.exports = FcmToken = mongoose.model("fcmtokens", FcmTokenSchema);