var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var addressSchema = new Schema({
	address: {type: String, unique: true},
	privateKey: {type: String, required: true, unique: true},
  publicKey: {type: String, unique: true},
  hexAddress: {type: String, unique: true},
});

var Address = mongoose.model('trxWallets', addressSchema);

module.exports = Address;
