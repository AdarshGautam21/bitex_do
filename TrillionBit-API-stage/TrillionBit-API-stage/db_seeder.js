const mongoose = require('mongoose');
var bcrypt = require('bcrypt');
const jsonfile = require('jsonfile');
var Queue = require('better-queue');

// DB Config
// const db = "mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex";
const db = "mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex";

// Connect to mongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');
    })
    .catch(err => {
        console.log(err);
        process.exit();
    });

const dbFile = './users.json';
const dbUserBankInfoFile = './userBankInfo.json';
const dbUserDepositFile = './userDeposit.json';
const dbUserWithdrawFile = './userWithdraw.json';
const dbUserExchangeFile = './userExchange.json';

const User = require('./models/User');
const UserIdentity = require('./models/UserIdentity');
const UserProfile = require('./models/UserProfile');
const UserWallet = require('./models/UserWallet');

const Assets = require('./models/trading/Assets');

const WalletTransactions = require('./models/wallet/WalletTransactions');
const UserBankInfo = require('./models/UserBankInfo');
const UserDepositRequest = require('./models/UserDepositRequest');
const UserWithdrawRequest = require('./models/UserWithdrawRequest');
const Order = require('./models/trading/Order');

const WalletController = require('./controller/WalletController');

const TradeCurrency = {'1': 'ETH', '2': 'BCH', '3': 'AED', '4': 'BTC',  '5': 'LTC', '6': 'GLC', '7': 'XRP'};

var asyncQue = new Queue(function (input, cb) {
  // Some processing here ...
  if (input.process === 'BankInfo') {
    createUserBankInfo(input.nUser, input.user);
  }
  if (input.process === 'Desposit') {
    createUserDeposit(input.nUser, input.user);
  }
  if (input.process === 'Withdraw') {
    createUserWithdraw(input.nUser, input.user);
  }
  if (input.process === 'Order') {
    createUserOrder(input.nUser, input.user);
  }
  if (input.process === 'Wallet') {
    createUserWallet(input.nUser, input.user);
  }
  cb(null, result);
}, { batchSize: 1, batchDelay: 3000, afterProcessDelay: 1500 });

const createUserBankInfo = (nuser, ouser) => {
  jsonfile.readFile(dbUserBankInfoFile)
    .then(obj => {
      obj.map(userBank => {
        if (userBank.user_id === ouser.id) {
          UserBankInfo.findOne({ userId: nuser._id })
            .then(async userBankInfo => {
              if (userBankInfo) {
                console.log('Details already stored, updated Again');
                userBankInfo.beneficiaryName = userBank.beneficiary_name;
                userBankInfo.bankName = userBank.bank_name;
                userBankInfo.bankIban = userBank.iban;
                userBankInfo.bankAccount = userBank.account_number;
                userBankInfo.bankAddress = userBank.branch_location;
                userBankInfo.bankSwift = userBank.swift_code;
                userBankInfo.bankPostalCode = '0000';
                userBankInfo.bankCurrency = 'AED';
                userBankInfo.bankCity = '';
                userBankInfo.varification = userBank.active;
                userBankInfo.save();

                const userProfile = await UserProfile.findOne({ userId: nuser._id });
                if(userProfile) {
                  userProfile.profileComplete = (userProfile.profileComplete + 20);
                  userProfile.save();
                }
              } else {
                const newUserBankInfo = UserBankInfo({
                  userId: nuser._id,
                  beneficiaryName: userBank.beneficiary_name,
                  bankName: userBank.bank_name,
                  bankIban: userBank.iban,
                  bankAccount: userBank.account_number,
                  bankAddress: userBank.branch_location,
                  bankSwift: userBank.swift_code,
                  bankPostalCode: '0000',
                  bankCurrency: 'AED',
                  bankCity: '',
                  varification: userBank.active,
                  createdAt: userBank.created_at,
                });
                newUserBankInfo.save()
                  .then(async nUserBankInfo => {
                    const userProfile = await UserProfile.findOne({ userId: user._id });
                    if(userProfile) {
                      userProfile.profileComplete = (userProfile.profileComplete + 20);
                      userProfile.save();
                    }
                    console.log(`${ouser.email}: Bank details created`);
                  })
                  .catch(err => {
                    console.log(`Failed to store bank details of ${ouser.email}`);
                  })
              }
            })
        }
      })
    })
};

const createUserDeposit = (nuser, ouser) => {
  jsonfile.readFile(dbUserDepositFile)
    .then(obj => {
      obj.map(userDeposit => {
        if (userDeposit.user_id === ouser.id) {
          UserDepositRequest.findOne({ userId: nuser._id, noteNumber: userDeposit.note_number })
            .then(userDepositRequest => {
              if (userDepositRequest) {
                console.log('Deposit is already stored');
              } else {
                if (userDeposit.trade_currency_id === '3') {
                  const newUserDepositRequest = UserDepositRequest({
                    userId: nuser._id,
                    type: userDeposit.deposit_type,
                    amount: userDeposit.amount,
                    coin: TradeCurrency[userDeposit.trade_currency_id],
                    address: userDeposit.cash_address,
                    timeSlot: userDeposit.timeslot,
                    pickupDate: userDeposit.pickup_date,
                    fees: userDeposit.fee,
                    status: userDeposit.status === 'done' ? 'Finished' : 'Pending',
                    approve: userDeposit.status === 'done' ? true : false,
                    noteNumber: userDeposit.note_number,
                    createdAt: userDeposit.created_at,
                  });
                  newUserDepositRequest.save()
                    .then(nUserDepositRequest => {
                      console.log(`${ouser.email}: Deposit request created created`);
                    })
                    .catch(err => {
                      console.log(`Failed to store deposit request of ${ouser.email}`);
                    })
                } else {
                  WalletTransactions.findOne({ txid: userDeposit.transaction_id })
                    .then(walletTransaction => {
                      if (walletTransaction) {
                        console.log('Transaction already exists');
                      } else {
                        const newWalletTransactions = WalletTransactions({
                          userId: nuser._id,
                          txid: userDeposit.transaction_id,
                          confirmations: userDeposit.confirmations,
                          receiverAddress: userDeposit.receiver_address,
                          type: 'Deposit',
                          rate: 0,
                          value: userDeposit.amount,
                          fees: userDeposit.fee,
                          coin: TradeCurrency[userDeposit.trade_currency_id],
                          date: userDeposit.created_at,
                          notes: userDeposit.notes,
                          state: userDeposit.status === 'done' ? 'Finished' : 'Approved',
                        });
                        newWalletTransactions.save()
                          .then(nWalletTransactions => {
                            console.log(`${ouser.email}: Deposit request created created`);
                          })
                          .catch(err => {
                            console.log(`Failed to store deposit request of ${ouser.email}`);
                          })
                      }
                    })
                    .catch(err => {
                      console.log('Transaction failed to search');
                    })
                }
              }
            })
        }
      })
    })
};

const createUserWithdraw = (nUser, ouser) => {
  jsonfile.readFile(dbUserWithdrawFile)
    .then(obj => {
      obj.map(userWithdraw => {
        if (userWithdraw.user_id === ouser.id) {
          UserWithdrawRequest.findOne({ userId: nUser._id, noteNumber: userWithdraw.note_number })
            .then(userWithdrawRequest => {
              if (userWithdrawRequest) {
                console.log('Withdraw is already stored');
              } else {
                if (userWithdraw.trade_currency_id === '3') {
                  const newUserWithdrawRequest = UserWithdrawRequest({
                    userId: nUser._id,
                    type: userWithdraw.deposit_type,
                    amount: userWithdraw.amount,
                    coin: TradeCurrency[userWithdraw.trade_currency_id],
                    address: userWithdraw.cash_address,
                    timeSlot: userWithdraw.timeslot,
                    pickupDate: userWithdraw.pickup_date,
                    fees: userWithdraw.fee,
                    status: userWithdraw.status === 'done' ? 'Finished' : 'Approved',
                    approve: userWithdraw.status === 'done' ? true : false,
                    noteNumber: userWithdraw.note_number,
                    createdAt: userWithdraw.created_at,
                  });
                  newUserWithdrawRequest.save()
                    .then(nUserWithdrawRequest => {
                      console.log(`${ouser.email}: Withdraw request created created`);
                    })
                    .catch(err => {
                      console.log(`Failed to store withdraw request of ${ouser.email}`);
                    })
                } else {
                  WalletTransactions.findOne({ txid: userWithdraw.transaction_id })
                    .then(walletTransaction => {
                      if (walletTransaction) {
                        console.log('Transaction already exists');
                      } else {
                        const newWalletTransactions = WalletTransactions({
                          userId: nUser._id,
                          txid: userWithdraw.transaction_id,
                          confirmations: userWithdraw.confirmations,
                          receiverAddress: userWithdraw.receiver_address,
                          senderAddress: userWithdraw.sender_address,
                          type: 'Withdrawal',
                          rate: 0,
                          value: userWithdraw.base_amount,
                          fees: userWithdraw.fee,
                          coin: TradeCurrency[userWithdraw.trade_currency_id],
                          date: userWithdraw.created_at,
                          notes: userWithdraw.notes,
                          state: userWithdraw.status === 'done' ? 'Finished' : 'Approved',
                        });
                        newWalletTransactions.save()
                          .then(nWalletTransactions => {
                            console.log(`${ouser.email}: Withdaw request created created`);
                          })
                          .catch(err => {
                            console.log(`Failed to store withdraw request of ${ouser.email}`);
                          })
                      }
                    })
                    .catch(err => {
                      console.log(`Failed to store withdraw request of ${ouser.email}`);
                    })
                }
              }
            })
        }
      })
    })
};

const createUserOrder = (nUser, ouser) => {
  jsonfile.readFile(dbUserExchangeFile)
    .then(obj => {
      obj.map(userExchange => {
        if (userExchange.user_id === ouser.id) {
          let orderStatus = 'Open';
          if (userExchange.status === '1') {
            orderStatus = 'Finished';
          }
          if (userExchange.status === '3') {
            orderStatus = 'Cancelled';
          }
          Order.findOne({
            userId: nUser._id,
            orderId: userExchange.order_id
          })
          .then(order => {
            if (order) {
              console.log('Order already exists.');
            } else {
              const newOrder = Order({
                userId: nUser._id,
                orderId: userExchange.order_id,
                side: userExchange.side === 'buy' ? 2 : 1,
                type: userExchange.type === 'market' ? 2 : 1,
                market: userExchange.symbol.replace(/[^a-zA-Z ]/g, ""),
                takerFee: '0.003',
                makerFee: '0.003',
                dealStock: userExchange.price,
                dealMoney: (parseFloat(userExchange.same_price) * parseFloat(userExchange.price)).toFixed(2),
                dealFee: userExchange.side === 'buy' ? userExchange.buy_fees : userExchange.sell_fees,
                amount: userExchange.price,
                price: userExchange.same_price,
                mTime: userExchange.created_date,
                cTime: userExchange.created_date,
                status: orderStatus,
                createTime: userExchange.created_date,
              });
              newOrder.save()
                .then(nOrder => {
                  console.log(`${ouser.email}: Order Created`);
                })
                .catch(err => {
                  console.log(`Failed to create order of ${ouser.email}`);
                })
            }
          })
          .catch(err => {
            console.log('Order Failed to create');
          })
        }
      })
    });

}

const createUserWallet = async (nUser, ouser) => {
  if (ouser.aed_balance) {
    let asset = await Assets.findOne({name: 'AED'});
    UserWallet.findOne({'userId': nUser._id, 'coin': asset.name})
      .then(async userWallet => {
        if (userWallet) {
          // userWallet.walletAmount = parseFloat(ouser.aed_balance);
          // await userWallet.save();

          // console.log('User wallet updated');
        } else {
          await WalletController.createWallet(nUser._id, asset, parseFloat(ouser.aed_balance));
          setTimeout(() => {return true}, 3000);
        }
      })
      .catch(err => {
        console.log('Error on getting wallet', err);
      })
  }
  if (ouser.bitcoin_balance) {
    let asset = await Assets.findOne({name: 'BTC'});
    UserWallet.findOne({'userId': nUser._id, 'coin': asset.name})
      .then(async userWallet => {
        if (userWallet) {
          // userWallet.walletAmount = parseFloat(ouser.bitcoin_balance);
          // await userWallet.save();

          console.log(ouser.email + ' BTC User wallet already exists');
        } else {
          await WalletController.createWallet(nUser._id, asset, parseFloat(ouser.bitcoin_balance));
          console.log('User new wallet created');
        }
      })
      .catch(err => {
        console.log('Error on getting wallet');
      })
  }
  if (ouser.ethereum_balance) {
    let asset = await Assets.findOne({name: 'ETH'});
    UserWallet.findOne({'userId': nUser._id, 'coin': asset.name})
      .then(async userWallet => {
        if (userWallet) {
          // userWallet.walletAmount = parseFloat(ouser.ethereum_balance);
          // await userWallet.save();

          // console.log('User wallet updated');
        } else {
          await WalletController.createWallet(nUser._id, asset, parseFloat(ouser.ethereum_balance));
        }
      })
      .catch(err => {
        console.log('Error on getting wallet');
      })
  }
  if (ouser.litecoin_balance) {
    let asset = await Assets.findOne({name: 'LTC'});
    UserWallet.findOne({'userId': nUser._id, 'coin': asset.name})
      .then(async userWallet => {
        if (userWallet) {
          // userWallet.walletAmount = parseFloat(ouser.litecoin_balance);
          // await userWallet.save();

          console.log(ouser.email + ' LTC User wallet already exists');
        } else {
          await WalletController.createWallet(nUser._id, asset, parseFloat(ouser.litecoin_balance));
          console.log('User new wallet created');
        }
      })
      .catch(err => {
        console.log('Error on getting wallet');
      })
  }
  if (ouser.bitcoincash_balance) {
    let asset = await Assets.findOne({name: 'BCH'});
    UserWallet.findOne({'userId': nUser._id, 'coin': asset.name})
      .then(async userWallet => {
        if (userWallet) {
          // userWallet.walletAmount = parseFloat(ouser.bitcoincash_balance);
          // await userWallet.save();

          console.log(ouser.email + ' BCH User wallet already exists');
        } else {
          await WalletController.createWallet(nUser._id, asset, parseFloat(ouser.bitcoincash_balance));
          console.log('User new wallet created');
        }
      })
      .catch(err => {
        console.log('Error on getting wallet');
      })
  }
  if (ouser.ripple_balance) {
    let asset = await Assets.findOne({name: 'XRP'});
    UserWallet.findOne({'userId': nUser._id, 'coin': asset.name})
      .then(async userWallet => {
        if (userWallet) {
          // userWallet.walletAmount = parseFloat(ouser.ripple_balance);
          // await userWallet.save();

          // console.log('User wallet updated');
        } else {
          await WalletController.createWallet(nUser._id, asset, parseFloat(ouser.ripple_balance));
        }
      })
      .catch(err => {
        console.log('Error on getting wallet');
      })
  }
}


jsonfile.readFile(dbFile)
  .then(obj => {
      obj.map(user => {
        User.findOne({ email: user.email })
            .then( euser => {
              if(euser) {
                console.log(`${euser.email} already exists.`);
                // createUserBankInfo(euser, user);
                // createUserDeposit(euser, user);
                // createUserWithdraw(euser, user);
                // createUserOrder(euser, user);
                // createUserWallet(euser, user);

                // asyncQue.push({ nUser: euser, user: user, process: 'BankInfo' });
                // asyncQue.push({ nUser: euser, user: user, process: 'Desposit' });
                // asyncQue.push({ nUser: euser, user: user, process: 'Withdraw' });
                // asyncQue.push({ nUser: euser, user: user, process: 'Order' });
                setTimeout(function () {
                  asyncQue.push({ nUser: euser, user: user, process: 'Wallet' });
                }, 3000)
              } else {
                const newUser = new User({
                  firstname: user.first_name,
                  lastname: user.last_name,
                  phone: user.phone,
                  email: user.email,
                  avatar: 'user.jpg',
                  password: user.password,
                  suspended: user.blocked === '1' ? true : false,
                  createdAt: new Date(user.created_at),
                  updatedAt: new Date(user.updated_at)
                });

                newUser.save()
                    .then(nUser => {
                        const userIdentity = new UserIdentity({
                            userId: nUser._id,
                            userNationality: 'AE',
                            submitted: user.documents_verified === '1' ? true : false,
                            approve: user.documents_verified === '1' ? true : false,
                        });
                        userIdentity.save();

                        const userProfile = new UserProfile({
                            userId: nUser._id,
                            emailVerified: user.email_verified === '1' ? true : false,
                            phoneVerified: user.phone_verified === '1' ? true : false
                        });
                        userProfile.save();

                        // asyncQue.push({ nUser: nUser, user: user, process: 'BankInfo' });
                        // asyncQue.push({ nUser: nUser, user: user, process: 'Desposit' });
                        // asyncQue.push({ nUser: nUser, user: user, process: 'Withdraw' });
                        // asyncQue.push({ nUser: nUser, user: user, process: 'Order' });
                        setTimeout(function () {
                          asyncQue.push({ nUser: nUser, user: user, process: 'Wallet' });
                        }, 3000)

                        // createUserBankInfo(nUser, user);
                        // createUserDeposit(nUser, user);
                        // createUserWithdraw(nUser, user);
                        // createUserOrder(nUser, user);
                        // createUserWallet(nUser);

                        console.log(`${nUser.email} created`);
                    })
                    .catch(err => {
                        console.log(`${user.email} falied to create`);
                    })
              }
            });

      });
    //   process.exit();
    })
  .catch(error => console.error(error))
