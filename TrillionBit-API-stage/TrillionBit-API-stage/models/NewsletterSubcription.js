const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const NewsletterSubscriptionSchema = new Schema({
	email: {
		type: String,
		default: false
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
});

module.exports = NewsletterSubscription = mongoose.model("newsletterSubscriptions", NewsletterSubscriptionSchema);