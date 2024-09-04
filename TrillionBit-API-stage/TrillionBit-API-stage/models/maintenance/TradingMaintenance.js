const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// Create Schema
const TradingMaintenanceSchema = new Schema({
	name: {
		type: String,
		require: true,
	},
	displayName: {
		type: String,
		require: false,
	},
	fiatName: {
		type: String,
		require: false,
	},
	active: {
		type: Boolean,
		default: true,
	},
	maintenance: {
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

TradingMaintenanceSchema.plugin(mongoosePaginate);
TradingMaintenanceSchema.set("timestamps", true);

module.exports = TradingMaintenance = mongoose.model(
	"tradingMaintenance",
	TradingMaintenanceSchema
);
