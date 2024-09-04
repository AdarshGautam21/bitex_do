const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");
const Schema = mongoose.Schema;

// Create Schema
const MaintenanceSchema = new Schema({
	type: {
		type: String,
		require: true,
	},
	maintenance: {
		type: Boolean,
		default: false,
	},
});

MaintenanceSchema.plugin(mongoosePaginate);
module.exports = Maintenance = mongoose.model(
	"maintenance",
	MaintenanceSchema
);
