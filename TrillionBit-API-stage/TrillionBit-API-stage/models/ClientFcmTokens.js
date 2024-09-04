const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ClientFcmTokenSchema = new Schema({
  userId: {
    type: String,
		require: true
  },
	token: {
		type: String,
		require: true
	},
});

module.exports = ClientFcmToken = mongoose.model("clientFcmTokens", ClientFcmTokenSchema);
