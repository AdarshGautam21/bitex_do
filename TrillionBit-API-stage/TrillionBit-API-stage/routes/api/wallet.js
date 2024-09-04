const express = require("express");
const curl = require("curl");
const schedule = require("node-schedule");
const { Encode, Decode } = require("xrpl-tagged-address-codec");
const router = express.Router();
const jwt_decode = require("jwt-decode");

const User = require("../../models/User");
const UserProfile = require("../../models/UserProfile");
const UserIdentity = require("../../models/UserIdentity");
const UserWallet = require("../../models/UserWallet");
const ApiWallet = require("../../models/wallet/ApiWallet");
const UserMarginWallet = require("../../models/margin/UserMarginWallet");
const WalletAddress = require("../../models/wallet/WalletAddress");
const WalletTransactions = require("../../models/wallet/WalletTransactions");
const WalletUsdtTransactions = require("../../models/wallet/WalletUsdtTransactions");
const UserDepositRequest = require("../../models/UserDepositRequest");
const UserWithdrawRequest = require("../../models/UserWithdrawRequest");
const Order = require("../../models/trading/Order");
const Assets = require("../../models/trading/Assets");
const TraderLevel = require("../../models/trading/TraderLevel");
const InrTraderLevel = require("../../models/trading/InrTraderLevel");
const AgentTraderLevel = require("../../models/agent/AgentTraderLevel");
const SubAgentTraderLevel = require("../../models/agent/SubAgentTraderLevel");
const AgentClientTraderLevel = require("../../models/agent/AgentClientTraderLevel");
const BitgoSetting = require("../../models/BitgoSetting");
const CurrencySetting = require("../../models/trading/CurrencySetting");
const XrpWallet = require("../../models/xrp/XrpWallet");

const depositEmail = require("../../emails/DepositEmail");
const withdrawEmail = require("../../emails/WithdrawEmail");

const validateWalletDepositRequest = require("../../validation/user/walletDepositRequest");
const validateWalletWithdrawRequest = require("../../validation/user/walletWithdrawRequest");
const validateWalletCryptoSend = require("../../validation/user/walletCryptoSend");
const buyBtxCoinValidation = require("../../validation/buyBtxCoin");
const ReferralEarnedDetail = require("../../models/referral/ReferralEarnedDetail");
const Referral = require("../../models/referral/Referral");
const ReferralTree = require("../../models/referral/ReferralTree");
const ReferralSetting = require("../../models/referral/ReferralSetting");
const WAValidator = require("multicoin-address-validator");

const WalletController = require("../../controller/WalletController");
const Notification = require("../../models/Notifications");

const keys = require("../../config/key");
const isEmpty = require("../../validation/isEmpty");
const { v4: uuidv4 } = require("uuid");

const BitGoJS = require("bitgo");

const getBitgoBalance = async () => {
  const bitgo = new BitGoJS.BitGo({
    env: "prod",
    accessToken: keys.bitgoAccessKey,
  });

  let coins = {
    btc: ["5e5132c928ebab595a650f1cd1adbb79"],
    // 'btc': ['5e5132c928ebab595a650f1cd1adbb79', '5e5131de915f3dfe56dfb4838375f3f2'],
    // 'bch': ['5e5133e163234543076916657db67420', '5e5134302a9ea50c08253b4daefe2604'],
    // 'ltc': ['5e5133382e9a866e0737e8aaff332cee', '5e51339328ebab595a651424f3e004a0'],
  };

  for (let coin in coins) {
    for (let walletId of coins[coin]) {
      console.log(coin, walletId);
      bitgo
        .coin(coin)
        .wallets()
        .get({ id: walletId })
        .then(function (wallet) {
          // wallet.send({ address: '1NWeZ6eggGrXNiFTSFH7fpeJN4DsX754pF', amount: `${parseInt(17706)}`, walletPassphrase: "Bitexuae@1234" }, function(err, result) {
          // 	console.log(result);
          //   if (err) {
          // 		// console.log("bitgoWallet: ", err);
          // 		if (err.result.error.includes('insufficient')) {
          // 			let response = {message: 'Insufficient balance'};
          // 			return response;
          // 		} else {
          // 			let response = {varient: "error", message: 'Error occured, please try again later'};
          // 			return response;
          // 		}
          // 	}
          // });
        });
    }
  }
};
// getBitgoBalance();

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const jwtTokenValidation = async (decoded) => {
  const currentTime = Math.floor(Date.now() / 1000);
  if (decoded.exp) {
    if (currentTime > decoded.exp) {
      // logout user
      return false;
    } else {
      return true;
    }
  } else {
    return false;
  }
};

const checkUserWithdrawalLimit = async (userWalletId, amount) => {
  return await UserWallet.findOne({ _id: userWalletId })
    .then((userWallet) => {
      if (userWallet) {
        if (
          parseFloat(userWallet.walletAmount) < parseFloat(amount) ||
          parseFloat(userWallet.walletAmount) === 0
        ) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    })
    .catch((err) => {
      return false;
    });
};

checkTradingLevel = async () => {
  const users = await User.find();
  for (ukey in users) {
    let isAgent = false;
    let isSubAgent = false;
    if (users[ukey]) {
      isAgent = users[ukey].agent;
      isSubAgent = users[ukey].subAgent;
    }

    let traderLevels;
    if (isAgent) {
      traderLevels = await AgentTraderLevel.find();
    } else if (isSubAgent) {
      traderLevels = await SubAgentTraderLevel.find();
    } else {
      if (users[ukey].country === "IN") {
        traderLevels = await InrTraderLevel.find();
      } else {
        traderLevels = await TraderLevel.find();
      }
    }

    var dt = new Date();
    var ltdt = new Date();
    await dt.setDate(dt.getDate() - 30);
    var gtdt = dt;

    const orders = await Order.find({
      userId: users[ukey]._id,
      createTime: { $gt: gtdt, $lt: ltdt },
    });
    let totalPrice = 0;
    for (order of orders) {
      totalPrice =
        order.type === 2 && order.side === 2
          ? totalPrice +
            parseFloat(order.dealMoney) * parseFloat(order.dealStock)
          : totalPrice + parseFloat(order.price) * parseFloat(order.amount);
    }

    if (traderLevels) {
      for (tkey in traderLevels) {
        if (totalPrice >= parseFloat(traderLevels[tkey].fromAmount)) {
          const userProfile = await UserProfile.findOne({
            userId: users[ukey]._id,
          });
          if (userProfile) {
            userProfile.traderLevel = traderLevels[tkey].name;
            await userProfile.save();
          }
        }
      }
    }
  }
};

schedule.scheduleJob("0 0 * * *", function () {
  checkTradingLevel();
  // console.log('TradingLevel Calculation Started for Everyday schecule');
});

/**
 * @route POST /api/wallet/check_xrp_address/:address
 * @description Check XRP adress.
 * @access Public
 */
router.get("/check_xrp_address/:address", async (req, res) => {
  const xrpWallet = await XrpWallet.findOne({ address: req.params.address });
  if (xrpWallet) {
    return res.json({ tagStatus: true });
  } else {
    if (req.params.address[0] === "X") {
      const untagged = Decode(req.params.address);
      return res.json({
        tagStatus: false,
        address: untagged.account,
        destinationTag: untagged.tag,
      });
    } else {
      return res.json({ tagStatus: true });
    }
  }
});

/**
 * @route POST /api/wallet/check_xrp_address/:address
 * @description Check XRP adress.
 * @access Public
 */
router.post("/get_xrp_x_address", async (req, res) => {
  const tagged = Encode({ account: req.body.address, tag: req.body.tag });
  return res.json(tagged);
});

/**
 * @route GET /api/wallet/margin_wallets/:userId
 * @description Get all walles.
 * @access Public
 */
router.get("/margin_wallets/:userId", (req, res) => {
  const userId = req.params.userId;

  UserMarginWallet.find({ userId: userId })
    .then(async (userWallets) => {
      if (userWallets.length > 0) {
        res.json(userWallets);
      } else {
        const bitgoSetting = await BitgoSetting.find();
        let liveAssets = false;
        if (bitgoSetting.length > 0) {
          liveAssets = bitgoSetting[0].live;
        }
        await Assets.find({ active: true, live: liveAssets })
          .then(async (assets) => {
            if (assets.length > 0) {
              let userWalletsArray = [];
              for (let i = 0; i < assets.length; i++) {
                let userWallet = await WalletController.createMarginWallet(
                  userId,
                  assets[i]
                );
                userWalletsArray.push(userWallet);
              }
              res.json(userWalletsArray);
            } else {
              res
                .status(400)
                .json({ variant: "error", message: "No user margin wallets." });
            }
          })
          .catch((err) => {
            // console.log(err);
            res.status(400).json({
              variant: "error",
              message: "Something is wrong contact admin.",
            });
          });
        res
          .status(400)
          .json({ variant: "error", message: "No user margin wallets." });
      }
    })
    .catch((err) => {
      res.status(400).json({
        variant: "error",
        message: "Error on getting user margin wallets.",
      });
    });
});

/**
 * @route GET /api/wallet/all/:userId
 * @description Get all walles.
 * @access Public
 */
router.get("/all/:userId", (req, res) => {
  const userId = req.params.userId;

  UserWallet.find({ userId: userId })
    .then(async (userWallets) => {
      if (userWallets.length > 0) {
        res.json(userWallets);
      } else {
        const bitgoSetting = await BitgoSetting.find();
        let liveAssets = false;
        if (bitgoSetting.length > 0) {
          liveAssets = bitgoSetting[0].live;
        }
        await Assets.find({ active: true, live: liveAssets })
          .then(async (assets) => {
            if (assets.length > 0) {
              let userWalletsArray = [];
              for (let i = 0; i < assets.length; i++) {
                let userWallet = await WalletController.createWallet(
                  userId,
                  assets[i]
                );
                userWalletsArray.push(userWallet);
                // if(assets[i].name === 'BTC') {
                // 	// Read the user authentication section to get your API access token
                //     const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: keys.bitgoAccessKey });

                //     bitgo.coin(keys.bitgoCoin).wallets().get({ id: keys.bitgoDepositeWallet }).then(function(wallet) {
                //     	let params = {
                //              label: keys.bitgoCoin + '_' + userId
                //            }
                //     	wallet.createAddress(params)
                // 			.then(function(address) {
                // 				const userWallet = new UserWallet;
                // 				userWallet.userId = userId;
                // 				userWallet.walletId = address.wallet;
                // 				userWallet.coin = address.coin;
                // 				userWallet.fiat = assets[i].fiat;
                // 				userWallet.bitgo = assets[i].bitgo;
                // 				userWallet.walletAddress = address.address;
                // 				userWallet.walletAmount = 0;
                // 				userWallet.save();
                // 				userWalletsArray.push(userWallet);
                // 			});
                // 		});
                // } else {
                // 	const userWallet = new UserWallet;
                // 	userWallet.userId = userId;
                // 	userWallet.walletId = '';
                // 	userWallet.coin = assets[i].name;
                // 	userWallet.fiat = assets[i].fiat;
                // 	userWallet.bitgo = assets[i].bitgo;
                // 	userWallet.walletAddress = '';
                // 	userWallet.walletAmount = 0;
                // 	userWallet.save();
                // 	userWalletsArray.push(userWallet);
                // }
              }
              res.json(userWalletsArray);
            } else {
              res
                .status(400)
                .json({ variant: "error", message: "No user wallets." });
            }
          })
          .catch((err) => {
            // console.log(err);
            res.status(400).json({
              variant: "error",
              message: "Something is wrong contact admin.",
            });
          });
        res.status(400).json({ variant: "error", message: "No user wallets." });
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({ variant: "error", message: "Error on getting user wallets." });
    });
});

/**
 * @route GET /api/wallet/balance/:userId
 * @description Get user wallet info object.
 * @access Public
 */
router.get("/balance/:userId", (req, res) => {
  const userId = req.params.userId;

  User.findOne({ _id: userId })
    .then((user) => {
      if (user) {
        UserWallet.findOne({ userId: user._id }).then(async (userWallet) => {
          if (userWallet) {
            let userWallet = await WalletController.createWallet(
              userId,
              assets[i]
            );
            if (userWallet.error) {
              res
                .status(400)
                .json({ variant: "error", message: userWallet.error });
            } else {
              res.json(userWallet);
            }
            //  			// Read the user authentication section to get your API access token
            // 	const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: keys.bitgoAccessKey });

            // 	bitgo.coin(keys.bitgoCoin).wallets().getWalletByAddress({ address: userWallet.walletAddress }).then(function(wallet) {
            // 		// res.json(wallet._wallet);
            // 		UserWallet.findOne({ userId: req.params.userId})
            // .then( userWallet => {
            // 	userWallet.walletAmount = wallet._wallet.balance;
            // 	userWallet.save();
            // 	res.json(userWallet);
            // });
            //  }).catch(err => {
            //  	// Read the user authentication section to get your API access token
            //   const bitgo = new BitGoJS.BitGo({ env: 'test', accessToken: keys.bitgoAccessKey });

            //   bitgo.coin(keys.bitgoCoin).wallets().get({ id: keys.bitgoDepositeWallet }).then(function(wallet) {
            //   	let params = {
            //            label: keys.bitgoCoin + '_' + userId
            //          }
            //   	wallet.createAddress(params)
            // 	.then(function(address) {
            // 	  // print new address
            // 	  userWallet.walletAddress = address.address;
            // 	  userWallet.save();

            // 	  let userWalletAddress = new WalletAddress;
            // 	  userWalletAddress.userId = req.params.userId;
            // 	  userWalletAddress.userWalletId = userWallet._id;
            // 	  userWalletAddress.walletAddress = address.address;
            // 	  userWalletAddress.save();

            // 	  UserWallet.findOne({ userId: req.params.userId})
            // 		.then( userWallet => {
            // 			if(userWallet) {
            // 				userWallet.walletAmount = wallet._wallet.balance;
            // 				userWallet.save();
            // 				res.json(userWallet);
            // 			} else {
            // 				const userWallet = new UserWallet;
            // 				userWallet.userId = user._id;
            // 				userWallet.walletId = address.wallet;
            // 				userWallet.coin = address.coin;
            // 				userWallet.walletAddress = address.address;
            // 				userWallet.walletAmount = 0;
            // 				userWallet.save();
            // 				res.json(userWallet);
            // 			}
            // 		});
            // 	})
            // 	.catch( err => {
            // 		res.status(400).json({variant: 'error', message: 'Error on generating address'});
            // 	});
            //   });
            //  	res.status(400).json({variant: 'error', message: 'User wallet not setup yet.'});
            //  });
          } else {
            res
              .status(400)
              .json({ variant: "error", message: "User wallet not found." });
          }
        });
      } else {
        res.status(400).json({ variant: "error", message: "User not found." });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

/**
 * @route GET /api/wallet/generate_address/:userId
 * @description Get user wallet info object.
 * @access Public
 */
router.get("/generate_address/:coin/:userId", (req, res) => {
  UserWallet.find({ userId: req.params.userId, coin: req.params.coin })
    .then(async (userWallet) => {
      if (userWallet.length > 0) {
        const walletController = await WalletController.generateAddress(
          userWallet[0]
        );
        if (walletController.error) {
          res
            .status(400)
            .json({ variant: "error", message: walletController.error });
        } else {
          res.json(walletController);
        }
      } else {
        res
          .status(400)
          .json({ variant: "error", message: "User wallet not found" });
      }
    })
    .catch((err) => {
      // console.log(err);
      res
        .status(400)
        .json({ variant: "error", message: "Error on generate new address" });
    });
});

/**
 * @route GET /api/wallet/generate_address/:userId
 * @description Get user wallet info object.
 * @access Public
 */
router.get("/get_addresess/:userId/:coin", (req, res) => {
  UserWallet.find({ userId: req.params.userId, coin: req.params.coin })
    .then((userWallet) => {
      if (userWallet.length > 0) {
        WalletAddress.find({ userWalletId: userWallet[0]._id })
          .then(async (walletAddresses) => {
            if (walletAddresses.length > 0) {
              res.json(walletAddresses);
            } else {
              const walletController = await WalletController.generateAddress(
                userWallet[0]
              );
              if (walletController.error) {
                res
                  .status(400)
                  .json({ variant: "error", message: walletController.error });
              } else {
                res.json(walletController);
              }
            }
          })
          .catch((err) => {
            res.status(400).json({
              variant: "error",
              message: "Error on getting wallet address",
            });
          });
      } else {
        res
          .status(400)
          .json({ variant: "error", message: "User wallet not found" });
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({ variant: "error", message: "Error on generate new address" });
    });
});

/**
 * @route GET /api/wallet/transactions
 * @description Get user wallet info object.
 * @access Public
 */
router.get("/transactions/:userId", async (req, res) => {
  const bitgoStatus = await WalletController.getBitgoStatus();
  // Read the user authentication section to get your API access token
  const bitgo = new BitGoJS.BitGo({
    env: bitgoStatus,
    accessToken: keys.bitgoAccessKey,
  });

  bitgo
    .coin(keys.bitgoCoin)
    .wallets()
    .get({ id: keys.bitgoDepositeWallet })
    .then(function (wallet) {
      wallet.transfers().then(function (transfers) {
        res.json(transfers);
      });
    });
});

getTransactionList = (allWithdrawalRequests) => {
  let withrawalRequests = [];
  let depositRequests = [];
  allWithdrawalRequests.then((withRequests) => {
    // console.log(withRequests);
  });
};

/**
 * @route POST /api/wallet/all_transactions/:userId
 * @description Get user wallet info object.
 * @access Public
 */
router.post("/all_transactions/:userId", async (req, res) => {
  let orderType = req.body.orderType;
  let account = req.body.account;
  let status = req.body.status;

  let limit = req.body.limit;

  let filterOrder = { userId: req.params.userId };
  let filterWithdraw = { userId: req.params.userId };
  let filterDeposit = { userId: req.params.userId };
  let filterTrans = { userId: req.params.userId };

  if (orderType) {
    if (orderType === "Limit (Buy)") {
      filterOrder.side = 2;
      filterOrder.type = 1;
    } else if (orderType === "Limit (Sell)") {
      filterOrder.side = 1;
      filterOrder.type = 1;
    } else if (orderType === "Market (Buy)") {
      filterOrder.side = 2;
      filterOrder.type = 2;
    } else if (orderType === "Market (Sell)") {
      filterOrder.side = 1;
      filterOrder.type = 2;
    } else {
      filterOrder.side = 0;
      filterOrder.type = 0;
    }
    filterWithdraw.type = orderType;
    filterDeposit.type = orderType;
    filterTrans.type = orderType;
  } else {
    filterTrans.type = {
      $in: [
        "Deposit",
        "Withdrawal",
        "Transfer",
        "Borrow",
        "Limit (Buy)",
        "Limit (Sell)",
        "Marekt (Buy)",
        "Marekt (Sell)",
      ],
    };
  }

  if (account) {
    filterOrder.market = account;
    filterWithdraw.account = account;
    filterDeposit.account = account;
    filterTrans.coin = account;
  }

  if (status) {
    filterOrder.status = status;
    filterWithdraw.status = status;
    filterDeposit.status = status;
    filterTrans.state = status;
  }

  await WalletController.getBtxTronTransactions();
  console.log("111");
  await WalletController.getEthTransactions(req.params.userId);
  console.log("222");
  await WalletController.getUsdtTransactions(req.params.userId);
  console.log("333");
  await WalletController.getTrxTransactions(req.params.userId);
  console.log("444");
  await WalletController.getTrc20Transactions(req.params.userId, "BTX");
  console.log("555");
  await WalletController.getTrc20Transactions(req.params.userId, "USDT");
  console.log("666");
  await WalletController.getBtxTransactions(req.params.userId);
  console.log("777");
  const orders = await Order.find(filterOrder);
  const allWithdrawalRequests = await UserWithdrawRequest.find(filterWithdraw);
  const allDepositRequests = await UserDepositRequest.find(filterDeposit);
  const allWalletTransactions = await WalletTransactions.find(filterTrans);
  let allTransactions = [];
  for (wkey in allWithdrawalRequests) {
    let withTransac = {
      type: "Withdrawal",
      date: allWithdrawalRequests[wkey].createdAt,
      account: allWithdrawalRequests[wkey].coin,
      value: allWithdrawalRequests[wkey].amount,
      rate: "-",
      fee: "-",
      side: "-",
      status: allWithdrawalRequests[wkey]
        ? allWithdrawalRequests[wkey].status
        : "Cancelled",
      noteNumber: allWithdrawalRequests[wkey].noteNumber,
    };
    if (withTransac) {
      allTransactions.push(withTransac);
    }
  }
  for (dkey in allDepositRequests) {
    let depTransac = {
      type:
        allDepositRequests[dkey].type === "Bank Transfer"
          ? "Deposit"
          : allDepositRequests[dkey].type,
      date: allDepositRequests[dkey].createdAt,
      account: allDepositRequests[dkey].coin,
      value: allDepositRequests[dkey].amount,
      rate: "-",
      fee: allDepositRequests[dkey] ? allDepositRequests[dkey].fees : "-",
      side: "-",
      noteNumber: allDepositRequests[dkey]
        ? allDepositRequests[dkey].noteNumber
        : "-",
      referenceNumber: allDepositRequests[dkey]
        ? allDepositRequests[dkey].referenceNumber
        : "-",
      status: allDepositRequests[dkey].status,
    };
    if (depTransac) {
      allTransactions.push(depTransac);
    }
  }
  for (okey in orders) {
    let orderTransac = {
      type:
        orders[okey].type === 1
          ? `Limit (${orders[okey].side === 1 ? "Sell" : "Buy"})`
          : `Market (${orders[okey].side === 1 ? "Sell" : "Buy"})`,
      side: orders[okey].side,
      date: orders[okey].createTime,
      updateDate: orders[okey].updateDate,
      account: orders[okey].market,
      value: orders[okey].market.includes("BTX")
        ? orders[okey].amount
        : orders[okey].type === 2
          ? orders[okey].side === 2
            ? parseFloat(orders[okey].dealStock - orders[okey].dealFee).toFixed(
                8
              )
            : orders[okey].amount
          : orders[okey].amount,
      // value: (orders[okey].type === 2 ? (orders[okey].side === 2 ? (parseFloat(orders[okey].dealStock)/parseFloat(orders[okey].dealMoney)).toFixed(8) : orders[okey].amount) : orders[okey].amount),
      rate:
        orders[okey].type === 2
          ? parseFloat(orders[okey].price).toFixed(2)
          : orders[okey].price,
      executed: orders[okey].price,
      fee: orders[okey].dealFee,
      status: orders[okey].status,
    };
    if (orderTransac) {
      allTransactions.push(orderTransac);
    }
  }
  for (tkey in allWalletTransactions) {
    let walletTransaction = {
      type: allWalletTransactions[tkey].type,
      date: allWalletTransactions[tkey].date,
      txid: allWalletTransactions[tkey].txid,
      txid_short: allWalletTransactions[tkey].txid
        ? allWalletTransactions[tkey].txid.substr(1, 8)
        : "",
      confirmation: allWalletTransactions[tkey].confirmations,
      account: allWalletTransactions[tkey].coin,
      value: allWalletTransactions[tkey].value,
      sender: allWalletTransactions[tkey].sender,
      receiver: allWalletTransactions[tkey].receiver,
      rate: allWalletTransactions[tkey].rate
        ? allWalletTransactions[tkey].rate
        : "-",
      fee: allWalletTransactions[tkey].fees
        ? allWalletTransactions[tkey].fees
        : "-",
      side: "-",
      status: allWalletTransactions[tkey].state,
    };
    if (walletTransaction) {
      allTransactions.push(walletTransaction);
    }
  }

  await allTransactions.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  if (limit) {
    if (allTransactions.length > 5) {
      allTransactions.length = parseInt(limit);
    }
  }
  res.json(allTransactions);
});

getDepositLimit = async (amount, userId) => {
  return UserIdentity.findOne({ userId: userId })
    .then(async (userIdentity) => {
      if (userIdentity) {
        if (userIdentity.approve) {
          return true;
        } else {
          return false;
          // var dt = new Date();
          // var ltdt = new Date();
          // await dt.setDate( dt.getDate() - 7 );
          // var gtdt = dt;
          // const weeklyLimit = 5000;
          // let currentLimit = parseFloat(amount);
          // const depositRequests = await UserDepositRequest.find({
          // 	userId: userId,
          // 	createdAt: { $gt: gtdt, $lt: ltdt },
          // });
          // for (key in depositRequests) {
          // 	currentLimit = currentLimit + parseFloat(depositRequests[key].amount);
          // }
          // if (currentLimit > weeklyLimit) {
          // 	return false;
          // } else {
          // 	return true;
          // }
        }
      } else {
        return false;
        // var dt = new Date();
        // var ltdt = new Date();
        // await dt.setDate( dt.getDate() - 7 );
        // var gtdt = dt;
        // const weeklyLimit = 5000;
        // let currentLimit = parseFloat(amount);
        // const depositRequests = await UserDepositRequest.find({
        // 	userId: userId,
        // 	createdAt: { $gt: gtdt, $lt: ltdt },
        // });
        // for (key in depositRequests) {
        // 	currentLimit = currentLimit + parseFloat(depositRequests[key].amount);
        // }
        // if (currentLimit > weeklyLimit) {
        // 	return false;
        // } else {
        // 	return true;
        // }
      }
    })
    .catch(() => {
      return false;
    });
};

/**
 * @route POST /api/wallet/transfer_deposit_amount
 * @description Create new deposit request.
 * @access Public
 */
router.post("/transfer_deposit_amount", (req, res) => {
  const userDepositReq = new UserDepositRequest({
    userId: req.body.userId,
    type: "Deposit",
    amount: req.body.amount,
    coin: req.body.coin,
    fees: req.body.fee,
    noteNumber: req.body.noteNumber,
  });
  userDepositReq
    .save()
    .then((userDepositRequest) => {
      userDepositRequest.status = "Finished";
      userDepositRequest.approve = true;
      userDepositRequest.save();

      UserWallet.findOne({
        userId: userDepositRequest.userId,
        coin: userDepositRequest.coin,
      }).then(async (userWallet) => {
        if (userWallet) {
          // depositReqest = await WalletController.depositeWallet(userWallet, parseFloat(userDepositRequest.amount));
          // console.log(depositReqest);

          // if (depositReqest) {
          userWallet.walletAmount =
            parseFloat(userWallet.walletAmount) +
            parseFloat(userDepositRequest.amount);
          userWallet.save();

          User.findOne({ _id: userDepositRequest.userId }).then((user) => {
            let currentDate = new Date();
            let months = [
              "January",
              "February",
              "March",
              "April",
              "May",
              "June",
              "July",
              "August",
              "September",
              "October",
              "November",
              "December",
            ];
            let emailBody = depositEmail(
              userDepositRequest._id,
              userDepositRequest.amount,
              userDepositRequest.fees,
              `${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
              userDepositRequest.coin,
              user.firstname + " " + user.lastname,
              req.body.noteNumber,
              "Accepted!"
            );

            const mailOptions = {
              from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
              to: user.email, // list of receivers
              subject: "Deposit Request Accepted", // Subject line
              html: emailBody, // plain text body
            };

            try {
              sgMail.send(mailOptions);
            } catch (error) {
              console.log(error);
            }
          });

          return res.json({
            variant: "success",
            message: `Transaction successfull.`,
          });
          // } else {
          // 	console.log('Viabtc balance update issue');
          // 	userDepositRequest.status = 'Pending';
          // 	userDepositRequest.approve = false;
          // 	userDepositRequest.save();
          // 	return res.status(400).json({variant: 'error', message: 'Transaction error please contact to the support if amount is debited from the bank.'});
          // }
        } else {
          // console.log('User wallet not found');
          userDepositRequest.status = "Pending";
          userDepositRequest.approve = false;
          userDepositRequest.save();
          return res.status(400).json({
            variant: "error",
            message:
              "Transaction error please contact to the support if amount is debited from the bank.",
          });
        }
      });
    })
    .catch((err) => {
      // console.log(err);
      userDepositRequest.status = "Pending";
      userDepositRequest.approve = false;
      userDepositRequest.save();
      return res.status(400).json({
        variant: "error",
        message:
          "Transaction error please contact to the support if amount is debited from the bank.",
      });
    });
});

/**
 * @route POST /api/wallet/create_deposit_request
 * @description Create new deposit request.
 * @access Public
 */
router.post("/create_deposit_request", (req, res) => {
  const { errors, isValid } = validateWalletDepositRequest(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ _id: req.body.userId })
    .then(async (user) => {
      if (user) {
        const depositLimitStatus = await getDepositLimit(
          req.body.amount,
          user._id
        );

        if (depositLimitStatus) {
          const userDepositRequest = new UserDepositRequest({
            userId: req.body.userId,
            type: "Deposit",
            amount: req.body.amount,
            coin: req.body.coin,
            fees: req.body.fee,
            noteNumber: req.body.noteNumber,
            referenceNumber: req.body.referenceNumber,
          });
          userDepositRequest
            .save()
            .then((userDepositRequest) => {
              let currentDate = new Date();
              let months = [
                "January",
                "February",
                "March",
                "April",
                "May",
                "June",
                "July",
                "August",
                "September",
                "October",
                "November",
                "December",
              ];
              let emailBody = depositEmail(
                userDepositRequest._id,
                userDepositRequest.amount,
                userDepositRequest.fees,
                `${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
                userDepositRequest.coin,
                user.firstname + " " + user.lastname,
                req.body.noteNumber,
                "Request Created"
              );

              const mailOptions = {
                from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
                to: user.email, // list of receivers
                subject: "Deposit Request Created", // Subject line
                html: emailBody, // plain text body
              };

              try {
                sgMail.send(mailOptions);
              } catch (error) {
                console.log(error);
              }

              const notificationData = {
                user: userDepositRequest.userId,
                details: "",
                notificationType: {
                  id: userDepositRequest._id,
                  documentName: "UserDepositRequest",
                },
              };
              const notication = Notification.create(notificationData);

              res.json({
                variant: "success",
                userDepositeRequestId: userDepositRequest._id,
                message:
                  "Deposit request successfully initiated. Please read and follow the transfer instructions to complete the transaction",
              });
            })
            .catch((err) => {
              //    console.log("errr ineer::", err);
              res.status(400).json({
                variant: "error",
                message: "Error on creating deposit request",
              });
            });
        } else {
          res.status(400).json({
            variant: "error",
            message: "Please verify KYC details to enjoy limit-less service.",
          });
        }
      } else {
        // console.log("errr for ::", err);
        res.status(400).json({
          variant: "error",
          message: "Error on creating deposit request",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        variant: "error",
        message: "Error on creating deposit request",
      });
    });
});

/**
 * @route POST /api/wallet/update_deposit_request
 * @description update_deposit_request.
 * @access Public
 */
router.post("/update_deposit_request", (req, res) => {
  if (req.body.userDepositeRequestId && req.body.referenceNumber) {
    UserDepositRequest.findOne({ _id: req.body.userDepositeRequestId }).then(
      (userDeposit) => {
        userDeposit.referenceNumber = req.body.referenceNumber;
        if (req.body.amount) {
          userDeposit.amount = req.body.amount;
        }
        userDeposit.save();
        const notificationData = {
          user: userDeposit.userId,
          details: "",
          notificationType: {
            id: userDeposit._id,
            documentName: "UserDepositRequest",
          },
        };
        const notication = Notification.create(notificationData);

        res.json({
          variant: "success",
          userDepositeRequestId: userDeposit._id,
          message:
            "Deposit request created successfully. Please wait for our response",
        });
      }
    );
  } else {
    return res
      .status(400)
      .json({ variant: "error", message: "Error on creating deposit request" });
  }
});

/**
 * @route POST /api/wallet/edit_deposit_request
 * @description edit_deposit_request.
 * @access Public
 */
router.post("/edit_deposit_request", (req, res) => {
  if (req.body.userDepositeRequestId && req.body.referenceNumber) {
    UserDepositRequest.findOne({ _id: req.body.userDepositeRequestId }).then(
      (userDeposit) => {
        userDeposit.referenceNumber = req.body.referenceNumber;
        userDeposit.save();
        res.json({
          variant: "success",
          userDepositeRequestId: userDeposit._id,
          message:
            "Deposit request updated successfully. Please wait for our response",
        });
      }
    );
  } else {
    return res
      .status(400)
      .json({ variant: "error", message: "Error on creating deposit request" });
  }
});

/**
 * @route POST /api/wallet/create_withdraw_request
 * @description Create new deposit request.
 * @access Public
 */
router.post("/create_withdraw_request", async (req, res) => {
  const { errors, isValid } = validateWalletWithdrawRequest(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let userWallet = await UserWallet.findOne({
    userId: req.body.userId,
    coin: req.body.coin,
    fiat: true,
  });
  if (userWallet) {
    if (
      parseFloat(userWallet.walletAmount) -
        parseFloat(userWallet.bonusWalletAmount) <
      parseFloat(req.body.amount)
    ) {
      return res.status(400).json({
        variant: "error",
        message: "Insufficient balance to withdraw.",
      });
    }
  }

  let d = new Date();
  d.setDate(d.getDate() - 1);
  const depositeReq = await UserDepositRequest.findOne({
    userId: req.body.userId,
    status: "Finished",
    createdAt: { $lt: d },
  });
  const depositeReqWalletTransactions = await WalletTransactions.findOne({
    userId: req.body.userId,
    type: "Deposit",
    state: "Finished",
    date: { $lt: d },
  });
  const prevDepositeCheck = isEmpty(depositeReq)
    ? isEmpty(depositeReqWalletTransactions)
      ? true
      : false
    : false;

  if (prevDepositeCheck) {
    return res.status(400).json({
      variant: "error",
      message: "You can withdraw after 24 hours of your first fiat deposit.",
    });
  } else {
    User.findOne({ _id: req.body.userId })
      .then(async (user) => {
        if (user) {
          const userWithdrawalLimit = await checkUserWithdrawalLimit(
            req.body.userWalletId,
            req.body.amount
          );

          if (userWithdrawalLimit) {
            const userWithdrawRequest = new UserWithdrawRequest({
              userId: req.body.userId,
              type: "Withdrawal",
              amount: req.body.amount,
              coin: req.body.coin,
              fees: req.body.fee,
              noteNumber: req.body.noteNumber,
            });
            userWithdrawRequest
              .save()
              .then((userWithdrawRequest) => {
                const notificationData = {
                  user: userWithdrawRequest.userId,
                  details: "",
                  notificationType: {
                    id: userWithdrawRequest._id,
                    documentName: "UserWithdrawRequest",
                  },
                };
                const notication = Notification.create(notificationData);
                UserWallet.find({
                  userId: userWithdrawRequest.userId,
                  coin: userWithdrawRequest.coin,
                }).then(async (userWallet) => {
                  if (userWallet.length > 0) {
                    //   withdrawReqest = await WalletController.withdrawWallet(userWallet[0], parseFloat(userWithdrawRequest.amount));
                    //   if (withdrawReqest) {

                    //   } else {
                    // 	  return res.status(400).json({variant: 'error', message: 'Failed to add amount to user wallet, try again'});
                    //   }

                    const params = [
                      user.viabtcUserId,
                      userWallet[0].coin,
                      "deposit",
                      new Date().getTime(),
                      "-" + userWithdrawRequest.amount,
                      {},
                    ];

                    const postParamas = {
                      method: "balance.update",
                      params: params,
                      id: 1516681174,
                    };

                    curl.post(
                      keys.tradingURI,
                      JSON.stringify(postParamas),
                      {},
                      async function (err, response, body) {
                        if (JSON.parse(body).result) {
                          if (JSON.parse(body).result.status === "success") {
                            userWallet[0].walletAmount =
                              parseFloat(userWallet[0].walletAmount) -
                              parseFloat(userWithdrawRequest.amount);
                            userWallet[0].save();

                            let currentDate = new Date();
                            let months = [
                              "January",
                              "February",
                              "March",
                              "April",
                              "May",
                              "June",
                              "July",
                              "August",
                              "September",
                              "October",
                              "November",
                              "December",
                            ];
                            let emailBody = withdrawEmail(
                              userWithdrawRequest._id,
                              userWithdrawRequest.amount,
                              userWithdrawRequest.fees,
                              `${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
                              userWithdrawRequest.coin,
                              user.firstname + " " + user.lastname,
                              userWithdrawRequest.noteNumber,
                              "Request Created"
                            );
                            // let emailBody = '<p>Hi '+ user.firstname +' ' + user.lastname + ',</p>';
                            // emailBody += '<p>Your withdrawal request have successfully placed, Please wait for our confirmation</p>';
                            // emailBody += '<p>Your withdrawal details are:</p>';
                            // emailBody += '<p>Amount: <strong>' + userWithdrawRequest.amount + '</strong></p>';
                            // emailBody += '<p>Coin: <strong>' + userWithdrawRequest.coin + '</strong></p>';
                            // emailBody += '<p>Fees: <strong>' + userWithdrawRequest.fees + '</strong></p>';
                            // emailBody += '<p>Note Number: <strong>' + userWithdrawRequest.noteNumber + '</strong></p>';

                            const mailOptions = {
                              from: {
                                name: "Trillionbit",
                                email: "noreply@trillionbit.com",
                              }, // sender address
                              to: user.email, // list of receivers
                              subject: "Withdrawal Request Created", // Subject line
                              html: emailBody, // plain text body
                            };

                            try {
                              sgMail.send(mailOptions);
                            } catch (error) {
                              console.log(error);
                            }

                            return res.json({
                              variant: "success",
                              message:
                                "Withdraw request created successfully. Please wait for our response",
                            });
                          } else {
                            return res.status(400).json({
                              variant: "error",
                              message:
                                "Failed to add amount to trading wallet..",
                            });
                          }
                        } else {
                          userWallet[0].walletAmount =
                            parseFloat(userWallet[0].walletAmount) -
                            parseFloat(userWithdrawRequest.amount);
                          userWallet[0].save();

                          let currentDate = new Date();
                          let months = [
                            "January",
                            "February",
                            "March",
                            "April",
                            "May",
                            "June",
                            "July",
                            "August",
                            "September",
                            "October",
                            "November",
                            "December",
                          ];
                          let emailBody = withdrawEmail(
                            userWithdrawRequest._id,
                            userWithdrawRequest.amount,
                            userWithdrawRequest.fees,
                            `${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
                            userWithdrawRequest.coin,
                            user.firstname + " " + user.lastname,
                            userWithdrawRequest.noteNumber,
                            "Request Created"
                          );

                          const mailOptions = {
                            from: {
                              name: "Trillionbit",
                              email: "noreply@trillionbit.com",
                            }, // sender address
                            to: user.email, // list of receivers
                            subject: "Withdrawal Request Created", // Subject line
                            html: emailBody, // plain text body
                          };

                          try {
                            sgMail.send(mailOptions);
                          } catch (error) {
                            console.log(error);
                          }

                          return res.json({
                            variant: "success",
                            message:
                              "Withdraw request created successfully. Please wait for our response",
                          });
                        }
                      }
                    );
                  } else {
                    return res.status(400).json({
                      variant: "error",
                      message: "Failed to add amount to user wallet.",
                    });
                  }
                });
              })
              .catch((err) =>
                res.status(400).json({
                  variant: "error",
                  message: "Error on creating withdraw request",
                })
              );
          } else {
            res.status(400).json({
              variant: "error",
              message: "Wallet blance is low to withdraw your amount.",
            });
          }
        } else {
          res.status(400).json({
            variant: "error",
            message: "Error on creating withdraw request",
          });
        }
      })
      .catch((err) =>
        res.status(400).json({
          variant: "error",
          message: "Error on creating withdraw request",
        })
      );
  }
});

/**
 * @route GET /api/wallet/get_margin_requests/:userId
 * @description Get user deposit requests.
 * @access Public
 */
router.get("/get_margin_requests/:userId", async (req, res) => {
  const allDepositRequests = await UserDepositRequest.find({
    userId: req.params.userId,
    type: { $in: ["Borrow", "Transfer", "Repay"] },
  }).sort("-createdAt");

  let allTransactions = [];

  for (dkey in allDepositRequests) {
    let depTransac = {
      _id: allDepositRequests[dkey]._id,
      type: allDepositRequests[dkey].type,
      date: allDepositRequests[dkey].createdAt,
      account: allDepositRequests[dkey].coin,
      value: allDepositRequests[dkey].amount,
      rate: "-",
      side: "-",
      noteNumber: allDepositRequests[dkey]
        ? allDepositRequests[dkey].noteNumber
        : "-",
      status: allDepositRequests[dkey]
        ? allDepositRequests[dkey].status
        : "Cancelled",
      fee: allDepositRequests[dkey] ? allDepositRequests[dkey].fees : "-",
      referenceNumber: allDepositRequests[dkey]
        ? allDepositRequests[dkey].referenceNumber
        : "-",
    };
    if (depTransac) {
      allTransactions.push(depTransac);
    }
  }

  await allTransactions.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  res.json(allTransactions);
});

/**
 * @route GET /api/wallet/get_deposit_requests/:userId
 * @description Get user deposit requests.
 * @access Public
 */
router.get("/get_deposit_requests/:userId", async (req, res) => {
  const allDepositRequests = await UserDepositRequest.find({
    userId: req.params.userId,
    type: { $in: ["Deposit", "Bank Transfer"] },
  }).sort("-createdAt");
  // const allWalletTransactions = await WalletTransactions.find({userId: req.params.userId, type: 'Deposit'}).sort('-createdAt');

  let allTransactions = [];

  for (dkey in allDepositRequests) {
    let depTransac = {
      _id: allDepositRequests[dkey]._id,
      type: "Deposit",
      date: allDepositRequests[dkey].createdAt,
      account: allDepositRequests[dkey].coin,
      value: allDepositRequests[dkey].amount,
      rate: "-",
      side: "-",
      fee: allDepositRequests[dkey] ? allDepositRequests[dkey].fees : "-",
      referenceNumber: allDepositRequests[dkey]
        ? allDepositRequests[dkey].referenceNumber
        : "-",
      noteNumber: allDepositRequests[dkey]
        ? allDepositRequests[dkey].noteNumber
        : "-",
      status: allDepositRequests[dkey]
        ? allDepositRequests[dkey].status
        : "Cancelled",
    };
    if (depTransac) {
      allTransactions.push(depTransac);
    }
  }

  // for (tkey in allWalletTransactions) {
  // 	let walletTransaction = {
  // 		type: allWalletTransactions[tkey].type,
  // 		date: allWalletTransactions[tkey].date,
  // 		txid: allWalletTransactions[tkey].txid,
  // 		confirmation: allWalletTransactions[tkey].confirmations,
  // 		account: allWalletTransactions[tkey].coin,
  // 		value: allWalletTransactions[tkey].value,
  // 		sender: allWalletTransactions[tkey].sender,
  // 		receiver: allWalletTransactions[tkey].receiver,
  // 		rate: '-',
  // 		fee: '-',
  // 		side: '-',
  // 		status: allWalletTransactions[tkey].state,
  // 	}
  // 	if (walletTransaction) {
  // 		allTransactions.push(walletTransaction);
  // 	}
  // }

  await allTransactions.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  res.json(allTransactions);
});

/**
 * @route GET /api/wallet/get_withdrawal_requests/:userId
 * @description Get user withdrawal requests.
 * @access Public
 */
router.get("/get_withdrawal_requests/:userId", async (req, res) => {
  const allWithdrawalRequests = await UserWithdrawRequest.find({
    userId: req.params.userId,
  });
  const allDepositRequests = await UserDepositRequest.find({
    userId: req.params.userId,
    type: { $in: ["Deposit", "Bank Transfer"] },
  });
  // const allWalletTransactions = await WalletTransactions.find({userId: req.params.userId, type: 'Withdrawal'}).sort('-createdAt');

  let allTransactions = [];

  for (wkey in allWithdrawalRequests) {
    let withTransac = {
      _id: allWithdrawalRequests[wkey]._id,
      type: "Withdrawal",
      date: allWithdrawalRequests[wkey].createdAt,
      account: allWithdrawalRequests[wkey].coin,
      value: allWithdrawalRequests[wkey].amount,
      rate: "-",
      fee: "-",
      side: "-",
      noteNumber: allWithdrawalRequests[wkey].noteNumber,
      status: allWithdrawalRequests[wkey]
        ? allWithdrawalRequests[wkey].status
        : "Cancelled",
    };
    if (withTransac) {
      allTransactions.push(withTransac);
    }
  }

  for (dkey in allDepositRequests) {
    let depTransac = {
      _id: allDepositRequests[dkey]._id,
      type: "Deposit",
      date: allDepositRequests[dkey].createdAt,
      account: allDepositRequests[dkey].coin,
      value: allDepositRequests[dkey].amount,
      rate: "-",
      fee: allDepositRequests[dkey] ? allDepositRequests[dkey].fees : "-",
      side: "-",
      noteNumber: allDepositRequests[dkey]
        ? allDepositRequests[dkey].noteNumber
        : "-",
      referenceNumber: allDepositRequests[dkey]
        ? allDepositRequests[dkey].referenceNumber
        : "-",
      status: allDepositRequests[dkey]
        ? allDepositRequests[dkey].status
        : "Cancelled",
    };
    if (depTransac) {
      allTransactions.push(depTransac);
    }
  }

  // for (tkey in allWalletTransactions) {
  // 	let walletTransaction = {
  // 		type: allWalletTransactions[tkey].type,
  // 		date: allWalletTransactions[tkey].date,
  // 		txid: allWalletTransactions[tkey].txid,
  // 		confirmation: allWalletTransactions[tkey].confirmations,
  // 		account: allWalletTransactions[tkey].coin,
  // 		value: allWalletTransactions[tkey].value,
  // 		sender: allWalletTransactions[tkey].sender,
  // 		receiver: allWalletTransactions[tkey].receiver,
  // 		rate: '-',
  // 		fee: '-',
  // 		side: '-',
  // 		status: allWalletTransactions[tkey].state,
  // 	}
  // 	if (walletTransaction) {
  // 		allTransactions.push(walletTransaction);
  // 	}
  // }

  await allTransactions.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  res.json(allTransactions);
});

verifyUserDelta = async (userId, coin) => {
  const userCryptoWallets = await UserWallet.find({
    userId: userId,
    fiat: false,
  });
  const userFiatWallet = await UserWallet.findOne({
    userId: userId,
    fiat: true,
  });
  const walletTransactions = await WalletTransactions.find({ userId: userId });
  const userFiatWithdrawals = await UserWithdrawRequest.find({
    userId: userId,
  });
  const userFiatDeposits = await UserDepositRequest.find({
    userId: userId,
    status: "Finished",
  });
  const userOrders = await Order.find({
    userId: userId,
    status: { $in: ["Open", "Finished"] },
    market: { $regex: coin, $options: "i" },
  });

  const assetsMarketLasts = await AssetsMarketLast.find();

  let assetMarketLast = {};
  for (key in assetsMarketLasts) {
    if (assetsMarketLasts[key].currency === "USD to AED") {
      assetMarketLast[assetsMarketLasts[key].market + "AED"] =
        assetsMarketLasts[key];
    }
    if (assetsMarketLasts[key].currency === "USD to INR") {
      assetMarketLast[assetsMarketLasts[key].market + "INR"] =
        assetsMarketLasts[key];
    }
  }

  let totalUserDeposit = 0;
  let totalUserWithdraw = 0;
  for (let wkey in userFiatWithdrawals) {
    totalUserWithdraw =
      totalUserWithdraw + parseFloat(userFiatWithdrawals[wkey].value);
  }

  for (let wkey in userFiatDeposits) {
    totalUserDeposit =
      totalUserDeposit + parseFloat(userFiatDeposits[wkey].value);
  }

  let totalUserAccountWithdrawals = 0;
  let totalUserAccountDeposit = 0;
  let totalUserCryptoWithdrawals = 0;
  let totalUserCryptoDeposit = 0;
  for (let ckey in walletTransactions) {
    let marketLast = assetMarketLast[
      walletTransactions[ckey].coin + "" + userFiatWallet.coin
    ]
      ? parseFloat(
          assetMarketLast[
            walletTransactions[ckey].coin + "" + userFiatWallet.coin
          ].last
        )
      : 0;
    if (
      walletTransactions[ckey].type === "Deposit" &&
      walletTransactions[ckey].status === "Finished"
    ) {
      totalUserAccountDeposit =
        totalUserAccountDeposit +
        parseFloat(walletTransactions[ckey].value) * marketLast;
      totalUserCryptoDeposit =
        totalUserCryptoDeposit + parseFloat(walletTransactions[ckey].value);
    }

    if (walletTransactions[ckey].type === "Withdrawal") {
      totalUserAccountWithdrawals =
        totalUserAccountWithdrawals +
        parseFloat(walletTransactions[ckey].value) * marketLast;
      totalUserCryptoWithdrawals =
        totalUserCryptoWithdrawals + parseFloat(walletTransactions[ckey].value);
    }
  }

  let totalUserBalance = 0;
  for (let ukey in userCryptoWallets) {
    if (userFiatWallet) {
      if (
        assetMarketLast[userCryptoWallets[ukey].coin + "" + userFiatWallet.coin]
      ) {
        totalUserBalance =
          totalUserBalance +
          parseFloat(userCryptoWallets[ukey].walletAmount) *
            parseFloat(
              assetMarketLast[
                userCryptoWallets[ukey].coin + "" + userFiatWallet.coin
              ].last
            );
      }
    }
  }

  const userDelta =
    ((totalUserAccountDeposit +
      totalUserDeposit -
      (totalUserAccountWithdrawals + totalUserWithdraw) -
      totalUserBalance) /
      (totalUserAccountDeposit + totalUserDeposit)) *
    100;

  if (userDelta < -10 || userDelta > 10) {
    return false;
  } else {
    return true;
  }
};

/**
 * @route POST /api/wallet/create_transaction
 * @description Get user send crypto requests.
 * @access Public
 */
router.post("/create_transaction", async (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt_decode(token);
    let validation = jwtTokenValidation(user);
    if (validation) {
      const { errors, isValid } = validateWalletCryptoSend(req.body);

      // Check Validation
      if (!isValid) {
        return res.status(400).json(errors);
      }

      const reciepientAmount = req.body.reciepientAmount
        .replace(",", ".")
        .split(",")[0];

      User.findOne({ _id: user.id })
        .then(async (user) => {
          if (user) {
            // const userDelta = await verifyUserDelta(user._id);
            const userDelta = true;
            ApiWallet.findOne({ _id: req.body.walletId, userId: user._id })
              .then(async (userWallet) => {
                let asset = await Assets.findOne({ name: userWallet.coin });
                if (userWallet) {
                  if (
                    isNaN(parseFloat(reciepientAmount)) ||
                    reciepientAmount.includes(" ") ||
                    parseFloat(userWallet.walletAmount) <
                      parseFloat(reciepientAmount)
                  ) {
                    res.json({
                      variant: "error",
                      message: "You don't have enough balance to send.",
                    });
                  } else {
                    const walletTransactions = new WalletTransactions();
                    walletTransactions.userId = userWallet.userId;
                    walletTransactions.confirmations = 0;
                    walletTransactions.type = "Withdrawal";
                    walletTransactions.value = reciepientAmount;
                    walletTransactions.receiverAddress =
                      req.body.reciepientAddress;
                    walletTransactions.destinationTag = req.body.destinationTag
                      ? req.body.destinationTag
                      : "";
                    walletTransactions.senderAddress = userWallet.walletAddress;
                    walletTransactions.fees = asset.withdrawalFee;
                    walletTransactions.coin = userWallet.coin;
                    walletTransactions.state = "Pending";
                    walletTransactions.save();

                    const notificationData = {
                      user: walletTransactions.userId,
                      details: "",
                      notificationType: {
                        id: walletTransactions._id,
                        documentName: "WalletTransactions",
                      },
                    };
                    const notication = Notification.create(notificationData);

                    if (userDelta) {
                      // withdrawReqest = await WalletController.withdrawWallet(userWallet, (parseFloat(req.body.reciepientAmount) + parseFloat(asset.withdrawalFee)));

                      // if (withdrawReqest) {
                      const walletController =
                        await WalletController.sendCrypto(
                          user,
                          userWallet,
                          req.body.reciepientAddress,
                          userWallet.walletAddress,
                          reciepientAmount,
                          (note = ""),
                          (destinationTag = req.body.destinationTag
                            ? req.body.destinationTag
                            : "")
                        );
                      if (walletController.variant === "error") {
                        walletTransactions.state = "Transaction Error";
                        walletTransactions.save();

                        return res.json(walletController);
                      } else {
                        // const withdrawAmount = await WalletController.withdrawWallet(userWallet, (parseFloat(reciepientAmount) + parseFloat(asset.withdrawalFee)));
                        // if (withdrawAmount) {
                        userWallet.walletAmount = (
                          parseFloat(userWallet.walletAmount) -
                          (parseFloat(req.body.reciepientAmount) +
                            parseFloat(asset.withdrawalFee))
                        ).toFixed(8);

                        walletTransactions.txid = !isEmpty(
                          walletController.transfer
                        )
                          ? walletController.transfer.txid
                          : "";
                        walletTransactions.fees = asset.withdrawalFee;
                        walletTransactions.state = !isEmpty(
                          walletController.transfer
                        )
                          ? walletController.transfer.state === "signed"
                            ? "Finished"
                            : "Pending"
                          : "Pending";

                        // const walletTransactions = new WalletTransactions({
                        // 	// userId: userWallet.userId,
                        // 	txid: !isEmpty(walletController.transfer) ? walletController.transfer.txid : '',
                        // 	// confirmations: 0,
                        // 	// type: 'Withdrawal',
                        // 	// value: reciepientAmount,
                        // 	// receiverAddress: req.body.reciepientAddress,
                        // 	// destinationTag: req.body.destinationTag ? req.body.destinationTag : '',
                        // 	// senderAddress: userWallet.walletAddress,
                        // 	fees: !isEmpty(walletController.transfer) ? walletController.transfer.fee : '',
                        // 	// coin: userWallet.coin,
                        // 	state: !isEmpty(walletController.transfer) ? (walletController.transfer.state === 'signed' ? 'Approved' : 'Pending') : 'Pending',
                        // });

                        walletTransactions.save();
                        userWallet.save();

                        res.json({
                          variant: "success",
                          message: `Initialized amount ${userWallet.coin} ${reciepientAmount} withrawal to address ${req.body.reciepientAddress}`,
                        });
                        // } else {
                        // 	res.json({variant: "error", message: "Error occurred, please try again later."});
                        // }
                      }
                      // } else {
                      // 	walletTransactions.state = 'Transaction Error';
                      // 	walletTransactions.save();

                      // 	res.json({variant: "error", message: "Transaction failed, please try again later."});
                      // }
                    } else {
                      res.json({
                        variant: "success",
                        message: `Initialized amount ${userWallet.coin} ${reciepientAmount} withrawal to address ${req.body.reciepientAddress}`,
                      });
                    }
                  }
                } else {
                  res.json({
                    variant: "error",
                    message: "User wallet not found.",
                  });
                }
              })
              .catch((err) => {
                // console.log(err);
                res.json({
                  variant: "error",
                  message: "Error occurred, please try again later.",
                });
              });
          } else {
            res.json({ variant: "error", message: "User not founnd." });
          }
        })
        .catch((err) => {
          res.json({ variant: "error", message: "Error on sending." });
        });
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid Token." });
    }
  } else {
    return res.status(400).json({ status: "error", message: "Token missing." });
  }
});

/**
 * @route POST /api/wallet/send_crypto
 * @description Get user send crypto requests.
 * @access Public
 */
router.post("/send_crypto", (req, res) => {
  const { errors, isValid } = validateWalletCryptoSend(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const reciepientAmount = req.body.reciepientAmount
    .replace(",", ".")
    .split(",")[0];
  var isTRC20 = WAValidator.validate(req.body.reciepientAddress, "TRX");
  var isERC20 = WAValidator.validate(req.body.reciepientAddress, "ETH");
  let withFee;

  User.findOne({ _id: req.body.userId })
    .then(async (user) => {
      if (user) {
        UserIdentity.findOne({ userId: req.body.userId })
          .then(async (kyc) => {
            if (kyc.approve) {
              // const userDelta = await verifyUserDelta(user._id);
              const userDelta = true;
              UserWallet.findOne({
                userId: req.body.userId,
                coin: req.body.coin ? req.body.coin : req.body.bitgoCoin,
              })
                .then(async (userWallet) => {
                  if (userWallet) {
                    let asset = await Assets.findOne({ name: userWallet.coin });
                    if (isERC20) {
                      withFee = asset.withdrawalFeeERC20;
                    } else {
                      withFee = asset.withdrawalFee;
                    }
                    // if (userWallet.coin === 'USDT') {
                    // 	if (isNaN(parseFloat(reciepientAmount)) || reciepientAmount.includes(' ') || (parseFloat(userWallet.walletAmount) < (parseFloat(reciepientAmount) + parseFloat(asset.withdrawalFee)))) {
                    // 		res.json({variant: "error", message: "You don't have enough balance to send."});
                    // 	}
                    // 	const walletUsdtTransactions = new WalletUsdtTransactions;
                    // 	walletUsdtTransactions.userId = userWallet.userId;
                    // 	walletUsdtTransactions.confirmations = 0;
                    // 	walletUsdtTransactions.type = 'Withdrawal';
                    // 	walletUsdtTransactions.value = reciepientAmount;
                    // 	walletUsdtTransactions.receiverAddress = req.body.reciepientAddress;
                    // 	walletUsdtTransactions.destinationTag = req.body.destinationTag ? req.body.destinationTag : '';
                    // 	walletUsdtTransactions.senderAddress = userWallet.walletAddress;
                    // 	walletUsdtTransactions.fees = asset.withdrawalFee;
                    // 	walletUsdtTransactions.coin = userWallet.coin;
                    // 	walletUsdtTransactions.state = 'Pending';
                    // 	await walletUsdtTransactions.save();
                    // 	return res.json({variant: 'error', message: 'We are temporary unable to process transaction.'});
                    // }

                    if (
                      isNaN(parseFloat(reciepientAmount)) ||
                      reciepientAmount.includes(" ") ||
                      parseFloat(userWallet.walletAmount) <
                        parseFloat(reciepientAmount)
                    ) {
                      res.json({
                        variant: "error",
                        message: "You don't have enough balance to send.",
                      });
                    } else {
                      const walletTransactions = new WalletTransactions();
                      walletTransactions.userId = userWallet.userId;
                      walletTransactions.confirmations = 0;
                      walletTransactions.type = "Withdrawal";
                      walletTransactions.value = reciepientAmount;
                      walletTransactions.receiverAddress =
                        req.body.reciepientAddress;
                      walletTransactions.destinationTag = req.body
                        .destinationTag
                        ? req.body.destinationTag
                        : "";
                      walletTransactions.senderAddress =
                        userWallet.walletAddress;
                      walletTransactions.fees = withFee;
                      walletTransactions.coin = userWallet.coin;
                      walletTransactions.state = "Pending";
                      walletTransactions.save();

                      const notificationData = {
                        user: walletTransactions.userId,
                        details: "",
                        notificationType: {
                          id: walletTransactions._id,
                          documentName: "WalletTransactions",
                        },
                      };
                      const notication = Notification.create(notificationData);
                      if (userDelta) {
                        // withdrawReqest = await WalletController.withdrawWallet(userWallet, (parseFloat(req.body.reciepientAmount) + parseFloat(asset.withdrawalFee)));

                        // if (withdrawReqest) {
                        const walletController =
                          await WalletController.sendCrypto(
                            user,
                            userWallet,
                            req.body.reciepientAddress,
                            userWallet.walletAddress,
                            reciepientAmount,
                            (note = ""),
                            (destinationTag = req.body.destinationTag
                              ? req.body.destinationTag
                              : "")
                          );
                        if (walletController.variant === "error") {
                          walletTransactions.state = "Transaction Error";
                          walletTransactions.save();

                          return res.json(walletController);
                        } else {
                          const params = [
                            user.viabtcUserId,
                            userWallet.coin,
                            "deposit",
                            new Date().getTime(),
                            "-" +
                              (parseFloat(req.body.reciepientAmount) +
                                parseFloat(withFee)),
                            {},
                          ];

                          const postParamas = {
                            method: "balance.update",
                            params: params,
                            id: 1516681174,
                          };

                          curl.post(
                            keys.tradingURI,
                            JSON.stringify(postParamas),
                            {},
                            async function (err, response, body) {
                              if (
                                JSON.parse(body).result.status === "success"
                              ) {
                                // const withdrawAmount = await WalletController.withdrawWallet(userWallet, (parseFloat(reciepientAmount) + parseFloat(asset.withdrawalFee)));
                                // if (withdrawAmount) {
                                userWallet.walletAmount = (
                                  parseFloat(userWallet.walletAmount) -
                                  (parseFloat(req.body.reciepientAmount) +
                                    parseFloat(withFee))
                                ).toFixed(8);

                                walletTransactions.txid = !isEmpty(
                                  walletController.transfer
                                )
                                  ? walletController.transfer.txid
                                  : "";
                                walletTransactions.fees = withFee;
                                walletTransactions.state = !isEmpty(
                                  walletController.transfer
                                )
                                  ? walletController.transfer.state === "signed"
                                    ? "Finished"
                                    : "Pending"
                                  : "Pending";

                                // const walletTransactions = new WalletTransactions({
                                // 	// userId: userWallet.userId,
                                // 	txid: !isEmpty(walletController.transfer) ? walletController.transfer.txid : '',
                                // 	// confirmations: 0,
                                // 	// type: 'Withdrawal',
                                // 	// value: reciepientAmount,
                                // 	// receiverAddress: req.body.reciepientAddress,
                                // 	// destinationTag: req.body.destinationTag ? req.body.destinationTag : '',
                                // 	// senderAddress: userWallet.walletAddress,
                                // 	fees: !isEmpty(walletController.transfer) ? walletController.transfer.fee : '',
                                // 	// coin: userWallet.coin,
                                // 	state: !isEmpty(walletController.transfer) ? (walletController.transfer.state === 'signed' ? 'Approved' : 'Pending') : 'Pending',
                                // });

                                walletTransactions.save();
                                userWallet.save();

                                res.json({
                                  variant: "success",
                                  message: `Initialized amount ${userWallet.coin} ${reciepientAmount} withrawal to address ${req.body.reciepientAddress}`,
                                });
                                // } else {
                                // 	res.json({variant: "error", message: "Error occurred, please try again later."});
                                // }
                              } else {
                                res.json({
                                  variant: "error",
                                  message:
                                    "Error occurred, please contact to the support.",
                                });
                              }
                            }
                          );
                        }
                        // } else {
                        // 	walletTransactions.state = 'Transaction Error';
                        // 	walletTransactions.save();

                        // 	res.json({variant: "error", message: "Transaction failed, please try again later."});
                        // }
                      } else {
                        res.json({
                          variant: "success",
                          message: `Initialized amount ${userWallet.coin} ${reciepientAmount} withrawal to address ${req.body.reciepientAddress}`,
                        });
                      }
                    }
                  } else {
                    res.json({
                      variant: "error",
                      message: "User wallet not found.",
                    });
                  }
                })
                .catch((err) => {
                  // console.log(err);
                  res.json({
                    variant: "error",
                    message: "Error occurred, please try again later.",
                  });
                });
            } else {
              res.json({ variant: "error", message: "User not verified." });
            }
          })
          .catch((err) => {
            // console.log(err);
            res.json({ variant: "error", message: "User not verified." });
          });
      } else {
        res.json({ variant: "error", message: "User not founnd." });
      }
    })
    .catch((err) => {
      res.json({ variant: "error", message: "Error on sending." });
    });
});

/**
 * @route GET /api/wallet/cancel_deposit/:transId
 * @description Cancel depost request
 * @access Public
 */
router.get("/cancel_deposit/:transId", (req, res) => {
  UserDepositRequest.findOne({ _id: req.params.transId })
    .then((userDepositRequest) => {
      if (userDepositRequest) {
        userDepositRequest.status = "Cancelled";
        userDepositRequest.approve = true;
        userDepositRequest.save();
        return res.json({
          variant: "success",
          message: "Deposit request cancelled.",
        });
      } else {
        return res.status(400).json({
          variant: "error",
          message: "Something went wrong please try again.",
        });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        variant: "error",
        message: "Something went wrong please try again.",
      });
    });
});

/**
 * @route GET /api/wallet/cancel_withdraw/:transId
 * @description Cancel withdraw request
 * @access Public
 */
router.get("/cancel_withdraw/:transId", (req, res) => {
  UserWithdrawRequest.findOne({ _id: req.params.transId })
    .then((userWithdrawRequest) => {
      if (userWithdrawRequest) {
        if (
          userWithdrawRequest.status === "Approved" ||
          userWithdrawRequest.status === "Finished"
        ) {
          return res.status(400).json({
            variant: "error",
            message: "Transaction is already Approved or Finished.",
          });
        } else {
          userWithdrawRequest.status = "Cancelled";
          userWithdrawRequest.approve = true;
          userWithdrawRequest.save();
          UserWallet.find({
            userId: userWithdrawRequest.userId,
            coin: userWithdrawRequest.coin,
          }).then(async (userWallet) => {
            if (userWallet.length > 0) {
              // withdrawReqest = await WalletController.depositeWallet(userWallet[0], parseFloat(userWithdrawRequest.amount));
              // if (withdrawReqest) {

              // } else {
              // 	return res.status(400).json({variant: 'error', message: 'Failed to cancel withdraw request, try again later.'});
              // }

              const user = await User.findOne({ _id: userWallet.userId });

              const params = [
                user.viabtcUserId,
                userWallet[0].coin,
                "deposit",
                new Date().getTime(),
                "" + userWithdrawRequest.amount,
                {},
              ];

              const postParamas = {
                method: "balance.update",
                params: params,
                id: 1516681174,
              };

              curl.post(
                keys.tradingURI,
                JSON.stringify(postParamas),
                {},
                async function (err, response, body) {
                  if (JSON.parse(body).result.status === "success") {
                    userWallet[0].walletAmount =
                      parseFloat(userWallet[0].walletAmount) +
                      parseFloat(userWithdrawRequest.amount);
                    userWallet[0].save();

                    let currentDate = new Date();
                    let months = [
                      "January",
                      "February",
                      "March",
                      "April",
                      "May",
                      "June",
                      "July",
                      "August",
                      "September",
                      "October",
                      "November",
                      "December",
                    ];
                    let emailBody = withdrawEmail(
                      userWithdrawRequest._id,
                      userWithdrawRequest.amount,
                      userWithdrawRequest.fees,
                      `${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
                      userWithdrawRequest.coin,
                      user.firstname + " " + user.lastname,
                      userWithdrawRequest.noteNumber,
                      "Request Cancelled"
                    );

                    const mailOptions = {
                      from: {
                        name: "Trillionbit",
                        email: "noreply@trillionbit.com",
                      }, // sender address
                      to: user.email, // list of receivers
                      subject: "Withdrawal Request Created", // Subject line
                      html: emailBody, // plain text body
                    };

                    try {
                      sgMail.send(mailOptions);
                    } catch (error) {
                      console.log(error);
                    }

                    res.json({
                      variant: "success",
                      message:
                        "Withdraw request created successfully. Please wait for our response",
                    });
                  } else {
                    return res.status(400).json({
                      variant: "error",
                      message: "Failed to add amount to trading wallet..",
                    });
                  }
                }
              );
            } else {
              return res.status(400).json({
                variant: "error",
                message: "Failed to cancel withdraw request, try again later.",
              });
            }
          });
          return res.json({
            variant: "success",
            message: "Withdraw request cancelled.",
          });
        }
      } else {
        return res.status(400).json({
          variant: "error",
          message: "Something went wrong please try again.",
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      return res.status(400).json({
        variant: "error",
        message: "Something went wrong please try again.",
      });
    });
});

/**
 * @route GET /api/wallet/get_aed_price
 * @description get aed price
 * @access Public
 */
router.get("/get_aed_price", (req, res) => {
  CurrencySetting.findOne({ name: "USD to AED" })
    .then((currencySetting) => {
      if (currencySetting) {
        return res.json(currencySetting.value);
      } else {
        return res.json(3.7);
      }
    })
    .catch((err) => {
      return res.json(3.7);
    });
});

/**
 * @route GET /api/wallet/all_wallet
 * @description get aed price
 * @access Public
 */
router.get("/all_wallet", async (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt_decode(token);
    let validation = jwtTokenValidation(user);
    if (validation) {
      await WalletController.getApiEthTransactions(user.id);
      const apiWallets = await ApiWallet.find({ userId: user.id }).select([
        "bonusWalletAmount",
        "active",
        "createdAt",
        "coin",
        "walletAddress",
        "walletAmount",
        "destinationTag",
        "bonusWalletAmount",
      ]);
      return res.json({ status: "success", wallets: apiWallets });
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid Token." });
    }
  } else {
    return res.status(400).json({ status: "error", message: "Token missing." });
  }
});

/**
 * @route GET /api/wallet/get_wallet/:walletId
 * @description get wallet
 * @access Public
 */
router.get("/get_wallet/:walletId", async (req, res) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt_decode(token);
    let validation = jwtTokenValidation(user);
    if (validation) {
      await WalletController.getApiEthTransactions(user.id);
      const apiWallet = await ApiWallet.findOne({
        _id: req.params.walletId,
      }).select([
        "bonusWalletAmount",
        "active",
        "createdAt",
        "coin",
        "walletAddress",
        "walletAmount",
        "destinationTag",
        "bonusWalletAmount",
      ]);
      if (apiWallet) {
        return res.json({ status: "success", wallets: apiWallet });
      } else {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid wallet id." });
      }
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid Token." });
    }
  } else {
    return res.status(400).json({ status: "error", message: "Token missing." });
  }
});

/**
 * @route POST /api/wallet/create_wallet
 * @description get aed price
 * @access Public
 */
router.post("/create_wallet", async (req, res) => {
  let coin = req.body.coin;

  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = await jwt_decode(token);
    let validation = jwtTokenValidation(user);
    if (validation) {
      let asset = await Assets.findOne({ name: coin });
      if (asset) {
        const newWallet = await WalletController.createApiWallet(
          user.id,
          asset
        );
        if (newWallet) {
          return res.json({ status: "success", wallet: newWallet });
        } else {
          return res
            .status(400)
            .json({ status: "error", message: "Faield to create a wallet." });
        }
      } else {
        return res
          .status(400)
          .json({ status: "error", message: "Invalid Coin." });
      }
    } else {
      return res
        .status(400)
        .json({ status: "error", message: "Invalid Token." });
    }
  } else {
    return res.status(400).json({ status: "error", message: "Token missing." });
  }
});

router.post("/buy-btx-coin", async (req, res) => {
  const { errors, isValid } = buyBtxCoinValidation(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  const { userId, btxBuyDetail } = req.body;
  User.findOne({ _id: userId })
    .then(async (user) => {
      if (user) {
        const userWalletBtx = await UserWallet.findOne({
          userId: userId,
          coin: "BTX",
          active: true,
        });
        const userWallet = await UserWallet.findOne({
          userId: userId,
          coin: btxBuyDetail.coin,
          active: true,
        });
        const msg = isEmpty(userWalletBtx)
          ? `please active your btx wallet.`
          : isEmpty(userWallet)
            ? `please active your ${btxBuyDetail.coin} wallet.`
            : "";
        if (!isEmpty(msg)) {
          return res.json({
            variant: "error",
            message: `please active your btx wallet.`,
          });
        }
        if (
          parseFloat(btxBuyDetail.price) > parseFloat(userWallet.walletAmount)
        ) {
          return res.json({
            variant: "error",
            message: `Please transfer more ${btxBuyDetail.coin} in order to buy BTX.`,
          });
        }
        // const orderExist = await Order.exists({userId: user._id, status: 'Finished', market: { $in : ["BTXINR", "BTXAED", "BTXETH", "BTXBTC", "BTXUSDT"]}});

        const currentDate = Date.now();
        const newOrder = Order({
          userId: user._id,
          orderId: uuidv4(),
          side: 2,
          type: 2,
          market: btxBuyDetail.market,
          takerFee: "0",
          makerFee: "0",
          dealStock: btxBuyDetail.amount,
          dealMoney: btxBuyDetail.price,
          dealFee: "0",
          amount: btxBuyDetail.amount,
          price: btxBuyDetail.price,
          mTime: currentDate,
          cTime: currentDate,
          status: "Finished",
          createTime: currentDate,
        });

        newOrder
          .save()
          .then(async (order) => {
            userWallet.walletAmount = (
              parseFloat(userWallet.walletAmount) -
              parseFloat(btxBuyDetail.price)
            ).toFixed(8);
            // console.log("userWallet.walletAmount", userWallet.walletAmount);
            await userWallet.save();
            userWalletBtx.walletAmount = (
              parseFloat(userWalletBtx.walletAmount) +
              parseFloat(btxBuyDetail.amount)
            ).toFixed(8);
            // console.log("userWalletBtx.walletAmount", userWalletBtx.walletAmount);
            userWalletBtx.markModified("walletAmount");
            await userWalletBtx.save();
            // if(!orderExist) {
            await addReferralEarnedDetail(
              user._id,
              btxBuyDetail.amount,
              btxBuyDetail.market
            );
            // }
            res.json({
              variant: "success",
              userWalletBtx: userWalletBtx,
              message: "BTX buy order placed Successfully",
            });
          })
          .catch((err) => {
            res.json({ variant: "error", message: "order not placed." });
          });
      } else {
        res.json({ variant: "error", message: "User not founnd." });
      }
    })
    .catch((err) => {
      res.json({ variant: "error", message: "Something went to wrong.!" });
    });
});

const addReferralEarnedDetail = async (userId, amount, market) => {
  const btxCommision = await ReferralSetting.findOne();
  const earnedPercentage =
    !isEmpty(btxCommision) && !isEmpty(btxCommision.btxCommissionPercentage)
      ? btxCommision.btxCommissionPercentage
      : "5";
  const referralTree = await ReferralTree.findOne({ referredUser: userId });
  if (!isEmpty(referralTree)) {
    const referredUser = await Referral.findById(referralTree.referralId);
    if (!isEmpty(referredUser)) {
      try {
        const totalAmount =
          (parseFloat(amount) * parseFloat(earnedPercentage)) / 100;
        const addReferralEarnedDetail = ReferralEarnedDetail({
          user: referredUser.userId,
          ReferralUser: userId,
          coin: "BTX",
          earnedMarket: market,
          earnedAmount: totalAmount,
          earnedPercentage: earnedPercentage,
        });
        await addReferralEarnedDetail.save();
        const userWalletBtx = await UserWallet.findOne({
          userId: referredUser.userId,
          coin: "BTX",
          active: true,
        });
        userWalletBtx.walletAmount = (
          parseFloat(userWalletBtx.walletAmount) + parseFloat(totalAmount)
        ).toFixed(8);
        await userWalletBtx.save();
      } catch (err) {
        // console.log(err);
        return false;
      }
    }
  }
  return false;
};

module.exports = router;
