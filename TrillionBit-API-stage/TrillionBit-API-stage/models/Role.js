const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

// Create Schema
const RoleSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	permissions: [{
		permissionId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "role_permissions",
			default: null
		},
		permission: {
			type: String,
			default: false
		},
	}],
	type: {
		type: String,
		require: true
	},
	isActive: {
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

RoleSchema.set('timestamps', true); 
RoleSchema.plugin(mongoosePaginate);
module.exports = Role = mongoose.model("roles", RoleSchema);