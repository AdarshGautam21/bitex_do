const { MongoClient } = require('mongodb');

let _db;

module.exports = {
  connectToServer(callback) {
    MongoClient.connect(
      'mongodb://localhost:27017/xrp',
      (err, db) => {
        _db = db;
        return callback(err);
      }
    );
  },

  getDb() {
    return _db;
  },
};
