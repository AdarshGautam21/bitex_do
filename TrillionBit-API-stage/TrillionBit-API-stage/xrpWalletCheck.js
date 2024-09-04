const mongoose = require('mongoose');
const gravatar = require('gravatar');
const TwinBcrypt = require('twin-bcrypt');
require('dotenv').config();

// DB Config
const db = "mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex";
// const db = "mongodb://157.245.154.181:24083/bitexuae";

// Connect to mongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // console.log(db + ' MongoDB connected');
    })
    .catch(err => {
        // console.log(err);
        process.exit();
    });

const XrpWallet = require('./models/xrp/XrpWallet');
const UserWallet = require('./models/UserWallet');

const xrpWallet = XrpWallet.findOne({'_id': '5e826f1c8a36df0b52a17935'});
let totalTags = 10003419;

for(let i = 10000000; i < totalTags; i++) {
    UserWallet.find({destinationTag: i})
        .then(async userWallets => {
            if (userWallets.length > 1) {
                let j = 0;
                for(userWallet of userWallets) {
                    if (j >= 1) {
                        // console.log(userWallet.destinationTag, 'is now', totalTags + 1);
                        userWallet.destinationTag = totalTags + 1;
                        await userWallet.save();
                    }
                    totalTags = totalTags + 1;
                    j = j + 1;
                }
            }
            // console.log(userWallets.length, i);
        });
}

