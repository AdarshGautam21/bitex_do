const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// Create Schema
const NotificationSchema = new Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		require: false,
	},
	details: {
		type: String,
		require: false,
		default: null,
	},
	notificationType: {
		id: {
			type: String,
			default: false,
		},
		documentName: {
			type: String,
			default: false,
		},
	},
	active: {
		type: Boolean,
		default: true,
	},
	isRead: {
		type: Boolean,
		default: false,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
});

NotificationSchema.set("timestamps", true);
NotificationSchema.plugin(mongoosePaginate);

module.exports = Notification = mongoose.model(
	"notifications",
	NotificationSchema
);
