const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

// Create Schema
const RolePermissionSchema= new Schema({
	name: {
		type: String,
		require: true
	},
	type: {
		type: String,
		require: false
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

RolePermissionSchema.set('timestamps', true); 
RolePermissionSchema.plugin(mongoosePaginate);
module.exports = RolePermission = mongoose.model("role_permissions", RolePermissionSchema);