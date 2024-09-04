const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

// Create Schema
const UserSchema = new Schema({
	firstname: {
		type: String,
		require: true
	},
	lastname: {
		type: String,
		require: true
	},
	email: {
		type: String,
		require: true
	},
	phone: {
		type: String,
		require: false
	},
	password: {
		type: String,
		require: true
	},
	country: {
		type: String,
		require: true
	},
	dateOfBirth: {
		type: String,
		require: false
	},
	avatar: {
		type: String
	},
	active: {
		type: Boolean,
		default: true,
	},
	biomatricDeviceId: {
		type: String,
		require: false
	},
	fcmToken: {
		type: String,
		require: false
	},
	suspended: {
		type: Boolean,
		default: false,
	},
	agent: {
		type: Boolean,
		default: false,
	},
	agentCode: {
		type: String,
		require: false,
	},
	subAgent: {
		type: Boolean,
		default: false,
	},
	marginTrading: {
		type: Boolean,
		default: false,
	},
	marginCall: {
		type: Boolean,
		default: false,
	},
	marginCallAt: {
		type: Date,
		default: Date.now,
	},
	walletId: {
		type: Number,
		require: false,
	},
	marginWalletId: {
		type: Number,
		require: false,
	},
	firebaseToken: {
		type: String,
		require: false,
	},
	viabtcUserId: {
		type: Number,
		require: false,
	},
	dbUpdate: {
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
	userIdentity: {
		type: Schema.Types.ObjectId,
		ref: 'userIdentities'
	},
	bitcashier: {
		type: Boolean,
		default: false
	}
});

UserSchema.plugin(mongoosePaginate);
module.exports = User = mongoose.model("users", UserSchema);