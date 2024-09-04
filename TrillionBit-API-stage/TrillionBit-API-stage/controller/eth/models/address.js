var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addressSchema = new Schema({
	address: {type: String, unique: true},
	privateKey: {type: String, required: true, unique: true}
});

var Address = mongoose.model('ethAddress', addressSchema);

module.exports = Address;
