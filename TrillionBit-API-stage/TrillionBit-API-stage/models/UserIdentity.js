const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserIdentitySchema = new Schema({
	userId: {
		type: String,
		require: true
	},
	userNationality: {
		type: String,
		default: false
	},
	userIdentityType: {
		type: String,
		default: 'Personal'
	},
	submitted: {
		type: Boolean,
		default: false,
	},
	approve: {
		type: Boolean,
		default: false,
	},
	onHold: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.Types.ObjectId,
		ref: 'users'
	}
});

module.exports = UserIdentity = mongoose.model("userIdentities", UserIdentitySchema);