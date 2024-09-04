const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// Create Schema
const WalletMaintenanceSchema = new Schema({
	name: {
		type: String,
		require: true,
	},
	displayName: {
		type: String,
		require: false,
	},
	fiat: {
		type: Boolean,
		default: false,
	},
	maintenance: {
		withdrawal: {
			type: Boolean,
			default: false,
		},
		deposit: {
			type: Boolean,
			default: false,
		},
	},
	active: {
		type: Boolean,
		default: true,
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

WalletMaintenanceSchema.plugin(mongoosePaginate);
WalletMaintenanceSchema.set("timestamps", true);

module.exports = WalletMaintenance = mongoose.model(
	"walletMaintenance",
	WalletMaintenanceSchema
);
