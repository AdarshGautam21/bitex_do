const mongoose = require('mongoose');
const gravatar = require('gravatar');
const TwinBcrypt = require('twin-bcrypt');
require('dotenv').config();

// DB Config
const db = "mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex";

// Connect to mongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log(db + 'MongoDB connected');
    })
    .catch(err => {
        console.log(err);
        process.exit();
    });

const User = require('./models/User');
const UserWallet = require('./models/UserWallet');
const WalletController = require('./controller/WalletController');

let viaWalletId = 600000;

const updateUserViabtc = async () => {
  const users = await User.find();
  for (user of users) {
    if (!user.dbUpdate) {
      const userWallets = await UserWallet.find({userId: user._id});
      for(userWallet of userWallets) {
        console.log(userWallet.coin);
        walletAmount = await WalletController.updateViaWalletBalance(userWallet, viaWalletId);
        console.log(userWallet.coin, walletAmount, viaWalletId);
      }
      user.viabtcUserId = viaWalletId
      user.dbUpdate = true;
      await user.save();
      viaWalletId = viaWalletId + 1;
    }
  }
}

updateUserViabtc();

// const data = {
//     email: 'admin@bitexuae.com',
//     name: 'Admin',
//     password: 'n9K7kr2hSjpatsEFOgHR'
// }

// Admin.findOne({ email: data.email })
//     .then( admin => {
//       if(admin) {
//         console.log('Admin already exists.');
//         process.exit();
//       } else {
//         const avatar = gravatar.url(data.email, {
//           s: '200', // Size
//           r: 'pg', // Rating
//           d: 'mm' // Default
//         });

//         const newAdmin = new Admin({
//           name: data.name,
//           email: data.email,
//           avatar,
//           password: data.password
//         });

//         TwinBcrypt.hash(newAdmin.password, function(hash) {
//           // Store hash in your password DB.
//           newAdmin.password = hash;
//             newAdmin
//               .save()
//               .then(admin => {
//                 console.log('DB successfully migrated.');
//                 process.exit();
//               })
//               .catch(err => {
//                 console.log(err);
//                 process.exit();
//               });
//         });

//       }
//     });

