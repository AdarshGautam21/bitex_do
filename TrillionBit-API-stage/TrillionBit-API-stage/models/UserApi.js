const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const UserApiSchema = new Schema({
	userId: {
		type: String,
		require: true,
	},
	name: {
		type: String,
		require: true,
	},
	apiKey: {
		type: String,
		require: true,
	},
	apiSecret: {
		type: String,
		require: true,
	},
	apiAccess: {
        type: [String],
        require: true,
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = UserApi = mongoose.model("userApis", UserApiSchema);