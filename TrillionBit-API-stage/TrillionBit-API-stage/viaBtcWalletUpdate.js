const axios = require('axios');
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const TwinBcrypt = require('twin-bcrypt');
const jsonfile = require('jsonfile')
require('dotenv').config();
const environment = 'live';

// const db = "mongodb://157.245.154.181:24083/bitexuae";

// Connect to mongoDB
if (environment === 'live') {
    // DB Config
    // const db = `mongodb://bitexuae:${encodeURIComponent('Y8!$b6l$fb!ZKl^pBS')}@bitex-db.cluster-cwcyz1rnuz0v.ap-south-1.docdb.amazonaws.com:22007/bitexuae?ssl=true&replicaSet=rs0&retryWrites=false`;
    const db = 'mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex'
    const certFileBuf = fs.readFileSync('/var/www/rds-combined-ca-bundle.pem');

    mongoose
        .connect(db, { sslCA: certFileBuf })
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err));
} else {
    // DB Config
    const db = "mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex";

    mongoose
      .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(() => {
            // console.log(db + ' MongoDB connected');
        })
        .catch(err => {
            // console.log(err);
            process.exit();
        });
}


const UserWallet = require('./models/UserWallet');
const User = require('./models/User');
const WalletSettings = require('./models/wallet/WalletSettings');
const WalletController = require('./controller/WalletController');


async function updateAllUserWallet() {
    let walletSettings = await WalletSettings.find({});
    let userWallets = await UserWallet.find({});
    let wallets = [];
    let i = 0;
    let walletId = 609345;

    if (walletSettings.length > 0) {
        walletId = walletSettings[0].walletLastId;
    }

    for (userWallet of userWallets) {
        try {
            const user = await User.findOne({_id: userWallet.userId});
    
            if (user) {
                // Update last viabtc wallet Id
                walletSettings[0].walletLastId = walletId;
                await walletSettings[0].save();
        
                // Update last wallet id to user
                if (user.viabtcUserId) {
                    //
                } else {
                    walletId = (walletId + 1);
        
                    user.viabtcUserId = walletId;
                    await user.save();
                }
        
                let wallet = {}
                let viaBalance = await WalletController.getViabtcWalletBalance(userWallet, user.viabtcUserId);
        
                console.log(viaBalance, userWallet.coin);
        
                wallet.userId = userWallet.userId;
                wallet.walletId = userWallet._id;
                // wallet.viaBtcId = user.walletId;
                wallet.email = user.email;
        
                if (parseFloat(userWallet.walletAmount) > parseFloat(viaBalance)) {
                    let walletDeposit = await WalletController.depositeWallet(userWallet, (parseFloat(userWallet.walletAmount) - parseFloat(viaBalance)));
                    if (walletDeposit) {
                        console.log(`${user.viabtcUserId} Deposited...`);
                    }
                } else if (parseFloat(userWallet.walletAmount) < parseFloat(viaBalance)) {
                    let walletWithdrawal = await WalletController.withdrawWallet(userWallet, (parseFloat(viaBalance) - parseFloat(userWallet.walletAmount)));
                    if (walletWithdrawal) {
                        console.log(`${user.walletId}  Withdraw...`);
                    }
                }
        
                let viaNewBalance = await WalletController.getViabtcWalletBalance(userWallet, user.viabtcUserId);
                console.log(user.viabtcUserId, user.email, viaNewBalance, userWallet.coin);
                wallet.walletAmount = userWallet.walletAmount;
                wallet.coin = userWallet.coin;
                wallet.viaBalance = viaNewBalance;
        
                wallets.push(wallet);
            }
        } catch (e) {
            //
        }

        if (i > userWallets.length) {
            break;
        }
        i = i + 1;
    }
    jsonfile.writeFile('./viaWalletBalance.json', wallets, function (err) {
        if (err) console.error(err)
    })
}

updateAllUserWallet();

    // UserWallet.find({destinationTag: i})
    //     .then(async userWallets => {
    //         if (userWallets.length > 1) {
    //             let j = 0;
    //             for(userWallet of userWallets) {
    //                 if (j >= 1) {
    //                     console.log(userWallet.destinationTag, 'is now', totalTags + 1);
    //                     userWallet.destinationTag = totalTags + 1;
    //                     await userWallet.save();
    //                 }
    //                 totalTags = totalTags + 1;
    //                 j = j + 1;
    //             }
    //         }
    //         console.log(userWallets.length, i);
    //     });

