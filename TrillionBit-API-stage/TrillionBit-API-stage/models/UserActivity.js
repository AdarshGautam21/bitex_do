const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// Create Schema
const UserActivitySchema = new Schema({
	userId: {
		type: String,
		require: true,
	},
	userIp: {
		type: String,
		require: false,
	},
	browserName: {
		type: String,
		require: false,
	},
	fullBrowserVersion: {
		type: String,
		require: false,
	},
	osName: {
		type: String,
		require: false,
	},
	osVersion: {
		type: String,
		require: false,
	},
	getUA: {
		type: String,
		require: false,
	},
	mobileVendor: {
		type: String,
		require: false,
	},
	mobileModel: {
		type: String,
		require: false,
	},
	deviceType: {
		type: String,
		require: false,
	},
	logTime: {
		type: Date,
		default: Date.now,
	},
	lastPass: {
		type: String,
		require: false,
	},
});

UserActivitySchema.plugin(mongoosePaginate);
module.exports = UserActivity = mongoose.model(
	"userActivities",
	UserActivitySchema
);
