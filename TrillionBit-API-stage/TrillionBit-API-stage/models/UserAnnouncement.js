const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserAnnouncementSchema = new Schema({
	announceTitle: {
		type: String,
		default: false
	},
	announceDetails: {
		type: String,
		default: false
	},
	newAnnounce: {
		type: Boolean,
		default: true,
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

module.exports = UserAnnouncement = mongoose.model("userAnnouncements", UserAnnouncementSchema);