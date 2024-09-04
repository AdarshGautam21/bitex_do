const express = require("express");
const fs = require("fs");
const axios = require("axios");
const router = express.Router();
// const saveBuffer = require('save-buffer');
const { v4: uuidv4 } = require("uuid");
const path = require("path");
const uuidAPIKey = require("uuid-apikey");
const { Encode } = require("xrpl-tagged-address-codec");
var base64 = require("base-64");
// const SMSGlobal = require('sms-global-js');
const schedule = require("node-schedule");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const keys = require("../../config/key");

const User = require("../../models/User");
const SumsubUser = require("../../models/sumsub/SumsubUser");
const FcmToken = require("../../models/FcmTokens");
const UserApi = require("../../models/UserApi");
const Referral = require("../../models/referral/Referral");
const ReferralTree = require("../../models/referral/ReferralTree");
const Assets = require("../../models/trading/Assets");
const UserIdentity = require("../../models/UserIdentity");
const UserDocument = require("../../models/UserDocument");
const UserResidenseInfo = require("../../models/UserResidenseInfo");
const UserPersonalInfo = require("../../models/UserPersonalInfo");
const UserBankInfo = require("../../models/UserBankInfo");
const UserWallet = require("../../models/UserWallet");
const UserMarginWallet = require("../../models/margin/UserMarginWallet");
const UserBorrowHolding = require("../../models/margin/UserBorrowHolding");
const UserActivity = require("../../models/UserActivity");
const UserCorporateOne = require("../../models/UserCorporateOne");
const UserCorporateTwo = require("../../models/UserCorporateTwo");
const WalletTransactions = require("../../models/wallet/WalletTransactions");
const AgentUsers = require("../../models/agent/AgentUsers");
const AgentCode = require("../../models/agent/AgentCode");
const AgentCommission = require("../../models/agent/AgentCommission");
const UserDepositRequest = require("../../models/UserDepositRequest");
const OnfidoUser = require("../../models/onfido/OnfidoUser");
const AgentClientTraderLevel = require("../../models/agent/AgentClientTraderLevel");
const UserBonusWalletHistory = require("../../models/UserBonusWalletHistory");
const BitexSavingUserWallet = require("../../models/bitexSaving/BitexSavingUserWallet");
const ClientFcmToken = require("../../models/ClientFcmTokens");

const TwinBcrypt = require("twin-bcrypt");
const crypto = require("crypto");
const clientInvitationEmail = require("../../emails/ClientInvitationEmail");
const verifiedUndepositEmail = require("../../emails/VerifiedUndepositEmail");
const unVerifyUsersEmail = require("../../emails/UnVerifyUsersEmail");

const validateRegisterInput = require("../../validation/register");
const validateUserPersonalInfo = require("../../validation/user/userPersonalInfo");
const validateUserBankInfo = require("../../validation/user/userBankInfo");
const validateUserFaceIdPass = require("../../validation/user/userFaceId");
const validateUserChangePass = require("../../validation/user/userChangePass");
const validateCorporateInfoFirst = require("../../validation/user/userCorporateInfoFirst");
const validateUserCorporateInfoSecond = require("../../validation/user/userCorporateInfoSecond");
const validateTransferClientBalance = require("../../validation/user/transferClientBalance");
const validateTransferMarginBalance = require("../../validation/user/transferMarginBalance");
const validateTransferFromMarginBalance = require("../../validation/user/retransferMarginBalance");
const validateBorrowMarginBalance = require("../../validation/user/borrowMarginBalance");
const validateRepayMarginBalance = require("../../validation/user/replayMarginBalance");
const validateTraderLevelInput = require("../../validation/admin/traderLevel");
const validatePhoneVerificationInput = require("../../validation/phoneVerification");
const validatePhoneEditInput = require("../../validation/phoneEdit");

const WalletController = require("../../controller/WalletController");
const TronController = require("../../controller/TronController");
const UserProfile = require("../../models/UserProfile");
// const SMSGLOBAL = require('smsglobal')('88dfbf258ca45ded5acd1113748cea6d', 'dbea4c0458f4a42a36f1dfc27756178b');
const ReferralEarnedDetail = require("../../models/referral/ReferralEarnedDetail");
const Notification = require("../../models/Notifications");
const randomstring = require("randomstring");
const isEmpty = require("../../validation/isEmpty");

// const sms = new SMSGlobal();
// var client = new Client(new Credentials("88dfbf258ca45ded5acd1113748cea6d", "dbea4c0458f4a42a36f1dfc27756178b"));

var twilio = require("twilio");
var accountSid = process.env.TWILIO_ACCOUNT_SID; // Your Account SID from www.twilio.com/console
var authToken = process.env.TWILIO_AUTH_TOKEN;

let apiUrl = process.env.URL;

const SUMSUB_APP_TOKEN = process.env.SUMSUB_APP_TOKEN;
const SUMSUB_SECRET_KEY = process.env.SUMSUB_SECRET_KEY;

/**
 * @route GET /api/user/all
 * @description GET all users
 * @access Public
 */
router.post("/all/:total_users", (req, res) => {
  const errors = {};
  let total_users = parseInt(req.params.total_users);

  // Query Params
  let queryParams = {};

  let ids = [];
  if (req.body.userIds && req.body.userIds != "") {
    ids = req.body.userIds.split(",");
    queryParams._id = { $in: ids };
  }
  if (req.body.startDate && req.body.endDate) {
    queryParams.date = { $gt: req.body.startDate, $lt: req.body.endDate };
  }

  // User query
  let userQuery = User.find(queryParams);

  userQuery
    .skip(0)
    .limit(total_users)
    .select(["name", "email", "avatar", "date"])
    .then((users) => {
      if (!users || users.length === 0) {
        errors.noprofile = "There are no users.";
        return res.status(404).json(errors);
      }
      res.json(users);
    })
    .catch((err) => res.status(400).json({ users: "There are no users." }));
});

/**
 * @route GET /api/user/get/:userId
 * @description GET all users
 * @access Public
 */
router.get("/get/:userId", async (req, res) => {
  // User query
  let user = await User.findOne({ _id: req.params.userId });

  if (user) {
    let walletSettings = await WalletSettings.find({});
    let walletId = 0;

    if (walletSettings.length > 0) {
      walletId = walletSettings[0].walletLastId;
    }

    // Update last wallet id to user
    if (user.viabtcUserId) {
      //
    } else {
      walletId = walletId + 1;
      walletSettings[0].walletLastId = walletId;
      await walletSettings[0].save();

      user.viabtcUserId = walletId;
      await user.save();
    }
    console.log(user);
    res.json(user);
  } else {
    res.status(400).json({ users: "There are no users." });
  }
});

/**
 * @route POST /api/user/store_fmc_token/:userId
 * @description Store fmc token of user
 * @access Public
 */
router.post("/store_fmc_token/:userId", async (req, res) => {
  // User query
  const user = await User.findOne({ userId: req.params.userId });

  if (user) {
    user.firebaseToken = req.body.fmcToken;
    await user.save();
    return res.json({ message: "Token saved." });
  } else {
    return res.status(400).json({ message: "Failed to save token." });
  }
});

/**
 * @route GET /api/user/get_orders/:userId
 * @description GET all user orders
 * @access Public
 */
router.get("/get_orders/:userId", async (req, res) => {
  // User query
  const orders = await Order.find({ userId: req.params.userId }).sort(
    "-createTime"
  );

  let allOrders = [];

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
      value:
        orders[okey].market === "BTXINR"
          ? orders[okey].side === 2
            ? parseFloat(orders[okey].dealMoney) /
              (parseFloat(orders[okey].dealMoney) /
                parseFloat(orders[okey].dealStock))
            : orders[okey].amount
          : orders[okey].type === 2
            ? orders[okey].side === 2
              ? (
                  parseFloat(orders[okey].dealStock) /
                  parseFloat(orders[okey].dealMoney)
                ).toFixed(8)
              : orders[okey].amount
            : orders[okey].amount,
      // value: (orders[okey].type === 2 ? (orders[okey].side === 2 ? (parseFloat(orders[okey].dealStock)/parseFloat(orders[okey].dealMoney)).toFixed(8) : orders[okey].amount) : orders[okey].amount),
      rate:
        orders[okey].type === 1
          ? parseFloat(orders[okey].price)
          : parseFloat(orders[okey].dealMoney) /
            parseFloat(orders[okey].dealStock),
      executed: orders[okey].dealMoney,
      fee: orders[okey].dealFee,
      status: orders[okey].status,
    };
    if (orderTransac) {
      allOrders.push(orderTransac);
    }
  }

  res.json(allOrders);
});

/**
 * @route GET /api/user/logs/:total_logs
 * @description GET all user logs
 * @access Public
 */
router.post("/logs/:total_logs", (req, res) => {
  const errors = {};
  let total_logs = parseInt(req.params.total_logs);

  // Query Params
  let queryParams = {};

  let ids = [];
  if (req.body.userIds && req.body.userIds != "") {
    ids = req.body.userIds.split(",");
    queryParams._id = { $in: ids };
  }
  if (req.body.startDate && req.body.endDate) {
    queryParams.date = { $gt: req.body.startDate, $lt: req.body.endDate };
  }

  // UserActivity query
  let userActivity = UserActivity.find({ userId: req.body.userId });

  userActivity
    .sort("-logTime")
    .skip(0)
    .limit(total_logs)
    .then((userActivity) => {
      if (!userActivity || userActivity.length === 0) {
        errors.noprofile = "There are no user activities.";
        return res.status(404).json(errors);
      }
      res.json(userActivity);
    })
    .catch((err) =>
      res.status(400).json({ userActivity: "There are no user activities." })
    );
});

/**
 * @route GET /api/user/search_by_name
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
        errors.noprofile = "There are no users.";
        return res.status(404).json(errors);
      }
      res.json(users);
    })
    .catch((err) => res.status(400).json({ users: "There are no users." }));
});

const checkAndRemoveUserPreviousDocs = (docType, userIdentityId) => {
  return UserDocument.find(
    { userIdentityId: userIdentityId },
    function (err, docs) {
      if (err) {
        return true;
      }
      if (docs.length === 0) {
        return true;
      } else {
        docs.forEach(function (userDocument, index) {
          let docFalseMatch = false;
          if (userDocument.documentType === docType) {
            docFalseMatch = true;
          }
          if (docFalseMatch) {
            let currentPath = "./storage/images/" + userDocument.documentFile;
            try {
              fs.unlinkSync(currentPath);
              userDocument.remove();
              return true;
            } catch (err) {
              userDocument.remove();
              return true;
            }
          }
        });
        return true;
      }
    }
  );
};

/**
 * @route POST /api/user/store_user_corporate_documents
 * @description Store Corporate UserDocument
 * @access Public
 */
router.post("/store_user_corporate_documents", (req, res) => {
  UserIdentity.findOne({ _id: req.body.userIdentityId })
    .then((userIdentity) => {
      if (userIdentity) {
        UserDocument.find(
          { documentType: req.body.docType, userIdentityId: userIdentity._id },
          async function (err, docs) {
            if (err) {
              return res.status(400).json(err);
            }

            const checkDocStatus = await checkAndRemoveUserPreviousDocs(
              req.body.docType,
              userIdentity._id
            );
            if (checkDocStatus) {
              for (let key in req.files) {
                let uniqueImageId = uuidv4();
                let currentFile = req.files[key];
                let currentPath =
                  "./storage/images/" +
                  uniqueImageId +
                  "." +
                  /[^.]+$/.exec(currentFile.originalname)[0];
                // await saveBuffer(currentFile.buffer, currentPath);
                await fs.open(currentPath, "w", function (err, fd) {
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

                const newUserDocument = new UserDocument({
                  userIdentityId: userIdentity._id,
                  documentType: req.body.docType,
                  documentFile:
                    uniqueImageId +
                    "." +
                    /[^.]+$/.exec(currentFile.originalname)[0],
                  documentName: req.body.docName,
                });

                newUserDocument
                  .save()
                  .then((userDocument) => {
                    res.json(userDocument);
                  })
                  .catch((err) => {
                    return res
                      .status(400)
                      .json({ message: "Error uploading document." });
                  });
              }
            } else {
              return res
                .status(400)
                .json({ message: "File not found on location" });
            }
          }
        );
      } else {
        res.status(400).json({ message: "User profile not found" });
      }
    })
    .catch((err) => {
      res.status(400).json({ message: "Error on file upload" });
    });
});

/**
 * @route POST /api/user/store_user_document
 * @description Store UserDocument
 * @access Public
 */
router.post("/store_user_document", (req, res) => {
  UserIdentity.findOne({ _id: req.body.userIdentityId }).then(
    (userIdentity) => {
      if (userIdentity) {
        UserDocument.find(
          { documentType: req.body.docType, userIdentityId: userIdentity._id },
          async function (err, docs) {
            if (err) {
              return res.status(400).json(err);
            }

            const checkDocStatus = await checkAndRemoveUserPreviousDocs(
              req.body.docType,
              userIdentity._id
            );
            if (checkDocStatus) {
              for (let key in req.files) {
                let uniqueImageId = uuidv4();
                let currentFile = req.files[key];
                let currentPath =
                  "./storage/images/" +
                  uniqueImageId +
                  "." +
                  /[^.]+$/.exec(currentFile.originalname)[0];
                // await saveBuffer(currentFile.buffer, currentPath);
                await fs.open(currentPath, "w", function (err, fd) {
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

                const newUserDocument = new UserDocument({
                  userIdentityId: userIdentity._id,
                  documentType: req.body.docType,
                  documentFile:
                    uniqueImageId +
                    "." +
                    /[^.]+$/.exec(currentFile.originalname)[0],
                  documentName: req.body.docName,
                });

                newUserDocument
                  .save()
                  .then((userDocument) => {
                    res.json(userDocument);
                  })
                  .catch((err) => {
                    return res
                      .status(400)
                      .json({ message: "Error uploading document." });
                  });
              }
            }
          }
        );
      } else {
        res.status(400).json({ message: "Error on file upload" });
      }
    }
  );
});

/**
 * @route POST /api/user/store_user_residense_info
 * @description Store UserResidenseInfo
 * @access Public
 */
router.post("/store_user_residense_info", (req, res) => {
  const errors = {};

  UserIdentity.findOne({ _id: req.body.userIdentityId }).then(
    (userIdentity) => {
      if (userIdentity) {
        UserResidenseInfo.findOne({ userIdentityId: userIdentity._id })
          .then(async (userResidenseInfo) => {
            if (userResidenseInfo) {
              if (userResidenseInfo.documentType === req.body.docType) {
                let currentPath =
                  "./storage/images/" + userResidenseInfo.documentFile;
                try {
                  fs.unlinkSync(currentPath);
                } catch (err) {
                  //
                }
                let uniqueImageId = uuidv4();
                let currentFile = req.files[0];
                let currentNewPath =
                  "./storage/images/" +
                  uniqueImageId +
                  "." +
                  /[^.]+$/.exec(currentFile.originalname)[0];
                // await saveBuffer(currentFile.buffer, currentNewPath);
                await fs.open(currentNewPath, "w", function (err, fd) {
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

                userResidenseInfo.documentFile =
                  uniqueImageId +
                  "." +
                  /[^.]+$/.exec(currentFile.originalname)[0];
                userResidenseInfo.save();
                res.json({ message: "Doc saved successfully." });
              } else {
                res.status(400).json({
                  message: "Document type is not matching with database.",
                });
              }
            } else {
              let uniqueImageId = uuidv4();
              let currentFile = req.files[0];
              let currentPath =
                "./storage/images/" +
                uniqueImageId +
                "." +
                /[^.]+$/.exec(currentFile.originalname)[0];
              // await saveBuffer(currentFile.buffer, currentPath);
              await fs.open(currentPath, "w", function (err, fd) {
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

              const newUserResidenseInfo = new UserResidenseInfo({
                userIdentityId: userIdentity._id,
                address: req.body.address,
                city: req.body.city,
                zipcode: req.body.zipcode,
                country: req.body.country,
                documentFile:
                  uniqueImageId +
                  "." +
                  /[^.]+$/.exec(currentFile.originalname)[0],
              });

              newUserResidenseInfo
                .save()
                .then((userResidenseInfo) => {
                  res.json(userResidenseInfo);
                })
                .catch((err) => console.log(err));
            }
          })
          .catch((err) => {
            return res
              .status(400)
              .json({ variant: "error", message: "Error save data" });
          });
      } else {
        res
          .status(400)
          .json({ variant: "error", message: "User profile not found" });
      }
    }
  );
});

/**
 * @route GET /api/user/user_residense/:userIdentityId
 * @description Get user residence info object.
 * @access Public
 */
router.get("/user_residense/:userIdentityId", (req, res) => {
  UserResidenseInfo.findOne({ userIdentityId: req.params.userIdentityId }).then(
    (userResidenseInfo) => {
      if (userResidenseInfo) {
        res.json(userResidenseInfo);
      } else {
        return res
          .status(400)
          .json({ email: "User residence documents not found." });
      }
    }
  );
});

/**
 * @route GET /api/auth/user_personal_info
 * @description Get user personal info object.
 * @access Public
 */
router.get("/user_personal_info/:userId", (req, res) => {
  UserPersonalInfo.findOne({ userId: req.params.userId }).then(
    (userPersonalInfo) => {
      if (userPersonalInfo) {
        res.json(userPersonalInfo);
      } else {
        return res.status(400).json({ email: "User personal info not found." });
      }
    }
  );
});

/**
 * @route GET /api/auth/finish-identity-verification/:userId
 * @description Get user identity info object.
 * @access Public
 */
router.get("/finish-identity-verification/:userId", (req, res) => {
  UserIdentity.findOne({ userId: req.params.userId }).then((userIdentity) => {
    if (userIdentity) {
      userIdentity.submitted = true;
      userIdentity.save();

      res.json(userIdentity);
    } else {
      return res.status(400).json({ email: "User identity not found." });
    }
  });
});

/**
 * @route POST /api/user/store_user_personal_info
 * @description Store UserResidenseInfo
 * @access Public
 */
router.post("/store_user_personal_info", (req, res) => {
  const { errors, isValid } = validateUserPersonalInfo(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ _id: req.body.userId }).then((user) => {
    if (user) {
      UserPersonalInfo.findOne({ userId: user._id })
        .then((userPersonalInfo) => {
          if (userPersonalInfo) {
            userPersonalInfo.streetAddress = req.body.streetAddress;
            userPersonalInfo.postalCode = req.body.postalCode;
            userPersonalInfo.city = req.body.city;
            userPersonalInfo.country = req.body.country;
            userPersonalInfo.verification = true;
            userPersonalInfo
              .save()
              .then((userPersonalInfo) => {
                return res.json({
                  variant: "success",
                  message: "Personal info updated successfully",
                });
              })
              .catch((err) => {
                return res
                  .status(400)
                  .json({ variant: "error", message: "Error on save data" });
              });
          } else {
            const newUserPersonalInfo = new UserPersonalInfo({
              userId: user._id,
              streetAddress: req.body.streetAddress,
              postalCode: req.body.postalCode,
              city: req.body.city,
              country: req.body.country,
              verification: true,
            });

            newUserPersonalInfo
              .save()
              .then(async (userPersonalInfo) => {
                const userProfile = await UserProfile.findOne({
                  userId: user._id,
                });
                if (userProfile) {
                  userProfile.profileComplete = userProfile.profileComplete + 5;
                  userProfile.save();
                }
                return res.json({
                  variant: "success",
                  message: "Personal info created successfully",
                });
              })
              .catch((err) => {
                return res
                  .status(400)
                  .json({ variant: "error", message: "Error on save data" });
              });
          }
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ variant: "error", message: "Error on save data" });
        });
    } else {
      return res
        .status(400)
        .json({ variant: "error", message: "User not found, try again" });
    }
  });
});

/**
 * @route GET /api/user/user_bank_info/:userId
 * @description Get user bank info object.
 * @access Public
 */
router.get("/user_bank_info/:userId", (req, res) => {
  UserBankInfo.findOne({ userId: req.params.userId }).then((userBankInfo) => {
    if (userBankInfo) {
      res.json(userBankInfo);
    } else {
      return res.json({ bankName: "", bankAccount: " " });
    }
  });
});

/**
 * @route POST /api/user/store_user_bank_info
 * @description Store UserBankInfo
 * @access Public
 */
router.post("/store_user_bank_info", (req, res) => {
  const { errors, isValid } = validateUserBankInfo(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ _id: req.body.userId }).then((user) => {
    if (user) {
      UserBankInfo.findOne({ userId: user._id })
        .then((userBankInfo) => {
          if (userBankInfo) {
            userBankInfo.bankName = req.body.bankName;
            userBankInfo.bankAccount = req.body.bankAccount;
            userBankInfo.bankAddress = req.body.bankAddress;
            userBankInfo.bankSwift = req.body.bankSwift
              ? req.body.bankSwift
              : "";
            userBankInfo.bankIban = req.body.bankIban ? req.body.bankIban : "";
            userBankInfo.bankCurrency = req.body.bankCurrency
              ? req.body.bankCurrency
              : "AED";
            userBankInfo.beneficiaryName = req.body.beneficiaryName
              ? req.body.beneficiaryName
              : "";
            userBankInfo.bankCity = req.body.bankCity;
            userBankInfo.varification = true;
            userBankInfo
              .save()
              .then((userBankInfo) => {
                res.json({
                  variant: "success",
                  message: "Bank info updated successfully",
                });
              })
              .catch((err) => res.json(err));
          } else {
            const newUserBankInfo = new UserBankInfo({
              userId: user._id,
              bankName: req.body.bankName,
              bankAccount: req.body.bankAccount,
              bankAddress: req.body.bankAddress,
              bankSwift: req.body.bankSwift ? req.body.bankSwift : "",
              bankIban: req.body.bankIban ? req.body.bankIban : "",
              beneficiaryName: req.body.beneficiaryName
                ? req.body.beneficiaryName
                : "",
              bankCurrency: req.body.bankCurrency,
              bankCity: req.body.bankCity,
              varification: true,
            });

            newUserBankInfo
              .save()
              .then(async (userBankInfo) => {
                const userProfile = await UserProfile.findOne({
                  userId: user._id,
                });
                if (userProfile) {
                  userProfile.profileComplete =
                    userProfile.profileComplete + 20;
                  userProfile.save();
                }
                res.json({
                  variant: "success",
                  message: "Bank info created successfully",
                });
              })
              .catch((err) => res.json(err));
          }
        })
        .catch((err) => {
          return res
            .status(400)
            .json({ variant: "error", message: "Error on data save" });
        });
    } else {
      res.status(400).json({ variant: "error", message: "User not found" });
    }
  });
});

const getOrCreateUserMarginWallet = async (asset, userId) => {
  const user = await User.findOne({ _id: userId });
  if (asset.fiat) {
    let assetName = asset.name;

    const userWallet = await UserMarginWallet.findOne({
      userId: userId,
      coin: assetName,
    });
    if (userWallet) {
      // walletAmount = await WalletController.getViabtcMarginWalletBalance(userWallet, user);
      // if (walletAmount) {
      // userWallet.walletAmount = walletAmount[userWallet.coin].available;
      // userWallet.walletFreezAmount = walletAmount[userWallet.coin].freeze;
      // await userWallet.save();
      // }
      return userWallet;
    } else {
      const newUserWallet = new UserMarginWallet();
      newUserWallet.userId = userId;
      newUserWallet.coin = assetName;
      newUserWallet.walletAmount = 0;
      newUserWallet.walletFreezAmount = 0;
      newUserWallet.borrowAmount = 0;
      newUserWallet.fiat = true;
      newUserWallet.active =
        (user.country === "AE" && assetName === "AED") ||
        (user.country === "IN" && assetName === "INR")
          ? true
          : assetName === "AED" && user.country !== "IN"
            ? true
            : false;
      newUserWallet.save();
      return newUserWallet;
    }
  } else {
    let assetName = asset.name;
    // Read the user authentication section to get your API access token

    const userWallet = await UserMarginWallet.findOne({
      userId: userId,
      coin: assetName,
    });

    if (userWallet) {
      // walletCryptoAmount = await WalletController.getViabtcMarginWalletBalance(userWallet, user);
      // if (walletCryptoAmount) {
      //   userWallet.walletAmount = walletCryptoAmount[userWallet.coin].available;
      //   await userWallet.save();
      // }
      return userWallet;
    } else {
      let walletController = await WalletController.createMarginWallet(
        userId,
        asset
      );
      return walletController;
    }
  }
};

const updateBonusAmount = async (assetName, userWallet, user) => {
  const userBonusWalletHistory = await UserBonusWalletHistory.findOne({
    userId: user._id,
    approved: false,
    coin: assetName,
  });
  const userBonusWalletHistoryApproved = await UserBonusWalletHistory.findOne({
    userId: user._id,
    approved: true,
    coin: assetName,
  });
  if (user.country === "AE" && assetName === "AED") {
    if (userBonusWalletHistory) {
      // let signupDeposit = WalletController.depositeWallet(userWallet, userBonusWalletHistory.bonusAmount);
      // if (signupDeposit) {
      userBonusWalletHistory.approved = true;
      await userBonusWalletHistory.save();

      userWallet.bonusWalletAmount = userBonusWalletHistory.bonusAmount;
      await userWallet.save();
      // }
    } else {
      if (parseFloat(userWallet.walletAmount) <= 0) {
        userWallet.bonusWalletAmount = 0;
        await userWallet.save();
        if (userBonusWalletHistoryApproved) {
          if (parseFloat(userWallet.walletFreezAmount) > 0) {
            userBonusWalletHistoryApproved.freezAmount = true;
            await userBonusWalletHistoryApproved.save();
          }
        }
      } else if (
        parseFloat(userWallet.walletAmount) <
        parseFloat(userWallet.bonusWalletAmount)
      ) {
        userWallet.bonusWalletAmount = parseFloat(userWallet.walletAmount);
        await userWallet.save();
        if (userBonusWalletHistoryApproved) {
          if (parseFloat(userWallet.walletFreezAmount) > 0) {
            userBonusWalletHistoryApproved.freezAmount = true;
            await userBonusWalletHistoryApproved.save();
          }
        }
      } else if (
        parseFloat(userWallet.walletAmount) >=
        parseFloat(userWallet.bonusWalletAmount)
      ) {
        if (userBonusWalletHistoryApproved) {
          if (parseFloat(userWallet.walletFreezAmount) > 0) {
            userBonusWalletHistoryApproved.freezAmount = true;
            await userBonusWalletHistoryApproved.save();
          }

          if (
            userBonusWalletHistoryApproved.freezAmount &&
            parseFloat(userWallet.walletFreezAmount) <= 0
          ) {
            userBonusWalletHistoryApproved.freezAmount = false;
            await userBonusWalletHistoryApproved.save();

            userWallet.bonusWalletAmount =
              userBonusWalletHistoryApproved.bonusAmount;
            await userWallet.save();
          }
        }
      } else if (
        parseFloat(userWallet.walletAmount) <
        parseFloat(userBonusWalletHistoryApproved.bonusAmount)
      ) {
        if (userBonusWalletHistoryApproved) {
          if (parseFloat(userWallet.walletFreezAmount) > 0) {
            userBonusWalletHistoryApproved.freezAmount = true;
            await userBonusWalletHistoryApproved.save();
          }

          if (
            userBonusWalletHistoryApproved.freezAmount &&
            parseFloat(userWallet.walletFreezAmount) <= 0
          ) {
            userBonusWalletHistoryApproved.freezAmount = false;
            await userBonusWalletHistoryApproved.save();

            userWallet.bonusWalletAmount = userWallet.walletAmount;
            await userWallet.save();
          }
        }
      }
    }
  } else if (user.country === "IN" && assetName === "INR") {
    if (userBonusWalletHistory) {
      // let signupDeposit = WalletController.depositeWallet(userWallet, userBonusWalletHistory.bonusAmount);
      // if (signupDeposit) {
      userBonusWalletHistory.approved = true;
      await userBonusWalletHistory.save();

      userWallet.bonusWalletAmount = userBonusWalletHistory.bonusAmount;
      await userWallet.save();
      // }
    } else {
      if (parseFloat(userWallet.walletAmount) <= 0) {
        userWallet.bonusWalletAmount = 0;
        await userWallet.save();
        if (userBonusWalletHistoryApproved) {
          if (parseFloat(userWallet.walletFreezAmount) > 0) {
            userBonusWalletHistoryApproved.freezAmount = true;
            await userBonusWalletHistoryApproved.save();
          }
        }
      } else if (
        parseFloat(userWallet.walletAmount) <
        parseFloat(userWallet.bonusWalletAmount)
      ) {
        userWallet.bonusWalletAmount = parseFloat(userWallet.walletAmount);
        await userWallet.save();
        if (userBonusWalletHistoryApproved) {
          if (parseFloat(userWallet.walletFreezAmount) > 0) {
            userBonusWalletHistoryApproved.freezAmount = true;
            await userBonusWalletHistoryApproved.save();
          }
        }
      } else if (
        parseFloat(userWallet.walletAmount) >=
        parseFloat(userWallet.bonusWalletAmount)
      ) {
        if (userBonusWalletHistoryApproved) {
          if (parseFloat(userWallet.walletFreezAmount) > 0) {
            userBonusWalletHistoryApproved.freezAmount = true;
            await userBonusWalletHistoryApproved.save();
          }

          if (
            userBonusWalletHistoryApproved.freezAmount &&
            parseFloat(userWallet.walletFreezAmount) <= 0
          ) {
            userBonusWalletHistoryApproved.freezAmount = false;
            await userBonusWalletHistoryApproved.save();

            userWallet.bonusWalletAmount =
              userBonusWalletHistoryApproved.bonusAmount;
            await userWallet.save();
          }
        }
      } else if (
        parseFloat(userWallet.walletAmount) <
        parseFloat(userBonusWalletHistoryApproved.bonusAmount)
      ) {
        if (userBonusWalletHistoryApproved) {
          if (parseFloat(userWallet.walletFreezAmount) > 0) {
            userBonusWalletHistoryApproved.freezAmount = true;
            await userBonusWalletHistoryApproved.save();
          }

          if (
            userBonusWalletHistoryApproved.freezAmount &&
            parseFloat(userWallet.walletFreezAmount) <= 0
          ) {
            userBonusWalletHistoryApproved.freezAmount = false;
            await userBonusWalletHistoryApproved.save();

            userWallet.bonusWalletAmount = userWallet.walletAmount;
            await userWallet.save();
          }
        }
      }
    }
  } else if (
    user.country != "AE" &&
    user.country != "IN" &&
    assetName === "USD"
  ) {
    if (userBonusWalletHistory) {
      // let signupDeposit = WalletController.depositeWallet(userWallet, userBonusWalletHistory.bonusAmount);
      // if (signupDeposit) {
      userBonusWalletHistory.approved = true;
      await userBonusWalletHistory.save();

      userWallet.bonusWalletAmount = userBonusWalletHistory.bonusAmount;
      await userWallet.save();
      // }
    } else {
      if (parseFloat(userWallet.walletAmount) <= 0) {
        userWallet.bonusWalletAmount = 0;
        await userWallet.save();
        if (userBonusWalletHistoryApproved) {
          if (parseFloat(userWallet.walletFreezAmount) > 0) {
            userBonusWalletHistoryApproved.freezAmount = true;
            await userBonusWalletHistoryApproved.save();
          }
        }
      } else if (
        parseFloat(userWallet.walletAmount) <
        parseFloat(userWallet.bonusWalletAmount)
      ) {
        userWallet.bonusWalletAmount = parseFloat(userWallet.walletAmount);
        await userWallet.save();
        if (userBonusWalletHistoryApproved) {
          if (parseFloat(userWallet.walletFreezAmount) > 0) {
            userBonusWalletHistoryApproved.freezAmount = true;
            await userBonusWalletHistoryApproved.save();
          }
        }
      } else if (
        parseFloat(userWallet.walletAmount) >=
        parseFloat(userWallet.bonusWalletAmount)
      ) {
        if (userBonusWalletHistoryApproved) {
          if (parseFloat(userWallet.walletFreezAmount) > 0) {
            userBonusWalletHistoryApproved.freezAmount = true;
            await userBonusWalletHistoryApproved.save();
          }

          if (
            userBonusWalletHistoryApproved.freezAmount &&
            parseFloat(userWallet.walletFreezAmount) <= 0
          ) {
            userBonusWalletHistoryApproved.freezAmount = false;
            await userBonusWalletHistoryApproved.save();

            userWallet.bonusWalletAmount =
              userBonusWalletHistoryApproved.bonusAmount;
            await userWallet.save();
          }
        }
      } else if (
        parseFloat(userWallet.walletAmount) <
        parseFloat(userBonusWalletHistoryApproved.bonusAmount)
      ) {
        if (userBonusWalletHistoryApproved) {
          if (parseFloat(userWallet.walletFreezAmount) > 0) {
            userBonusWalletHistoryApproved.freezAmount = true;
            await userBonusWalletHistoryApproved.save();
          }

          if (
            userBonusWalletHistoryApproved.freezAmount &&
            parseFloat(userWallet.walletFreezAmount) <= 0
          ) {
            userBonusWalletHistoryApproved.freezAmount = false;
            await userBonusWalletHistoryApproved.save();

            userWallet.bonusWalletAmount = userWallet.walletAmount;
            await userWallet.save();
          }
        }
      }
    }
  }
};

const getOrCreateUserWallet = async (asset, userId) => {
  const user = await User.findOne({ _id: userId });
  let walletSettings = await WalletSettings.find({});
  let walletId = 0;

  if (walletSettings.length > 0) {
    walletId = walletSettings[0].walletLastId;
  }

  if (asset.fiat) {
    let assetName = asset.name;

    const userWallet = await UserWallet.findOne({
      userId: userId,
      coin: assetName,
    });
    if (userWallet) {
      // Update last wallet id to user
      if (user.viabtcUserId) {
        //
      } else {
        walletId = walletId + 1;

        walletSettings[0].walletLastId = walletId;
        await walletSettings[0].save();

        user.viabtcUserId = walletId;
        await user.save();
      }
      let walletAmount = await WalletController.getViabtcWalletBalance(
        userWallet,
        user.viabtcUserId
      );
      if (
        parseFloat(walletAmount) < parseFloat(userWallet.walletAmount) ||
        parseFloat(walletAmount) <= 0
      ) {
        // console.log(`Updating balance of user wallet ${parseInt(userWallet.userId.replace(/\D/g,''))}`)
        // await WalletController.updateViabtcWalletBalance(userWallet, walletAmount);
      }

      // await updateBonusAmount(assetName, userWallet, user);
      userWallet.walletAmount = walletAmount;
      await userWallet.save();

      return userWallet;
    } else {
      let active = false;

      if (user.country === "AE" && assetName === "AED") {
        active = true;
      } else if (user.country === "IN" && assetName === "INR") {
        active = true;
      } else if (
        user.country != "AE" &&
        user.country != "IN" &&
        assetName === "USD"
      ) {
        active = true;
      }

      // Update last wallet id to user
      if (user.viabtcUserId) {
        //
      } else {
        walletId = walletId + 1;

        walletSettings[0].walletLastId = walletId;
        await walletSettings[0].save();

        user.viabtcUserId = walletId;
        await user.save();
      }

      const newUserWallet = new UserWallet();
      newUserWallet.userId = userId;
      newUserWallet.coin = assetName;
      newUserWallet.viabtcUserId = walletId;
      newUserWallet.walletAmount = 0;
      newUserWallet.walletFreezAmount = 0;
      newUserWallet.fiat = true;
      newUserWallet.active = active;
      await newUserWallet.save();
      await WalletController.getViabtcWalletBalance(
        newUserWallet,
        user.viabtcUserId
      );

      // await updateBonusAmount(assetName, newUserWallet, user);

      return newUserWallet;
    }
  } else {
    let assetName = asset.name;
    // Read the user authentication section to get your API access token

    const userWallet = await UserWallet.findOne({
      userId: userId,
      coin: assetName,
    });

    if (userWallet) {
      // Update last wallet id to user
      if (user.viabtcUserId) {
        //
      } else {
        walletId = walletId + 1;

        walletSettings[0].walletLastId = walletId;
        await walletSettings[0].save();

        user.viabtcUserId = walletId;
        await user.save();
      }

      if (userWallet.coin === "USDT" || userWallet.coin === "BTX") {
        if (!userWallet.walletTrxAddress) {
          const createTrxWallet = await TronController.createWallet();
          if (createTrxWallet) {
            userWallet.walletTrxAddress = createTrxWallet.address;
            userWallet.walletTrxId = createTrxWallet.privateKey;
            await userWallet.save();
          }
        }
      }

      walletAmount = await WalletController.getViabtcWalletBalance(
        userWallet,
        user.viabtcUserId
      );

      userWallet.walletAmount = walletAmount;
      await userWallet.save();
      // if (walletAmount) {
      // userWallet.walletAmount = walletAmount[userWallet.coin].available;
      // userWallet.walletFreezAmount = walletAmount[userWallet.coin].freeze;
      // await userWallet.save();
      // }

      // if (userWallet.coin === 'BTX') {
      //   btxCoinBalance = await WalletController.getWalletBalance(userWallet.coin, userWallet);
      //   if (btxCoinBalance) {
      //     walletAmount = await WalletController.getViabtcWalletBalance(userWallet, user.viabtcUserId);
      //     if ((parseFloat(walletAmount) < parseFloat(userWallet.walletAmount)) || (parseFloat(walletAmount) <= 0)) {
      //       // await WalletController.updateViabtcWalletBalance(userWallet, walletAmount);
      //     }
      //     // userWallet.walletAmount = btxCoinBalance;
      //     await userWallet.save();
      //   }
      // }

      return userWallet;
    } else {
      const userWallet = await WalletController.createWallet(userId, asset);
      if (user.viabtcUserId) {
        //
      } else {
        walletId = walletId + 1;

        walletSettings[0].walletLastId = walletId;
        await walletSettings[0].save();

        user.viabtcUserId = walletId;
        await user.save();
      }
      if (userWallet.coin === "USDT" || userWallet.coin === "BTX") {
        if (!userWallet.walletTrxAddress) {
          const createTrxWallet = await TronController.createWallet();
          if (createTrxWallet) {
            userWallet.walletTrxAddress = createTrxWallet.address;
            userWallet.walletTrxId = createTrxWallet.privateKey;
            await userWallet.save();
          }
        }
      }
      await WalletController.getViabtcWalletBalance(
        userWallet,
        user.viabtcUserId
      );
      return userWallet;
    }
  }
};

/**
 * @route GET /api/user/user_active_margin_wallets/:userId
 * @description Get user active wallets info object.
 * @access Public
 */
router.get("/user_active_margin_wallets/:userId", (req, res) => {
  let _id = req.params.userId;

  Assets.find({ active: true })
    .sort({ priority: -1 })
    .then(async (assets) => {
      if (assets.length > 0) {
        let activeAssets = [];
        let activeWallets = [];
        let activeCurrentAssets = [];
        for (let i = 0; i < assets.length; i++) {
          if (assets[i].active) {
            if (!activeCurrentAssets.includes(assets[i].name)) {
              activeAssets.push(assets[i]);
              activeCurrentAssets.push(assets[i].name);
            }
          }
        }

        for (var j = 0; j < activeAssets.length; j++) {
          let asset = activeAssets[j];
          const activeWallet = await getOrCreateUserMarginWallet(asset, _id);

          let xAddress = "";
          if (activeWallet.coin === "XRP") {
            if (!activeWallet.walletXAddress) {
              xAddress = Encode({
                account: activeWallet.walletAddress,
                tag: activeWallet.destinationTag,
              });
              activeWallet.walletXAddress = xAddress;
              await activeWallet.save();
            } else {
              xAddress = activeWallet.walletXAddress;
            }
          }

          const activeBorrows = await UserBorrowHolding.find({
            userMarginWalletId: activeWallet._id,
            active: true,
          });
          let totalBorrowIntrests = 0;
          if (activeBorrows.length > 0) {
            for (activeBorrow of activeBorrows) {
              let delta =
                Math.abs(Date.now() - Date.parse(activeBorrow.createdAt)) /
                1000;
              // let hours = Math.ceil(((delta / 3600) / 24) / 4);
              let hours =
                Math.ceil((Math.floor(delta / 3600) % 24) / 4) === 0
                  ? 1
                  : Math.ceil((Math.floor(delta / 3600) % 24) / 4);
              totalBorrowIntrests =
                totalBorrowIntrests +
                parseFloat(activeBorrow.borrowAmount) * 0.001 * hours;
              activeBorrow.borrowIntrestAmount =
                parseFloat(activeBorrow.borrowAmount) * 0.001 * hours;
              await activeBorrow.save();
            }
          }

          if (activeWallet) {
            activeWallet.borrowIntrestAmount = totalBorrowIntrests;
            await activeWallet.save();

            let currentActiveWallet = {
              _id: activeWallet._id,
              userId: activeWallet.userId,
              destinationTag: activeWallet.destinationTag,
              coin: activeWallet.coin,
              fiat: activeWallet.fiat,
              active: activeWallet.active,
              bitgo: activeWallet.bitgo,
              xAddress: xAddress,
              walletAddress: activeWallet.walletAddress,
              walletAmount: activeWallet.walletAmount,
              availableBorrowAmount: activeWallet.availableBorrowAmount
                ? activeWallet.availableBorrowAmount
                : 0,
              borrowAmount: activeWallet.borrowAmount
                ? activeWallet.borrowAmount
                : 0,
              totalBorrowIntrests: totalBorrowIntrests,
              createdAt: activeWallet.createdAt,
              displayName: asset.displayName,
              depositFee: asset.depositFee ? asset.depositFee : 0,
              withdrawalFee: asset.withdrawalFee ? asset.withdrawalFee : 0,
              description: asset.description ? asset.description : "-",
            };
            activeWallets.push(currentActiveWallet);
          }
        }

        res.json(activeWallets);
      } else {
        res.status(400).json({ variant: "error", message: "No assets found" });
      }
    })
    .catch((err) => {
      // console.log(err);
    });
});

/**
 * @route GET /api/user/get_wallet/:walletId
 * @description Get user wallet info object.
 * @access Public
 */
router.get("/get_wallet/:walletId", (req, res) => {
  let _id = req.params.walletId;

  UserWallet.findOne({ _id: _id })
    .then(async (userWallet) => {
      if (userWallet) {
        let xAddress = "";
        if (userWallet.coin === "XRP") {
          if (!userWallet.walletXAddress) {
            xAddress = Encode({
              account: userWallet.walletAddress,
              tag: userWallet.destinationTag,
            });
            userWallet.walletXAddress = xAddress;
            userWallet.save();
          }
        }
        let asset = await Assets.findOne({ name: userWallet.coin });
        if (asset) {
          let currentActiveWallet = {
            destinationTag: userWallet.destinationTag,
            coin: userWallet.coin,
            xAddress: xAddress,
            walletAddress: userWallet.walletAddress,
            walletAmount: userWallet.walletAmount,
            createdAt: userWallet.createdAt,
            displayName: asset.displayName,
            depositFee: asset.depositFee ? asset.depositFee : 0,
            withdrawalFee: asset.withdrawalFee ? asset.withdrawalFee : 0,
            description: asset.description ? asset.description : "-",
            withdrawalFee: asset.withdrawalFee,
          };
          res.json(currentActiveWallet);
        } else {
          res.status(400).json({
            variant: "error",
            message: "Error on getting wallet data.",
          });
        }
      } else {
        res
          .status(400)
          .json({ variant: "error", message: "Error on getting wallet data." });
      }
    })
    .catch((err) => {
      // console.log(err);
      res
        .status(400)
        .json({ variant: "error", message: "Error on getting wallet data." });
    });
});

/**
 * @route GET /api/user/all_wallets/:userId
 * @description Get user active wallets info object.
 * @access Public
 */
router.get("/all_wallets/:userId", (req, res) => {
  let _id = req.params.userId;

  Assets.find({ active: true })
    .sort({ priority: 1 })
    .then(async (assets) => {
      if (assets.length > 0) {
        let activeAssets = [];
        let activeWallets = [];
        let activeCurrentAssets = [];
        for (let i = 0; i < assets.length; i++) {
          if (assets[i].active) {
            if (!activeCurrentAssets.includes(assets[i].name)) {
              activeAssets.push(assets[i]);
              activeCurrentAssets.push(assets[i].name);
            }
          }
        }

        for (var j = 0; j < activeAssets.length; j++) {
          let asset = activeAssets[j];
          const activeWallet = await getOrCreateUserWallet(asset, _id);

          let xAddress = "";
          if (activeWallet.coin === "XRP") {
            if (!activeWallet.walletXAddress) {
              xAddress = Encode({
                account: activeWallet.walletAddress,
                tag: activeWallet.destinationTag,
              });
              activeWallet.walletXAddress = xAddress;
              await activeWallet.save();
            } else {
              xAddress = activeWallet.walletXAddress;
            }
          }

          if (activeWallet) {
            let currentActiveWallet = {
              id: activeWallet._id,
              destinationTag: activeWallet.destinationTag,
              coin: activeWallet.coin,
              xAddress: xAddress,
              walletAddress: activeWallet.walletAddress,
              walletAmount: activeWallet.walletAmount,
              createdAt: activeWallet.createdAt,
              displayName: asset.displayName,
              depositFee: asset.depositFee ? asset.depositFee : 0,
              withdrawalFee: asset.withdrawalFee ? asset.withdrawalFee : 0,
              description: asset.description ? asset.description : "-",
              withdrawalFee: asset.withdrawalFee,
            };
            activeWallets.push(currentActiveWallet);
          }
        }

        res.json(activeWallets);
      } else {
        res.status(400).json({ variant: "error", message: "No assets found" });
      }
    })
    .catch((err) => {
      // console.log(err);
    });
});

/**
 * @route GET /api/user/user_active_wallets/:userId
 * @description Get user active wallets info object.
 * @access Public
 */
router.get("/user_active_wallets/:userId", async (req, res) => {
  let _id = req.params.userId;

  // await WalletController.getBtxTronTransactions();

  await WalletController.getEthTransactions(req.params.userId);
  await WalletController.getUsdtTransactions(req.params.userId);
  await WalletController.getTrxTransactions(req.params.userId);
  await WalletController.getTrc20Transactions(req.params.userId, "BTX");
  await WalletController.getTrc20Transactions(req.params.userId, "USDT");

  // await WalletController.getBtxTransactions(req.params.userId);

  Assets.find({ active: true })
    .sort({ priority: 1 })
    .then(async (assets) => {
      if (assets.length > 0) {
        let activeAssets = assets;
        let activeWallets = [];
        // let activeCurrentAssets = [];
        // for(let i = 0; i < assets.length; i++) {
        //   if(assets[i].active) {
        //     if (!activeCurrentAssets.includes(assets[i].name)) {
        //       activeAssets.push(assets[i]);
        //       activeCurrentAssets.push(assets[i].name);
        //     }
        //   }
        // }

        for (var j = 0; j < activeAssets.length; j++) {
          let asset = activeAssets[j];

          const activeWallet = await getOrCreateUserWallet(asset, _id);

          let xAddress = "";
          // if (activeWallet.coin === 'XRP') {
          //   if (!activeWallet.walletXAddress) {
          //     xAddress = Encode({ account: activeWallet.walletAddress, tag: activeWallet.destinationTag });
          //     activeWallet.walletXAddress = xAddress;
          //     await activeWallet.save();
          //   } else {
          //     xAddress = activeWallet.walletXAddress;
          //   }
          // }

          if (activeWallet) {
            let currentActiveWallet = {
              _id: activeWallet._id,
              userId: activeWallet.userId,
              destinationTag: activeWallet.destinationTag,
              coin: activeWallet.coin,
              fiat: activeWallet.fiat,
              active: activeWallet.active,
              bitgo: activeWallet.bitgo,
              xAddress: xAddress,
              walletAddress: activeWallet.walletAddress,
              walletAmount: activeWallet.walletAmount,
              walletTrxAddress: activeWallet.walletTrxAddress
                ? activeWallet.walletTrxAddress
                : false,
              createdAt: activeWallet.createdAt,
              displayName: asset.displayName,
              depositFee: asset.depositFee ? asset.depositFee : 0,
              withdrawalFee: asset.withdrawalFee ? asset.withdrawalFee : 0,
              description: asset.description ? asset.description : "-",
              withdrawalFee: asset.withdrawalFee,
            };
            activeWallets.push(currentActiveWallet);
          }
        }
        res.json(activeWallets);
      } else {
        res.status(400).json({ variant: "error", message: "No assets found" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

/**
 * @route GET /api/user/user_margin_wallet
 * @description Get user wallet info object.
 * @access Public
 */
router.get("/user_margin_wallet/:walletId", (req, res) => {
  let _id = req.params.walletId;

  UserMarginWallet.findOne({ _id: _id })
    .then(async (userWallet) => {
      if (userWallet) {
        if (userWallet.coin === "XRP") {
          if (!userWallet.walletXAddress) {
            xAddress = Encode({
              account: userWallet.walletAddress,
              tag: userWallet.destinationTag,
            });
            userWallet.walletXAddress = xAddress;
            userWallet.save();
          }
        }
        let asset = await Assets.findOne({ name: userWallet.coin });
        res.json({ asset: asset, userWallet: userWallet });
      } else {
        res
          .status(400)
          .json({ variant: "error", message: "Error on getting wallet data." });
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({ variant: "error", message: "Error on getting wallet data." });
    });
});

/**
 * @route GET /api/user/user_wallet
 * @description Get user wallet info object.
 * @access Public
 */
router.get("/user_wallet/:walletId", (req, res) => {
  let _id = req.params.walletId;

  UserWallet.findOne({ _id: _id })
    .then(async (userWallet) => {
      if (userWallet) {
        if (userWallet.coin === "XRP") {
          if (!userWallet.walletXAddress) {
            xAddress = Encode({
              account: userWallet.walletAddress,
              tag: userWallet.destinationTag,
            });
            userWallet.walletXAddress = xAddress;
            userWallet.save();
          }
        }
        let asset = await Assets.findOne({ name: userWallet.coin });
        res.json({ asset: asset, userWallet: userWallet });
      } else {
        res
          .status(400)
          .json({ variant: "error", message: "Error on getting wallet data." });
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({ variant: "error", message: "Error on getting wallet data." });
    });
});

/**
 * @route GET /api/user/get_referral/:userId
 * @description Get referral info object.
 * @access Public
 */
router.get("/get_referral/:userId", async (req, res) => {
  let referralCode = randomstring.generate(8);
  let userId = req.params.userId;
  if (!isEmpty(userId)) {
    referralCode = referralCode + userId.slice(userId.length - 4);
  }
  Referral.findOne({ userId: req.params.userId }).then(async (referral) => {
    if (referral) {
      if (isEmpty(referral.referralCode)) {
        referral.referralCode = referralCode;
        await referral.save();
      }
      res.json(referral);
    } else {
      let newReferral = new Referral();
      newReferral.userId = req.params.userId;
      newReferral.numberOfReferrals = 0;
      newReferral.totalReferralEarnings = 0;
      newReferral.uniquId = uuidv4();
      newReferral.referralCode = referralCode;
      newReferral.save();
      res.json(newReferral);
    }
  });
});

/**
 * @route GET /api/user/get_referral_tree/:userId
 * @description Get referral info object.
 * @access Public
 */
router.get("/get_referral_tree/:userId", (req, res) => {
  Referral.findOne({ userId: req.params.userId }).then((referral) => {
    if (referral) {
      ReferralTree.find({ referralId: referral._id }).then(
        async (referralTrees) => {
          if (referralTrees.length > 0) {
            let referralTreesArr = [];
            for (var i = referralTrees.length - 1; i >= 0; i--) {
              let user = await User.findOne({
                _id: referralTrees[i].referredUser,
              });
              let referralTreeObj = {};
              if (user) {
                referralTreeObj.user = user.firstname + " " + user.lastname;
                referralTreeObj.userEmail = user.email;
                referralTreeObj.referredUserEarning = referralTrees[i]
                  .referredUserEarning
                  ? referralTrees[i].referredUserEarning
                  : 0;
                referralTreeObj.date = referralTrees[i].createdAt;
                referralTreesArr.push(referralTreeObj);
              }
            }
            res.json(referralTreesArr);
          } else {
            res.json([]);
          }
        }
      );
    } else {
      res.json([]);
    }
  });
});

/**
 * @route POST /api/user/update_profile_picture/:userId
 * @description Get referral info object.
 * @access Public
 */
router.post("/update_profile_picture/:userId", async (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then(async (user) => {
      if (user) {
        let uniqueImageId = uuidv4();
        let currentFile = req.files[0];
        let currentPath =
          "./storage/images/" +
          uniqueImageId +
          "." +
          /[^.]+$/.exec(currentFile.originalname)[0];
        // await saveBuffer(currentFile.buffer, currentPath);
        await fs.open(currentPath, "w", function (err, fd) {
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

        user.avatar =
          uniqueImageId + "." + /[^.]+$/.exec(currentFile.originalname)[0];
        try {
          await user.save();
          res.json({
            variant: "success",
            data: user,
            message: "Profile picture updated",
          });
        } catch (error) {
          res.status(400).json({
            variant: "error",
            message: "Something is wrong, try again later.",
          });
        }
      } else {
        res.status(400).json({
          variant: "error",
          message: "Something is wrong, try again later.",
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json({
        variant: "error",
        message: "Something is wrong, try again later.",
      });
    });
});

/**
 * @route GET /api/user/get_image/:imageId
 * @description Get all car images
 * @access Public
 */
router.get("/get_image/:imageId", (req, res) => {
  if (req.params.imageId.split(".").length > 1) {
    if (req.params.imageId.split(".")[1] === "pdf") {
      try {
        if (
          fs.existsSync(
            path.join(__dirname, "../../storage/images/pdf_icon.png")
          )
        ) {
          //file exists
          res.sendFile(
            path.join(__dirname, "../../storage/images/pdf_icon.png")
          );
        } else {
          res.sendFile(path.join(__dirname, "../../config/") + "userLogo.jpg");
        }
      } catch (err) {
        res.sendFile(path.join(__dirname, "../../config/") + "userLogo.jpg");
      }
    } else {
      try {
        if (
          fs.existsSync(
            path.join(__dirname, "../../storage/images/") + req.params.imageId
          )
        ) {
          //file exists
          res.sendFile(
            path.join(__dirname, "../../storage/images/") + req.params.imageId
          );
        } else {
          res.sendFile(path.join(__dirname, "../../config/") + "userLogo.jpg");
        }
      } catch (err) {
        res.sendFile(path.join(__dirname, "../../config/") + "userLogo.jpg");
      }
    }
  }
});

/**
 * @route GET /api/user/user-details/:userId
 * @description Get user details
 * @access Public
 */
router.get("/user-details/:userId", (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user) {
        res.json(user);
      } else {
        res.json({});
      }
    })
    .catch((err) => {
      res.json({});
    });
});

/**
 * @route GET /api/user/get_user_api/:userId
 * @description Get user details
 * @access Public
 */
router.get("/get_user_api/:userId", (req, res) => {
  UserApi.find({ userId: req.params.userId })
    .then((userApis) => {
      if (userApis.length > 0) {
        res.json(userApis);
      } else {
        res.json([]);
      }
    })
    .catch((err) => {
      res.json([]);
    });
});

/**
 * @route POST /api/user/create_user_api/:userId
 * @description Get user details
 * @access Public
 */
router.post("/create_user_api/:userId", async (req, res) => {
  const userApi = new UserApi();
  const apiCreds = await uuidAPIKey.create();
  userApi.userId = req.params.userId;
  userApi.name = req.body.label;
  userApi.apiKey = apiCreds.apiKey;
  userApi.apiSecret = apiCreds.uuid;
  userApi.apiAccess = req.body.apiAccess;
  userApi
    .save()
    .then((userApi) => {
      res.status(400).json({
        variant: "success",
        message: "Api created successfully.",
        newApiKey: userApi.apiKey,
        newApiSecret: userApi.apiSecret,
      });
    })
    .catch((err) => {
      // console.log(err);
      res.status(400).json({
        variant: "error",
        message: "Error creating API key, please try again.",
      });
    });
});

/**
 * @route GET /api/user/remove_user_api/:userApiKeyId
 * @description Get user details
 * @access Public
 */
router.get("/remove_user_api/:userApiKeyId", (req, res) => {
  UserApi.findOne({ _id: req.params.userApiKeyId })
    .then((userApi) => {
      if (userApi) {
        userApi.remove();
        res.json({ variant: "success", message: "API key removed" });
      } else {
        res.status(400).json({
          variant: "error",
          message: "Error removing API key, please try again.",
        });
      }
    })
    .catch((err) => {
      res.status(400).json({
        variant: "error",
        message: "Error removing API key, please try again.",
      });
    });
});

/**
 * @route POST /api/user/update_password/:userId
 * @description Update user password
 * @access Public
 */
router.post("/update_password/:userId", (req, res) => {
  const { errors, isValid } = validateUserChangePass(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user) {
        let oldPassVerify = TwinBcrypt.compareSync(
          req.body.oldPassword,
          user.password
        );
        if (oldPassVerify) {
          TwinBcrypt.hash(req.body.newPassword, function (hash) {
            // Store hash in your password DB.
            user.password = hash;
            user
              .save()
              .then((user) => {
                res.json({
                  variant: "success",
                  message: "Password successfully updated.",
                });
              })
              .catch((err) =>
                res.status(400).json({
                  variant: "error",
                  message: "Error on update password, Try again.",
                })
              );
          });
        } else {
          res.status(400).json({
            oldPassword: "Old password is wrong, try reset password.",
          });
        }
      } else {
        res.status(400).json({
          variant: "error",
          message: "Error on update password, Try again.",
        });
      }
    })
    .catch((err) => {
      res
        .status(400)
        .json({ variant: "error", message: "User not found, try again." });
    });
});

/**
 * @route POST /api/user/store_corporate_info_two/:userId
 * @description Save user corporate details
 * @access Public
 */
router.post("/store_corporate_info_two/:userId", (req, res) => {
  const { errors, isValid } = validateUserCorporateInfoSecond(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  UserIdentity.findOne({ _id: req.body.userIdentityId })
    .then((userIdentity) => {
      if (userIdentity) {
        UserCorporateTwo.findOne({ userIdentityId: userIdentity._id })
          .then((userCorporateTwo) => {
            if (userCorporateTwo) {
              userCorporateTwo.fullLegleName = req.body.fullLegleName;
              userCorporateTwo.numberOfDirectors = req.body.numberOfDirectors;
              userCorporateTwo.incorporationDate = req.body.incorporationDate;
              userCorporateTwo.nationality = req.body.nationality;
              userCorporateTwo.businessType = req.body.bussinessType;
              userCorporateTwo.registraionNumber = req.body.registraionNumber;

              userCorporateTwo.bankName = req.body.bankName;
              userCorporateTwo.bankAccountNumber = req.body.bankAccountNumber;
              userCorporateTwo.bankAccountHolderName =
                req.body.bankAccountHolderName;
              userCorporateTwo.bankCountry = req.body.bankCountry;
              userCorporateTwo.save();

              return res.json(userCorporateTwo);
            } else {
              const newuserCorporateInfoTwo = new UserCorporateTwo();
              newuserCorporateInfoTwo.fullLegleName = req.body.fullLegleName;
              newuserCorporateInfoTwo.numberOfDirectors =
                req.body.numberOfDirectors;
              newuserCorporateInfoTwo.incorporationDate =
                req.body.incorporationDate;
              newuserCorporateInfoTwo.nationality = req.body.nationality;
              newuserCorporateInfoTwo.businessType = req.body.bussinessType;
              newuserCorporateInfoTwo.registraionNumber =
                req.body.registraionNumber;

              newuserCorporateInfoTwo.bankName = req.body.bankName;
              newuserCorporateInfoTwo.bankAccountNumber =
                req.body.bankAccountNumber;
              newuserCorporateInfoTwo.bankAccountHolderName =
                req.body.bankAccountHolderName;
              newuserCorporateInfoTwo.bankCountry = req.body.bankCountry;
              newuserCorporateInfoTwo.save();

              return res.json(newuserCorporateInfoTwo);
            }
          })
          .catch((err) => {
            const newuserCorporateInfoTwo = new UserCorporateTwo();
            newuserCorporateInfoTwo.fullLegleName = req.body.fullLegleName;
            newuserCorporateInfoTwo.numberOfDirectors =
              req.body.numberOfDirectors;
            newuserCorporateInfoTwo.incorporationDate =
              req.body.incorporationDate;
            newuserCorporateInfoTwo.nationality = req.body.nationality;
            newuserCorporateInfoTwo.businessType = req.body.bussinessType;
            newuserCorporateInfoTwo.registraionNumber =
              req.body.registraionNumber;

            newuserCorporateInfoTwo.bankName = req.body.bankName;
            newuserCorporateInfoTwo.bankAccountNumber =
              req.body.bankAccountNumber;
            newuserCorporateInfoTwo.bankAccountHolderName =
              req.body.bankAccountHolderName;
            newuserCorporateInfoTwo.bankCountry = req.body.bankCountry;
            newuserCorporateInfoTwo.save();

            return res.json(newuserCorporateInfoTwo);
          });
      } else {
        return res.status(400).json({
          variant: "error",
          message: "User identity error, try again",
        });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ variant: "error", message: "User identity error, try again" });
    });
});

/**
 * @route POST /api/user/store_corporate_info_one/:userId
 * @description Get user details
 * @access Public
 */
router.post("/store_corporate_info_one/:userId", (req, res) => {
  const { errors, isValid } = validateCorporateInfoFirst(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  UserIdentity.findOne({ _id: req.body.userIdentityId })
    .then((userIdentity) => {
      if (userIdentity) {
        UserCorporateOne.findOne({ userIdentityId: userIdentity._id })
          .then((userCorporateOne) => {
            if (userCorporateOne) {
              userCorporateOne.firstname = req.body.firstname;
              userCorporateOne.lastname = req.body.lastname;
              userCorporateOne.dateOfBirth = req.body.dateOfBirth;
              userCorporateOne.nationality = req.body.nationality;
              userCorporateOne.phone = req.body.phone;

              userCorporateOne.officeAddress = req.body.officeAddress;
              userCorporateOne.officeCity = req.body.officeCity;
              userCorporateOne.officeZip = req.body.officeZip;
              userCorporateOne.officeCountry = req.body.officeCountry;
              userCorporateOne.save();

              return res.json(userCorporateOne);
            } else {
              const newuserCorporateInfoOne = new UserCorporateOne();
              newuserCorporateInfoOne.userIdentityId = req.body.userIdentityId;
              newuserCorporateInfoOne.firstname = req.body.firstname;
              newuserCorporateInfoOne.lastname = req.body.lastname;
              newuserCorporateInfoOne.dateOfBirth = req.body.dateOfBirth;
              newuserCorporateInfoOne.nationality = req.body.nationality;
              newuserCorporateInfoOne.phone = req.body.phone;

              newuserCorporateInfoOne.officeAddress = req.body.officeAddress;
              newuserCorporateInfoOne.officeCity = req.body.officeCity;
              newuserCorporateInfoOne.officeZip = req.body.officeZip;
              newuserCorporateInfoOne.officeCountry = req.body.officeCountry;
              newuserCorporateInfoOne.save();

              return res.json(newuserCorporateInfoOne);
            }
          })
          .catch((err) => {
            const newuserCorporateInfoOne = new UserCorporateOne();
            newuserCorporateInfoOne.userIdentityId = req.body.userIdentityId;
            newuserCorporateInfoOne.firstname = req.body.firstname;
            newuserCorporateInfoOne.lastname = req.body.lastname;
            newuserCorporateInfoOne.dateOfBirth = req.body.dateOfBirth;
            newuserCorporateInfoOne.nationality = req.body.nationality;
            newuserCorporateInfoOne.phone = req.body.phone;

            newuserCorporateInfoOne.officeAddress = req.body.officeAddress;
            newuserCorporateInfoOne.officeCity = req.body.officeCity;
            newuserCorporateInfoOne.officeZip = req.body.officeZip;
            newuserCorporateInfoOne.officeCountry = req.body.officeCountry;
            newuserCorporateInfoOne.save();

            return res.json(newuserCorporateInfoOne);
          });
      } else {
        return res.status(400).json({
          variant: "error",
          message: "User identity error, try again",
        });
      }
    })
    .catch((err) => {
      return res
        .status(400)
        .json({ variant: "error", message: "User identity error, try again" });
    });
});

/**
 * @route POST /api/user/store_fmc_token
 * @description Store fmc token of user
 * @access Private
 */
router.post("/store_fmc_token", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userId });
  if (user) {
    const clientFcmToken = await ClientFcmToken.findOne({
      userId: req.body.userId,
    });
    if (!clientFcmToken) {
      const newFcmToken = new ClientFcmToken({
        userId: req.body.userId,
        token: req.body.fmcToken,
      });
      await newFcmToken.save();
    } else {
      clientFcmToken.token = req.body.fmcToken;
      clientFcmToken.save();
    }

    user.fcmToken = req.body.fmcToken;
    await user.save();
    return res.json({ message: "Token saved." });
  } else {
    console.log("Token failed to save");
    return res.json({ message: "Token failed to save" });
  }
});

/**
 * @route POST /api/user/enable_face_id
 * @description Verify user password
 * @access Public
 */
router.post("/enable_face_id", (req, res) => {
  const { errors, isValid } = validateUserFaceIdPass(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ _id: req.body.userId })
    .then((user) => {
      if (user) {
        let hash = user.password;
        hash = hash.replace(/^\$2y(.+)$/i, "$2a$1");
        let oldPassVerify = TwinBcrypt.compareSync(
          req.body.faceIdPassword,
          hash
        );
        if (oldPassVerify) {
          UserProfile.findOne({ userId: user._id }).then((userProfile) => {
            // console.log(userProfile);
            if (userProfile) {
              userProfile.faceId = true;
              userProfile
                .save()
                .then(() => {
                  user.biomatricDeviceId = req.body.biomatricDeviceId;
                  user.save();
                  res.json({
                    variant: "success",
                    message: "Password successfully verified.",
                  });
                })
                .catch((err) => {
                  res.json({
                    variant: "error",
                    message: "Something went wrong, try again.",
                  });
                });
            }
          });
        } else {
          res
            .status(400)
            .json({ faceIdPassword: "password is wrong, try reset password." });
        }
      } else {
        res.json({ variant: "error", message: "User not found, try again." });
      }
    })
    .catch((err) => {
      res.json({ variant: "error", message: "User not found, try again." });
    });
});

/**
 * @route GET /api/user/last_five_transactions/:userId
 * @description Last five transactions
 * @access Public
 */
router.get("/last_five_transactions/:userId", (req, res) => {
  User.findOne({ _id: req.params.userId }).then((user) => {
    if (user) {
      WalletTransactions.find({ userId: user._id })
        .sort("-date")
        .skip(0)
        .limit(5)
        .then((transactions) => {
          if (transactions.length > 0) {
            res.json(transactions);
          }
        });
    } else {
      res.json({ variant: "error", message: "User not found, try again." });
    }
  });
});

/**
 * @route POST /api/user/disable_face_id
 * @description Verify user password
 * @access Public
 */
router.post("/disable_face_id", (req, res) => {
  User.findOne({ _id: req.body.userId })
    .then((user) => {
      if (user) {
        UserProfile.findOne({ userId: user._id }).then((userProfile) => {
          if (userProfile) {
            userProfile.faceId = false;
            userProfile
              .save()
              .then(() => {
                res.json({ variant: "success", message: "Face Id disabled." });
              })
              .catch((err) =>
                res.json({
                  variant: "error",
                  message: "Something went wrong, try again.",
                })
              );
          }
        });
      } else {
        res.json({ variant: "error", message: "User not found, try again." });
      }
    })
    .catch((err) => {
      res.json({ variant: "error", message: "User not found, try again." });
    });
});

/**
 * @route GET /api/user/get_referral_redeem/:userId
 * @description Redeem referral earning
 * @access Public
 */
router.get("/get_referral_redeem/:userId", (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user) {
        Referral.findOne({ userId: user._id }).then((referral) => {
          if (referral) {
            UserWallet.findOne({
              userId: user._id,
              fiat: true,
              active: true,
            }).then((userWallet) => {
              userWallet.walletAmount =
                parseFloat(userWallet.walletAmount) +
                parseFloat(referral.totalReferralEarnings);
              userWallet
                .save()
                .then((userWalletAdd) => {
                  referral.totalReferralEarnings = 0;
                  referral.save();

                  res.json({
                    variant: "success",
                    message: "Transfer successful",
                  });
                })
                .catch((err) => {
                  res.json({
                    variant: "error",
                    message: "Falied to redeem, try again later",
                  });
                });
            });
          } else {
            res.json({
              variant: "error",
              message: "Falied to redeem, try again later",
            });
          }
        });
      } else {
        res.json({
          variant: "error",
          message: "Something went wrong, try again",
        });
      }
    })
    .catch((err) => {
      res.json({
        variant: "error",
        message: "Something went wrong, try again",
      });
    });
});

/**
 * @route GET /api/user/get_agent_clients/:userId
 * @description Add new client
 * @access Public
 */
router.get("/get_agent_clients/:userId", async (req, res) => {
  const agent = await User.findOne({ _id: req.params.userId });

  if (agent) {
    const agentUsers = await AgentUsers.find({ agentId: agent._id });

    let clients = [];
    for (agentUser of agentUsers) {
      const user = await User.findOne({ _id: agentUser.userId }).select([
        "firstname",
        "lastname",
        "email",
        "avatar",
        "subAgent",
        "active",
        "phone",
        "country",
        "createdAt",
      ]);
      if (user) {
        clients.push(user);
      }
    }
    res.json(clients);
  } else {
    res.json([]);
  }
});

/**
 * @route POST /api/user/resend_client_verification
 * @description Add new client
 * @access Public
 */
router.post("/resend_client_verification/:userId", async (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then(async (user) => {
      if (user) {
        const client = await User.findOne({ _id: req.body.clietId });
        if (client) {
          let encodedEmail = base64.encode(client.email);
          const userProfile = await UserProfile.findOne({ userId: client._id });

          if (userProfile) {
            let emailBody = clientInvitationEmail(
              userProfile.emailVerificationCode,
              apiUrl,
              user.agentCode,
              encodedEmail
            );

            const mailOptions = {
              from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
              to: client.email, // list of receivers
              subject: "New account invitation!", // Subject line
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
                "You have successfully a client wait for his/her email approval.",
            });
          } else {
            return res.json({
              variant: "error",
              message:
                "Client profile not found, contact support to resolve issue",
            });
          }
        } else {
          return res.json({
            variant: "error",
            message: "Client not found, contact support to resolve issue",
          });
        }
      } else {
        return res.json({
          variant: "error",
          message: "Something went wrong, try again",
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      return res.json({
        variant: "error",
        message: "Something went wrong, try again",
      });
    });
});

/**
 * @route POST /api/user/add_new_client/:userId
 * @description Add new client
 * @access Public
 */
router.post("/add_new_client/:userId", (req, res) => {
  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user) {
        const { errors, isValid } = validateRegisterInput(req.body);

        // Check Validation
        if (!isValid) {
          return res.status(400).json(errors);
        }

        User.findOne({ email: req.body.email }).then(async (euser) => {
          if (euser) {
            return res.status(400).json({ email: "User already exists." });
          } else {
            // const avatar = gravatar.url(req.body.email, {
            //   s: '200', // Size
            //   r: 'pg', // Rating
            //   d: 'mm' // Default
            // });

            const avatar = "user_logo.png";

            const agentCode = await AgentCode.findOne().limit(1);
            const newUser = new User({
              firstname: req.body.firstname,
              lastname: req.body.lastname,
              email: req.body.email,
              phone: req.body.countryCode + " " + req.body.phone,
              country: req.body.country,
              agent: req.body.agent ? req.body.agent : false,
              agentCode: req.body.country + agentCode.agentCode,
              active: false,
              avatar,
              password: req.body.password,
            });

            TwinBcrypt.hash(newUser.password, function (hash) {
              // Store hash in your password DB.
              newUser.password = hash;
              newUser.save().then(async (nuser) => {
                const agentUser = new AgentUsers({
                  agentId: user._id,
                  userId: nuser._id,
                });
                await agentUser.save();

                agentCode.agentCode = parseInt(agentCode.agentCode) + 1;
                agentCode.save();

                const emailVerificationCode = Math.floor(
                  100000 + Math.random() * 900000
                );
                const phoneVerificationCode = Math.floor(
                  100000 + Math.random() * 900000
                );

                const newUserProfile = new UserProfile({
                  userId: nuser._id,
                  emailVerificationCode: emailVerificationCode,
                  phoneVerificationCode: phoneVerificationCode,
                });
                newUserProfile.save();

                const newUserPersonalInfo = new UserPersonalInfo({
                  userId: nuser._id,
                  country: req.body.country,
                  verification: true,
                });
                newUserPersonalInfo.save();

                let encodedEmail = base64.encode(nuser.email);

                let emailBody = clientInvitationEmail(
                  emailVerificationCode,
                  apiUrl,
                  nuser.agentCode,
                  encodedEmail
                );
                // emailBody += '<p>Verification Code: ' + emailVerificationCode + '</p>';

                const mailOptions = {
                  from: {
                    name: "Trillionbit",
                    email: "noreply@trillionbit.com",
                  }, // sender address
                  to: nuser.email, // list of receivers
                  subject: "New account invitation!", // Subject line
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
                    "You have successfully a client wait for his/her email approval.",
                });
                process.exit();
              });
            });
          }
        });
      } else {
        // console.log('')
        res.json({
          variant: "error",
          message: "Something went wrong, try again",
        });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.json({
        variant: "error",
        message: "Something went wrong, try again",
      });
    });
});

/**
 * @route POST /api/user/borrow_to_margin_wallet
 * @description Transfer balance to margin wallet
 * @access Public
 */
router.post("/borrow_to_margin_wallet", (req, res) => {
  const { errors, isValid } = validateBorrowMarginBalance(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ _id: req.body.userId })
    .then(async (user) => {
      if (user) {
        const marginWallet = await UserMarginWallet.findOne({
          _id: req.body.userMarginWalletId,
        });

        if (marginWallet) {
          if (
            (marginWallet.borrowAmount
              ? parseFloat(marginWallet.availableBorrowAmount) * 2 -
                parseFloat(marginWallet.borrowAmount)
              : parseFloat(marginWallet.availableBorrowAmount) * 2) <
            parseFloat(req.body.borrowAmount)
          ) {
            return res.status(400).json({
              borrowAmount: "Enter less then maximum borrow amount.",
              isValid: false,
            });
          } else {
            // const depositMarginWallet = await WalletController.depositeMarginWallet(marginWallet, parseFloat(req.body.borrowAmount), user);

            // if (depositMarginWallet) {
            marginWallet.walletAmount =
              parseFloat(marginWallet.walletAmount) +
              parseFloat(req.body.borrowAmount);
            marginWallet.borrowAmount =
              (marginWallet.borrowAmount
                ? parseFloat(marginWallet.borrowAmount)
                : 0) + parseFloat(req.body.borrowAmount);
            await marginWallet.save();

            const userBorrowHolding = new UserBorrowHolding();
            userBorrowHolding.userId = user._id;
            userBorrowHolding.userMarginWalletId = marginWallet._id;
            userBorrowHolding.borrowAmount = req.body.borrowAmount;
            userBorrowHolding.save();

            const userDepositRequest = new UserDepositRequest({
              userId: marginWallet.userId,
              type: "Borrow",
              amount: req.body.borrowAmount,
              coin: marginWallet.coin,
              fees: 0,
              status: "Finished",
              noteNumber: "Transfer borrow to margin wallet",
            });
            userDepositRequest.save();

            return res.json({
              variant: "success",
              message: `Wallet amount ${req.body.borrowAmount} successfully transferred.`,
            });
            // } else {
            //   return res.json({variant: 'error', message: 'User margin failed to borrow, try again later.'});
            // }
          }
        } else {
          return res.json({
            variant: "error",
            message: "User margin wallet not found, try again later.",
          });
        }
      } else {
        res.json({ variant: "error", message: "User not found, try again." });
      }
    })
    .catch((err) => {
      res.json({ variant: "error", message: "User not found, try again." });
    });
});

/**
 * @route POST /api/user/repay_to_margin_wallet
 * @description Transfer balance to margin wallet
 * @access Public
 */
router.post("/repay_to_margin_wallet", (req, res) => {
  const { errors, isValid } = validateRepayMarginBalance(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // console.log(req.body.userId);
  User.findOne({ _id: req.body.userId })
    .then(async (user) => {
      if (user) {
        const marginWallet = await UserMarginWallet.findOne({
          _id: req.body.userMarginWalletId,
        });
        if (marginWallet) {
          if (
            parseFloat(req.body.repayAmount) >
            parseFloat(marginWallet.borrowAmount) +
              parseFloat(marginWallet.borrowIntrestAmount)
          ) {
            return res.status(400).json({
              repayAmount: "You can not replay more then borrow amount",
              isValid: false,
            });
          } else {
            if (
              parseFloat(marginWallet.borrowAmount) +
                parseFloat(marginWallet.borrowIntrestAmount) <
              parseFloat(req.body.repayAmount)
            ) {
              return res.status(400).json({
                repayAmount: "Enter less then amount you borrowed.",
                isValid: false,
              });
            } else {
              if (marginWallet.borrowAmount) {
                if (parseFloat(marginWallet.borrowAmount) <= 0) {
                  return res.status(400).json({
                    repayAmount: "You did not borrowed anything to repay",
                    isValid: false,
                  });
                } else {
                  const userBorrowHoldings = await UserBorrowHolding.find({
                    active: true,
                    userMarginWalletId: marginWallet._id,
                  });
                  let totalRepayAccount = parseFloat(req.body.repayAmount);
                  let totalRepayViaBtcAmount = parseFloat(req.body.repayAmount);

                  marginWallet.walletAmount =
                    parseFloat(marginWallet.walletAmount) - totalRepayAccount;
                  if (
                    parseFloat(marginWallet.borrowAmount) < totalRepayAccount
                  ) {
                    marginWallet.borrowAmount = 0;
                  } else {
                    marginWallet.borrowAmount =
                      (marginWallet.borrowAmount
                        ? parseFloat(marginWallet.borrowAmount)
                        : 0) - totalRepayAccount;
                  }

                  for (userBorrowHolding of userBorrowHoldings) {
                    if (
                      totalRepayAccount >
                      parseFloat(userBorrowHolding.borrowAmount) +
                        parseFloat(userBorrowHolding.borrowIntrestAmount)
                    ) {
                      totalRepayAccount =
                        totalRepayAccount -
                        (parseFloat(userBorrowHolding.borrowAmount) +
                          parseFloat(userBorrowHolding.borrowIntrestAmount));
                      userBorrowHolding.borrowAmount = 0;
                      userBorrowHolding.borrowIntrestAmount = 0;
                      userBorrowHolding.active = false;
                      await userBorrowHolding.save();
                    } else if (
                      totalRepayAccount ===
                      parseFloat(userBorrowHolding.borrowAmount) +
                        parseFloat(userBorrowHolding.borrowIntrestAmount)
                    ) {
                      totalRepayAccount =
                        totalRepayAccount -
                        (parseFloat(userBorrowHolding.borrowAmount) +
                          parseFloat(userBorrowHolding.borrowIntrestAmount));
                      userBorrowHolding.borrowAmount = 0;
                      userBorrowHolding.borrowIntrestAmount = 0;
                      userBorrowHolding.active = false;
                      await userBorrowHolding.save();
                    } else {
                      if (
                        parseFloat(userBorrowHolding.borrowAmount) >
                        totalRepayAccount
                      ) {
                        userBorrowHolding.borrowAmount =
                          parseFloat(userBorrowHolding.borrowAmount) -
                          totalRepayAccount;
                        totalRepayAccount = 0;
                        await userBorrowHolding.save();
                      } else if (
                        (parseFloat(userBorrowHolding.borrowAmount) <
                          totalRepayAccount &&
                          parseFloat(userBorrowHolding.borrowIntrestAmount) >=
                            totalRepayAccount -
                              parseFloat(userBorrowHolding.borrowAmount)) ||
                        parseFloat(userBorrowHolding.borrowAmount) ===
                          totalRepayAccount
                      ) {
                        return res.status(400).json({
                          isValid: false,
                          repayAmount: "Please enter total repay amount.",
                        });
                      }
                    }
                  }

                  // const repayMarginWallet = await WalletController.withdrawMarginWallet(marginWallet, totalRepayViaBtcAmount, user);

                  // if (repayMarginWallet) {
                  await marginWallet.save();
                  const userDepositRequest = new UserDepositRequest({
                    userId: marginWallet.userId,
                    type: "Repay",
                    amount: req.body.repayAmount,
                    coin: marginWallet.coin,
                    fees: 0,
                    status: "Finished",
                    noteNumber: "Transfer borrow to margin wallet",
                  });
                  userDepositRequest.save();

                  return res.json({
                    variant: "success",
                    message: `Wallet amount ${req.body.repayAmount} successfully transferred.`,
                  });
                  // } else {
                  //   return res.status(400).json({repayAmount: 'Failed to repay, please try again.', isValid: false});
                  // }
                }
              } else {
                return res.status(400).json({
                  repayAmount: "You did not borrowed anything to repay",
                  isValid: false,
                });
              }
            }
          }
        } else {
          return res.json({
            variant: "error",
            message: "User margin wallet not found, try again later.",
          });
        }
      } else {
        res.json({ variant: "error", message: "User not found, try again." });
      }
    })
    .catch((err) => {
      // console.log(err);
      res.json({ variant: "error", message: "User not found, try again." });
    });
});

/**
 * @route POST /api/user/transfer_from_margin_wallet
 * @description Transfer balance to margin wallet
 * @access Public
 */
router.post("/transfer_from_margin_wallet", (req, res) => {
  const { errors, isValid } = validateTransferFromMarginBalance(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ _id: req.body.userId })
    .then((user) => {
      if (user) {
        UserWallet.findOne({ _id: req.body.userWalletId })
          .then(async (userWallet) => {
            if (userWallet) {
              const marginWallet = await UserMarginWallet.findOne({
                _id: req.body.userMarginWalletId,
              });

              if (marginWallet) {
                if (marginWallet.borrowAmount) {
                  const activeBorrows = await UserBorrowHolding.find({
                    userMarginWalletId: marginWallet._id,
                    active: true,
                  });
                  let borrowWithIntrestAvailable = false;
                  if (activeBorrows.length > 0) {
                    borrowWithIntrestAvailable = true;
                  }

                  if (
                    parseFloat(marginWallet.borrowAmount) > 0 ||
                    borrowWithIntrestAvailable
                  ) {
                    return res.json({
                      variant: "error",
                      message:
                        "Please repay your borrowed balance in order to make this transfer.",
                    });
                  } else {
                    if (
                      parseFloat(marginWallet.walletAmount) <
                      parseFloat(req.body.transferAmount)
                    ) {
                      return res.json({
                        variant: "error",
                        message: "Insufficient balance to transfer.",
                      });
                    } else {
                      // const fromMarginWallet = await WalletController.withdrawMarginWallet(marginWallet, parseFloat(req.body.transferAmount), user);

                      // if (fromMarginWallet) {
                      marginWallet.walletAmount =
                        parseFloat(marginWallet.walletAmount) -
                        parseFloat(req.body.transferAmount);
                      marginWallet.availableBorrowAmount =
                        marginWallet.availableBorrowAmount
                          ? parseFloat(marginWallet.availableBorrowAmount) -
                              parseFloat(req.body.transferAmount) <=
                              0 || parseFloat(marginWallet.walletAmount) <= 0
                            ? 0
                            : parseFloat(marginWallet.availableBorrowAmount) -
                              parseFloat(req.body.transferAmount)
                          : 0;
                      await marginWallet.save();

                      // const toUserWallet = await WalletController.depositeWallet(userWallet, parseFloat(req.body.transferAmount));
                      // if (toUserWallet) {
                      userWallet.walletAmount =
                        parseFloat(userWallet.walletAmount) +
                        parseFloat(req.body.transferAmount);
                      await userWallet.save();

                      const userDepositRequest = new UserDepositRequest({
                        userId: userWallet.userId,
                        type: "Transfer",
                        amount: req.body.transferAmount,
                        coin: marginWallet.coin,
                        fees: 0,
                        status: "Finished",
                        noteNumber: "Transfer to spot wallet",
                      });
                      userDepositRequest.save();

                      return res.json({
                        variant: "success",
                        message: `Wallet amount ${req.body.transferAmount} successfully transferred.`,
                      });
                      // } else {
                      //   return res.json({variant: 'error', message: 'Failed to tranfer, please try again later.'});
                      // }
                      // } else {
                      //   return res.json({variant: 'error', message: 'Failed to tranfer, please try again later.'});
                      // }
                    }
                  }
                } else {
                  return res.json({
                    variant: "error",
                    message: "Enable to tranfer please try again later.",
                  });
                }
              } else {
                return res.json({
                  variant: "error",
                  message: "User margin wallet not found, try again later.",
                });
              }
            } else {
              return res.json({
                variant: "error",
                message: "User wallet not found, try again.",
              });
            }
          })
          .catch((err) => {
            // console.log(err);
            return res.json({
              variant: "error",
              message: "User wallet not found, try again.",
            });
          });
      } else {
        res.json({ variant: "error", message: "User not found, try again." });
      }
    })
    .catch((err) => {
      res.json({ variant: "error", message: "User not found, try again." });
    });
});

/**
 * @route POST /api/user/transfer_to_margin_wallet
 * @description Transfer balance to margin wallet
 * @access Public
 */
router.post("/transfer_to_margin_wallet", (req, res) => {
  const { errors, isValid } = validateTransferMarginBalance(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ _id: req.body.userId })
    .then((user) => {
      if (user) {
        // let hash = user.password;
        //   hash = hash.replace(/^\$2y(.+)$/i, '$2a$1');
        //   TwinBcrypt.compare(req.body.userPassword, hash, function(isMatch) {
        //       if (isMatch) {

        //       } else {
        //         return res.status(400).json({ userPassword: 'Password incorrect'});
        //       }
        //   });

        UserWallet.findOne({ _id: req.body.userWalletId })
          .then(async (userWallet) => {
            if (userWallet) {
              const marginWallet = await UserMarginWallet.findOne({
                _id: req.body.userMarginWalletId,
              });

              if (marginWallet) {
                if (
                  parseFloat(userWallet.walletAmount) <
                  parseFloat(req.body.transferAmount)
                ) {
                  return res.json({
                    variant: "error",
                    message: "Insufficient balance to transfer.",
                  });
                } else {
                  // const transferToMargin = await WalletController.depositeMarginWallet(marginWallet, parseFloat(req.body.transferAmount), user);

                  // if (transferToMargin) {
                  marginWallet.walletAmount =
                    parseFloat(marginWallet.walletAmount) +
                    parseFloat(req.body.transferAmount);
                  marginWallet.availableBorrowAmount =
                    marginWallet.availableBorrowAmount
                      ? parseFloat(marginWallet.availableBorrowAmount) +
                        parseFloat(req.body.transferAmount)
                      : parseFloat(req.body.transferAmount);
                  await marginWallet.save();

                  // const toUserWallet = await WalletController.withdrawWallet(userWallet, parseFloat(req.body.transferAmount));
                  // if (toUserWallet) {
                  userWallet.walletAmount =
                    parseFloat(userWallet.walletAmount) -
                    parseFloat(req.body.transferAmount);
                  await userWallet.save();
                  // }

                  const userDepositRequest = new UserDepositRequest({
                    userId: userWallet.userId,
                    type: "Transfer",
                    amount: req.body.transferAmount,
                    coin: marginWallet.coin,
                    fees: 0,
                    status: "Finished",
                    noteNumber: "Transfer to margin wallet",
                  });
                  userDepositRequest.save();

                  return res.json({
                    variant: "success",
                    message: `Wallet amount ${req.body.transferAmount} successfully transferred.`,
                  });

                  // } else {
                  //   return res.json({variant: 'error', message: 'Failed to transfer, try again later.'});
                  // }
                }
              } else {
                return res.json({
                  variant: "error",
                  message: "User margin wallet not found, try again later.",
                });
              }
            } else {
              return res.json({
                variant: "error",
                message: "User wallet not found, try again.",
              });
            }
          })
          .catch((err) => {
            // console.log(err);
            return res.json({
              variant: "error",
              message: "User wallet not found, try again.",
            });
          });
      } else {
        res.json({ variant: "error", message: "User not found, try again." });
      }
    })
    .catch((err) => {
      res.json({ variant: "error", message: "User not found, try again." });
    });
});

/**
 * @route POST /api/user/transfer_to_client_wallet
 * @description Transfer balance to client wallet
 * @access Public
 */
router.post("/transfer_to_client_wallet", (req, res) => {
  const { errors, isValid } = validateTransferClientBalance(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ _id: req.body.userId })
    .then((user) => {
      if (user) {
        let hash = user.password;
        hash = hash.replace(/^\$2y(.+)$/i, "$2a$1");
        TwinBcrypt.compare(req.body.agentPassword, hash, function (isMatch) {
          if (isMatch) {
            UserWallet.findOne({ _id: req.body.walletId })
              .then(async (userWallet) => {
                if (userWallet) {
                  const agentWallet = await UserWallet.findOne({
                    userId: user._id,
                    coin: req.body.coin,
                  });

                  if (agentWallet) {
                    if (
                      parseFloat(agentWallet.walletAmount) <
                      parseFloat(req.body.transferAmount)
                    ) {
                      return res.json({
                        variant: "error",
                        message: "Insufficient balance to transfer.",
                      });
                    } else {
                      // withdrawReqest = await WalletController.withdrawWallet(agentWallet, parseFloat(req.body.transferAmount));

                      // if (withdrawReqest) {
                      agentWallet.walletAmount =
                        parseFloat(agentWallet.walletAmount) -
                        parseFloat(req.body.transferAmount);
                      await agentWallet.save();
                      // }

                      // depositRequest = await WalletController.depositeWallet(userWallet, parseFloat(req.body.transferAmount));

                      // if (depositRequest) {
                      userWallet.walletAmount =
                        parseFloat(userWallet.walletAmount) +
                        parseFloat(req.body.transferAmount);
                      await userWallet.save();
                      // }

                      const userDepositRequest = new UserDepositRequest({
                        userId: userWallet.userId,
                        type: "Deposit",
                        amount: req.body.transferAmount,
                        coin: req.body.coin,
                        fees: 0,
                        status:
                          depositRequest && withdrawReqest
                            ? "Finished"
                            : "Transaction Error",
                        noteNumber: "Transfer by agent",
                      });
                      userDepositRequest.save();

                      return res.json({
                        variant: "success",
                        message: `Wallet amount ${req.body.transferAmount} successfully transferred.`,
                      });
                    }
                  } else {
                    return res.json({
                      variant: "error",
                      message: "Error on transfer balance, try again.",
                    });
                  }
                } else {
                  return res.json({
                    variant: "error",
                    message: "User wallet not found, try again.",
                  });
                }
              })
              .catch((err) => {
                // console.log(err);
                return res.json({
                  variant: "error",
                  message: "User wallet not found, try again.",
                });
              });
          } else {
            return res
              .status(400)
              .json({ agentPassword: "Password incorrect" });
          }
        });
      } else {
        res.json({ variant: "error", message: "User not found, try again." });
      }
    })
    .catch((err) => {
      res.json({ variant: "error", message: "User not found, try again." });
    });
});

/**
 * @route GET /api/user/get_agent_commission/:agentId
 * @description Update agent commissions
 */
router.get("/get_agent_commission/:agentId", async (req, res) => {
  const agentCommission = await AgentCommission.findOne({
    agentId: req.params.agentId,
  });

  if (agentCommission) {
    res.json(agentCommission);
  } else {
    res.json({});
  }
});

/**
 * @route POST /api/user/update_agent_commission/:agentId
 * @description Update agent commissions
 */
router.post("/update_agent_commission/:agentId", async (req, res) => {
  const agentCommission = await AgentCommission.findOne({
    agentId: req.params.agentId,
  });

  if (agentCommission) {
    agentCommission.makerFee = req.body.makerFee;
    agentCommission.takerFee = req.body.takerFee;
    agentCommission.save();
  } else {
    const newAgentCommission = new AgentCommission();
    newAgentCommission.agentId = req.params.agentId;
    newAgentCommission.makerFee = req.body.makerFee;
    newAgentCommission.takerFee = req.body.takerFee;
    newAgentCommission.save();
  }
  return res.json({
    variant: "success",
    message: `Agent commission updated.!`,
  });
});

/**
 * @route GET /api/user/get_agent_client_trader_levels/:clientId
 * @description Get all trader levels
 * @access Public
 */
router.get("/get_agent_client_trader_levels/:clientId", async (req, res) => {
  const agentClientTraderLevels = await AgentClientTraderLevel.find({
    clientId: req.params.clientId,
  });

  if (agentClientTraderLevels.length > 0) {
    res.json(agentClientTraderLevels);
  } else {
    res
      .status(400)
      .json({ variant: "error", message: "No agent trader levels found" });
  }
});

/**
 * @route Post /api/admin/trading/create_agent_client_trader_level
 * @description Create trader level
 * @access Public
 */
router.post("/create_agent_client_trader_level", async (req, res) => {
  const { errors, isValid } = validateTraderLevelInput(req.body);

  // Check Validation
  if (!isValid) {
    return res
      .status(400)
      .json({ variant: "error", message: "Falied to create trader level." });
  }
  const agentClientTraderLevel = new AgentClientTraderLevel({
    agentId: req.body.agentId,
    clientId: req.body.clientId,
    name: req.body.name,
    fromAmount: req.body.fromAmount,
    toAmount: req.body.toAmount,
    maker_fee: req.body.makerFee,
    taker_fee: req.body.takerFee,
  });
  agentClientTraderLevel
    .save()
    .then((agentClientTraderLevel) => {
      res.json({
        variant: "success",
        message: "Trader level created successfully.",
      });
    })
    .catch((err) => {
      res.json({ variant: "error", message: "Falied to create trader level." });
    });
});

/**
 * @route Post /api/admin/trading/update_agent_client_trader_level/:treaderId
 * @description Update trader level
 * @access Public
 */
router.post(
  "/update_agent_client_trader_level/:treaderId",
  async (req, res) => {
    const { errors, isValid } = validateTraderLevelInput(req.body);

    // Check Validation
    if (!isValid) {
      return res
        .status(400)
        .json({ variant: "error", message: "Falied to update trader level." });
    }

    const agentClientTraderLevel = await AgentClientTraderLevel.findOne({
      _id: req.params.treaderId,
    });

    agentClientTraderLevel.name = req.body.name;
    agentClientTraderLevel.fromAmount = req.body.fromAmount;
    agentClientTraderLevel.toAmount = req.body.toAmount;
    agentClientTraderLevel.maker_fee = req.body.makerFee;
    agentClientTraderLevel.taker_fee = req.body.takerFee;
    agentClientTraderLevel
      .save()
      .then((agentClientTraderLevel) => {
        res.json({
          variant: "success",
          message: "Trader level updated successfully.",
        });
      })
      .catch((err) => {
        res.json({
          variant: "error",
          message: "Falied to update trader level.",
        });
      });
  }
);

/**
 * @route GET /api/admin/trading/remove_agent_client_trader_level/:treaderId
 * @description Remove trader level
 * @access Public
 */
router.get("/remove_agent_client_trader_level/:treaderId", async (req, res) => {
  const agentClientTraderLevel = await AgentClientTraderLevel.findOne({
    _id: req.params.treaderId,
  });

  agentClientTraderLevel
    .remove()
    .then((agentClientTraderLevel) => {
      res.json({
        variant: "success",
        message: "Trader level removed successfully.",
      });
    })
    .catch((err) => {
      res.json({ variant: "error", message: "Falied to remove trader level." });
    });
});

/**
 * @route GET /api/users/send_verification_sms/:userId
 * @description Remove trader level
 * @access Public
 */
router.get("/send_verification_sms/:userId", async (req, res) => {
  const user = await User.findOne({ _id: req.params.userId });
  if (user) {
    const userProfile = await UserProfile.findOne({ userId: user._id });
    if (userProfile) {
      res.json({
        variant: "error",
        message:
          "This service is temporarily unavailable, Please contact support to update new number of verify.",
      });

      // const phoneVerificationCode = Math.floor(100000 + Math.random() * 900000);
      // userProfile.phoneVerificationCode = phoneVerificationCode;
      // await userProfile.save();
      // let phoneNumber = user.phone;
      // phoneNumber = phoneNumber.replace(/\s/g, '');
      // const smsPayload = {
      //   origin: 'Bitex',
      //   message: `${phoneVerificationCode} is your Bitex verfication code.`,
      //   destination: phoneNumber,
      // };

      // var twlioClient = new twilio(accountSid, authToken);
      // twlioClient.messages.create({
      //     body: `${phoneVerificationCode} is your Bitex verfication code.`,
      //     to: phoneNumber,  // Text this number
      //     from: '+17047410223' // From a valid Twilio number
      // })
      // .then((message) => {
      //   // console.log(message.sid);
      //   return res.json({variant: 'success', message: 'Verification sms successfully sent!'});
      // }).catch((error) => {
      //   // console.log(error);
      //   return res.json({variant: 'error', errors: error, message: 'Error on sending a message, please try again.'})
      // });

      // SMSGLOBAL.sms.send(smsPayload, function (error) {
      //   if (error)  return res.json({variant: 'error', errors: error, message: 'Error on sending a message, please try again.'});
      //   return res.json({variant: 'success', message: 'Verification sms successfully sent!'});
      // });
    } else {
      res.json({ variant: "error", message: "User Profile not found." });
    }
  } else {
    res.json({ variant: "error", message: "User not found." });
  }
});

/**
 * @route POST /api/user/verify-phone/:userId
 * @description Verify phone address
 * @access Public
 */
router.post("/verify-phone/:userId", (req, res) => {
  const { errors, isValid } = validatePhoneVerificationInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (user) {
        user.active = true;
        user.save();
        UserProfile.findOne({ userId: user._id })
          .then((userProfile) => {
            if (userProfile) {
              if (userProfile.phoneVerified) {
                return res.json({
                  variant: "error",
                  message: "Phone number already verified!",
                });
              } else {
                if (
                  userProfile.phoneVerificationCode ===
                  parseInt(req.body.verificationCode)
                ) {
                  userProfile.phoneVerified = true;
                  userProfile.profileComplete =
                    userProfile.profileComplete + 13;
                  userProfile
                    .save()
                    .then((verfiedUser) => {
                      return res.json({
                        variant: "success",
                        message: "Phone successfully verified!",
                      });
                    })
                    .catch((err) =>
                      res.status(400).json({
                        verificationCode:
                          "Unknown error on verification please retry or contact to support.",
                      })
                    );
                } else {
                  return res.status(400).json({
                    verificationCode:
                      "Wrong verification code, please check your email or resend code",
                  });
                }
              }
            } else {
              return res.status(400).json({
                verificationCode: "User profile not found.",
              });
            }
          })
          .catch((err) =>
            res.status(400).json({
              verificationCode:
                "Unknown error on verification please retry or contact to support.",
            })
          );
      } else {
        return res.status(400).json({
          verificationCode: "User not found.",
        });
      }
    })
    .catch((err) =>
      res.status(400).json({
        verificationCode: "User not found.",
      })
    );
});

const generateSignature = (timestamp, httpMethod, path, body = "") => {
  const stringToSign = `${timestamp}${httpMethod}${path}${body}`;
  console.log(`String to Sign: ${stringToSign}`); // Debugging
  const signature = crypto
    .createHmac("sha256", SUMSUB_SECRET_KEY)
    .update(stringToSign)
    .digest("hex");
  console.log(`Generated Signature: ${signature}`); // Debugging
  return signature;
};

/**
 * @route GET /api/user/get-verification-token/:userId
 * @description GET verification token for Sumsub
 * @access Public
 */
router.get("/get-verification-token-sumsub/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const path = `/resources/accessTokens?userId=${encodeURIComponent(userId)}&levelName=basic-kyc-level&ttlInSecs=600`;
    const timestamp = Math.floor(Date.now() / 1000); // Unix timestamp in seconds
    const body = JSON.stringify({});
    const signature = generateSignature(timestamp, "POST", path, body);

    console.log(`Path: ${path}`); // Debugging
    console.log(`Timestamp: ${timestamp}`); // Debugging

    const response = await axios.post(
      `https://api.sumsub.com${path}`,
      {},
      {
        headers: {
          Accept: "application/json",
          "X-App-Token": SUMSUB_APP_TOKEN,
          "X-App-Access-Sig": signature,
          "X-App-Access-Ts": timestamp,
        },
      }
    );

    console.log("API Response:", response.data); // DebuggingX

    let sumsubUser = await SumsubUser.findOne({ userId });

    const applicantId = response.data.userId;
    const inspectionId = response.data.inspectionId || null; // Default to null if not present
    const reviewResult = response.data.reviewResult || {}; // Default to an empty object if not present

    if (sumsubUser) {
      sumsubUser.applicantId = applicantId;
      sumsubUser.inspectionId = inspectionId;
      sumsubUser.reviewResult = reviewResult;
      await sumsubUser.save();
    } else {
      sumsubUser = new SumsubUser({
        userId,
        applicantId,
        inspectionId,
        reviewResult,
      });
      await sumsubUser.save();
    }
    res.json(response.data);
  } catch (error) {
    console.error(
      "Error fetching verification token:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({
      variant: "error",
      message: "Something went wrong, please try again later.",
    });
  }
});

/**
 * @route POST /api/user/start-verification-check/:userId
 * @description POST start verification
 * @access Public
 */
router.post("/start-verification-check/:userId", async (req, res) => {
  user = await User.findOne({ _id: req.params.userId });

  if (user) {
    let onfidoUser = await OnfidoUser.findOne({ userId: user._id });
    if (onfidoUser) {
      axios
        .post(
          "https://api.onfido.com/v3/checks/",
          {
            applicant_id: onfidoUser.applicantId,
            report_names: [
              "document",
              "facial_similarity_photo",
              "watchlist_standard",
            ],
            // consider: ["watchlist_standard"],
            // applicant_provides_data: true,
            // document_ids: req.body.documentIds,
          },
          {
            headers: {
              Authorization: `Token token=${process.env.ONFIDO_API_KEY}`,
            },
          }
        )
        .then(async (response) => {
          //  console.log(response.data, 'Check started');
          let userIdentity = await UserIdentity.findOne({
            userId: req.params.userId,
          });
          //  console.log(userIdentity);
          if (userIdentity) {
            userIdentity.submitted = true;
            const notificationData = {
              user: userIdentity.userId,
              details: "",
              notificationType: {
                id: userIdentity._id,
                documentName: "UserIdentity",
              },
            };
            const notication = Notification.create(notificationData);
            await userIdentity.save();
            //  console.log('update identity', userIdentity);
          } else {
            let newUserIdentity = new UserIdentity();
            newUserIdentity.userId = user._id;
            newUserIdentity.userNationality = user.country;
            newUserIdentity.submitted = true;
            await newUserIdentity.save();
            const notificationData = {
              user: newUserIdentity.userId,
              details: "",
              notificationType: {
                id: newUserIdentity._id,
                documentName: "UserIdentity",
              },
            };
            const notication = Notification.create(notificationData);
            // console.log('create identity');
          }
          onfidoUser.checksId = response.data.id;
          onfidoUser.reportIds = JSON.stringify(response.data.report_ids);
          onfidoUser.resultsUri = response.data.results_uri;
          await onfidoUser.save();

          return res.json({
            variant: "success",
            message: "KYC verification initiated.",
          });
        })
        .catch((err) => {
          // console.log(err.response.data.error.fields.applicant, err.response.statusText, err.response.status);
          return res.status(400).json({
            variant: "error",
            message: "Something went wrong please try again later.",
          });
        });
    } else {
      // console.log('Onfido applicant not found.');
      return res.status(400).json({
        variant: "error",
        message: "Something went wrong please try again later.",
      });
    }
  } else {
    // console.log('Onfido user not found.');
    return res.status(400).json({
      variant: "error",
      message: "Something went wrong please try again later.",
    });
  }
});

/**
 * @route GET /api/user/get-android-verification-token/:userId
 * @description GET verification token
 * @access Public
 */
router.get("/get-android-verification-token/:userId", async (req, res) => {
  user = await User.findOne({ _id: req.params.userId });

  if (user) {
    axios
      .post(
        "https://api.onfido.com/v3/applicants",
        {
          first_name: user.firstname,
          last_name: user.lastname,
          email: user.email,
          dob: user.dateOfBirth,
          address: {
            postcode: "",
            country: "IND",
          },
        },
        {
          headers: {
            Authorization: `Token token=${process.env.ONFIDO_API_KEY}`,
          },
        }
      )
      .then(async (response) => {
        // console.log(response.data);
        let onfidoUser = await OnfidoUser.findOne({
          userId: req.params.userId,
        });

        if (onfidoUser) {
          onfidoUser.applicantId = response.data.id;
          onfidoUser.save();
        } else {
          onfidoUser = new OnfidoUser();
          onfidoUser.userId = req.params.userId;
          onfidoUser.applicantId = response.data.id;
          onfidoUser.save();
        }
        // res.json(response.data);
        axios
          .post(
            "https://api.onfido.com/v3/sdk_token",
            {
              applicant_id: response.data.id,
              application_id: "com.bitexuae",
            },
            {
              headers: {
                Authorization: `Token token=${process.env.ONFIDO_API_KEY}`,
              },
            }
          )
          .then((response) => {
            // console.log(response.data);
            res.json(response.data);
          })
          .catch((err) => {
            // console.log(err);
            return res.status(400).json({
              variant: "error",
              message: "Something went wrong please try again later.",
            });
          });
      })
      .catch((err) => {
        // console.log(err);
        return res.status(400).json({
          variant: "error",
          message: "Something went wrong please try again later.",
        });
      });
  } else {
    res.status(400).json({
      variant: "error",
      message: "Something went wrong please try again later.",
    });
  }
});

/**
 * @route GET /api/user/get-ios-verification-token/:userId
 * @description GET verification token
 * @access Public
 */
router.get("/get-ios-verification-token/:userId", async (req, res) => {
  user = await User.findOne({ _id: req.params.userId });

  if (user) {
    axios
      .post(
        "https://api.onfido.com/v3/applicants",
        {
          first_name: user.firstname,
          last_name: user.lastname,
          email: user.email,
        },
        {
          headers: {
            Authorization: `Token token=${process.env.ONFIDO_API_KEY}`,
          },
        }
      )
      .then(async (response) => {
        // console.log(response.data);
        let onfidoUser = await OnfidoUser.findOne({
          userId: req.params.userId,
        });

        if (onfidoUser) {
          onfidoUser.applicantId = response.data.id;
          onfidoUser.save();
        } else {
          onfidoUser = new OnfidoUser();
          onfidoUser.userId = req.params.userId;
          onfidoUser.applicantId = response.data.id;
          onfidoUser.save();
        }
        // res.json(response.data);
        axios
          .post(
            "https://api.onfido.com/v3/sdk_token",
            {
              applicant_id: response.data.id,
              application_id: "org.bitex.exchange",
            },
            {
              headers: {
                Authorization: `Token token=${process.env.ONFIDO_API_KEY}`,
              },
            }
          )
          .then((response) => {
            // console.log(response.data);
            res.json(response.data);
          })
          .catch((err) => {
            // console.log(err);
            return res.status(400).json({
              variant: "error",
              message: "Something went wrong please try again later.",
            });
          });
      })
      .catch((err) => {
        // console.log(err);
        return res.status(400).json({
          variant: "error",
          message: "Something went wrong please try again later.",
        });
      });
  } else {
    res.status(400).json({
      variant: "error",
      message: "Something went wrong please try again later.",
    });
  }
});

/**
 * @route GET /api/user/get-verification-token/:userId
 * @description GET verification token
 * @access Public
 */
router.get("/get-verification-token/:userId", async (req, res) => {
  user = await User.findOne({ _id: req.params.userId });

  if (user) {
    axios
      .post(
        "https://api.onfido.com/v3/applicants",
        {
          first_name: user.firstname,
          last_name: user.lastname,
          email: user.email,
        },
        {
          headers: {
            Authorization: `Token token=${process.env.ONFIDO_API_KEY}`,
          },
        }
      )
      .then(async (response) => {
        // console.log(response.data);
        let onfidoUser = await OnfidoUser.findOne({
          userId: req.params.userId,
        });

        if (onfidoUser) {
          onfidoUser.applicantId = response.data.id;
          onfidoUser.save();
        } else {
          onfidoUser = new OnfidoUser();
          onfidoUser.userId = req.params.userId;
          onfidoUser.applicantId = response.data.id;
          onfidoUser.save();
        }
        // res.json(response.data);
        axios
          .post(
            "https://api.onfido.com/v3/sdk_token",
            {
              applicant_id: response.data.id,
              referrer: "https://bitex.com/*",
            },
            {
              headers: {
                Authorization: `Token token=${process.env.ONFIDO_API_KEY}`,
              },
            }
          )
          .then((response) => {
            // console.log(response.data);
            res.json(response.data);
          })
          .catch((err) => {
            // console.log(err);
            return res.status(400).json({
              variant: "error",
              message: "Something went wrong please try again later.",
            });
          });
      })
      .catch((err) => {
        // console.log(err);
        return res.status(400).json({
          variant: "error",
          message: "Something went wrong please try again later.",
        });
      });
  } else {
    res.status(400).json({
      variant: "error",
      message: "Something went wrong please try again later.",
    });
  }
});

/**
 * @route POST /api/user/edit-phone/:userId
 * @description Edit phone address
 * @access Public
 */
router.post("/edit-phone/:userId", async (req, res) => {
  const { errors, isValid } = validatePhoneEditInput(req.body);
  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }
  if (req.params.userId) {
    const mobileNumber = req.body.countryCode + " " + req.body.mobileNumber;
    const doesUserExit = await User.findOne({
      phone: mobileNumber,
      _id: { $ne: req.params.userId },
    })
      .select("_id")
      .lean();
    if (!isEmpty(doesUserExit)) {
      return res.status(400).json({
        mobileNumber:
          "This mobile number already register with other account, Please contact to support.",
      });
    }
    try {
      const user = await User.findOne({ _id: req.params.userId });
      if (!isEmpty(user)) {
        user.phone = req.body.countryCode + " " + req.body.mobileNumber;
        let promises = [user.save()];
        const userProfile = await UserProfile.findOne({ userId: user._id });
        if (!isEmpty(userProfile)) {
          userProfile.phoneVerified = false;
          promises.push(userProfile.save());
        }
        await Promise.all(promises);
        return res.json({
          variant: "success",
          message: "Phone successfully updated!",
        });
      } else {
        return res.status(400).json({
          mobileNumber: "Something went wrong! Please contact to support.",
        });
      }
    } catch (error) {
      return res.status(400).json({
        mobileNumber: "Something went wrong! Please contact to support.",
      });
    }
  }
});

schedule.scheduleJob("0 30 04 * * *", async () => {
  // console.log('this will run everyday at 10:00 AM INR');

  const verifiedUsers = await UserIdentity.find({
    submitted: true,
    approve: true,
  }).select("userId");
  let usersIdList = [];
  if (verifiedUsers.length > 0) {
    for (verifiedUser of verifiedUsers) {
      usersIdList.push(verifiedUser.userId);
    }
  }
  const userDepositRequest = await UserDepositRequest.find({
    userId: { $in: usersIdList },
  }).select("userId");
  let userDepositList = [];
  if (userDepositRequest.length > 0) {
    for (userDeposit of userDepositRequest) {
      userDepositList.push(userDeposit.userId);
    }
  }
  usersIdList = usersIdList.filter((val) => !userDepositList.includes(val));
  let allVerifiedUsers = await User.find({ _id: { $in: usersIdList } })
    .select("email")
    .sort({ createdAt: -1 })
    .where("email");
  let usersEmails = [];
  if (allVerifiedUsers.length > 0) {
    for (user of allVerifiedUsers) {
      usersEmails.push(user.email);
    }
  }
  verifyUserUndepositEmail(usersEmails);
});

const verifyUserUndepositEmail = async (userEmails) => {
  const emailBody = verifiedUndepositEmail();
  const mailOptions = {
    from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
    to: usersEmails, // list of receivers
    subject: "One step closer to start trading.", // Subject line
    html: emailBody, // plain text body
  };
  await sgMail.send(mailOptions);
  // console.log("email successs");
};

schedule.scheduleJob("0 30 04 * * *", async () => {
  // console.log('this will run everyday at 10:00 AM INR');

  const verifiedUsers = await UserIdentity.find({
    submitted: false,
    approve: false,
  }).select("userId");
  let usersIdList = [];
  if (verifiedUsers.length > 0) {
    for (verifiedUser of verifiedUsers) {
      usersIdList.push(verifiedUser.userId);
    }
  }

  let allVerifiedUsers = await User.find({ _id: { $in: usersIdList } })
    .select("email")
    .sort({ createdAt: -1 })
    .where("email");
  let usersEmails = [];
  if (allVerifiedUsers.length > 0) {
    for (user of allVerifiedUsers) {
      usersEmails.push(user.email);
    }
  }
  unVerifyUsers(usersEmails);
});

const unVerifyUsers = async (usersEmails) => {
  const emailBody = unVerifyUsersEmail();
  const mailOptions = {
    from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
    to: usersEmails, // list of receivers
    subject: "Get your account verified in 30 second.", // Subject line
    html: emailBody, // plain text body
  };
  await sgMail.send(mailOptions);
  // console.log("email successs");
};

/**
 * @route GET /api/user/get_referral-details/:userId
 * @description Get referral info object.
 * @access Public
 */
router.get("/get-referral-details/:userId", (req, res) => {
  ReferralEarnedDetail.find({ user: req.params.userId })
    .populate("ReferralUser")
    .then((referrals) => {
      if (referrals) {
        return res.json({ variant: "success", data: referrals });
      } else {
        return res.json({ variant: "error" });
      }
    });
});

/**
 * @route GET /api/user/get_referral-details-pagination/:userId
 * @description Get referral info object.
 * @access Public
 */
router.get("/get-referral-details-pagination/:userId", (req, res) => {
  let queryOptions = { user: req.params.userId };
  let perPage = req.query.rows ? req.query.rows : 10;
  let page = req.query.page ? req.query.page : 1;

  ReferralEarnedDetail.paginate(queryOptions, {
    page: parseInt(page),
    limit: parseInt(perPage),
    populate: ["ReferralUser"],
  }).then((referrals) => {
    if (referrals) {
      return res.json({ variant: "success", data: referrals });
    } else {
      return res.json({ variant: "error" });
    }
  });
});

/**
 * @route GET /api/user/active-bitex-saving-wallets/:userId
 * @description Get user active wallets info object.
 * @access Public
 */
router.get("/active-bitex-saving-wallets/:userId", (req, res) => {
  let _id = req.params.userId;
  Assets.find({ active: true, fiat: false })
    .sort({ priority: 1 })
    .then(async (assets) => {
      if (assets.length > 0) {
        let activeAssets = [];
        let activeCurrentAssets = [];
        for (let i = 0; i < assets.length; i++) {
          if (assets[i].active) {
            if (!activeCurrentAssets.includes(assets[i].name)) {
              activeAssets.push(assets[i]);
              activeCurrentAssets.push(assets[i].name);
            }
          }
        }

        const user = await User.findOne({ _id: _id });
        let bitexSavingUserActiveWallet = [];
        for (var j = 0; j < activeAssets.length; j++) {
          let asset = activeAssets[j];
          let assetName = asset.name;
          const bitexSavingUserWallet = await BitexSavingUserWallet.findOne({
            userId: user._id,
            coin: assetName,
          });
          bitexSavingUserActiveWallet[j] = bitexSavingUserWallet;
          if (isEmpty(bitexSavingUserWallet)) {
            const newBitexSavingUserWallet = new BitexSavingUserWallet();
            newBitexSavingUserWallet.userId = user._id;
            newBitexSavingUserWallet.user = user._id;
            newBitexSavingUserWallet.coin = assetName;
            newBitexSavingUserWallet.walletAmount = 0;
            newBitexSavingUserWallet.walletFreezAmount = 0;
            newBitexSavingUserWallet.fiat = false;
            newBitexSavingUserWallet.active = true;
            await newBitexSavingUserWallet.save();
            bitexSavingUserActiveWallet[j] = newBitexSavingUserWallet;
          }
        }
        res.json(bitexSavingUserActiveWallet);
      } else {
        res.status(400).json({ variant: "error", message: "No assets found" });
      }
    })
    .catch((err) => {
      // console.log(err);
    });
});

/**
 * @route GET /api/user/get-user/:id
 * @description GET  user
 * @access Public
 */
router.get("/get-user/:id", async (req, res) => {
  try {
    const user = await User.findOne(
      { _id: req.params.id },
      "_id firstname lastname email phone avatar country suspended agent createdAt"
    ).lean();
    res.json(user);
  } catch (error) {
    res.status(400).json({ users: "There are no users." });
  }
  // .select(['_id', 'firstname', 'lastname', 'email', 'phone', 'avatar', 'country', 'suspended', 'agent', 'createdAt'])
});

/**
 * @route GET /api/user/bitcashier
 * @description Bitcashier API access
 * @access Public
 */
// router.post('', async(req, res) => {
//   const userId = req.params.userId;
//     const { access } = req.body;

//     try {
//         const user = await User.findByIdAndUpdate(userId, { bitcashierAPIAccess: access }, { new: true });
//         if (!user) {
//             return res.status(404).json({ error: 'User not found' });
//         }
//         return res.json({ message: `Bitcashier API access for user ${user.username} updated successfully`, user });
//     } catch (error) {
//         console.error('Error setting Bitcashier API access:', error.message);
//         return res.status(500).json({ error: 'Internal server error' });
//     }
// })

module.exports = router;
