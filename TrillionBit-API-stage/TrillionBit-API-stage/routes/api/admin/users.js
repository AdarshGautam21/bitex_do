const curl = require("curl");
const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
// const saveBuffer = require('save-buffer');
const { v4: uuidv4 } = require("uuid");

const User = require("../../../models/User");
const UserDocument = require("../../../models/UserDocument");
const UserIdentity = require("../../../models/UserIdentity");
const UserWallet = require("../../../models/UserWallet");
const DocumentEmail = require("../../../models/DocumentEmail");
const WalletTransactions = require("../../../models/wallet/WalletTransactions");
const UserAnnouncement = require("../../../models/UserAnnouncement");
const UserDepositRequest = require("../../../models/UserDepositRequest");
const UserWithdrawRequest = require("../../../models/UserWithdrawRequest");
const BitgoSetting = require("../../../models/BitgoSetting");
const BitgoWalletIdentifier = require("../../../models/BitgoWalletIdentifier");
const ReferralSetting = require("../../../models/referral/ReferralSetting");
const AgentCommisson = require("../../../models/agent/AgentCommission");
const AgentDefaultSettings = require("../../../models/agent/AgentDefaultSettings");
const AgentCode = require("../../../models/agent/AgentCode");
const LeverageSetting = require("../../../models/margin/LeverageSetting");
const EthAddress = require("../../../controller/eth/models/address");

const Markets = require("../../../models/trading/Markets");
const Order = require("../../../models/trading/Order");

const Blog = require("../../../models/Blog");
const AppVersions = require("../../../models/AppVersions");

const depositEmail = require("../../../emails/DepositEmail");
const withdrawEmail = require("../../../emails/WithdrawEmail");
const resendDocEmail = require("../../../emails/ResendDocEmail");
const verifiedDocEmail = require("../../../emails/VerifiedDocEmail");

const WalletController = require("../../../controller/WalletController");

const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const keys = require("../../../config/key");

const BitGoJS = require("bitgo");

const validateUserUpdateInput = require("../../../validation/admin/updateUser");
const { isEmpty } = require("lodash");
const Assets = require("../../../models/trading/Assets");
const UserActivity = require("../../../models/UserActivity");
const permissionSeeder = require("../../../seeders/permission");
const UserProfile = require("../../../models/UserProfile");

/**
 * @route GET /api/admin/users/bitgo_settings
 * @description Get all bitgo settings.
 * @access Public
 */
router.get("/bitgo_settings", (req, res) => {
  let bitgoSetting = BitgoSetting.find();
  if (bitgoSetting.length > 0) {
    res.json(bitgoSetting);
  } else {
    res.json({ message: "No settings found" });
  }
});

const getBitgoBalances = async (bitgoWalletIdentifier) => {
  const bitgo = new BitGoJS.BitGo({
    env: "prod",
    accessToken: keys.bitgoAccessKey,
  });
  if (
    bitgoWalletIdentifier.name === "BTC" &&
    bitgoWalletIdentifier.type === "withdraw"
  ) {
    return {
      _wallet: {
        balance: 1.4032 * 1e8,
      },
    };
  } else if (
    bitgoWalletIdentifier.name === "BCH" &&
    bitgoWalletIdentifier.type === "withdraw"
  ) {
    return {
      _wallet: {
        balance: 5.56 * 1e8,
      },
    };
  } else if (
    bitgoWalletIdentifier.name === "LTC" &&
    bitgoWalletIdentifier.type === "withdraw"
  ) {
    return {
      _wallet: {
        balance: 22.1 * 1e8,
      },
    };
  } else {
    return await bitgo
      .coin(bitgoWalletIdentifier.name.toLowerCase())
      .wallets()
      .get({ id: bitgoWalletIdentifier.identifier });
  }
};

/**
 * @route GET /api/admin/users/bitgo_wallet_identifier
 * @description Get all bitgo settings.
 * @access Public
 */
router.get("/bitgo_wallet_identifier", async (req, res) => {
  let bitgoIdentifiers = [];
  let bitgoWalletIdentifiers = await BitgoWalletIdentifier.find();
  if (bitgoWalletIdentifiers.length > 0) {
    for (bitgoWalletIdentifier of bitgoWalletIdentifiers) {
      console.log(bitgoWalletIdentifier.name);
      let b_balance_wallet = await getBitgoBalances(bitgoWalletIdentifier);
      bitgoIdentifiers.push({
        ...bitgoWalletIdentifier._doc,
        balance: parseFloat(b_balance_wallet._wallet.balance) / 1e8,
      });
    }
    res.json(bitgoIdentifiers);
  } else {
    res.status(400).json({ message: "No identifiers found" });
  }
});

/**
 * @route GET /api/admin/users/get_wallet_transactions/:userId
 * @description Get all bitgo settings.
 * @access Public
 */
router.get("/get_wallet_transactions/:userId", async (req, res) => {
  let allTransactions = [];
  let allWalletTransactions = await WalletTransactions.find({
    userId: req.params.userId,
  });
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
  res.json(allTransactions);
});

/**
 * @route POST /api/admin/users/all_crypto_deposits
 * @description Get all bitgo settings.
 * @access Public
 */
router.post("/all_crypto_deposits", async (req, res) => {
  let page_size = parseInt(req.query.page_size);
  let page = parseInt(req.query.page);
  let skip = (page > 0 ? page : 0) * page_size;

  let allTransactions = [];
  let allCount = await WalletTransactions.count({ type: "Deposit" });
  let allWalletTransactions = await WalletTransactions.find({
    type: "Deposit",
  })
    .sort({ date: -1 })
    .where("value")
    .regex(new RegExp(req.body.search_string, "i"))
    .skip(skip)
    .limit(page_size);

  for (tkey in allWalletTransactions) {
    let walletTransaction = {
      _id: allWalletTransactions[tkey]._id,
      user: await User.findOne({
        _id: allWalletTransactions[tkey].userId,
      }),
      type: allWalletTransactions[tkey].type,
      date: allWalletTransactions[tkey].date,
      txid: allWalletTransactions[tkey].txid
        ? allWalletTransactions[tkey].txid
        : "",
      confirmation: allWalletTransactions[tkey].confirmations,
      account: allWalletTransactions[tkey].coin,
      value: allWalletTransactions[tkey].value,
      receiverAddress: allWalletTransactions[tkey].receiverAddress,
      senderAddress: allWalletTransactions[tkey].senderAddress,
      fee: allWalletTransactions[tkey].fees
        ? allWalletTransactions[tkey].fees
        : "-",
    };
    if (walletTransaction) {
      allTransactions.push(walletTransaction);
    }
  }
  // await allTransactions.sort(function(a, b){return new Date(b.date) - new Date(a.date)});
  let response = {};
  response["data"] = allTransactions;
  response["totalCount"] = allCount;
  response["page"] = page;
  res.json(response);
});

/**
 * @route POST /api/admin/users/all_crypto_withdrawals
 * @description Get all bitgo settings.
 * @access Public
 */
router.post("/all_crypto_withdrawals", async (req, res) => {
  let page_size = parseInt(req.query.page_size);
  let page = parseInt(req.query.page);
  let skip = (page > 0 ? page : 0) * page_size;

  let allTransactions = [];
  let allCount = await WalletTransactions.count({ type: "Withdrawal" });
  let allWalletTransactions = await WalletTransactions.find({
    type: "Withdrawal",
  })
    .sort({ date: -1 })
    .where("value")
    .regex(new RegExp(req.body.search_string, "i"))
    .skip(skip)
    .limit(page_size);

  for (tkey in allWalletTransactions) {
    let walletTransaction = {
      _id: allWalletTransactions[tkey]._id,
      user: await User.findOne({
        _id: allWalletTransactions[tkey].userId,
      }),
      type: allWalletTransactions[tkey].type,
      date: allWalletTransactions[tkey].date,
      txid: allWalletTransactions[tkey].txid
        ? allWalletTransactions[tkey].txid
        : "",
      destinationTag: allWalletTransactions[tkey].destinationTag
        ? allWalletTransactions[tkey].destinationTag
        : null,
      // txid_short: allWalletTransactions[tkey].txid ? allWalletTransactions[tkey].txid.substr(1, 8) : '',
      confirmation: allWalletTransactions[tkey].confirmations,
      account: allWalletTransactions[tkey].coin,
      value: allWalletTransactions[tkey].value,
      sender: allWalletTransactions[tkey].sender,
      receiver: allWalletTransactions[tkey].receiver,
      receiverAddress: allWalletTransactions[tkey].receiverAddress,
      senderAddress: allWalletTransactions[tkey].senderAddress,
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
  // const data = await allTransactions.sort(function(a, b){return new Date(b.date) - new Date(a.date)});

  let response = {};
  response["data"] = allTransactions;
  response["totalCount"] = allCount;
  response["page"] = page;
  res.json(response);
});

/**
 * @route POST /api/admin/users/update_crypto_transaction
 * @description Update crypto transaction.
 * @access Public
 */
router.post("/update_crypto_transaction", async (req, res) => {
  let walletTransactions = await WalletTransactions.findOne({
    _id: req.body._id,
  });
  walletTransactions.txid = req.body.txid;
  walletTransactions.state = req.body.status;
  walletTransactions
    .save()
    .then((walletTransactions) => {
      res.json({
        variant: "success",
        message: "Transaction updated successfully",
      });
    })
    .catch((err) => {
      res.status(400).json({
        variant: "error",
        message: "Failed to update transaction",
      });
    });
});

/**
 * @route POST /api/admin/users/all_fiat_withdrawals
 * @description Post all fiat transactions
 * @access Public
 */
router.post("/all_fiat_withdrawals", async (req, res) => {
  let page_size = parseInt(req.query.page_size);
  let page = parseInt(req.query.page);
  let skip = (page > 0 ? page : 0) * page_size;

  let allTransactions = [];
  let allCount = await UserWithdrawRequest.count();
  let allWalletTransactions = await UserWithdrawRequest.find()
    .sort({ createdAt: -1 })
    .where("amount")
    .regex(new RegExp(req.body.search_string, "i"))
    .skip(skip)
    .limit(page_size);

  for (tkey in allWalletTransactions) {
    let walletTransaction = {
      _id: allWalletTransactions[tkey]._id,
      user: await User.findOne({
        _id: allWalletTransactions[tkey].userId,
      }),
      type: "Withdrawal",
      date: allWalletTransactions[tkey]
        ? allWalletTransactions[tkey].createdAt
        : "",
      account: allWalletTransactions[tkey].coin,
      value: allWalletTransactions[tkey].amount,
      noteNumber: allWalletTransactions[tkey].noteNumber,
      status: allWalletTransactions[tkey].status,
    };
    if (walletTransaction) {
      allTransactions.push(walletTransaction);
    }
  }
  // await allTransactions.sort(function(a, b){return new Date(b.date) - new Date(a.date)});

  let response = {};
  response["data"] = allTransactions;
  response["totalCount"] = allCount;
  response["page"] = page;
  res.json(response);
});

/**
 * @route POST /api/admin/users/all_fiat_deposit
 * @description Get all fiat transactions
 * @access Public
 */
router.post("/all_fiat_deposit", async (req, res) => {
  let page_size = parseInt(req.query.page_size);
  let page = parseInt(req.query.page);
  let skip = (page > 0 ? page : 0) * page_size;

  let allTransactions = [];
  let allCount = await UserDepositRequest.count();
  let allWalletTransactions = await UserDepositRequest.find()
    .sort({ createdAt: -1 })
    .where("amount")
    .regex(new RegExp(req.body.search_string, "i"))
    .skip(skip)
    .limit(page_size);

  for (tkey in allWalletTransactions) {
    let walletTransaction = {
      _id: allWalletTransactions[tkey]._id,
      user: await User.findOne({
        _id: allWalletTransactions[tkey].userId,
      }),
      type: "Deposit",
      date: allWalletTransactions[tkey].createdAt,
      account: allWalletTransactions[tkey].coin,
      value: allWalletTransactions[tkey].amount,
      noteNumber: allWalletTransactions[tkey].noteNumber
        ? allWalletTransactions[tkey].noteNumber
        : "",
      referenceNumber: allWalletTransactions[tkey].referenceNumber
        ? allWalletTransactions[tkey].referenceNumber
        : "",
      status: allWalletTransactions[tkey].status,
    };
    if (walletTransaction) {
      allTransactions.push(walletTransaction);
    }
  }
  // await allTransactions.sort(function(a, b){return new Date(b.date) - new Date(a.date)});
  let response = {};
  response["data"] = allTransactions;
  response["totalCount"] = allCount;
  response["page"] = page;
  res.json(response);
});

/**
 * @route GET /api/admin/users/bitgo_wallet_identifier
 * @description Get all bitgo settings.
 * @access Public
 */
router.get("/bitgo_wallet_identifier", async (req, res) => {
  let bitgoWalletIdentifiers = await BitgoWalletIdentifier.find();
  if (bitgoWalletIdentifiers.length > 0) {
    res.json(bitgoWalletIdentifiers);
  } else {
    res.status(400).json({ message: "No identifiers found" });
  }
});

/**
 * @route GET /api/admin/users/bitgo_wallet_identifier
 * @description Get all bitgo settings.
 * @access Public
 */
router.post("/create_bitgo_wallet_identifier", (req, res) => {
  const bitgoWalletIdentifier = new BitgoWalletIdentifier({
    name: req.body.name,
    identifier: req.body.identifier,
    type: req.body.type,
  });
  bitgoWalletIdentifier
    .save()
    .then((bitgoWalletIdentifier) => {
      res.json({ variant: "success", message: "Identifier added." });
    })
    .catch((err) =>
      res.status(400).json({
        variant: "error",
        message: "Failed to create. Try again.",
      })
    );
});

/**
 * @route GET /api/admin/users/remove_wallet_identifier/:identifierId
 * @description Get all bitgo settings.
 * @access Public
 */
router.post("/remove_wallet_identifier/:identifierId", async (req, res) => {
  let bitgoWalletIdentifier = await BitgoWalletIdentifier.findOne({
    _id: req.params.identifierId,
  });
  if (bitgoWalletIdentifier) {
    bitgoWalletIdentifier.remove();
    res.json({ variant: "success", message: "Identifier removed." });
  } else {
    res.status(400).json({
      variant: "error",
      message: "Failed to remove. Try again.",
    });
  }
});

/**
 * @route GET /api/admin/user/all_orders
 * @description GET all all_orders
 * @access Public
 */
router.get("/all_orders", async (req, res) => {
  const orders = await Order.find().sort("-createTime");

  let allTransactions = [];
  for (okey in orders) {
    let orderTransac = {
      _id: orders[okey]._id,
      user: await User.findOne({ _id: orders[okey].userId }),
      type:
        orders[okey].type === 1
          ? `Limit (${orders[okey].side === 1 ? "Sell" : "Buy"})`
          : `Market (${orders[okey].side === 1 ? "Sell" : "Buy"})`,
      side: orders[okey].side,
      date: orders[okey].createTime,
      updateDate: orders[okey].updateDate,
      account: orders[okey].market,
      value:
        orders[okey].type === 2
          ? orders[okey].side === 2
            ? (
                parseFloat(orders[okey].dealStock) /
                parseFloat(orders[okey].dealMoney)
              ).toFixed(8)
            : orders[okey].amount
          : orders[okey].amount,
      rate: orders[okey].price,
      executed: orders[okey].price,
      fee: orders[okey].dealFee,
      status: orders[okey].status,
    };
    if (orderTransac) {
      allTransactions.push(orderTransac);
    }
  }

  await allTransactions.sort(function (a, b) {
    return new Date(b.date) - new Date(a.date);
  });
  res.json(allTransactions);
});

/**
 * @route POST /api/admin/user/all_verified
 * @description GET all verified users
 * @access Private
 */
router.post("/all_verified", async (req, res) => {
  let page_size = parseInt(req.query.page_size);
  let page = parseInt(req.query.page);
  let skip = (page > 0 ? page : 0) * page_size;

  let verifiedUsers = await UserIdentity.find({
    submitted: true,
    approve: true,
  }).select("userId -_id");

  let usersIdList = [];
  if (verifiedUsers.length > 0) {
    for (verifiedUser of verifiedUsers) {
      usersIdList.push(verifiedUser.userId);
    }
  }

  let allCount = await User.count({ _id: { $in: usersIdList } });
  let allVerifiedUsers = await User.find({ _id: { $in: usersIdList } })
    .sort({ createdAt: -1 })
    .where("email")
    .regex(new RegExp(req.body.search_string, "i"))
    .skip(skip)
    .limit(page_size);

  let response = {};
  response["data"] = allVerifiedUsers;
  response["totalCount"] = allCount;
  response["page"] = page;
  return res.json(response);
});

/**
 * @route POST /api/admin/user/all_doc_submitted
 * @description GET all verified users
 * @access Private
 */
router.post("/all_doc_submitted", async (req, res) => {
  let page_size = parseInt(req.query.page_size);
  let page = parseInt(req.query.page);
  let skip = (page > 0 ? page : 0) * page_size;

  let docSubmittedUsers = await UserIdentity.find({
    submitted: true,
    approve: false,
  }).select("userId -_id");

  let usersIdList = [];
  if (docSubmittedUsers.length > 0) {
    for (docSubmittedUser of docSubmittedUsers) {
      usersIdList.push(docSubmittedUser.userId);
    }
  }

  let allCount = await User.count({ _id: { $in: usersIdList } });
  let allDocSubmittedUsers = await User.find({ _id: { $in: usersIdList } })
    .sort({ createdAt: -1 })
    .where("email")
    .regex(new RegExp(req.body.search_string, "i"))
    .skip(skip)
    .limit(page_size);

  let response = {};
  response["data"] = allDocSubmittedUsers;
  response["totalCount"] = allCount;
  response["page"] = page;
  return res.json(response);
});

/**
 * @route GET /api/admin/user/all
 * @description GET all users
 * @access Public
 */
router.post("/all/:total_users", async (req, res) => {
  // const errors = {};
  // let total_users = parseInt(req.params.total_users);

  // // Query Params
  // let queryParams = {};

  // let ids = [];
  // if(req.body.userIds && req.body.userIds != "") {
  //     ids = req.body.userIds.split(",");
  //     queryParams._id = { $in: ids };
  // }
  // if(req.body.startDate && req.body.endDate) {
  //     queryParams.date = { $gt: req.body.startDate, $lt: req.body.endDate };
  // }

  // User query
  // let userQuery = User.find(queryParams);
  let verifiedUsers = await UserIdentity.find({
    submitted: true,
    approve: true,
  }).select("userId -_id");
  let submittedUsers = await UserIdentity.find({
    submitted: true,
    approve: false,
  }).select("userId -_id");

  // let usersList = [];
  // let usersSubmittedList = [];
  let usersNewList = [];

  if (verifiedUsers.length > 0) {
    for (verifiedUser of verifiedUsers) {
      usersNewList.push(verifiedUser.userId);
    }
  }

  if (submittedUsers.length > 0) {
    for (submittedUser of submittedUsers) {
      usersNewList.push(submittedUser.userId);
    }
  }

  let newUsers = await User.find({ _id: { $nin: usersNewList } });

  // if (newUsers.length > 0) {
  //   for(newUser of newUsers) {
  //     const user = await User.findOne({_id: newUser.userId});
  //     if (user) {
  //       const currentNewUser = {
  //         ...user._doc,
  //         submitted: newUser ? (newUser.submitted ? 'True' : 'False') : 'False',
  //         approve: newUser ? (newUser.approve ? 'True' : 'False') : 'False',
  //         onHold: newUser ? (newUser.onHold ? 'True' : 'False') : 'False',
  //       };
  //       usersNewList.push(currentNewUser);
  //     }
  //   }
  // }

  res.json({
    // usersList: usersList,
    // usersSubmittedList: usersSubmittedList,
    usersNewList: newUsers,
  });

  // userQuery
  //   .skip(0).limit(total_users)
  //   .sort('-createdAt')
  //   .select(['firstname', 'lastname', 'email', 'avatar', 'agent', 'subAgent', 'marginTrading', 'phone', 'country', 'createdAt'])
  //   .then(async users => {
  //     if(!users || users.length === 0) {
  //       errors.message = 'There are no users.';
  //       return res.status(404).json(errors);
  //     }

  //     let usersList = [];
  //     let usersSubmittedList = [];
  //     let usersNewList = [];
  //     for(user of users) {
  //       // let userProfile = await UserProfile.findOne({userId: user._id});
  //       await UserIdentity.findOne({userId: user._id})
  //         .then(async userIdentity => {
  //           let currentUser = {
  //             ...user._doc,
  //             agent: user.agent,
  //             subAgent: user.subAgent,
  //             marginTrading: user.marginTrading ? user.marginTrading : false,
  //             submitted: userIdentity ? (userIdentity.submitted ? 'True' : 'False') : 'False',
  //             approve: userIdentity ? (userIdentity.approve ? 'True' : 'False') : 'False',
  //             onHold: userIdentity ? (userIdentity.onHold ? 'True' : 'False') : 'False',
  //             // userProfile: userProfile,
  //             // userIdentity: userIdentity,
  //           };
  //           if (currentUser.submitted === 'True' && currentUser.approve === 'True') {
  //             usersList.push(currentUser);
  //           }
  //           if (currentUser.submitted === 'True' && currentUser.approve === 'False') {
  //             usersSubmittedList.push(currentUser);
  //           }
  //           if (currentUser.submitted === 'False' && currentUser.approve === 'False') {
  //             usersNewList.push(currentUser);
  //           }
  //           return true;
  //         })
  //     }
  //     res.json({
  //       usersList: usersList,
  //       usersSubmittedList: usersSubmittedList,
  //       usersNewList: usersNewList,
  //     });
  //   })
  //   .catch(err =>
  //     {
  //       console.log(err);
  //       res.status(400).json({ users: 'There are no users.'})
  //     }
  //   )
});

/**
 * @route GET /api/admin/user/get_announcements
 * @description get users announcements
 * @access Public
 */
router.get("/get_announcements", (req, res) => {
  const errors = {};

  UserAnnouncement.find()
    .sort("-createdAt")
    .skip(0)
    .limit(5)
    .then((userAnnouncement) => {
      if (userAnnouncement.length < 1) {
        errors.message = "There are no announcements.";
        return res.json([]);
      }
      res.json(userAnnouncement);
    })
    .catch((err) => res.json([]));
});

/**
 * @route DELETE /api/admin/user/remove_announcements
 * @description remove users announcements
 * @access Public
 */
router.all("/remove_announcements/:announcementId", (req, res) => {
  const errors = {};

  UserAnnouncement.findOne({ _id: req.params.announcementId })
    .then((userAnnouncement) => {
      if (userAnnouncement) {
        userAnnouncement
          .remove()
          .then((response) => {
            res.json({
              variant: "success",
              message: "Announcement removed successfully",
            });
          })
          .catch((err) => {
            res.status(400).json({
              variant: "error",
              message: "Failed to remove announcement",
            });
          });
      } else {
        res.status(400).json({
          variant: "error",
          message: "Announcement not found on our database",
        });
      }
    })
    .catch((err) =>
      res.status(400).json({
        variant: "error",
        message: "Failed to remove announcement",
      })
    );
});

/**
 * @route POST /api/admin/user/create_announcements
 * @description get users announcements
 * @access Public
 */
router.post("/create_announcements", (req, res) => {
  const errors = {};

  const data = req.body;

  try {
    const userAnnouncement = new UserAnnouncement({
      announceTitle: data.announceTitle ? data.announceTitle : "",
      announceDetails: data.announceDetails,
    });
    userAnnouncement.save();
    res.json({
      variant: "success",
      message: "Successfully created announcement",
    });
  } catch (err) {
    res.status(400).json({
      variant: "error",
      message: "Failed to create announcement",
    });
  }
});

/**
 * @route GET /api/admin/user/search_by_name
 * @description Search users by name
 * @access Public
 */
router.get("/search_by_name/:search_string", (req, res) => {
  const errors = {};

  User.find()
    .where("name")
    .regex(new RegExp(req.params.search_string, "i"))
    .select(["name", "email", "avatar", "date"])
    .then((users) => {
      if (!users) {
        errors.message = "There are no users.";
        return res.status(404).json(errors);
      }
      res.json(users);
    })
    .catch((err) => res.status(400).json({ users: "There are no users." }));
});

/**
 * @route DELETE /api/admin/users/delete_user
 * @description Delete user by email
 * @access Public
 */
router.delete("/delete_user", (req, res) => {
  User.findOne({ email: req.body.user_email })
    .then((user) => {
      if (user) {
        user.remove();
        res.json({
          variant: "success",
          message: "User " + user.email + " successfully removed.",
        });
      } else {
        return res
          .status(400)
          .json({ variant: "error", message: "User not found." });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        variant: "error",
        message: "Invalid user email to delete",
      });
    });
});

/**
 * @route PUT /api/admin/users/update_user
 * @description Update user details
 * @access Public
 */
router.put("/update_user", (req, res) => {
  const { errors, isValid } = validateUserUpdateInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  let _id = req.body._id;

  User.findOne({ _id })
    .then((user) => {
      if (user) {
        user.email = req.body.email;
        user.name = req.body.name;
        user.save();

        res.json({
          variant: "success",
          message: "User " + user.email + " successfully updated.",
        });
      } else {
        return res
          .status(400)
          .json({ variant: "error", message: "User not found." });
      }
    })
    .catch((err) => {
      return res.status(400).json({
        variant: "error",
        message: "Invalid user id to update.",
      });
    });
});

/**
 * @route GET /api/admin/users/approve_user_doc
 * @description Search users by name
 * @access Public
 */
router.get("/approve_user_doc/:doc_id", (req, res) => {
  const _id = req.params.doc_id;

  UserDocument.findOne({ _id: _id })
    .then((userDocument) => {
      if (userDocument) {
        userDocument.verification = true;
        userDocument
          .save()
          .then((response) => {
            res.json({
              variant: "success",
              message: "Doc status successfully updated.",
            });
          })
          .catch((err) => {
            return res.status(400).json({
              variant: "error",
              message: "Error on approve doc.",
            });
          });
      } else {
        return res.status(400).json({
          variant: "error",
          message: "Error on approve doc.",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        variant: "error",
        message: "There are no doc found.",
      });
    });
});

/**
 * @route GET /api/admin/users/get_wallets
 * @description Get all user wallets
 * @access Public
 */
router.get("/get_wallets", (req, res) => {
  UserWallet.find()
    .then((userWallets) => {
      if (userWallets.length > 0) {
        return res.json(userWallets);
      } else {
        return res
          .status(400)
          .json({ variant: "error", message: "No wallets found." });
      }
    })
    .catch((err) => {
      res.status(400).json({
        variant: "error",
        message: "Error on getting wallet.",
      });
    });
});

/**
 * @route GET /api/admin/users/get_user_profile/:userId
 * @description Get all user profile
 * @access Public
 */
router.get("/get_user_profile/:userId", (req, res) => {
  UserProfile.findOne({ userId: req.params.userId })
    .then((userProfile) => {
      if (userProfile) {
        return res.json(userProfile);
      } else {
        return res
          .status(400)
          .json({ variant: "error", message: "No wallets found." });
      }
    })
    .catch((err) => {
      res.status(400).json({
        variant: "error",
        message: "Error on getting wallet.",
      });
    });
});

/**
 * @route GET /api/admin/users/get_wallets_info/:userId
 * @description Get all user wallets
 * @access Public
 */
router.get("/get_wallets_info/:userId", (req, res) => {
  UserWallet.find({ userId: req.params.userId })
    .then(async (userWallets) => {
      if (userWallets.length > 0) {
        let userWalletList = [];
        for (userWallet of userWallets) {
          let ethDetails = await EthAddress.findOne({
            address: userWallet.walletAddress,
          });
          userWalletList.push({
            ...userWallet._doc,
            ethDetails: ethDetails ? ethDetails : "",
          });
        }
        return res.json(userWalletList);
      } else {
        return res
          .status(400)
          .json({ variant: "error", message: "No wallets found." });
      }
    })
    .catch((err) => {
      res.status(400).json({
        variant: "error",
        message: "Error on getting wallet.",
      });
    });
});

/**
 * @route GET /api/admin/users/get_availale_markets
 * @description Get all available markets
 * @access Public
 */
router.get("/get_availale_markets", async (req, res) => {
  let markets = await Markets.find({});

  return res.json(markets);

  // const postParamas = {
  //     method: 'market.list',
  //     params: [],
  //     id: 1516681174
  // }

  // curl.post(keys.tradingURI, JSON.stringify(postParamas), {}, async function(err, response, body) {
  //   console.log(body, 'markets');
  //   if(err) {
  //     res.status(400).json({message: 'No markets found'});
  //   } else {
  //     markets = JSON.parse(body).result;
  //     let marketArr = [];

  //     for (var i = markets.length - 1; i >= 0; i--) {
  //       let currentMarket = markets[i];
  //       await Markets.findOne({ 'name' :  currentMarket.name })
  //         .then(market => {
  //           if(market) {
  //             marketArr.push(market);
  //           } else {
  //             const newMarket = new Markets({
  //               name: currentMarket.name,
  //               min_amount: currentMarket.min_amount,
  //               money: currentMarket.money,
  //               stock: currentMarket.stock,
  //               fee_prec: currentMarket.fee_prec,
  //               money_prec: currentMarket.money_prec,
  //               stock_prec: currentMarket.stock_prec
  //             });
  //             newMarket.save();
  //             marketArr.push(newMarket);
  //           }
  //         })
  //         .catch(err => {
  //           //
  //         })
  //     }
  //     res.json(marketArr);
  //   }
  // });
});

/**
 * @route GET /api/admin/users/update_market/:marketId
 * @description Get update market.
 * @access Public
 */
router.get("/update_market/:marketId", (req, res) => {
  Markets.findOne({ _id: req.params.marketId })
    .then((market) => {
      if (market) {
        market.active = !market.active;
        market.save();
        res.json({
          variant: "success",
          message: `Market ${market.name} is updated`,
        });
      } else {
        res.status(400).json({
          variant: "error",
          message: "Market not found on DB.",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        variant: "error",
        message: "Error on updating market.",
      });
    });
});

/**
 * @route POST /api/admin/users/update_market_data/:marketId
 * @description Get update market data.
 * @access Public
 */
router.post("/update_market_data/:marketId", (req, res) => {
  Markets.findOne({ _id: req.params.marketId })
    .then((market) => {
      if (market) {
        market.displayName = req.body.displayName;
        market.priority = req.body.priority;
        !isEmpty(req.body.limitOrderRange)
          ? (market.limitOrderRange = req.body.limitOrderRange)
          : null;
        !isEmpty(req.body.marketOrderRange)
          ? (market.marketOrderRange = req.body.marketOrderRange)
          : null;
        !isEmpty(req.body.quantityRange)
          ? (market.quantityRange = req.body.quantityRange)
          : null;
        !isEmpty(req.body.priceRange)
          ? (market.priceRange = req.body.priceRange)
          : null;
        market.spreadBid = req.body.spreadBid;
        market.spreadAsk = req.body.spreadAsk;
        market.save();
        res.json({
          variant: "success",
          message: `Market ${market.name} is updated`,
        });
      } else {
        res.status(400).json({
          variant: "error",
          message: "Market not found on DB.",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        variant: "error",
        message: "Error on updating market.",
      });
    });
});

/**
 * @route GET /api/admin/users/webhook/all
 * @description Get all webhooks.
 * @access Public
 */
router.get("/webhook/all", async (req, res) => {
  const coins = ["BTC", "LTC", "BCH"];
  const result = [];

  const bitgoStatus = await WalletController.getBitgoStatus();
  // Read the user authentication section to get your API access token
  const bitgo = new BitGoJS.BitGo({
    env: bitgoStatus,
    accessToken: keys.bitgoAccessKey,
  });

  for (key in coins) {
    const bitgoWalletIdentifier = await BitgoWalletIdentifier.find({
      name: coins[key],
      type: "deposit",
    });
    const bitgoWebhook = await bitgo
      .coin(coins[key].toLowerCase())
      .wallets()
      .get({ id: bitgoWalletIdentifier[0].identifier })
      .then(function (wallet) {
        return wallet.listWebhooks({}, function callback(err, result) {
          return result;
        });
      })
      .catch((err) => {
        return false;
      });

    if (bitgoWebhook) {
      if (bitgoWebhook.webhooks[0]) {
        result.push(bitgoWebhook.webhooks[0]);
      }
    }
  }
  res.json(result);
});

/**
 * @route GET /api/admin/users/webhook/add
 * @description Get user wallet info object.
 * @access Public
 */
router.post("/webhook/add", async (req, res) => {
  const bitgoStatus = await WalletController.getBitgoStatus();
  // Read the user authentication section to get your API access token
  const bitgoWalletIdentifier = await BitgoWalletIdentifier.find({
    name: req.body.coin,
    type: "deposit",
  });

  const bitgo = new BitGoJS.BitGo({
    env: bitgoStatus,
    accessToken: keys.bitgoAccessKey,
  });

  bitgo
    .coin(req.body.coin.toLowerCase())
    .wallets()
    .get({ id: bitgoWalletIdentifier[0].identifier })
    .then(function (wallet) {
      wallet.addWebhook(
        {
          url: req.body.url,
          type: "transaction",
          numConfirmations: parseInt(req.body.confirmation),
        },
        function callback(err, result) {
          res.json({
            variant: "success",
            message: "Webhook added successfully",
          });
        }
      );
    })
    .catch((err) => {
      res.json({ variant: "error", message: "Failed to create webhook" });
    });
});

/**
 * @route POST /api/admin/users/webhook/remove
 * @description Remove a webhook.
 * @access Public
 */
router.post("/webhook/remove", async (req, res) => {
  const bitgoStatus = await WalletController.getBitgoStatus();
  // Read the user authentication section to get your API access token
  const bitgo = new BitGoJS.BitGo({
    env: bitgoStatus,
    accessToken: keys.bitgoAccessKey,
  });

  bitgo
    .coin("tbtc")
    .wallets()
    .get({ id: keys.bitgoDepositeWallet })
    .then(function (wallet) {
      wallet.removeWebhook(
        { url: req.body.url, type: "transaction" },
        function callback(err, result) {
          res.json({
            variant: "success",
            message: "Webhook removed successfully",
          });
        }
      );
    })
    .catch((err) => {
      res.json({ variant: "error", message: "Failed to remove webhook" });
    });
});

/**
 * @route GET /api/admin/users/update_deposit_request/:status/:request_id
 * @description Update user details
 * @access Public
 */
router.get("/update_deposit_request/:status/:request_id", (req, res) => {
  const status = req.params.status;
  const statusId = req.params.request_id;

  // console.log(status, statusId);

  UserDepositRequest.findOne({ _id: statusId })
    .then((userDepositRequest) => {
      if (userDepositRequest) {
        if (userDepositRequest.approve) {
          return res.status(400).json({
            variant: "error",
            message: "Request is already been updated.",
          });
        } else {
          if (status === "finished") {
            userDepositRequest.status = "Finished";
            userDepositRequest.approve = true;
            userDepositRequest.save();

            // console.log(parseInt(userDepositRequest.userId.replace(/\D/g,'')), userDepositRequest.amount);
            UserWallet.find({
              userId: userDepositRequest.userId,
              coin: userDepositRequest.coin,
            }).then(async (userWallet) => {
              if (userWallet.length > 0) {
                const user = await User.findOne({
                  _id: userWallet[0].userId,
                });
                const params = [
                  user.viabtcUserId,
                  userDepositRequest.coin,
                  "deposit",
                  new Date().getTime(),
                  parseFloat(userDepositRequest.amount) + "",
                  {},
                ];

                const postParamas = {
                  method: "balance.update",
                  params: params,
                  id: 1516681174,
                };

                // depositReqest = await WalletController.depositeWallet(userWallet[0], parseFloat(userDepositRequest.amount));

                // if (depositReqest) {
                // code taken from here
                // } else {
                //   return res.status(400).json({variant: 'error', message: 'Failed to add amount to user wallet, try again.'});
                // }

                console.log(postParamas);
                curl.post(
                  keys.tradingURI,
                  JSON.stringify(postParamas),
                  {},
                  async function (err, response, body) {
                    console.log(body, err);
                    if (JSON.parse(body).result.status === "success") {
                      userWallet[0].walletAmount =
                        parseFloat(userWallet[0].walletAmount) +
                        parseFloat(userDepositRequest.amount);
                      userWallet[0].save();

                      User.findOne({
                        _id: userDepositRequest.userId,
                      }).then((user) => {
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
                          `${currentDate.getDate()}, ${
                            months[currentDate.getMonth()]
                          } ${currentDate.getFullYear()}`,
                          userDepositRequest.coin,
                          user.firstname + " " + user.lastname,
                          req.body.noteNumber,
                          "Accepted!"
                        );

                        const mailOptions = {
                          from: {
                            name: "Trillionbit",
                            email: "noreply@trillionbit.com",
                          }, // sender address
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
                        message: "Deposit request successfully updated.",
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
                  message: "Failed to add amount to user wallet.",
                });
              }
            });
          } else if (status === "canceled") {
            userDepositRequest.status = "Cancelled";
            userDepositRequest.approve = true;
            userDepositRequest.save();

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
                `${currentDate.getDate()}, ${
                  months[currentDate.getMonth()]
                } ${currentDate.getFullYear()}`,
                userDepositRequest.coin,
                user.firstname + " " + user.lastname,
                req.body.noteNumber,
                "Cancelled!"
              );

              const mailOptions = {
                from: {
                  name: "Trillionbit",
                  email: "noreply@trillionbit.com",
                }, // sender address
                to: user.email, // list of receivers
                subject: "Deposit Request Cancelled", // Subject line
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
              message: "Deposit request successfully cancelled.",
            });
          }
        }
      } else {
        return res.status(400).json({
          variant: "error",
          message: "Selected User deposit request not found.",
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
 * @route GET /api/admin/users/update_withdrwal_request/:status/:request_id
 * @description Update user details
 * @access Public
 */
router.get("/update_withdrwal_request/:status/:request_id", (req, res) => {
  const status = req.params.status;
  const statusId = req.params.request_id;

  UserWithdrawRequest.findOne({ _id: statusId })
    .then((userWithdrawRequest) => {
      if (userWithdrawRequest) {
        if (userWithdrawRequest.approve) {
          return res.status(400).json({
            variant: "error",
            message: "Request is already been updated.",
          });
        } else {
          if (status === "approved") {
            userWithdrawRequest.status = "Approved";
            // userWithdrawRequest.approve = true;
            userWithdrawRequest.save();

            return res.json({
              variant: "success",
              message: "Withdrawal request successfully approved.",
            });
          } else if (status === "finished") {
            userWithdrawRequest.status = "Finished";
            userWithdrawRequest.approve = true;
            userWithdrawRequest.save();

            User.findOne({ _id: userWithdrawRequest.userId }).then((user) => {
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
                `${currentDate.getDate()}, ${
                  months[currentDate.getMonth()]
                } ${currentDate.getFullYear()}`,
                userWithdrawRequest.coin,
                user.firstname + " " + user.lastname,
                userWithdrawRequest.noteNumber,
                "Finished!"
              );

              const mailOptions = {
                from: {
                  name: "Trillionbit",
                  email: "noreply@trillionbit.com",
                }, // sender address
                to: user.email, // list of receivers
                subject: "Withdrawal Finished", // Subject line
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
              message: "Withdrawal request successfully updated.",
            });
          } else if (status === "canceled") {
            userWithdrawRequest.status = "Cancelled";
            userWithdrawRequest.approve = true;
            userWithdrawRequest.save();

            UserWallet.find({
              userId: userWithdrawRequest.userId,
              coin: userWithdrawRequest.coin,
            }).then(async (userWallet) => {
              if (userWallet.length > 0) {
                const user = await User.findOne({
                  _id: userWallet[0].userId,
                });
                if (user) {
                  const params = [
                    user.viabtcUserId,
                    userWithdrawRequest.coin,
                    "deposit",
                    new Date().getTime(),
                    "" + parseFloat(userWithdrawRequest.amount),
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
                      console.log(body, err);
                      if (JSON.parse(body).result.status === "success") {
                        userWallet[0].walletAmount =
                          parseFloat(userWallet[0].walletAmount) +
                          parseFloat(userWithdrawRequest.amount);
                        userWallet[0].save();

                        User.findOne({
                          _id: userWithdrawRequest.userId,
                        }).then((user) => {
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
                            `${currentDate.getDate()}, ${
                              months[currentDate.getMonth()]
                            } ${currentDate.getFullYear()}`,
                            userWithdrawRequest.coin,
                            user.firstname + " " + user.lastname,
                            userWithdrawRequest.noteNumber,
                            "Cancelled!"
                          );

                          const mailOptions = {
                            from: {
                              name: "Trillionbit",
                              email: "noreply@trillionbit.com",
                            }, // sender address
                            to: user.email, // list of receivers
                            subject: "Withdrawal Request Cancelled", // Subject line
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
                          message: "Withdrawal request successfully updated.",
                        });
                      } else {
                        return res.status(400).json({
                          variant: "error",
                          message: "Something went wrong please try again.",
                        });
                      }
                    }
                  );
                } else {
                  return res.status(400).json({
                    variant: "error",
                    message: "Something went wrong please try again.",
                  });
                }

                // depositReqest = await WalletController.depositeWallet(userWallet[0], parseFloat(userWithdrawRequest.amount));

                // if (depositReqest) {
                // } else {
                //   return res.status(400).json({variant: 'error', message: 'Something went wrong please try again.'});
                // }
              }
            });
          }
        }
      } else {
        return res.status(400).json({
          variant: "error",
          message: "Selected User withdrawal request not found.",
        });
      }
    })
    .catch((err) => {
      console.log(err);
      return res.status(400).json({
        variant: "error",
        message: "Something went wrong please try again.",
      });
    });
});

/**
 * @route GET /api/admin/users/get_referral_settings
 * @description Update user details
 * @access Public
 */
router.get("/get_referral_settings", (req, res) => {
  ReferralSetting.find().then((referrelSetting) => {
    if (referrelSetting.length > 0) {
      res.json(referrelSetting[0]);
    } else {
      let referralSetting = new ReferralSetting();
      referralSetting.commissionPercentage = 25;
      referralSetting.earningPeriod = 3;
      referralSetting.save();
      res.json(referralSetting);
    }
  });
});

/**
 * @route POST /api/admin/users/update_referral_settings/:referralSettingId
 * @description Update user details
 * @access Public
 */
router.post("/update_referral_settings/:referralSettingId", (req, res) => {
  ReferralSetting.findOne({ _id: req.params.referralSettingId })
    .then((referrelSetting) => {
      if (referrelSetting) {
        referrelSetting.commissionPercentage = req.body.commission;
        referrelSetting.btxCommissionPercentage =
          req.body.btxCommissionPercentage;
        referrelSetting.earningPeriod = req.body.referralPeriod;
        referrelSetting.save();
        return res.json({
          variant: "success",
          message: "Settings updated successfully.",
        });
      } else {
        let referralSetting = new ReferralSetting();
        referralSetting.commissionPercentage = req.body.commission;
        referrelSetting.btxCommissionPercentage =
          req.body.btxCommissionPercentage;
        referralSetting.earningPeriod = req.body.referralPeriod;
        referralSetting.save();
        return res.json({
          variant: "success",
          message: "Settings updated successfully.",
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
 * @route POST /api/admin/users/approve_user_identity/:userId
 * @description Approve user identity
 * @access Public
 */
router.get("/approve_user_identity/:userId", (req, res) => {
  UserIdentity.findOne({ userId: req.params.userId })
    .then(async (userIdentity) => {
      if (userIdentity) {
        userIdentity.approve = true;
        userIdentity.save();

        let user = await User.findOne({ _id: req.params.userId });

        let emailBody = verifiedDocEmail(user.firstname + " " + user.lastname);

        const mailOptions = {
          from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
          to: user.email, // list of receivers
          subject: "Account Verified!", // Subject line
          html: emailBody, // plain text body
        };

        try {
          sgMail.send(mailOptions);
        } catch (error) {
          console.log(error);
        }

        return res.json({
          variant: "success",
          message: "User identity approved.",
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
 * @route POST /api/admin/users/resend_doc/:userId/:issueEmailId
 * @description Approve user identity
 * @access Public
 */
router.get("/resend_doc/:userId/:issueEmailId", (req, res) => {
  UserIdentity.findOne({ userId: req.params.userId })
    .then(async (userIdentity) => {
      if (userIdentity) {
        let issueDocEmail = await DocumentEmail.findOne({
          _id: req.params.issueEmailId,
        });
        userIdentity.submitted = false;
        userIdentity.approve = false;
        userIdentity.save();

        let userDocuments = await UserDocument.find({
          userIdentityId: userIdentity._id,
        });
        for (userDocument of userDocuments) {
          const filePath =
            path.join(__dirname, "../../../storage/images/") +
            userDocument.documentFile;
          fs.unlinkSync(filePath);
          await userDocument.remove();
        }

        let user = await User.findOne({ _id: req.params.userId });

        let emailContent = `
          <tr>
            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
                <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">1. ID proof: National ID (Front and Back) or Driver’s license (Front and Back) or Passport</div>
            </td>
          </tr>

          <tr>
            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
              <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">2. Address proof: Utility bill or bank statement or employment certificate</div>
            </td>
          </tr>

          <tr>
            <td align="left" style="font-size:0px;padding:10px 25px;word-break:break-word;">
              <div style="font-family:Lato, sans-serif;font-size:16px;font-weight:500;line-height:22px;text-align:left;color:#535353;">If you have any questions, please let us know</div>
            </td>
          </tr>`;

        if (issueDocEmail) {
          emailContent = `
          <tr>
            <td align="left" style="font-size:16px;padding:10px 25px;word-break:break-word;">
              ${issueDocEmail.content}
            </td>
          </tr>
          `;
        }

        let emailBody = resendDocEmail(
          user.firstname + " " + user.lastname,
          emailContent
        );

        const mailOptions = {
          from: { name: "Bitex UAE", email: "support@bitexuae.com" }, // sender address
          to: user.email, // list of receivers
          subject: "Identity Verification Issue!", // Subject line
          html: emailBody, // plain text body
        };

        try {
          sgMail.send(mailOptions);
        } catch (error) {
          console.log(error);
        }

        return res.json({
          variant: "success",
          message: "User identity cancelled.",
        });
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
 * @route GET /api/admin/users/all_issue_emails
 * @description Get all issue emails
 * @access Public
 */
router.get("/all_issue_emails", (req, res) => {
  DocumentEmail.find()
    .then(async (documentEmails) => {
      return res.json(documentEmails);
    })
    .catch((err) => {
      return res.status(400).json({
        variant: "error",
        message: "Something went wrong please try again.",
      });
    });
});

/**
 * @route POST /api/admin/users/save_issue_email
 * @description Store Email
 * @access Public
 */
router.post("/save_issue_email", async (req, res) => {
  const documentEmail = new DocumentEmail({
    name: req.body.name,
    content: req.body.content,
  });

  documentEmail
    .save()
    .then((newdocumentEmail) => {
      return res.json({
        variant: "success",
        message: `${documentEmail.name} email created!.`,
      });
    })
    .catch((err) => {
      return res.status(400).json({
        variant: "error",
        message: "Something went wrong please try again.",
      });
    });
});

/**
 * @route POST /api/admin/users/update_issue_email
 * @description Store Blog
 * @access Public
 */
router.post("/update_issue_email", async (req, res) => {
  const documentEmail = await DocumentEmail.findOne({ _id: req.body.id });

  if (documentEmail) {
    documentEmail.name = req.body.name;
    documentEmail.content = req.body.content;
    documentEmail.save();
    return res.json({
      variant: "success",
      message: `${documentEmail.name} email updated!.`,
    });
  } else {
    return res.status(400).json({
      variant: "error",
      message: "Something went wrong please try again.",
    });
  }
});

/**
 * @route GET /api/admin/users/remove_issue_email/:blogId
 * @description Remove blog.
 * @access Public
 */
router.get("/remove_issue_email/:emailId", async (req, res) => {
  let documentEmail = await DocumentEmail.findOne({
    _id: req.params.emailId,
  });
  if (documentEmail) {
    documentEmail.remove();
    res.json({ variant: "success", message: "Email removed." });
  } else {
    res.status(400).json({
      variant: "error",
      message: "Failed to remove. Try again.",
    });
  }
});

/**
 * @route GET /api/admin/users/all_blogs
 * @description Approve user identity
 * @access Public
 */
router.get("/all_blogs", (req, res) => {
  Blog.find()
    .then(async (blogs) => {
      return res.json(blogs);
    })
    .catch((err) => {
      return res.status(400).json({
        variant: "error",
        message: "Something went wrong please try again.",
      });
    });
});

/**
 * @route POST /api/admin/users/save_blog
 * @description Store Blog
 * @access Public
 */
router.post("/save_blog", async (req, res) => {
  let currentFilePath;
  let currentThumbPath;
  let myfile;
  let mythumbnail;
  for (file of req.files) {
    let uniqueImageId = uuidv4();
    let currentFile = file;

    if (currentFile.fieldname === "file") {
      currentFilePath =
        "./storage/images/" +
        uniqueImageId +
        "." +
        /[^.]+$/.exec(currentFile.originalname)[0];
      myfile = uniqueImageId + "." + /[^.]+$/.exec(currentFile.originalname)[0];
      // await saveBuffer(currentFile.buffer, currentFilePath);
      await fs.open(currentFilePath, "w", function (err, fd) {
        if (err) {
          // throw 'could not open file: ' + err;
          // console.log(err);
        }

        // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
        fs.write(
          fd,
          currentFile.buffer,
          0,
          currentFile.buffer.length,
          null,
          function (err) {
            if (err) {
              // console.log(err)
            }
            fs.close(fd, function () {
              // console.log('wrote the file successfully');
            });
          }
        );
      });
    }

    if (currentFile.fieldname === "thumbnail") {
      currentThumbPath =
        "./storage/images/" +
        uniqueImageId +
        "." +
        /[^.]+$/.exec(currentFile.originalname)[0];
      mythumbnail =
        uniqueImageId + "." + /[^.]+$/.exec(currentFile.originalname)[0];
      // await saveBuffer(currentFile.buffer, currentThumbPath);
      await fs.open(currentThumbPath, "w", function (err, fd) {
        if (err) {
          // throw 'could not open file: ' + err;
          // console.log(err);
        }

        // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
        fs.write(
          fd,
          currentFile.buffer,
          0,
          currentFile.buffer.length,
          null,
          function (err) {
            if (err) {
              // console.log(err)
            }
            fs.close(fd, function () {
              // console.log('wrote the file successfully');
            });
          }
        );
      });
    }
  }
  // let currentPath = './storage/images/'+ uniqueImageId +'.'+/[^.]+$/.exec(currentFile.originalname)[0];
  // await saveBuffer(currentFile.buffer, currentPath);

  const blog = new Blog({
    image: myfile,
    thubmnail: mythumbnail,
    name: req.body.name,
    caption: req.body.caption,
    details: req.body.details,
    keywords: req.body.keywords,
    description: req.body.description,
  });

  blog
    .save()
    .then((newBlog) => {
      return res.json({
        variant: "success",
        message: `${newBlog.name} Blog created!.`,
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json({
        variant: "error",
        message: "Something went wrong please try again.",
      });
    });
});

/**
 * @route POST /api/admin/users/update_blog
 * @description Store Blog
 * @access Public
 */
router.post("/update_blog", async (req, res) => {
  let currentFilePath;
  let currentThumbPath;
  let myfile;
  let mythumbnail;
  let fileChange = false;
  let thumbnailChange = false;
  // let currentPath = './storage/images/'+ uniqueImageId +'.'+/[^.]+$/.exec(currentFile.originalname)[0];
  // await saveBuffer(currentFile.buffer, currentPath);

  const blog = await Blog.findOne({ _id: req.body.id });

  if (blog) {
    let currentRemovePath = "./storage/images/" + blog.image;
    let currentRemoveThumbPath = "./storage/images/" + blog.thubmnail;

    if (req.files) {
      for (file of req.files) {
        let uniqueImageId = uuidv4();
        let currentFile = file;

        if (currentFile.fieldname === "file") {
          fileChange = true;
          try {
            fs.unlinkSync(currentRemovePath);
          } catch (err) {
            //
          }
          currentFilePath =
            "./storage/images/" +
            uniqueImageId +
            "." +
            /[^.]+$/.exec(currentFile.originalname)[0];
          myfile =
            uniqueImageId + "." + /[^.]+$/.exec(currentFile.originalname)[0];
          // await saveBuffer(currentFile.buffer, currentFilePath);
          await fs.open(currentFilePath, "w", function (err, fd) {
            if (err) {
              // throw 'could not open file: ' + err;
              // console.log(err);
            }

            // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
            fs.write(
              fd,
              currentFile.buffer,
              0,
              currentFile.buffer.length,
              null,
              function (err) {
                if (err) {
                  // console.log(err)
                }
                fs.close(fd, function () {
                  // console.log('wrote the file successfully');
                });
              }
            );
          });
        }

        if (currentFile.fieldname === "thumbnail") {
          thumbnailChange = true;
          try {
            fs.unlinkSync(currentRemoveThumbPath);
          } catch (err) {
            //
          }
          currentThumbPath =
            "./storage/images/" +
            uniqueImageId +
            "." +
            /[^.]+$/.exec(currentFile.originalname)[0];
          mythumbnail =
            uniqueImageId + "." + /[^.]+$/.exec(currentFile.originalname)[0];
          // await saveBuffer(currentFile.buffer, currentThumbPath);
          await fs.open(currentThumbPath, "w", function (err, fd) {
            if (err) {
              // throw 'could not open file: ' + err;
              // console.log(err);
            }

            // write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
            fs.write(
              fd,
              currentFile.buffer,
              0,
              currentFile.buffer.length,
              null,
              function (err) {
                if (err) {
                  // console.log(err)
                }
                fs.close(fd, function () {
                  // console.log('wrote the file successfully');
                });
              }
            );
          });
        }
      }
    }

    if (fileChange) {
      blog.image = myfile;
    }
    if (thumbnailChange) {
      blog.thubmnail = mythumbnail;
    }
    blog.name = req.body.name;
    blog.caption = req.body.caption;
    blog.details = req.body.details;
    blog.keywords = req.body.keywords;
    blog.description = req.body.description;
    blog.save();
    return res.json({
      variant: "success",
      message: `${blog.name} Blog created!.`,
    });
  } else {
    return res.status(400).json({
      variant: "error",
      message: "Something went wrong please try again.",
    });
  }
});

/**
 * @route GET /api/admin/users/remove_blog/:blogId
 * @description Remove blog.
 * @access Public
 */
router.get("/remove_blog/:blogId", async (req, res) => {
  let blog = await Blog.findOne({ _id: req.params.blogId });
  if (blog) {
    let currentPath = "./storage/images/" + blog.image;
    let currentThumbPath = "./storage/images/" + blog.thubmnail;
    try {
      fs.unlinkSync(currentPath);
      fs.unlinkSync(currentThumbPath);
      blog.remove();
    } catch (err) {
      blog.remove();
    }
    res.json({ variant: "success", message: "Blog removed." });
  } else {
    res.status(400).json({
      variant: "error",
      message: "Failed to remove. Try again.",
    });
  }
});

/**
 * @route GET /api/admin/users/get_app_version
 * @description Get app versions.
 * @access Public
 */
router.get("/get_app_version", async (req, res) => {
  AppVersions.find()
    .then((appVersions) => {
      return res.json(appVersions);
    })
    .catch((err) => {
      return res.status(400).json({
        variant: "error",
        message: "Failed to get app versions.",
      });
    });
});

/**
 * @route DELETE /api/admin/users/remove_app_version/:appVersionId
 * @description Remove app version.
 * @access Public
 */
router.delete("/remove_app_version/:appVersionId", async (req, res) => {
  let appVersion = await AppVersions.findOne({
    _id: req.params.appVersionId,
  });
  if (appVersion) {
    appVersion.remove();
    return res.json({
      variant: "success",
      message: "App version removed.",
    });
  } else {
    return res.status(400).json({
      variant: "error",
      message: "Failed to remove. Try again.",
    });
  }
});

/**
 * @route POST /api/admin/users/create_app_version
 * @description Store app version
 * @access Public
 */
router.post("/create_app_version", async (req, res) => {
  const appVersion = new AppVersions({
    name: req.body.name,
    currentVersion: req.body.currentVersion,
    previousVersion: req.body.previousVersion,
  });

  appVersion
    .save()
    .then((newAppVersion) => {
      return res.json({
        variant: "success",
        message: `${newAppVersion.name} version created!.`,
      });
    })
    .catch((err) => {
      res.status(400).json({
        variant: "error",
        message: "Something went wrong please try again.",
      });
    });
});

/**
 * @route GET /api/admin/users/get_agent_default_settings
 * @description Update agent commissions
 */
router.get("/get_agent_default_settings", async (req, res) => {
  const agentDefaultSettings = await AgentDefaultSettings.find({});

  if (agentDefaultSettings.length > 0) {
    res.json(agentDefaultSettings[0]);
  } else {
    res.json({});
  }
});

/**
 * @route POST /api/admin/users/update_agent_default_setting
 * @description Update agent commissions
 */
router.post("/update_agent_default_setting", async (req, res) => {
  const agentDefaultSettings = await AgentDefaultSettings.find({});

  if (agentDefaultSettings.length > 0) {
    for (agentDefaultSetting of agentDefaultSettings) {
      agentDefaultSetting.makerFee = req.body.makerFee;
      agentDefaultSetting.takerFee = req.body.takerFee;
      agentDefaultSetting.save();
    }
  } else {
    const newagentDefaultSettings = new AgentDefaultSettings();
    newagentDefaultSettings.makerFee = req.body.makerFee;
    newagentDefaultSettings.takerFee = req.body.takerFee;
    newagentDefaultSettings.save();
  }
  return res.json({
    variant: "success",
    message: `Agent settings updated.!`,
  });
});

/**
 * @route GET /api/admin/users/get_agent_commission/:agentId
 * @description Update agent commissions
 */
router.post("/get_agent_commission/:agentId", async (req, res) => {
  const agentCommission = await AgentCommisson.findOne({
    agentId: req.params.agentId,
  });

  if (agentCommission) {
    agentCommission.makerFee = req.body.makerFee;
    agentCommission.takerFee = req.body.takerFee;
    agentCommission.save();

    return res.json({
      variant: "success",
      message: "Agent commission updated.",
    });
  } else {
    let newAgentCommission = new AgentCommisson();
    newAgentCommission.agentId = req.params.agentId;
    newAgentCommission.makerFee = 0.0;
    newAgentCommission.takerFee = 0.0;
    newAgentCommission.save();

    return res.json({
      variant: "success",
      message: "Agent commission created.",
    });
  }
});

/**
 * @route POST /api/admin/users/update_agent_commission/:agentId
 * @description Update agent commissions
 */
router.post("/update_agent_commission/:agentId", async (req, res) => {
  const agentCommission = await AgentCommisson.findOne({
    agentId: req.params.agentId,
  });

  if (agentCommission) {
    agentCommission.makerFee = req.body.makerFee;
    agentCommission.takerFee = req.body.takerFee;
    agentCommission.save();

    return res.json({
      variant: "success",
      message: "Agent commission updated.",
    });
  } else {
    let newAgentCommission = new AgentCommisson();
    newAgentCommission.agentId = req.params.agentId;
    newAgentCommission.makerFee = req.body.makerFee;
    newAgentCommission.takerFee = req.body.takerFee;
    newAgentCommission.save();

    return res.json({
      variant: "success",
      message: "Agent commission created.",
    });
  }
});

/**
 * @route GET /api/admin/users/toggle_agent/:userId
 * @description Upate agent flag on user
 */
router.post("/toggle_agent/:userId", async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });

  if (user) {
    const agentCode = await AgentCode.findOne().limit(1);
    let userAgentCode = `${user.country ? user.country : "IN"}${
      agentCode.agentCode
    }`;
    user.agent = !user.agent;
    user.subAgent = user.agent ? false : user.subAgent ? user.subAgent : false;
    if (isEmpty(user.agentCode) && user.agent) {
      user.agentCode = userAgentCode;
      agentCode.agentCode = parseInt(agentCode.agentCode) + 1;
      agentCode.save();
    }
    user.save();

    return res.json({
      variant: "success",
      message: "Agent settings updated.",
    });
  } else {
    return res.json({ variant: "error", message: "User not found." });
  }
});

/**
 * @route GET /api/admin/users/toggle_margin_trading/:userId
 * @description Upate margin trading on user
 */
router.post("/toggle_margin_trading/:userId", async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });

  if (user) {
    user.marginTrading = !user.marginTrading;
    user.save();

    return res.json({
      variant: "success",
      message: "Margin trading settings updated.",
    });
  } else {
    return res.json({ variant: "error", message: "User not found." });
  }
});

/**
 * @route GET /api/admin/users/toggle_sub_agent/:userId
 * @description Upate agent flag on user
 */
router.post("/toggle_sub_agent/:userId", async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });

  if (user) {
    const agentCode = await AgentCode.findOne().limit(1);
    let userAgentCode = `${user.country ? user.country : "IN"}${
      agentCode.agentCode
    }`;

    user.subAgent = !user.subAgent;
    user.agent = user.subAgent ? false : user.agent ? user.agent : false;
    if (isEmpty(user.agentCode) && user.agent) {
      user.agentCode = userAgentCode;
      agentCode.agentCode = parseInt(agentCode.agentCode) + 1;
      agentCode.save();
    }
    user.save();

    return res.json({
      variant: "success",
      message: "Sub agent settings updated.",
    });
  } else {
    return res.json({ variant: "error", message: "User not found." });
  }
});

/**
 * @route GET /api/admin/users/get_assets_leverage
 * @description Update agent commissions
 */
router.get("/get_assets_leverage", async (req, res) => {
  const leverageSettings = await LeverageSetting.find({});

  if (leverageSettings.length > 0) {
    let leverageSetting_list = [];
    for (leverageSetting of leverageSettings) {
      let asset = await Assets.findOne({
        _id: leverageSetting._doc.assetsId,
      });
      leverageSetting_list.push({
        ...leverageSetting._doc,
        asset: asset ? asset.name : "",
      });
    }
    res.json(leverageSetting_list);
  } else {
    res.json([]);
  }
});

/**
 * @route GET /api/admin/users/remove_assets_leverage/:leverageId
 * @description Update agent commissions
 */
router.get("/remove_assets_leverage/:leverageId", async (req, res) => {
  const leverageSetting = await LeverageSetting.findOne({
    _id: req.params.leverageId,
  });

  if (leverageSetting) {
    leverageSetting.remove();
    return res.json({
      variant: "success",
      message: `Leverage settings removed.!`,
    });
  } else {
    return res.json({
      variant: "error",
      message: `Leverage settings failed to remove.!`,
    });
  }
});

/**
 * @route POST /api/admin/users/get_assets_leverage
 * @description Update agent commissions
 */
router.post("/add_assets_leverage", async (req, res) => {
  const leverageSetting = await LeverageSetting.findOne({
    assetsId: req.body.asset,
  });

  if (leverageSetting) {
    leverageSetting.assetsId = req.body.asset;
    leverageSetting.maxLeverageLevel = req.body.maxLeverageLevel;
    leverageSetting.save();
    return res.json({
      variant: "success",
      message: `Leverage settings updated.!`,
    });
  } else {
    const newleverageSetting = new LeverageSetting();
    newleverageSetting.assetsId = req.body.asset;
    newleverageSetting.maxLeverageLevel = req.body.maxLeverageLevel;
    newleverageSetting.save();
  }
  return res.json({
    variant: "success",
    message: `Leverage settings added.!`,
  });
});

/**
 * @route POST /api/admin/users/store_fmc_token
 * @description Store fmc token of user
 * @access Public
 */
router.post("/store_fmc_token", async (req, res) => {
  const fcmToken = await FcmToken.findOne({ token: req.body.fmcToken });
  if (!fcmToken) {
    const newFcmToken = new FcmToken({
      token: req.body.fmcToken,
    });
    await newFcmToken.save();
  }
  return res.json({ message: "Token saved." });
});

/**
 * @route GET /api/user/get/:id
 * @description GET all users
 * @access Public
 */
router.get("/get-user/:id", async (req, res) => {
  try {
    const user = await User.findOne(
      { _id: req.params.id },
      "_id firstname lastname email phone avatar country dateOfBirth suspended agent viabtcUserId createdAt"
    ).lean();
    res.json(user);
  } catch (error) {
    res.status(400).json({ users: "There are no users." });
  }
  // .select(['_id', 'firstname', 'lastname', 'email', 'phone', 'avatar', 'country', 'suspended', 'agent', 'createdAt'])
});

/**
 * @route get /api/admin/user/all_verified
 * @description GET all verified users
 * @access Private
 */
router.get("/get-all-users", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let queryOptions = {};
  let sort = { createdAt: -1 };
  if (req.query.sortColumn) {
    sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
  }
  if (req.query.search) {
    const searchText = req.query.search.trim();
    let regex = new RegExp(searchText, "i");
    queryOptions = {
      $or: [
        {
          firstname: regex,
        },
        {
          email: regex,
        },
        {
          lastname: regex,
        },
        {
          country: regex,
        },
      ],
    };
  }
  if (!isEmpty(req.query.filters)) {
    const filters = JSON.parse(req.query.filters);

    for (let index = 0; index < filters.length; index++) {
      const value = filters[index]["value"][0];
      const name = filters[index]["name"];

      if (name === "createdAt") {
        if (value && filters[index]["value"][1])
          queryOptions["createdAt"] = {
            $gte: new Date(value),
            $lte: new Date(filters[index]["value"][1]),
          };
      } else if (name === "email") {
        if (value === "Verified Users") {
          let verifiedUsers = await UserIdentity.find({
            submitted: true,
            approve: true,
          })
            .select("userId -_id")
            .lean();
          let usersIdList = [];
          let i = verifiedUsers.length;
          while (i--) {
            usersIdList.push(verifiedUsers[i].userId);
          }
          queryOptions["_id"] = { $in: usersIdList };
        } else if (value === "Document Submitted Users") {
          let verifiedUsers = await UserIdentity.find({
            submitted: true,
            approve: false,
          })
            .select("userId -_id")
            .lean();
          let usersIdList = [];
          let i = verifiedUsers.length;
          while (i--) {
            usersIdList.push(verifiedUsers[i].userId);
          }
          queryOptions["_id"] = { $in: usersIdList };
        } else if (value === "UnVerified Users") {
          let verifiedUsers = await UserIdentity.find({
            submitted: false,
            approve: false,
          })
            .select("userId -_id")
            .lean();
          let usersIdList = [];
          let i = verifiedUsers.length;
          while (i--) {
            usersIdList.push(verifiedUsers[i].userId);
          }
          queryOptions["_id"] = { $in: usersIdList };
        } else if (value === "Suspended Users") {
          queryOptions["suspended"] = true;
        }
      } else {
        queryOptions[name] =
          fil.value.length === 1 ? value : { $all: fil.value };
      }
    }
  }

  let users = await User.paginate(queryOptions, {
    select: "firstname lastname email country createdAt",
    lean: true,
    page: parseInt(page),
    limit: parseInt(perPage),
    sort: sort,
  });
  return res.json(users);
});

/**
 * @route GET /api/admin/user/get-all-verify-users
 * @description GET all verified users
 * @access Private
 */
router.get("/get-all-verify-users", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let queryOptions = {};
  let sort = { createdAt: -1 };
  if (req.query.sortColumn) {
    sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
  }
  let verifiedUsers = await UserIdentity.find({
    submitted: true,
    approve: true,
  })
    .select("userId -_id")
    .lean();
  let usersIdList = [];
  let i = verifiedUsers.length;
  while (i--) {
    usersIdList.push(verifiedUsers[i].userId);
  }
  if (req.query.search) {
    const searchText = req.query.search.trim();
    let regex = new RegExp(searchText, "i");
    queryOptions = {
      $or: [
        {
          firstname: regex,
        },
        {
          email: regex,
        },
        {
          lastname: regex,
        },
        {
          country: regex,
        },
      ],
    };
  }

  queryOptions["_id"] = { $in: usersIdList };
  if (!isEmpty(req.query.filters)) {
    const filters = JSON.parse(req.query.filters);
    console.log("filters", filters);
    filters.map((fil) => {
      if (fil.name === "createdAt") {
        if (fil.value[0] && fil.value[1])
          queryOptions["createdAt"] = {
            $gte: new Date(fil.value[0]),
            $lte: new Date(fil.value[1]),
          };
      } else {
        queryOptions[fil.name] =
          fil.value.length === 1 ? fil.value[0] : { $all: fil.value };
      }
    });
  }
  let allVerifiedUsers = await User.paginate(queryOptions, {
    select:
      "firstname lastname email country agent subAgent marginTrading createdAt",
    lean: true,
    page: parseInt(page),
    limit: parseInt(perPage),
    sort: sort,
  });
  return res.json(allVerifiedUsers);
});

/**
 * @route GET /api/admin/user/get-all-indian-users
 * @description GET all verified users
 * @access Private
 */
router.get("/get-all-indian-users", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let queryOptions = {};
  let sort = { createdAt: -1 };
  if (req.query.sortColumn) {
    sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
  }
  if (req.query.search) {
    const searchText = req.query.search.trim();
    let regex = new RegExp(searchText, "i");
    queryOptions = {
      $or: [
        {
          firstname: regex,
        },
        {
          email: regex,
        },
        {
          lastname: regex,
        },
        {
          country: regex,
        },
      ],
    };
  }
  queryOptions["country"] = "IN";
  let users = await User.paginate(queryOptions, {
    select: "firstname lastname email country createdAt",
    lean: true,
    page: parseInt(page),
    limit: parseInt(perPage),
    sort: sort,
  });
  return res.json(users);
});

/**
 * @route GET /api/wallet/get_withdrawal_requests/:userId
 * @description Get user withdrawal requests.
 * @access Public
 */
router.get("/get_withdrawal_requests/:userId", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let sort = { createdAt: -1 };
  let queryOptions = {};
  if (req.query.sortColumn) {
    sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
  }
  if (req.query.search) {
    const searchText = req.query.search.trim();
    let regex = new RegExp(searchText, "i");
    queryOptions = {
      $or: [
        {
          noteNumber: regex,
        },
        {
          coin: regex,
        },
        {
          amount: regex,
        },
        {
          status: regex,
        },
      ],
    };
  }
  if (!isEmpty(req.query.filters)) {
    const filters = JSON.parse(req.query.filters);
    filters.map((fil) => {
      if (fil.name === "createdAt") {
        if (fil.value[0] && fil.value[1])
          queryOptions["createdAt"] = {
            $gte: new Date(fil.value[0]),
            $lte: new Date(fil.value[1]),
          };
      } else {
        queryOptions[fil.name] =
          fil.value.length === 1 ? fil.value[0] : { $all: fil.value };
      }
    });
  }
  queryOptions["userId"] = req.params.userId;
  try {
    const userWithdrawalRequests = await UserWithdrawRequest.paginate(
      queryOptions,
      {
        select: "_id createdAt coin amount noteNumber referenceNumber status",
        lean: true,
        page: parseInt(page),
        limit: parseInt(perPage),
        sort: sort,
      }
    );
    return res.json(userWithdrawalRequests);
  } catch (error) {
    return res.json([]);
  }
});

/**
 * @route GET /api/wallet/get_withdrawal_requests/:userId
 * @description Get user withdrawal requests.
 * @access Public
 */
router.get("/get_deposite_requests/:userId", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let sort = { createdAt: -1 };
  let queryOptions = {
    userId: req.params.userId,
    type: { $in: ["Deposit", "Bank Transfer"] },
  };
  if (req.query.sortColumn) {
    sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
  }
  if (req.query.search) {
    const searchText = req.query.search.trim();
    let regex = new RegExp(searchText, "i");
    queryOptions = {
      $or: [
        {
          noteNumber: regex,
        },
        {
          referenceNumber: regex,
        },
        {
          transactionId: regex,
        },
        {
          type: regex,
        },
        {
          coin: regex,
        },
        {
          fees: regex,
        },
        {
          amount: regex,
        },
        {
          paymentType: regex,
        },
        {
          status: regex,
        },
      ],
    };
  }
  if (!isEmpty(req.query.filters)) {
    const filters = JSON.parse(req.query.filters);
    filters.map((fil) => {
      if (fil.name === "paymentType" && fil.value[0] === "Bank Transfer")
        queryOptions["paymentType"] = { $eq: null };
      else if (fil.name === "paymentType")
        queryOptions["paymentType"] = { $regex: fil.value[0] };
      else if (fil.name === "createdAt") {
        if (fil.value[0] && fil.value[1])
          queryOptions["createdAt"] = {
            $gte: new Date(fil.value[0]),
            $lte: new Date(fil.value[1]),
          };
      } else
        queryOptions[fil.name] =
          fil.value.length === 1 ? fil.value[0] : { $in: fil.value };
    });
  }
  try {
    const userDepositRequest = await UserDepositRequest.paginate(queryOptions, {
      select:
        "_id userId createdAt type transactionId paymentType coin amount noteNumber referenceNumber responseMsg status",
      lean: true,
      page: parseInt(page),
      limit: parseInt(perPage),
      sort: sort,
    });
    return res.json(userDepositRequest);
  } catch (error) {
    return res.json([]);
  }
});

/**
 * @route GET /api/admin/users/get-crypto-transactions/:userId
 * @description Get crypto transcation.
 * @access public
 */
router.get("/get-crypto-transactions/:userId", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let sort = { date: -1 };
  let queryOptions = { userId: req.params.userId };
  if (req.query.sortColumn) {
    sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
  }
  if (req.query.search) {
    const searchText = req.query.search.trim();
    let regex = new RegExp(searchText, "i");
    queryOptions = {
      $or: [
        {
          type: regex,
        },
        {
          fees: regex,
        },
        {
          coin: regex,
        },
        {
          txid: regex,
        },
        {
          value: regex,
        },
        {
          rate: regex,
        },
        {
          state: regex,
        },
        {
          senderAddress: regex,
        },
        {
          receiverAddress: regex,
        },
      ],
    };
  }

  if (!isEmpty(req.query.filters)) {
    const filters = JSON.parse(req.query.filters);
    filters.map((fil) => {
      if (fil.name === "date") {
        if (fil.value[0] && fil.value[1])
          queryOptions["date"] = {
            $gte: new Date(fil.value[0]),
            $lte: new Date(fil.value[1]),
          };
      } else {
        queryOptions[fil.name] =
          fil.value.length === 1 ? fil.value[0] : { $all: fil.value };
      }
    });
  }

  try {
    const walletTransactions = await WalletTransactions.paginate(queryOptions, {
      select:
        "_id coin type date value senderAddress receiverAddress txid fees rate state",
      lean: true,
      page: parseInt(page),
      limit: parseInt(perPage),
      sort: sort,
    });
    return res.json(walletTransactions);
  } catch (error) {
    return res.json([]);
  }
});

/**
 * @route GET /api//user/get-orders/:userId
 * @description GET all user orders
 * @access Public
 */
router.get("/get-orders/:userId", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let sort = { createTime: -1 };
  let queryOptions = { userId: req.params.userId };
  if (req.query.sortColumn) {
    sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
  }
  if (req.query.search) {
    const searchText = req.query.search.trim();
    let regex = new RegExp(searchText, "i");
    queryOptions = {
      $or: [
        {
          market: regex,
        },
        {
          dealFee: regex,
        },
        {
          amount: regex,
        },
        {
          status: regex,
        },
      ],
    };
  }
  if (req.query.filters) {
    const filters = JSON.parse(req.query.filters);
    filters.map((fil) => {
      if (fil.name === "date") {
        if (fil.value[0] && fil.value[1])
          queryOptions["createTime"] = {
            $gte: new Date(fil.value[0]),
            $lte: new Date(fil.value[1]),
          };
      } else if (fil.name === "type") {
        const filVal = fil.value[0];
        queryOptions["type"] = filVal.includes("Limit") ? 1 : 2;
        queryOptions["side"] = filVal.includes("Sell") ? 1 : 2;
      } else {
        queryOptions[fil.name] =
          fil.value.length === 1 ? fil.value[0] : { $in: fil.value };
      }
    });
  }
  try {
    let orders = await Order.paginate(queryOptions, {
      select:
        "_id createTime side updateDate market type dealStock dealMoney dealFee price amount status",
      lean: true,
      page: parseInt(page),
      limit: parseInt(perPage),
      sort: sort,
    });
    let allOrders = [];
    if (!isEmpty(orders.docs)) {
      let orderIndex = orders.docs.length;
      let orderLists = orders.docs;
      while (orderIndex--) {
        if (!isEmpty(orderLists[orderIndex])) {
          allOrders.unshift({
            _id: orderLists[orderIndex]._id,
            type:
              orderLists[orderIndex].type === 1
                ? `Limit (${
                    orderLists[orderIndex].side === 1 ? "Sell" : "Buy"
                  })`
                : `Market (${
                    orderLists[orderIndex].side === 1 ? "Sell" : "Buy"
                  })`,
            side: orderLists[orderIndex].side,
            date: orderLists[orderIndex].createTime,
            updateDate: orderLists[orderIndex].updateDate,
            account: orderLists[orderIndex].market,
            value:
              orderLists[orderIndex].market === "BTXINR"
                ? orderLists[orderIndex].side === 2
                  ? parseFloat(orderLists[orderIndex].dealMoney) /
                    (parseFloat(orderLists[orderIndex].dealMoney) /
                      parseFloat(orderLists[orderIndex].dealStock))
                  : orderLists[orderIndex].amount
                : orderLists[orderIndex].type === 2
                  ? orderLists[orderIndex].side === 2
                    ? (
                        parseFloat(orderLists[orderIndex].dealStock) /
                        parseFloat(orderLists[orderIndex].dealMoney)
                      ).toFixed(8)
                    : orderLists[orderIndex].amount
                  : orderLists[orderIndex].amount,
            rate: orderLists[orderIndex].price,
            executed: orderLists[orderIndex].dealMoney,
            fee: orderLists[orderIndex].dealFee,
            status: orderLists[orderIndex].status,
          });
        }
      }
      orders.docs = allOrders;
    }
    return res.json(orders);
  } catch (error) {
    return res.json([]);
  }
});

/**
 * @route GET /api/admin/user/get-all-user-orders
 * @description GET all get-all-user-orders
 * @access Public
 */
router.get("/get-all-user-orders", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let sort = { createTime: -1 };
  let queryOptions = {};
  if (req.query.sortColumn) {
    if (req.query.sortColumn === "date")
      sort = {
        createTime: req.query.sort === "asc" ? 1 : -1,
      };
    else
      sort = {
        [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1,
      };
  }
  if (!isEmpty(req.query.search)) {
    try {
      const search = JSON.parse(req.query.search);
      if (!isEmpty(search.search)) {
        let searchText = search.search.trim();
        let regex = new RegExp(searchText, "i");
        queryOptions = {
          $or: [
            {
              market: regex,
            },
            {
              dealFee: regex,
            },
            {
              amount: regex,
            },
            {
              status: regex,
            },
          ],
        };
      }
      if (!isEmpty(search.name)) {
        let searchText = search.name.trim();
        let regex = new RegExp(searchText, "i");
        let userQueryOptions = {
          $or: [
            {
              firstname: regex,
            },
            {
              email: regex,
            },
            {
              lastname: regex,
            },
          ],
        };
        let users = await User.find(userQueryOptions, "_id").lean();
        let usersIdList = [];
        let i = users.length;
        while (i--) {
          usersIdList.push(users[i]._id);
        }
        queryOptions["userId"] = { $in: usersIdList };
      }
    } catch (error) {
      console.log("search error", error);
    }
  }

  if (req.query.filters) {
    const filters = JSON.parse(req.query.filters);
    filters.map((fil) => {
      if (fil.name === "date") {
        if (fil.value[0] && fil.value[1])
          queryOptions["createTime"] = {
            $gte: new Date(fil.value[0]),
            $lte: new Date(fil.value[1]),
          };
      } else if (fil.name === "type") {
        const filVal = fil.value[0];
        queryOptions["type"] = filVal.includes("Limit") ? 1 : 2;
        queryOptions["side"] = filVal.includes("Sell") ? 1 : 2;
      } else {
        queryOptions[fil.name] =
          fil.value.length === 1 ? fil.value[0] : { $in: fil.value };
      }
    });
  }
  try {
    let orders = await Order.paginate(queryOptions, {
      select:
        "_id userId createTime side updateDate market type dealStock dealMoney price dealFee amount status",
      lean: true,
      page: parseInt(page),
      limit: parseInt(perPage),
      sort: sort,
    });
    let allOrders = [];
    if (!isEmpty(orders.docs)) {
      let orderIndex = orders.docs.length;
      let orderLists = orders.docs;
      const userIds = orderLists.reduce((uniqueUserId, order) => {
        return uniqueUserId.includes(order.userId)
          ? uniqueUserId
          : [...uniqueUserId, order.userId];
      }, []);
      const users = await User.find(
        { _id: { $in: userIds } },
        "_id firstname lastname email"
      ).lean();
      while (orderIndex--) {
        if (!isEmpty(orderLists[orderIndex])) {
          let user = users.find(
            (userItem) =>
              userItem._id.toString() === orderLists[orderIndex].userId
          );
          // console.log("user:", user, users);
          allOrders.unshift({
            user: user,
            _id: orderLists[orderIndex]._id,
            type:
              orderLists[orderIndex].type === 1
                ? `Limit (${
                    orderLists[orderIndex].side === 1 ? "Sell" : "Buy"
                  })`
                : `Market (${
                    orderLists[orderIndex].side === 1 ? "Sell" : "Buy"
                  })`,
            side: orderLists[orderIndex].side,
            date: orderLists[orderIndex].createTime,
            updateDate: orderLists[orderIndex].updateDate,
            account: orderLists[orderIndex].market,
            value:
              orderLists[orderIndex].market === "BTXINR"
                ? orderLists[orderIndex].side === 2
                  ? parseFloat(orderLists[orderIndex].dealMoney) /
                    (parseFloat(orderLists[orderIndex].dealMoney) /
                      parseFloat(orderLists[orderIndex].dealStock))
                  : orderLists[orderIndex].amount
                : orderLists[orderIndex].type === 2
                  ? orderLists[orderIndex].side === 2
                    ? (
                        parseFloat(orderLists[orderIndex].dealStock) /
                        parseFloat(orderLists[orderIndex].dealMoney)
                      ).toFixed(8)
                    : orderLists[orderIndex].amount
                  : orderLists[orderIndex].amount,
            rate: orderLists[orderIndex].price,
            executed: orderLists[orderIndex].dealMoney,
            fee: orderLists[orderIndex].dealFee,
            status: orderLists[orderIndex].status,
          });
        }
      }
      orders.docs = allOrders;
    }
    return res.json(orders);
  } catch (error) {
    return res.json([]);
  }
});

/**
 * @route GET /api/admin/users/get-crypto-withdrawals
 * @description Get all get-crypto-withdrawals
 * @access Public
 */
router.get("/get-crypto-withdrawals", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let sort = { date: -1 };
  let queryOptions = { type: "Withdrawal" };
  if (req.query.sortColumn) {
    sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
  }
  if (!isEmpty(req.query.search)) {
    try {
      const search = JSON.parse(req.query.search);
      if (!isEmpty(search.search)) {
        let searchText = search.search.trim();
        let regex = new RegExp(searchText, "i");
        queryOptions = {
          $or: [
            {
              fees: regex,
            },
            {
              coin: regex,
            },
            {
              txid: regex,
            },
            {
              value: regex,
            },
            {
              rate: regex,
            },
            {
              state: regex,
            },
            {
              senderAddress: regex,
            },
            {
              receiverAddress: regex,
            },
          ],
        };
      }
      if (!isEmpty(search.name)) {
        let searchText = search.name.trim();
        let regex = new RegExp(searchText, "i");
        let userQueryOptions = {
          $or: [
            {
              firstname: regex,
            },
            {
              email: regex,
            },
            {
              lastname: regex,
            },
          ],
        };
        let users = await User.find(userQueryOptions, "_id").lean();
        let usersIdList = [];
        let i = users.length;
        while (i--) {
          usersIdList.push(users[i]._id);
        }
        queryOptions["userId"] = { $in: usersIdList };
      }
    } catch (error) {
      console.log("search error", error);
    }
  }

  if (!isEmpty(req.query.filters)) {
    const filters = JSON.parse(req.query.filters);
    filters.map((fil) => {
      if (fil.name === "date") {
        if (fil.value[0] && fil.value[1])
          queryOptions["date"] = {
            $gte: new Date(fil.value[0]),
            $lte: new Date(fil.value[1]),
          };
      } else {
        queryOptions[fil.name] =
          fil.value.length === 1 ? fil.value[0] : { $all: fil.value };
      }
    });
  }

  try {
    let walletTransactions = await WalletTransactions.paginate(queryOptions, {
      select:
        "_id coin userId date value senderAddress receiverAddress txid fees rate state destinationTag confirmations receiver sender",
      lean: true,
      page: parseInt(page),
      limit: parseInt(perPage),
      sort: sort,
    });
    let walletTransactionData = [];
    if (!isEmpty(walletTransactions.docs)) {
      let walletTransactionIndex = walletTransactions.docs.length;
      let walletTransactionLists = walletTransactions.docs;
      const userIds = walletTransactionLists.reduce(
        (uniqueUserId, walletTransaction) => {
          return uniqueUserId.includes(walletTransaction.userId)
            ? uniqueUserId
            : [...uniqueUserId, walletTransaction.userId];
        },
        []
      );
      const users = await User.find(
        { _id: { $in: userIds } },
        "_id firstname lastname email"
      ).lean();
      while (walletTransactionIndex--) {
        if (!isEmpty(walletTransactionLists[walletTransactionIndex])) {
          let user = users.find(
            (userItem) =>
              userItem._id.toString() ===
              walletTransactionLists[walletTransactionIndex].userId
          );
          // console.log("user:", user, users);
          walletTransactionData.unshift({
            _id: walletTransactionLists[walletTransactionIndex]._id,
            user: user,
            date: walletTransactionLists[walletTransactionIndex].date,
            txid: walletTransactionLists[walletTransactionIndex].txid
              ? walletTransactionLists[walletTransactionIndex].txid
              : "",
            destinationTag: walletTransactionLists[walletTransactionIndex]
              .destinationTag
              ? walletTransactionLists[walletTransactionIndex].destinationTag
              : null,
            // txid_short: walletTransactionLists[walletTransactionIndex].txid ? walletTransactionLists[walletTransactionIndex].txid.substr(1, 8) : '',
            confirmations:
              walletTransactionLists[walletTransactionIndex].confirmations,
            coin: walletTransactionLists[walletTransactionIndex].coin,
            value: walletTransactionLists[walletTransactionIndex].value,
            sender: walletTransactionLists[walletTransactionIndex].sender,
            receiver: walletTransactionLists[walletTransactionIndex].receiver,
            receiverAddress:
              walletTransactionLists[walletTransactionIndex].receiverAddress,
            senderAddress:
              walletTransactionLists[walletTransactionIndex].senderAddress,
            rate: walletTransactionLists[walletTransactionIndex].rate
              ? walletTransactionLists[walletTransactionIndex].rate
              : "-",
            fees: walletTransactionLists[walletTransactionIndex].fees
              ? walletTransactionLists[walletTransactionIndex].fees
              : "-",
            side: "-",
            state: walletTransactionLists[walletTransactionIndex].state,
          });
        }
      }
      walletTransactions.docs = walletTransactionData;
    }
    return res.json(walletTransactions);
  } catch (error) {
    return res.json([]);
  }
});

/**
 * @route GET /api/wallet/get_withdrawal_requests/:userId
 * @description Get user withdrawal requests.
 * @access Public
 */
router.get("/get-withdrawal-requests", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let sort = { createdAt: -1 };
  // let queryOptions = { };
  // status: {$ne: 'Pending'}
  if (req.query.sortColumn) {
    sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
  }
  if (!isEmpty(req.query.search)) {
    try {
      const search = JSON.parse(req.query.search);
      if (!isEmpty(search.search)) {
        let searchText = search.search.trim();
        let regex = new RegExp(searchText, "i");
        queryOptions = {
          $or: [
            {
              fees: regex,
            },
            {
              coin: regex,
            },
            {
              txid: regex,
            },
            {
              value: regex,
            },
            {
              rate: regex,
            },
            {
              state: regex,
            },
            {
              senderAddress: regex,
            },
            {
              receiverAddress: regex,
            },
          ],
        };
      }
      if (!isEmpty(search.name)) {
        let searchText = search.name.trim();
        let regex = new RegExp(searchText, "i");
        let userQueryOptions = {
          $or: [
            {
              firstname: regex,
            },
            {
              email: regex,
            },
            {
              lastname: regex,
            },
          ],
        };
        let users = await User.find(userQueryOptions, "_id").lean();
        let usersIdList = [];
        let i = users.length;
        while (i--) {
          usersIdList.push(users[i]._id);
        }
        queryOptions["userId"] = { $in: usersIdList };
      }
    } catch (error) {
      console.log("search error", error);
    }
  }

  if (!isEmpty(req.query.filters)) {
    const filters = JSON.parse(req.query.filters);
    filters.map((fil) => {
      if (fil.name === "createdAt") {
        if (fil.value[0] && fil.value[1])
          queryOptions["createdAt"] = {
            $gte: new Date(fil.value[0]),
            $lte: new Date(fil.value[1]),
          };
      } else {
        queryOptions[fil.name] =
          fil.value.length === 1 ? fil.value[0] : { $all: fil.value };
      }
    });
  }

  try {
    const userWithdrawalRequests = await UserWithdrawRequest.paginate(
      queryOptions,
      {
        select:
          "_id userId createdAt coin amount noteNumber referenceNumber status",
        lean: true,
        page: parseInt(page),
        limit: parseInt(perPage),
        sort: sort,
      }
    );

    let userWithdrawalRequestData = [];
    if (!isEmpty(userWithdrawalRequests.docs)) {
      let userWithdrawalRequestIndex = userWithdrawalRequests.docs.length;
      let userWithdrawalRequestLists = userWithdrawalRequests.docs;
      const userIds = userWithdrawalRequestLists.reduce(
        (uniqueUserId, userWithdrawalRequest) => {
          return uniqueUserId.includes(userWithdrawalRequest.userId)
            ? uniqueUserId
            : [...uniqueUserId, userWithdrawalRequest.userId];
        },
        []
      );
      const users = await User.find(
        { _id: { $in: userIds } },
        "_id firstname lastname email"
      ).lean();
      while (userWithdrawalRequestIndex--) {
        if (!isEmpty(userWithdrawalRequestLists[userWithdrawalRequestIndex])) {
          let user = users.find(
            (userItem) =>
              userItem._id.toString() ===
              userWithdrawalRequestLists[userWithdrawalRequestIndex].userId
          );
          userWithdrawalRequestData.unshift({
            ...userWithdrawalRequestLists[userWithdrawalRequestIndex],
            user: user,
          });
        }
      }
      userWithdrawalRequests.docs = userWithdrawalRequestData;
    }

    return res.json(userWithdrawalRequests);
  } catch (error) {
    return res.json([]);
  }
});

/**
 * @route GET /api/admin/users/get-crypto-withdrawals
 * @description Get all get-crypto-withdrawals
 * @access Public
 */
router.get("/get-crypto-deposite", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let sort = { date: -1 };
  let queryOptions = { type: "Deposit" };
  if (req.query.sortColumn) {
    sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
  }
  if (!isEmpty(req.query.search)) {
    try {
      const search = JSON.parse(req.query.search);
      if (!isEmpty(search.search)) {
        let searchText = search.search.trim();
        let regex = new RegExp(searchText, "i");
        queryOptions = {
          $or: [
            {
              fees: regex,
            },
            {
              coin: regex,
            },
            {
              txid: regex,
            },
            {
              value: regex,
            },
            {
              rate: regex,
            },
            {
              state: regex,
            },
            {
              senderAddress: regex,
            },
            {
              receiverAddress: regex,
            },
          ],
        };
      }
      if (!isEmpty(search.name)) {
        let searchText = search.name.trim();
        let regex = new RegExp(searchText, "i");
        let userQueryOptions = {
          $or: [
            {
              firstname: regex,
            },
            {
              email: regex,
            },
            {
              lastname: regex,
            },
          ],
        };
        let users = await User.find(userQueryOptions, "_id").lean();
        let usersIdList = [];
        let i = users.length;
        while (i--) {
          usersIdList.push(users[i]._id);
        }
        queryOptions["userId"] = { $in: usersIdList };
      }
    } catch (error) {
      console.log("search error", error);
    }
  }

  if (!isEmpty(req.query.filters)) {
    const filters = JSON.parse(req.query.filters);
    filters.map((fil) => {
      if (fil.name === "date") {
        if (fil.value[0] && fil.value[1])
          queryOptions["date"] = {
            $gte: new Date(fil.value[0]),
            $lte: new Date(fil.value[1]),
          };
      } else {
        queryOptions[fil.name] =
          fil.value.length === 1 ? fil.value[0] : { $all: fil.value };
      }
    });
  }

  try {
    let walletTransactions = await WalletTransactions.paginate(queryOptions, {
      select:
        "_id coin userId date value senderAddress receiverAddress txid fees rate state destinationTag confirmations receiver sender",
      lean: true,
      page: parseInt(page),
      limit: parseInt(perPage),
      sort: sort,
    });
    let walletTransactionData = [];
    if (!isEmpty(walletTransactions.docs)) {
      let walletTransactionIndex = walletTransactions.docs.length;
      let walletTransactionLists = walletTransactions.docs;
      const userIds = walletTransactionLists.reduce(
        (uniqueUserId, walletTransaction) => {
          return uniqueUserId.includes(walletTransaction.userId)
            ? uniqueUserId
            : [...uniqueUserId, walletTransaction.userId];
        },
        []
      );
      const users = await User.find(
        { _id: { $in: userIds } },
        "_id firstname lastname email"
      ).lean();
      while (walletTransactionIndex--) {
        if (!isEmpty(walletTransactionLists[walletTransactionIndex])) {
          let user = users.find(
            (userItem) =>
              userItem._id.toString() ===
              walletTransactionLists[walletTransactionIndex].userId
          );
          // console.log("user:", user, users);
          walletTransactionData.unshift({
            _id: walletTransactionLists[walletTransactionIndex]._id,
            user: user,
            date: walletTransactionLists[walletTransactionIndex].date,
            txid: walletTransactionLists[walletTransactionIndex].txid
              ? walletTransactionLists[walletTransactionIndex].txid
              : "",
            destinationTag: walletTransactionLists[walletTransactionIndex]
              .destinationTag
              ? walletTransactionLists[walletTransactionIndex].destinationTag
              : null,
            // txid_short: walletTransactionLists[walletTransactionIndex].txid ? walletTransactionLists[walletTransactionIndex].txid.substr(1, 8) : '',
            confirmations:
              walletTransactionLists[walletTransactionIndex].confirmations,
            coin: walletTransactionLists[walletTransactionIndex].coin,
            value: walletTransactionLists[walletTransactionIndex].value,
            sender: walletTransactionLists[walletTransactionIndex].sender,
            receiver: walletTransactionLists[walletTransactionIndex].receiver,
            receiverAddress:
              walletTransactionLists[walletTransactionIndex].receiverAddress,
            senderAddress:
              walletTransactionLists[walletTransactionIndex].senderAddress,
            rate: walletTransactionLists[walletTransactionIndex].rate
              ? walletTransactionLists[walletTransactionIndex].rate
              : "-",
            fees: walletTransactionLists[walletTransactionIndex].fees
              ? walletTransactionLists[walletTransactionIndex].fees
              : "-",
            side: "-",
            state: walletTransactionLists[walletTransactionIndex].state,
          });
        }
      }
      walletTransactions.docs = walletTransactionData;
    }
    return res.json(walletTransactions);
  } catch (error) {
    return res.json([]);
  }
});

/**
 * @route GET /api/wallet/get-deposit-requests
 * @description Get user deposit requests.
 * @access Public
 */
router.get("/get-deposit-requests", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let sort = { createdAt: -1 };
  let queryOptions = {};
  if (req.query.sortColumn) {
    sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
  }
  if (!isEmpty(req.query.search)) {
    try {
      const search = JSON.parse(req.query.search);
      if (!isEmpty(search.search)) {
        let searchText = search.search.trim();
        let regex = new RegExp(searchText, "i");
        queryOptions = {
          $or: [
            {
              noteNumber: regex,
            },
            {
              referenceNumber: regex,
            },
            {
              transactionId: regex,
            },
            {
              type: regex,
            },
            {
              coin: regex,
            },
            {
              fees: regex,
            },
            {
              amount: regex,
            },
            {
              paymentType: regex,
            },
            {
              status: regex,
            },
          ],
        };
      }
      if (!isEmpty(search.name)) {
        let searchText = search.name.trim();
        let regex = new RegExp(searchText, "i");
        let userQueryOptions = {
          $or: [
            {
              firstname: regex,
            },
            {
              email: regex,
            },
            {
              lastname: regex,
            },
          ],
        };
        let users = await User.find(userQueryOptions, "_id").lean();
        let usersIdList = [];
        let i = users.length;
        while (i--) {
          usersIdList.push(users[i]._id);
        }
        queryOptions["userId"] = { $in: usersIdList };
      }
    } catch (error) {
      console.log("search error", error);
    }
  }

  if (!isEmpty(req.query.filters)) {
    const filters = JSON.parse(req.query.filters);
    filters.map((fil) => {
      if (fil.name === "paymentType" && fil.value[0] === "Bank Transfer")
        queryOptions["paymentType"] = { $eq: null };
      else if (fil.name === "paymentType")
        queryOptions["paymentType"] = { $regex: fil.value[0] };
      else if (fil.name === "createdAt") {
        if (fil.value[0] && fil.value[1])
          queryOptions["createdAt"] = {
            $gte: new Date(fil.value[0]),
            $lte: new Date(fil.value[1]),
          };
      } else
        queryOptions[fil.name] =
          fil.value.length === 1 ? fil.value[0] : { $in: fil.value };
    });
  }
  try {
    const userDepositRequests = await UserDepositRequest.paginate(
      queryOptions,
      {
        select:
          "_id userId createdAt type transactionId paymentType  coin amount noteNumber responseMsg referenceNumber status",
        lean: true,
        page: parseInt(page),
        limit: parseInt(perPage),
        sort: sort,
      }
    );

    let userDepositRequestRequestData = [];
    if (!isEmpty(userDepositRequests.docs)) {
      let userDepositRequestIndex = userDepositRequests.docs.length;
      let userDepositRequestLists = userDepositRequests.docs;
      const userIds = userDepositRequestLists.reduce(
        (uniqueUserId, userDepositRequest) => {
          return uniqueUserId.includes(userDepositRequest.userId)
            ? uniqueUserId
            : [...uniqueUserId, userDepositRequest.userId];
        },
        []
      );
      const users = await User.find(
        { _id: { $in: userIds } },
        "_id firstname lastname email"
      ).lean();
      while (userDepositRequestIndex--) {
        if (!isEmpty(userDepositRequestLists[userDepositRequestIndex])) {
          let user = users.find(
            (userItem) =>
              userItem._id.toString() ===
              userDepositRequestLists[userDepositRequestIndex].userId
          );
          userDepositRequestRequestData.unshift({
            ...userDepositRequestLists[userDepositRequestIndex],
            user: user,
          });
        }
      }
      userDepositRequests.docs = userDepositRequestRequestData;
    }
    return res.json(userDepositRequests);
  } catch (error) {
    return res.json([]);
  }
});

/**
 * @route PUT /api/admin/users/update-user/:id
 * @description Update user details
 * @access Public
 */

router.put("/update-user/:id", async (req, res) => {
  let existUser = {};
  if (!isEmpty(req.body.email)) {
    existUser = await User.findOne({
      email: req.body.email,
      _id: { $ne: req.params.id },
    });
  }
  if (!isEmpty(existUser))
    return res.status(400).json({ name: "User already exists." });
  try {
    const userData = {};
    const userPersonalData = {};
    if (!isEmpty(req.body.email)) {
      userData["email"] = req.body.email;
    }
    if (!isEmpty(req.body.firstname)) {
      userData["firstname"] = req.body.firstname;
    }

    if (!isEmpty(req.body.lastname)) {
      userData["lastname"] = req.body.lastname;
    }

    if (!isEmpty(req.body.phone)) {
      userData["phone"] = req.body.phone;
    }

    if (!isEmpty(req.body.dateOfBirth)) {
      userData["dateOfBirth"] = req.body.dateOfBirth;
    }

    if (!isEmpty(req.body.country)) {
      userData["country"] = req.body.country;
    }

    if (!isEmpty(req.body.suspended)) {
      userData["suspended"] = req.body.suspended;
    }

    if (!isEmpty(req.body.streetAddress)) {
      userPersonalData["streetAddress"] = req.body.streetAddress;
    }
    if (!isEmpty(req.body.city)) {
      userPersonalData["city"] = req.body.city;
    }
    if (!isEmpty(req.body.postalCode)) {
      userPersonalData["postalCode"] = req.body.postalCode;
    }

    const updatedUserPersonal = await UserPersonalInfo.findOneAndUpdate(
      { userId: req.params.id },
      userPersonalData,
      {
        upsert: true,
        new: true,
      }
    );

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.params.id },
      userData,
      {
        upsert: true,
        new: true,
      }
    );
    if (!isEmpty(updatedUser) || !isEmpty(updatedUserPersonal))
      res.json({
        variant: "success",
        message: "User updated successfully.",
      });
    else res.json({ variant: "error", message: "Falied to update User." });
  } catch (error) {
    res.json({ variant: "error", message: "Falied to update User." });
  }
});

/**
 * @route GET /api/admin/users/toggle-verification-user/:id
 * @description Update ttoggle-verification-user
 * @access Public
 */
router.get("/toggle-verification-user/:id", async (req, res) => {
  try {
    const userIdentity = await UserIdentity.findOne({
      userId: req.params.id,
    });
    if (userIdentity) {
      userIdentity.approve = userIdentity.approve ? false : true;
      userIdentity.submitted = userIdentity.approve;
      await userIdentity.save();
    }
    res.json({
      variant: "success",
      message: "user updated successfully.",
    });
  } catch (error) {
    res.json({ variant: "error", message: "Falied to update user." });
  }
});

/**
 * @route GET /api/admin/users/toggle-block-user/:id
 * @description Update toggle-block-user
 * @access Public
 */
router.get("/toggle-block-user/:id", async (req, res) => {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (user) {
      user.suspended = user.suspended ? false : true;
      await user.save();
    }
    res.json({
      variant: "success",
      message: "user updated successfully.",
    });
  } catch (error) {
    res.json({ variant: "error", message: "Falied to update user." });
  }
});

/**
 * @route get /api/admin/user/all_verified
 * @description GET all verified users
 * @access Private
 */
router.get("/get-user-login-histories/:userId", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let queryOptions = { userId: req.params.userId };
  let sort = { logTime: -1 };
  if (req.query.sortColumn) {
    sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
  }
  if (req.query.search) {
    const searchText = req.query.search.trim();
    let regex = new RegExp(searchText, "i");
    queryOptions = {
      $or: [
        {
          deviceType: regex,
        },
        {
          browserName: regex,
        },
        {
          mobileModel: regex,
        },
        {
          osName: regex,
        },
        {
          fullBrowserVersion: regex,
        },
      ],
    };
  }
  if (req.query.filters) {
    const filters = JSON.parse(req.query.filters);
    filters.map((fil) => {
      if (fil.name === "logTime") {
        if (fil.value[0] && fil.value[1])
          queryOptions["logTime"] = {
            $gte: new Date(fil.value[0]),
            $lte: new Date(fil.value[1]),
          };
      } else {
        queryOptions[fil.name] =
          fil.value.length === 1 ? fil.value[0] : { $all: fil.value };
      }
    });
  }
  let userActivity = await UserActivity.paginate(queryOptions, {
    lean: true,
    page: parseInt(page),
    limit: parseInt(perPage),
    sort: sort,
  });
  return res.json(userActivity);
});

/**
 * @route get /api/admin/user/all_verified
 * @description GET all verified users
 * @access Private
 */
router.get("/insert-permissions", async (req, res) => {
  try {
    await permissionSeeder.insert();
    return res.json(error);
  } catch (error) {
    return res.json(error);
  }
});

/**
 * @route POST /api/admin/users/update-user-profile/:id
 * @description update-user-profile
 * @access Public
 */
router.post("/update-user-profile/:id", async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({
      userId: req.params.id,
    });
    if (userProfile) {
      userProfile.emailVerified = !userProfile.emailVerified;
      await userProfile.save();
    }
    res.json({
      variant: "success",
      message: "user profile updated successfully.",
    });
  } catch (error) {
    res.json({ variant: "error", message: "Falied to update user." });
  }
});

/**
 * @route GET /api/admin/users/get-user-profile/:id
 * @description Update get-user-profile
 * @access Public
 */
router.get("/get-user-profile/:id", async (req, res) => {
  try {
    const userProfile = await UserProfile.findOne({
      userId: req.params.id,
    });
    res.json(userProfile);
  } catch (error) {
    res.json({ variant: "error", message: "Falied to get user profile." });
  }
});

/**
 * @route GET /api/admin/user/get-all-user-orders
 * @description GET all get-all-user-orders
 * @access Public
 */
router.get("/get-all-user-wallet-balance", async (req, res) => {
  let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
  let page = req.query.page ? req.query.page : 1;
  let queryOptions = { coin: "BTC" };
  if (req.query.sortColumn) {
    if (req.query.sortColumn === "createdAt" || req.query.sortColumn === "date")
      sort = {
        createdAt: req.query.sort === "asc" ? 1 : -1,
      };
    else
      sort = {
        [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1,
      };
  }
  if (!isEmpty(req.query.search)) {
    try {
      const search = JSON.parse(req.query.search);
      if (!isEmpty(search.search)) {
        let searchText = search.search.trim();
        let regex = new RegExp(searchText, "i");
        queryOptions = {
          $or: [
            {
              walletAmount: regex,
            },
            {
              walletAddress: regex,
            },
          ],
        };
      }
      if (!isEmpty(search.name)) {
        let searchText = search.name.trim();
        let regex = new RegExp(searchText, "i");
        let userQueryOptions = {
          $or: [
            {
              firstname: regex,
            },
            {
              email: regex,
            },
            {
              lastname: regex,
            },
          ],
        };
        let users = await User.find(userQueryOptions, "_id").lean();
        let usersIdList = [];
        let i = users.length;
        while (i--) {
          usersIdList.push(users[i]._id.toString());
        }
        queryOptions["userId"] = { $in: usersIdList };
      }
    } catch (error) {
      console.log("search error", error);
    }
  }

  if (req.query.filters) {
    const filters = JSON.parse(req.query.filters);
    filters.map((fil) => {
      if (fil.name === "date" || fil.name === "createdAt") {
        if (fil.value[0] && fil.value[1])
          queryOptions["createdAt"] = {
            $gte: new Date(fil.value[0]),
            $lte: new Date(fil.value[1]),
          };
      } else {
        queryOptions[fil.name] =
          fil.value.length === 1 ? fil.value[0] : { $in: fil.value };
      }
    });
  }
  queryOptions["$expr"] = {
    $gt: [{ $toDouble: "$walletAmount" }, 0.0],
  };
  try {
    console.log("queryOptions", queryOptions);
    const userWalletAggregate = UserWallet.aggregate([
      { $match: queryOptions },
      {
        $addFields: {
          walletAmountDouble: {
            $toDouble: "$walletAmount",
          },
        },
      },
      { $sort: { walletAmountDouble: -1 } },
    ]);
    let userWallets = await UserWallet.aggregatePaginate(userWalletAggregate, {
      page: parseInt(page),
      limit: parseInt(perPage),
    });
    let allUserWallets = [];
    if (!isEmpty(userWallets.docs)) {
      let userWalletIndex = userWallets.docs.length;
      let userWalletLists = userWallets.docs;
      const userIds = userWalletLists.reduce((uniqueUserId, userWallet) => {
        return uniqueUserId.includes(userWallet.userId)
          ? uniqueUserId
          : [...uniqueUserId, userWallet.userId];
      }, []);
      const users = await User.find(
        { _id: { $in: userIds } },
        "_id firstname lastname email"
      ).lean();

      while (userWalletIndex--) {
        if (!isEmpty(userWalletLists[userWalletIndex])) {
          let user = users.find(
            (userItem) =>
              userItem._id.toString() ===
              userWalletLists[userWalletIndex].userId
          );
          // console.log("user:", user, users);
          allUserWallets.unshift({
            user: user,
            ...userWalletLists[userWalletIndex],
          });
        }
      }
      userWallets.docs = allUserWallets;
    }
    return res.json(userWallets);
  } catch (error) {
    console.log("error", error);
    return res.json([]);
  }
});

module.exports = router;
