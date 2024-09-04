const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const mongoose = require('mongoose');
const gravatar = require('gravatar');
const TwinBcrypt = require('twin-bcrypt');
const curl = require('curl');
var fs = require( 'fs' );
require('dotenv').config();

const contractAddress = '0x207335749Ac86B2dae43b36E259eFa252b90779F';

// DB Config
//const db = `mongodb://${process.env.MONGO_USER}:${encodeURIComponent(process.env.MONGO_PASS)}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
// const db = `mongodb://${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
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


// const db = "mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex";
// // const db = "mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex";

// // Connect to mongoDB
// mongoose
//   .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
//     .then(() => {
//         console.log('MongoDB connected');
//     })
//     .catch(err => {
//         console.log(err);
//         process.exit();
//     });


// const certFileBuf = fs.readFileSync('/var/www/rds-combined-ca-bundle.pem');

// mongoose
// .connect(db, { sslCA: certFileBuf })
//   .then(() => console.log('MongoDB connected'))
//   .catch(err => {
//     console.log(err);
//     process.exit();
//   });

const UserDepositRequest = require('./models/UserDepositRequest');
const UserWithdrawRequest = require('./models/UserWithdrawRequest');
const WalletTransactions = require('./models/wallet/WalletTransactions');
const User = require('./models/User');
const UserProfile = require('./models/UserProfile');
const Order = require('./models/trading/Order');
const UserWallet = require('./models/UserWallet');

const WalletController = require('./controller/WalletController');
const EthController = require('./controller/EthController');
const XrpController = require('./controller/XrpController');
const TronController = require('./controller/TronController');

var Address = require('./controller/eth/models/address');

let userId = 'rutulnarania81@gmail.com';

updateViabtcWallet = async (userWallet) => {
  const params = [
      parseInt(userWallet.userId.replace(/\D/g,'')),
      userWallet.coin,
      'deposit',
      new Date().getTime(),
      '-'+userWallet.amount,
      {}
  ];

  const postParamas = {
      method: 'balance.update',
      params: params,
      id: 1516681174
  }

    return curl.post('http://139.162.234.246:8080/', JSON.stringify(postParamas), {}, async function(err, response, body) {
      if(err){
        console.log(`Wallet Failed to Updated`, err);
        return false;
      } else {
        console.log(`${parseInt(userWallet.userId.replace(/\D/g,''))} Wallet Updated`);
        return true;
      }
    });
}

updateUserViabtcBalance = async () => {
  const users = await User.find({});
  for (user of users) {
    console.log(user._id);
    const userBtxWallet = await UserWallet.findOne({userId: user._id, coin: 'BTX'});
    const userInrWallet = await UserWallet.findOne({userId: user._id, coin: 'INR'});
    if (userBtxWallet) {
      if (parseFloat(userBtxWallet.walletAmount) > 0) {
        console.log(userBtxWallet.walletAmount);
        // await updateViabtcWallet(userBtxWallet);
      }
    }
    if (userInrWallet) {
      if (parseFloat(userInrWallet.walletAmount) > 0) {
        console.log(userInrWallet.walletAmount);
        // await updateViabtcWallet(userInrWallet);
      }
    }
  }
}

// updateUserViabtcBalance();

transferEth = async () => {
  let user = await User.findOne({email: userId});
  // let userWallet = await UserWallet.findOne({walletAddress: '0x3fbEaf832eA8ee88463e53FDa066441f0C6C3009', coin: 'ETH'});
  let userWallet = await UserWallet.findOne({userId: user._id, coin: 'ETH'});
  if (userWallet) {
    // console.log(userWallet);
    const walletBalance = await EthController.balance(userWallet.walletId);
    console.log(walletBalance, (parseFloat(walletBalance) - 0.0001));
    const walletController =  await WalletController.sendCrypto(user, userWallet, '0x77172de4f4afc40c2034f6ba9ccf211619d7dbf0', userWallet.walletAddress, (parseFloat(walletBalance) - 0.017), note="Go out", destinationTag='');
    // const ethWalletTransactions = await EthController.send(userWallet.walletId, '0x77172de4f4afc40c2034f6ba9ccf211619d7dbf0', 0.011972675);
    console.log(walletController);
  } else {
    console.log('User wallet not found');
  }
  // let user = await User.findOne({email: userId});
  // if (user) {
  // } else {
  //   console.log('User not found');
  // }1000000000000000
}

// transferEth();

exportDeposit = async () => {
    // let depositRequests = await WalletTransactions.find({type: 'Deposit', state: 'Finished', coin: 'ETH'});
    // const users = await User.find({});
    // let depositRequestList = [];
    // let depositInrRequests = await UserDepositRequest.find({status: 'Finished', coin: 'INR'});
    let ordersList = [];
    let ordersRequests = await Order.find({createTime: {"$gte":"2021-04-01T00:00:00.000Z","$lte":"2021-06-30T23:59:37.146Z"}})
    
    for(ordersRequest of ordersRequests) {
        let user = await User.findOne({_id: ordersRequest.userId});
        let depositReqst = {
          ...ordersRequest._doc,
          dealStock: parseFloat(ordersRequest._doc.dealStock) > 0 ? ordersRequest._doc.dealStock : ordersRequest._doc.amount,
          dealMoney: parseFloat(ordersRequest._doc.dealMoney) > 0 ? ordersRequest._doc.dealMoney : ordersRequest._doc.price,
          side: ordersRequest._doc.side == 1 ? 'Sell' : 'Buy',
          type: ordersRequest._doc.type == 1 ? 'Limit' : 'Market',
          user: user ? `${user.firstname} ${user.lastname}` : '-',
          email: user ? `${user.email}` : '-',
        };
        ordersList.push(depositReqst);
    }
    // console.log(depositRequestList);

    // const csvWriter = createCsvWriter({
    //     path: 'WithdrawalINRRequest.csv',
    //     header: [
    //       {id: 'status', title: 'status'},
    //       {id: 'amount', title: 'amount'},
    //       {id: 'coin', title: 'coin'},
    //       {id: 'noteNumber', title: 'noteNumber'},
    //     ]
    //   });
    

    // const csvWriter = createCsvWriter({
    //   path: 'users.csv',
    //   header: [
    //     {id: 'firstname', title: 'First Name'},
    //     {id: 'lastname', title: 'Last Name'},
    //     {id: 'email', title: 'Email'},
    //     {id: 'createdAt', title: 'Date'},
    //   ]
    // });

      const csvWriter = createCsvWriter({
        path: 'AprlToJuneOrders.csv',
        header: [
          {id: 'status', title: 'status'},
          {id: 'dealStock', title: 'dealStock'},
          {id: 'dealMoney', title: 'dealMoney'},
          {id: 'side', title: 'side'},
          {id: 'type', title: 'type'},
          {id: 'makerFee', title: 'makerFee'},
          {id: 'takerFee', title: 'takerFee'},
          {id: 'market', title: 'market'},
          {id: 'updateDate', title: 'updateDate'},
          {id: 'createTime', title: 'createTime'},
          {id: 'email', title: 'Email'},
          {id: 'user', title: 'User'},
        ]
      });
    
    // const options = { 
    //     fieldSeparator: ',',
    //     quoteStrings: '"',
    //     decimalSeparator: '.',
    //     showLabels: true, 
    //     showTitle: true,
    //     title: 'DepositRequest',
    //     useTextFile: false,
    //     useBom: true,
    //     useKeysAsHeaders: true,
    //     // headers: ['Column 1', 'Column 2', etc...] <-- Won't work with useKeysAsHeaders present!
    //   };
     
    // if (users) {
    //     csvWriter
    //     .writeRecords(users)
    //     .then(()=> console.log('The CSV file was written successfully'));
    // }
    if (ordersList) {
        csvWriter
        .writeRecords(ordersList)
        .then(()=> console.log('The transaction CSV file was written successfully'));
    }
}

// exportDeposit();

const transferXrp = async () => {
  const clientId = 'abc';
  const recipientAddress = 'rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh';
  // const recipientAddress = 'rNRQ9HrhSwYEDZtxBGnhiY7D4P8yTMThzQ';
  // const recipientAddress = 'rU2mEJSLqBRkYLVTv55rFTgQajkLTnT6mA';
  const amount = 114.34;
  // const destinationTag = '108543';
  const destinationTag = '362523508';
  // const sendXrp = await XrpController.internalDepositToWithdrawSend('rqcVUTf6Pq8RgDCDYuw7Bse1UsnuxXWS5', 100);
  const sendXrp = await XrpController.send(clientId, recipientAddress, amount, destinationTag);

  console.log(sendXrp);
}

transferXrp();

const tronTransactions = async () => {
  const transactions = await TronController.transactions('TDjPt9uKcGgqyPHqn2cEgxvyN33R2tfs5T');
  console.log(transactions);
}

// tronTransactions();

const btxTrasnactions = async () => {
  const to = '0xD2B25924cBCDF8107AbFcC1711993F2b795DA44c';
  const from = '0x5369b63cEa62Ec91eF0DB039006EB80001437D5e';
  const amount = '5';
  const privateKey = '0xf5f6d094c0f076b372397667432a1f19da37c00e69034a2dc693a8fc5497db62';
  const contract = '0x207335749Ac86B2dae43b36E259eFa252b90779F';
  const btxWalletTransactions = await EthController.sendBtx(privateKey, from, to, amount, contract);
  console.log(btxWalletTransactions);
}

// btxTrasnactions();

const getWalletId = () => {
  // let userId = "5f4e408e99363621a3244368";
  let userId = '60cc2a3e42d20848feb8e9c5';
  console.log(parseInt(parseInt(userId.replace(/\D/g,'')).toString().substring(0, 19)));
}
// getWalletId();

const getUserWallets = async () => {
  const user = await User.findOne({email: 'andrew.urey@gmail.com'});
  if (user) {
    const userwallets = await UserWallet.find({userId: user._id});
    if (userwallets.length > 0) {
      for (userWallet of userwallets) {
        console.log(userWallet);
        if (userWallet.coin === 'ETH') {
          const ethPrivate = await Address.findOne({address: userWallet.walletAddress});
          if (ethPrivate) {
            console.log(ethPrivate);
          } else {
            console.log('Address not found');
          }
        }
      }
    } else {
      res.json({'message': 'user Wallet not found'});
    }
  } else {
    res.json({'messsage': "Failed user not found"});
  }
}

const getLatestUsers = async () => {
  const users = await User.find({ //query today up to tonight
      updatedAt: {
        $gte: new Date(2021, 10, 0o4), 
        $lt: new Date(2021, 10, 0o7)
      }
    });

    console.log(users.length, new Date(2021, 10, 0o4), new Date(2021, 10, 0o7));
    for(user of users) {
      console.log(user);
    }
}

// getLatestUsers();

const updateUserProfile = async () => {
  const user = await User.findOne({email: 'vivekpkotak@gmail.com'});
  if (user) {
    const userProfile = await UserProfile.findOne({userId: user._id});
    if (userProfile) {
      userProfile.emailVerified = true;
      await userProfile.save();
      console.log('Profile verified');
    } else {
      console.log('Profiled failed to update');
    }
  } else {
    console.log('User not found');
  }
}

// updateUserProfile();
