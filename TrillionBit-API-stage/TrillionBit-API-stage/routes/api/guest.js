const express = require("express");
const path = require("path");
const fs = require("fs");
const curl = require("curl");
const WebSocket = require("ws");
const schedule = require("node-schedule");
const router = express.Router();
const axios = require("axios");
const ipLocation = require("iplocation");
const { v4: uuidv4 } = require("uuid");
const BitGoJS = require("bitgo");
const NewsletterSuscription = require("../../models/NewsletterSubcription");
const UserAnnouncement = require("../../models/UserAnnouncement");
const Blog = require("../../models/Blog");
const AppVersions = require("../../models/AppVersions");
const welcomeEmail = require("../../emails/WelcomeEmail");

const WalletController = require("../../controller/WalletController");
const WalletAddress = require("../../models/wallet/WalletAddress");
const WalletTransactions = require("../../models/wallet/WalletTransactions");
const UserDepositRequest = require("../../models/UserDepositRequest");
const UserWithdrawRequest = require("../../models/UserWithdrawRequest");
const Markets = require("../../models/trading/Markets");
const Assets = require("../../models/trading/Assets");
const CryptoHistory = require("../../models/trading/CryptoHistory");
const AssetsMarketLast = require("../../models/trading/AssetsMarketLast");
const CurrencySetting = require("../../models/trading/CurrencySetting");
const BitstampMarket = require("../../models/trading/BitstampMarket");
const FutureTicker = require("../../models/trading/FutureTicker");
const UserWallet = require("../..//models/UserWallet");
const ApiWallet = require("../../models/wallet/ApiWallet");
const FcmToken = require("../../models/FcmTokens");

const Article = require("../../models/Article");
const ArticleTags = require("../../models/ArticleTags");
const ArticleCategory = require("../../models/ArticleCategory");

const XrpController = require("../../controller/XrpController");
const TronController = require("../../controller/TronController");
const EthController = require("../../controller/EthController");

const isEmpty = require("../../validation/isEmpty");

const depositEmail = require("../../emails/DepositEmail");

const keys = require("../../config/key");
const htmlToPdf = require("html-pdf-node");
const sgMail = require("@sendgrid/mail");
const BitexSavingCoin = require("../../models/bitexSaving/BitexSavingCoin");
const BitexSaving = require("../../models/bitexSaving/BitexSaving");
const Maintenance = require("../../models/maintenance/Maintenance");
const TradingMaintenance = require("../../models/maintenance/TradingMaintenance");
const WalletMaintenance = require("../../models/maintenance/WalletMaintenance");

const BankDetail = require("../../models/BankDetail");
var admin = require("firebase-admin");

var serviceAccount = require("../../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bitex-uae.firebaseio.com",
});

const sendAdminNotification = async (title, messageBody) => {
  let fmcTokens = await FcmToken.find();
  for (fmcToken of fmcTokens) {
    const message = {
      notification: {
        title: title,
        body: messageBody,
      },
      android: {
        notification: {
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
          },
        },
      },
      token: fmcToken.token,
    };

    // Send a message to devices subscribed to the provided topic.
    admin
      .messaging()
      .send(message)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  }
};
// getToken();

let marketLasts = {};

schedule.scheduleJob("*/1 * * * *", async function () {
  // checkMarginLevel();
  let assetMarketLast = await AssetsMarketLast.findOne({
    market: "BTC",
    currency: "USD to INR",
  });
  if (assetMarketLast) {
    // sendNotification(`${assetMarketLast.market} price update`, `Latest Price: ${parseFloat(assetMarketLast.last).toFixed(2)}`);
  }
});

let lastCryptoWithdrawal = 0;
let lastCryptoDeposit = 0;
let lastFiatWithdrawal = 0;
let lastFiatDeposit = 0;

schedule.scheduleJob("*/30 * * * * *", async function () {
  // checkMarginLevel();
  let allCryptoWithdrawals = await WalletTransactions.find({
    type: "Withdrawal",
  }).sort("-date");
  let allCryptoDeposit = await WalletTransactions.find({
    type: "Deposit",
  }).sort("-date");
  let userDepositRequest = await UserDepositRequest.find().sort("-createdAt");
  let userWithdrawRequest = await UserWithdrawRequest.find().sort("-createdAt");

  if (allCryptoWithdrawals.length > 0) {
    if (
      lastCryptoWithdrawal > 0 &&
      lastCryptoWithdrawal < allCryptoWithdrawals.length
    ) {
      // sendNotification('New Crypto Withdrawal', `Amount: ${allCryptoWithdrawals[0].value} ${allCryptoWithdrawals[0].coin}`);
      lastCryptoWithdrawal = allCryptoWithdrawals.length;
    } else {
      lastCryptoWithdrawal = allCryptoWithdrawals.length;
    }
  }

  if (allCryptoDeposit.length > 0) {
    if (lastCryptoDeposit > 0 && lastCryptoDeposit < allCryptoDeposit.length) {
      // sendNotification('New Crypto Deposit', `Amount: ${allCryptoDeposit[0].value} ${allCryptoDeposit[0].coin}`);
      lastCryptoDeposit = allCryptoDeposit.length;
    } else {
      lastCryptoDeposit = allCryptoDeposit.length;
    }
  }

  if (userDepositRequest.length > 0) {
    if (lastFiatDeposit > 0 && lastFiatDeposit < userDepositRequest.length) {
      if (UserDepositRequest[0]) {
        // sendAdminNotification('New Fiat Deposit', `Amount: ${userDepositRequest[0].amount} ${UserDepositRequest[0].coin}`);
        lastFiatDeposit = userDepositRequest.length;
      }
    } else {
      lastFiatDeposit = userDepositRequest.length;
    }
  }

  if (userWithdrawRequest.length > 0) {
    if (
      lastFiatWithdrawal > 0 &&
      lastFiatWithdrawal < userWithdrawRequest.length
    ) {
      // sendAdminNotification('New Fiat Withdrawal', `Amount: ${userWithdrawRequest[0].amount} ${userWithdrawRequest[0].coin}`);
      lastFiatWithdrawal = userWithdrawRequest.length;
    } else {
      lastFiatWithdrawal = userWithdrawRequest.length;
    }
  }
  // console.log('Checking for transactions', lastFiatWithdrawal, lastFiatDeposit, lastCryptoDeposit, lastCryptoWithdrawal);
});

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * @route POST /api/guest/news_letter_subscription
 * @description Get assets update.
 * @access Public
 */
router.post("/news_letter_subscription", (req, res) => {
  NewsletterSuscription.findOne({ email: req.body.email }).then(
    (newsletterSuscription) => {
      if (newsletterSuscription) {
        res.json({
          variant: "warning",
          message: "This email already subscribed",
        });
      } else {
        let newsletterSuscription = new NewsletterSuscription();
        newsletterSuscription.email = req.body.email;
        newsletterSuscription.save();
        res.json({
          variant: "susscess",
          message: "Email subscribed successfully.",
        });
      }
    }
  );
});

/**
 * @route GET /api/guest/get_image/:imageId
 * @description Get all car images
 * @access Public
 */
router.get("/get_image/:imageId", (req, res) => {
  const filePath =
    path.join(__dirname, "../../storage/images/") + req.params.imageId;
  const defaultFile = path.join(__dirname, "../../config/userLogo.png");
  const defaultPdf = path.join(__dirname, "../../storage/images/pdf_icon.png");

  if (req.params.imageId.split(".").length > 1) {
    if (req.params.imageId.split(".")[1] === "pdf") {
      try {
        if (fs.existsSync(filePath)) {
          //file exists
          res.sendFile(filePath);
        } else {
          res.sendFile(defaultFile);
        }
      } catch (err) {
        res.sendFile(defaultFile);
      }
    } else {
      try {
        if (fs.existsSync(filePath)) {
          //file exists
          res.sendFile(filePath);
        } else {
          res.sendFile(defaultFile);
        }
      } catch (err) {
        res.sendFile(defaultFile);
      }
    }
  } else {
    res.sendFile(defaultFile);
  }
});

/**
 * @route GET /api/guest/get_key_doc/:imageId
 * @description Get all car images
 * @access Public
 */
router.get("/get_key_doc/:imageId", (req, res) => {
  if (req.params.imageId.split(".").length > 1) {
    res.sendFile(
      path.join(__dirname, "../../storage/images/") + req.params.imageId
    );
  }
});

router.get("/market_status/:market", (req, res) => {
  if (req.params.market) {
    const params = [req.params.market, 86400];

    const postParamas = {
      method: "market.status",
      params: params,
      id: 1516681174,
    };

    curl.post(
      keys.tradingURI,
      JSON.stringify(postParamas),
      {},
      async function (err, response, body) {
        if (JSON.parse(body).error !== "null") {
          if (JSON.parse(body).result) {
            return res.json(JSON.parse(body).result);
          } else {
            return res.status(400).json({
              variant: "error",
              message: "Error on fetching data, please try again.",
            });
          }
        } else {
          return res.status(400).json({
            variant: "error",
            message: "Error on fetching data, please try again.",
          });
        }
      }
    );
  } else {
    return res
      .status(400)
      .json({ variant: "error", message: "Invalid market." });
  }
});

/**
 * @route POST /api/guest/webhook_notification
 * @description Get user withdrawal requests.
 * @access Public
 */
router.post("/webhook_notification", async (req, res) => {
  if (!isEmpty(req.body)) {
    const bitgoStatus = await WalletController.getBitgoStatus();
    // Read the user authentication section to get your API access token
    const bitgo = new BitGoJS.BitGo({
      env: bitgoStatus,
      accessToken: keys.bitgoAccessKey,
    });
    const bitgoWalletIdentifier = await BitgoWalletIdentifier.find({
      name: req.body.coin.toUpperCase(),
      type: "deposit",
    });

    console.log(req.body);

    bitgo
      .coin(req.body.coin)
      .wallets()
      .get({ id: bitgoWalletIdentifier[0].identifier })
      .then(function (wallet) {
        wallet
          .getTransaction({ txHash: req.body.hash })
          .then(function (transaction) {
            // console.log(transaction);
            // if(err) {
            // 	res.json({message: 'failed'});
            // }
            if (transaction.entries.length > 0) {
              for (var i = transaction.entries.length - 1; i >= 0; i--) {
                let currentTransaction = transaction.entries[i].wallet
                  ? transaction.entries[i]
                  : false;
                console.log(currentTransaction, transaction);
                if (currentTransaction) {
                  // WalletAddress.updateMany({ "txid": req.body.hash }, { state: 'Finished' });
                  WalletAddress.findOne({
                    walletAddress: currentTransaction.address,
                  })
                    .then(async (walletAddress) => {
                      if (walletAddress) {
                        let userWallet = await UserWallet.findOne({
                          _id: walletAddress.userWalletId,
                        });
                        if (userWallet) {
                          User.findOne({ _id: userWallet.userId })
                            .then(async (user) => {
                              if (user) {
                                // depositReqest = await WalletController.depositeWallet(userWallet, (currentTransaction.value / 100000000));
                                // if (depositReqest) {
                                const params = [
                                  user.viabtcUserId,
                                  userWallet.coin,
                                  "deposit",
                                  new Date().getTime(),
                                  "" + currentTransaction.value / 100000000,
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
                                      if (
                                        JSON.parse(body).result.status ===
                                        "success"
                                      ) {
                                        userWallet.walletAmount = (
                                          parseFloat(userWallet.walletAmount) +
                                          currentTransaction.value / 100000000
                                        ).toFixed(8);

                                        WalletTransactions.find({
                                          txid: req.body.hash,
                                          userId: user._id,
                                        }).then((walletTransaction) => {
                                          if (walletTransaction.length > 0) {
                                            walletTransaction[0].confirmations =
                                              transaction.confirmations;
                                            walletTransaction[0].state =
                                              "Finished";
                                            walletTransaction[0].save();
                                          } else {
                                            if (
                                              currentTransaction.value /
                                                100000000 >
                                              0
                                            ) {
                                              const walletTransactions =
                                                new WalletTransactions({
                                                  userId: user._id,
                                                  txid: req.body.hash,
                                                  confirmations:
                                                    transaction.confirmations,
                                                  type: "Deposit",
                                                  value: parseFloat(
                                                    (
                                                      currentTransaction.value /
                                                      100000000
                                                    ).toFixed(8)
                                                  ),
                                                  fees: parseFloat(
                                                    (
                                                      transaction.fee /
                                                      100000000
                                                    ).toFixed(8)
                                                  ),
                                                  coin: userWallet.coin,
                                                  state: "Finished",
                                                });
                                              walletTransactions.save();
                                              userWallet.save();

                                              let currentDate = new Date(
                                                `${walletTransactions.date}`
                                              );
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
                                                walletTransactions._id,
                                                (
                                                  currentTransaction.value /
                                                  100000000
                                                ).toFixed(8),
                                                "0.00",
                                                `${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
                                                walletTransactions.coin,
                                                user.firstname +
                                                  " " +
                                                  user.lastname,
                                                walletTransactions.note
                                                  ? walletTransactions.note
                                                  : "",
                                                "Confirmed"
                                              );

                                              const mailOptions = {
                                                from: {
                                                  name: "Trillionbit",
                                                  email:
                                                    "noreply@trillionbit.com",
                                                }, // sender address
                                                to: user.email, // list of receivers
                                                subject:
                                                  currentTransaction.coinName.toUpperCase() +
                                                  " Deposit", // Subject line
                                                html: emailBody, // plain text body
                                              };

                                              sgMail.send(mailOptions);
                                            }
                                          }
                                        });
                                      } else {
                                        //
                                      }
                                    } else {
                                      //
                                    }
                                  }
                                );
                                // }

                                // console.log({ message: 'Wallet balance updated'});
                                return res.json({});

                                // const params = [
                                //   parseInt(userWallet.userId.replace(/\D/g,'')),
                                //   userWallet.coin,
                                //   'deposit',
                                //   new Date().getTime(),
                                //   (currentTransaction.value / 100000000)+'',
                                //   {}
                                // ];

                                // const postParamas = {
                                //   method: 'balance.update',
                                //   params: params,
                                //   id: 1516681174
                                // }

                                // curl.post(keys.tradingURI, JSON.stringify(postParamas), {}, async function(err, response, body) {
                                //   if(JSON.parse(body).result.status === 'success'){
                                //     await WalletTransactions.findOne({ txid: req.body.hash })
                                //       .then(walletTransaction => {
                                //         if(walletTransaction) {
                                //           walletTransaction.confirmations = transaction.confirmations;
                                //           walletTransaction.save();
                                //         } else {
                                //           const walletTransactions = new WalletTransactions({
                                //             userId: user._id,
                                //             txid: req.body.hash,
                                //             confirmations: transaction.confirmations,
                                //             type: 'Deposit',
                                //             value: (currentTransaction.value / 100000000).toFixed(8),
                                //             fees: (transaction.fee / 100000000).toFixed(8),
                                //             coin: userWallet.coin,
                                //             state: '',
                                //           })
                                //           walletTransactions.save();
                                //         }
                                //       });

                                //       let emailBody = '<p>Hi '+ user.firstname +' ' + user.lastname + ',</p>';
                                //       emailBody += '<p>You have just received ' + (currentTransaction.value / 100000000).toFixed(8) + ' '+ currentTransaction.coinName +'</p>';
                                //       emailBody += '<p>Please login to your account to check more details.</p>';

                                //       const mailOptions = {
                                //         from: 'admin@bitex.com', // sender address
                                //         to: user.email, // list of receivers
                                //         subject: 'Bitexuae: '+ currentTransaction.coinName +' Deposit', // Subject line
                                //         html: emailBody// plain text body
                                //       };

                                //       sgMail.send(mailOptions);

                                //       console.log({ message: 'Wallet balance updated'});
                                //       return true;
                                //     } else {
                                //       console.log({message: 'Something went wrong'});
                                //       return true;
                                //     };
                                // });
                              } else {
                                // console.log({message: 'User not found'});
                                return res.json({});
                              }
                            })
                            .catch((err) => {
                              // console.log(err);
                              return res.json({});
                            });
                        } else {
                          let apiWallet = await ApiWallet.findOne({
                            _id: walletAddress.userWalletId,
                          });
                          if (apiWallet) {
                            User.findOne({ _id: apiWallet.userId })
                              .then(async (user) => {
                                if (user) {
                                  // depositReqest = await WalletController.depositeWallet(apiWallet, (currentTransaction.value / 100000000));
                                  // if (depositReqest) {
                                  apiWallet.walletAmount = (
                                    parseFloat(apiWallet.walletAmount) +
                                    currentTransaction.value / 100000000
                                  ).toFixed(8);

                                  WalletTransactions.find({
                                    txid: req.body.hash,
                                    userId: user._id,
                                  }).then((walletTransaction) => {
                                    if (walletTransaction.length > 0) {
                                      walletTransaction[0].confirmations =
                                        transaction.confirmations;
                                      walletTransaction[0].state = "Finished";
                                      walletTransaction[0].save();
                                    } else {
                                      if (
                                        currentTransaction.value / 100000000 >
                                        0
                                      ) {
                                        const walletTransactions =
                                          new WalletTransactions({
                                            userId: user._id,
                                            txid: req.body.hash,
                                            confirmations:
                                              transaction.confirmations,
                                            type: "Deposit",
                                            value: parseFloat(
                                              (
                                                currentTransaction.value /
                                                100000000
                                              ).toFixed(8)
                                            ),
                                            fees: parseFloat(
                                              (
                                                transaction.fee / 100000000
                                              ).toFixed(8)
                                            ),
                                            coin: apiWallet.coin,
                                            state: "Finished",
                                          });
                                        walletTransactions.save();
                                        apiWallet.save();

                                        let currentDate = new Date(
                                          `${walletTransactions.date}`
                                        );
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
                                          walletTransactions._id,
                                          (
                                            currentTransaction.value / 100000000
                                          ).toFixed(8),
                                          "0.00",
                                          `${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
                                          walletTransactions.coin,
                                          user.firstname + " " + user.lastname,
                                          walletTransactions.note
                                            ? walletTransactions.note
                                            : "",
                                          "Confirmed"
                                        );

                                        const mailOptions = {
                                          from: {
                                            name: "Trillionbit",
                                            email: "noreply@trillionbit.com",
                                          }, // sender address
                                          to: user.email, // list of receivers
                                          subject:
                                            currentTransaction.coinName.toUpperCase() +
                                            " Deposit", // Subject line
                                          html: emailBody, // plain text body
                                        };

                                        sgMail.send(mailOptions);
                                      }
                                    }
                                  });
                                  // }

                                  // console.log({ message: 'Wallet balance updated'});
                                  return res.json({});
                                } else {
                                  // console.log({message: 'User not found'});
                                  return res.json({});
                                }
                              })
                              .catch((err) => {
                                // console.log(err);
                                return res.json({});
                              });
                          } else {
                            // console.log({message: 'No wallet found'});
                            return res.json({});
                          }
                        }
                      } else {
                        // console.log({message: 'No wallet address found'});
                        return res.json({});
                      }
                    })
                    .catch((err) => {
                      // console.log(err);
                      return res.json({});
                    });
                }
              }
            } else {
              // console.log({message: 'No trasactions found'});
              return res.json({});
            }
          });
      });
  } else {
    // console.log(req);
    return res.json({});
  }
  res.json({});
});

function connectXrpWebsocket() {
  const ws = new WebSocket("wss://s1.ripple.com");

  ws.on("open", function open() {
    // console.log("XRP transaction socket connected!")
    const command = {
      command: "subscribe",
      accounts: ["rPxwYPKAn33oRjwzxuzQi6y3ikWyBEtJhE"],
    };
    ws.send(JSON.stringify(command));
  });

  ws.on("message", async function incoming(data) {
    // console.log('Got message from XRP server');
    const jsonData = JSON.parse(data);

    if (jsonData.engine_result === "tesSUCCESS") {
      // console.log(jsonData.transaction.DestinationTag, 'destination tag', jsonData);
      if (jsonData.transaction.DestinationTag) {
        const userWallet = await UserWallet.findOne({
          destinationTag: jsonData.transaction.DestinationTag,
        });
        const apiWallet = await ApiWallet.findOne({
          destinationTag: jsonData.transaction.DestinationTag,
        });
        if (userWallet) {
          User.findOne({ _id: userWallet.userId }).then((user) => {
            if (user) {
              const params = [
                user.viabtcUserId,
                userWallet.coin,
                "deposit",
                new Date().getTime(),
                "" + parseFloat(jsonData.meta.delivered_amount) / 1000000,
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
                      userWallet.walletAmount =
                        parseFloat(userWallet.walletAmount) +
                        parseFloat(jsonData.meta.delivered_amount) / 1000000;

                      WalletTransactions.find({
                        txid: jsonData.transaction.hash,
                        userId: userWallet.userId,
                      }).then((walletTransaction) => {
                        if (walletTransaction.length > 0) {
                          //
                        } else {
                          const walletTransactions = new WalletTransactions({
                            userId: user._id,
                            txid: jsonData.transaction.hash,
                            type: "Deposit",
                            value:
                              parseFloat(jsonData.meta.delivered_amount) /
                              1000000,
                            fees:
                              parseFloat(jsonData.transaction.fee) / 1000000,
                            coin: userWallet.coin,
                            state: "Finished",
                          });
                          walletTransactions.save();
                          userWallet.save();

                          let currentDate = new Date(
                            `${walletTransactions.date}`
                          );
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
                            walletTransactions._id,
                            parseFloat(jsonData.meta.delivered_amount) /
                              1000000,
                            "0.00",
                            `${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
                            walletTransactions.coin,
                            user.firstname + " " + user.lastname,
                            walletTransactions.note
                              ? walletTransactions.note
                              : "",
                            "Confirmed"
                          );

                          const mailOptions = {
                            from: {
                              name: "Trillionbit",
                              email: "noreply@trillionbit.com",
                            }, // sender address
                            to: user.email, // list of receivers
                            subject: "Bitex: " + userWallet.coin + " Deposit", // Subject line
                            html: emailBody, // plain text body
                          };

                          sgMail.send(mailOptions);
                        }
                      });
                    } else {
                      //
                    }
                  } else {
                    //
                  }
                }
              );
            }
          });
        }

        if (apiWallet) {
          User.findOne({ _id: apiWallet.userId }).then((user) => {
            if (user) {
              apiWallet.walletAmount =
                parseFloat(apiWallet.walletAmount) +
                parseFloat(jsonData.meta.delivered_amount) / 1000000;

              WalletTransactions.find({
                txid: jsonData.transaction.hash,
                userId: apiWallet.userId,
              }).then((walletTransaction) => {
                if (walletTransaction.length > 0) {
                  //
                } else {
                  const walletTransactions = new WalletTransactions({
                    userId: user._id,
                    txid: jsonData.transaction.hash,
                    type: "Deposit",
                    value: parseFloat(jsonData.meta.delivered_amount) / 1000000,
                    fees: parseFloat(jsonData.transaction.fee) / 1000000,
                    coin: apiWallet.coin,
                    state: "Finished",
                  });
                  walletTransactions.save();
                  apiWallet.save();

                  let currentDate = new Date(`${walletTransactions.date}`);
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
                    walletTransactions._id,
                    parseFloat(jsonData.meta.delivered_amount) / 1000000,
                    "0.00",
                    `${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`,
                    walletTransactions.coin,
                    user.firstname + " " + user.lastname,
                    walletTransactions.note ? walletTransactions.note : "",
                    "Confirmed"
                  );

                  const mailOptions = {
                    from: {
                      name: "Trillionbit",
                      email: "noreply@trillionbit.com",
                    }, // sender address
                    to: user.email, // list of receivers
                    subject: "Bitex: " + apiWallet.coin + " Deposit", // Subject line
                    html: emailBody, // plain text body
                  };

                  sgMail.send(mailOptions);
                }
              });
            }
          });
        }
      } else {
        const walletTransactions = new WalletTransactions({
          userId: "pfqv1owzsstp",
          txid: jsonData.transaction.hash,
          type: "Deposit",
          value: parseFloat(jsonData.meta.delivered_amount) / 1000000,
          fees: parseFloat(jsonData.transaction.fee) / 1000000,
          coin: "XRP",
          state: "Finished",
        });
        walletTransactions.save();
      }
    }
  });

  ws.on("close", function incoming(data) {
    // console.log('XRP transaction socket Closed... Reconnecting...');
    setTimeout(function () {
      connectXrpWebsocket();
    }, 1000);
  });
}

connectXrpWebsocket();

/**
 * @route GET /api/guest/get_userannouncement
 * @description Get new announcement
 * @access Public
 */
router.get("/get_userannouncement", (req, res) => {
  UserAnnouncement.find({ newAnnounce: true })
    .then(async (userAnnouncements) => {
      if (userAnnouncements.length > 0) {
        await UserAnnouncement.updateMany(
          { newAnnounce: true },
          { newAnnounce: false }
        );
        res.json(userAnnouncements);
      } else {
        res.json([]);
      }
    })
    .catch((err) => {
      res.json([]);
    });
});

/**
 * @route GET /api/guest/market/lists
 * @description Get market list.
 * @access Public
 */
router.get("/market/lists", (req, res) => {
  Markets.find({ active: true })
    .sort({ priority: -1 })
    .then((markets) => {
      res.json(markets);
    })
    .catch((err) => {
      res.status(400).json({ variant: "error", message: "No markets found" });
    });
});

/**
 * @route GET /api/guest/get_future_tikers
 * @description Get all market last values.
 * @access Public
 */
router.get("/get_future_tikers", async (req, res) => {
  FutureTicker.find()
    .then((futureTickers) => {
      res.json(futureTickers);
    })
    .catch((err) => {
      res.json([]);
    });
});

router.post("/send_btx", async (req, res) => {
  let sendAmount = parseInt(req.body.amount);

  const sendFromAd = await TronController.sendFromAdminBtx(
    "TJncDX2q7h5YippB4iNtCwTxBiGpVGiXJa",
    sendAmount
  );

  console.log(sendFromAd);
  if (sendFromAd) {
    res.json({
      transfer: {
        txid: sendFromAd,
        fee: 0.0,
        state: "signed",
      },
    });
  } else {
    res.status(400).json({ variant: "error", message: "No markets found" });
  }
});

router.post("/check_user", async (req, res) => {
  let email = req.body.email;
  let phone = req.body.phone;

  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    res.json({
      status: true,
      new_user: false,
      otp_required: false,
      message: "User exists",
    });
  } else {
    const newUser = new User({
      // firstname: req.body.firstname,
      // lastname: req.body.lastname,
      email: req.body.email,
      phone: req.body.phone,
      // country: req.body.country,
      // dateOfBirth: req.body.dateOfBirth,
      // agent: req.body.agent ? req.body.agent : false,
      // avatar,
      // password: req.body.password,
    });
    newUser.save();

    const emailVerificationCode = Math.floor(100000 + Math.random() * 900000);

    const newUserProfile = new UserProfile({
      userId: newUser._id,
      emailVerificationCode: emailVerificationCode,
    });
    newUserProfile.save();
    let emailBody = welcomeEmail(
      emailVerificationCode,
      "https://www.trillionbit.com"
    );
    // emailBody += '<p>Verification Code: ' + emailVerificationCode + '</p>';

    const mailOptions = {
      from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
      to: req.body.email, // list of receivers
      subject: "Verify your account", // Subject line
      html: emailBody, // plain text body
    };

    sgMail.send(mailOptions);

    res.json({
      status: true,
      new_user: true,
      otp_required: true,
      otp_sent: true,
      message: "New user created",
    });
  }
});

router.post("/verify_user_otp", async (req, res) => {
  let email = req.body.email;
  let phone = req.body.phone;
  let verifyCode = req.body.emailCode;
  verifyCode = parseInt(verifyCode);

  const existingUser = await User.findOne({ email: req.body.email });
  const userProfile = await UserProfile.findOne({ userId: existingUser.id });

  if (userProfile.emailVerificationCode === verifyCode) {
    res.json({
      status: true,
      verified: true,
      message: "Email verified",
      kyc_link: "",
    });
  } else {
    res.json({ status: true, verified: false, message: "Invalid code" });
  }
});

/**
 * @route GET /api/guest/get_final_market_last
 * @description Get all market last values.
 * @access Public
 */
router.get("/get_final_market_last", async (req, res) => {
  BitstampMarket.find()
    .then((assetsMarketLasts) => {
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
        if (assetsMarketLasts[key].currency === "USD to USD") {
          assetMarketLast[assetsMarketLasts[key].market + "USD"] =
            assetsMarketLasts[key];
        }
      }
      res.json(assetMarketLast);
    })
    .catch((err) => {
      res.json([]);
    });
});

/**
 * @route GET /api/guest/get_market_last
 * @description Get all market last values.
 * @access Public
 */
router.get("/get_market_last", async (req, res) => {
  AssetsMarketLast.find()
    .then((assetsMarketLasts) => {
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
        if (assetsMarketLasts[key].currency === "USD to USD") {
          assetMarketLast[assetsMarketLasts[key].market + "USD"] =
            assetsMarketLasts[key];
        }
        if (assetsMarketLasts[key].currency === "USD to USDT") {
          assetMarketLast[assetsMarketLasts[key].market + "USDT"] =
            assetsMarketLasts[key];
        }
      }
      // assetMarketLast['BTXAED'] = {
      //     "market" : "BTX",
      //     "currency" : "USD to AED",
      //     "high" : "0.5",
      //     "low" : "0.5",
      //     "last" : "0.5",
      //     "open" : "0.5",
      //     "volume" : "20000000",
      //     "ask" : "0.5",
      //     "bid" : "0.5",
      // };
      // assetMarketLast['BTXINR'] = {
      //     "market" : "BTX",
      //     "currency" : "USD to INR",
      //     "high" : "10",
      //     "low" : "10",
      //     "last" : "10",
      //     "open" : "10",
      //     "volume" : "20000000",
      //     "ask" : "10",
      //     "bid" : "10",
      // };
      // assetMarketLast['BTXUSDT'] = {
      //   "market" : "BTX",
      //   "currency" : "USD to USDT",
      //   "high" : "0.129",
      //   "low" : "0.129",
      //   "last" : "0.129",
      //   "open" : "0.129",
      //   "volume" : "20000000",
      //   "ask" : "0.129",
      //   "bid" : "0.129",
      // };
      res.json(assetMarketLast);
    })
    .catch((err) => {
      res.json([]);
    });
});

/**
 * @route GET /api/guest/crypto_history
 * @description Get all user last five orders.
 * @access Public
 */
router.get("/crypto_history", async (req, res) => {
  let market_graph = {};
  let currencySettings = await CurrencySetting.find({});

  for (currencySetting of currencySettings) {
    let cryptoHistories = await CryptoHistory.find({});

    for (cryptoHistory of cryptoHistories) {
      if (isEmpty(market_graph[currencySetting.currency])) {
        market_graph[currencySetting.currency] = {};
      } else {
        market_graph[currencySetting.currency] =
          market_graph[currencySetting.currency];
      }
      // cryptoHistoryObj[cryptoHistory.name] = cryptoHistory.history;
      if (currencySetting.name === cryptoHistory.currency) {
        market_graph[currencySetting.currency][cryptoHistory.name] =
          cryptoHistory.history;
      }
    }
  }

  res.json(market_graph);
});

/**
 * @route Get /api/guest/assets/withdraw_fee/:coin
 * @description Get assets list.
 * @access Public
 */
router.get("/assets/withdraw_fee/:coin", async (req, res) => {
  const tradingAssets = await Assets.findOne({ name: req.params.coin });
  if (tradingAssets) {
    res.json(tradingAssets.withdrawalFee ? tradingAssets.withdrawalFee : 0);
  } else {
    res.json(0);
  }
});

/**
 * @route GET /api/guest/get_app_versions/:osType
 * @description Get all blogs
 * @access Public
 */
router.get("/get_app_versions/:osType", (req, res) => {
  AppVersions.findOne({ name: req.params.osType })
    .then(async (appversons) => {
      return res.json(appversons);
    })
    .catch((err) => {
      return {};
    });
});

/**
 * @route GET /api/guest/all_blogs
 * @description Get all blogs
 * @access Public
 */
router.get("/all_blogs", (req, res) => {
  Blog.find()
    .sort("-date")
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
 * @route GET /api/guest/currency_price/:currency
 * @description Get currency details
 * @access Public
 */
router.get("/currency_price/:currency", (req, res) => {
  CurrencySetting.findOne({ currency: req.params.currency })
    .then(async (currency) => {
      let resCurrency = {
        name: currency.currency,
        value: parseFloat(currency.value),
        premium: parseFloat(currency.premium),
        discount: parseFloat(currency.discount),
        spread: parseFloat(currency.spread),
      };
      return res.json(resCurrency);
    })
    .catch((err) => {
      return res.status(400).json({
        variant: "error",
        message: "Something went wrong please try again.",
      });
    });
});

/**
 * @route GET /api/guest/last_three_blogs/:blogId
 * @description Get all blogs
 * @access Public
 */
router.get("/last_three_blogs/:blogName", (req, res) => {
  Blog.find({ name: { $ne: req.params.blogName.replace(/_/g, " ") } })
    .limit(3)
    .sort("-date")
    .then(async (blogs) => {
      return res.json(blogs);
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
 * @route GET /api/guest/get_blog_details/:blogId
 * @description Get blog details
 * @access Public
 */
router.get("/get_blog_details/:blogName", (req, res) => {
  Blog.findOne({ name: req.params.blogName.replace(/_/g, " ") })
    .then(async (blog) => {
      if (blog) {
        return res.json(blog);
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
 * @route POST /api/guest/get_ip_location
 * @description Get IP Location details
 * @access Public
 */
router.post("/get_ip_location", async (req, res) => {
  try {
    const ip_location = await axios.get(
      `http://api.ipstack.com/${req.body.userIp}?access_key=3d0b5f2c219ff706e5066383c8338355&output=json`
    );
    // const ip_location = await axios.get(`https://ipapi.co/${req.body.userIp}/json`)
    // const ipLocationData = await ipLocation(req.body.userIp);
    res.json(ip_location.data);
  } catch {
    res.json({
      country_code: "AE",
    });
  }
});

/**
 * @route GET /api/guest/last_three_blogs/:blogId
 * @description Get all blogs
 * @access Public
 */
// router.get('/last_three_articles/:blogName', (req, res) => {
//   Article.find({ name: {$ne: req.params.blogName.replace(/_/g, " ")}})
//   .populate({
//       path: 'articleTags',
//     }).populate({
//       path: 'category',
//     })
//   .limit(3)
//   .sort('-updatedAt')
//   .then(async articles => {
//   return res.json(articles);
//   })
//   .catch(err => {
//   console.log(err);
//   return res.status(400).json({variant: 'error', message: 'Something went wrong please try again.'});
//   })
// });

/**
 * @route GET /api/guest/last_three_blogs/:blogId
 * @description Get all blogs
 * @access Public
 */
router.get("/last_three_article/:blogName", (req, res) => {
  Article.findOne({ slug: req.params.blogName })
    .then(async (articles) => {
      let queryOptions = { slug: { $ne: req.params.blogName } };
      if (articles.articleTags && articles.articleTags.length) {
        queryOptions["articleTags"] = { $in: articles.articleTags };
      }
      if (articles.category) {
        queryOptions["category"] = `${articles.category}`;
      }
      Article.find(queryOptions)
        .limit(3)
        .populate({
          path: "articleTags",
        })
        .populate({
          path: "category",
        })
        .then((articl) => {
          return res.json(articl);
        })
        .catch((err) => {
          return res.status(400).json({
            variant: "error",
            err: err,
            message: "Something went wrong please try again.",
          });
        });
    })
    .catch((err) => {
      return res.status(400).json({
        variant: "error",
        err: err,
        message: "Something went wrong please try again.",
      });
    });
});

/**
 * @route GET /api/guest/get_blog_details/:blogId,
 * @description Get blog details
 * @access Public
 */
router.get("/get_article_details/:blogName", (req, res) => {
  Article.findOne({ slug: req.params.blogName })
    .populate({
      path: "articleTags",
    })
    .populate({
      path: "category",
    })
    .then(async (article) => {
      if (article) {
        return res.json(article);
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
 * @route GET /api/guest/get-articles
 * @description GET all articles
 * @access Public
 */
router.get("/get-articles", (req, res) => {
  let type = req.query.type ? req.query.type : "article";
  let queryOptions = { type: type };
  let perPage = req.query.rows ? req.query.rows : 10;
  let page = req.query.page ? req.query.page : 1;
  if (req.query.search) {
    let searchText = req.query.search;
    queryOptions = {
      $or: [
        {
          name: {
            $regex: searchText,
            $options: "i",
          },
        },
      ],
    };
  }
  let sort = {};
  if (req.query.sortColumn) {
    sort[req.query.sortColumn] = req.query.sort === "asc" ? 1 : -1;
  }

  if (req.query.filters) {
    // console.log("req.query.filters", req.query.filters);
    // console.log("req.query.filters", JSON.parse(req.query.filters));
    const filters = JSON.parse(req.query.filters);
    if (filters.articleTags && filters.articleTags.length) {
      queryOptions["articleTags"] = { $all: filters.articleTags };
    }
    if (filters.articleCategory) {
      queryOptions["category"] = filters.articleCategory;
    }
    if (filters.articleDifficultyLevel) {
      queryOptions["difficultyLevel"] = filters.articleDifficultyLevel;
    }
    if (filters.articleReadingTime && filters.articleReadingTime.length) {
      queryOptions["readingTime"] = {
        $lte: filters.articleReadingTime[1],
        $gte: filters.articleReadingTime[0],
      };
    }
  }

  Article.paginate(queryOptions, {
    page: parseInt(page),
    limit: parseInt(perPage),
    populate: ["articleTags", "category"],
    sort: sort,
  })
    // Article
    // .find(queryOptions)
    // .sort(sort)
    // .populate({
    //   path: 'articleTags',
    // })
    // .populate({
    //   path: 'category',
    // })
    .then((article) => {
      return res.json(article);
    })
    .catch((err) => {
      return res.status(400).json({
        variant: "error",
        message: "Something went wrong please try again.",
      });
    });
});

/**
 * @route GET /api/admin/article-categories/get_article_tags
 * @description Get all article-categories
 * @access Public
 */
router.get("/get_active_article_categories", async (req, res) => {
  const articleCategory = await ArticleCategory.find({ active: true });

  if (articleCategory.length > 0) {
    res.json(articleCategory);
  } else {
    res.status(400).json({ variant: "error", message: "No Categories found" });
  }
});

/**
 * @route GET /api/guest/get_active_markets
 * @description Get all article-categories
 * @access Public
 */
router.get("/get_active_markets", async (req, res) => {
  const activeMarkets = await Markets.find({ active: true });

  if (activeMarkets.length > 0) {
    res.json(activeMarkets);
  } else {
    res.json([]);
  }
});

/**
 * @route GET /api/admin/article-tags/get_article_tags
 * @description Get all article-tags
 * @access Public
 */
router.get("/get_active_article_tags", async (req, res) => {
  const articleTags = await ArticleTags.find({ active: true });

  if (articleTags.length > 0) {
    res.json(articleTags);
  } else {
    res.status(400).json({ variant: "error", message: "No Tags found" });
  }
});

/**
 * @route POST /api/admin/article/save_image
 * @description Store image
 * @access Public
 */
router.post("/save_image", async (req, res) => {
  let currentFilePath;
  let myfile;
  for (file of req.files) {
    let uniqueImageId = uuidv4();
    let currentFile = file;
    // if (currentFile.fieldname === 'file') {
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
        res.json({
          variant: "error",
          fileName: myfile,
          message: "something went to wrong.",
        });
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
            res.json({ variant: "error", message: "something went to wrong." });
          }
          fs.close(fd, function () {
            res.json({
              uploaded: true,
              url: "https://api.bitex.com/api/guest/get_image/" + myfile,
            });
          });
        }
      );
    });
    // }
  }
});

/**
 * @route GET /api/guest/get_category_wise_articles,
 * @description Get blog Category Wise
 * @access Public
 */
router.get("/get_feature_article", async (req, res) => {
  const article = await Article.find({ featureArticle: true })
    .populate({
      path: "articleTags",
    })
    .populate({
      path: "category",
    })
    .populate({
      path: "articleTags",
    })
    .populate({
      path: "category",
    });
  if (article.length > 0) {
    res.json(article);
  } else {
    res
      .status(400)
      .json({ variant: "error", message: "No feature Article found" });
  }
});

/**
 * @route GET /api/guest/get_category_wise_articles,
 * @description Get blog Category Wise
 * @access Public
 */
router.get("/get_category_wise_articles", async (req, res) => {
  const articleCategory = await ArticleCategory.find({ active: true });
  if (articleCategory.length > 0) {
    let collectionData = [];
    for (const category of articleCategory) {
      let obj = {};
      obj["name"] = category.name;
      obj["_id"] = category._id;
      obj["articles"] = await Article.find({ category: category._id })
        .populate({
          path: "articleTags",
        })
        .populate({
          path: "category",
        })
        .limit(3);
      collectionData.push(obj);
    }
    return res.json(collectionData);
  } else {
    return res.status(400).json({
      variant: "error",
      message: "Something went wrong please try again.",
    });
  }

  // ArticleCategory.aggregate([
  //   {
  //     $lookup: {
  //       from: 'article',
  //       localField: '_id',
  //       foreignField: 'category',
  //       as: 'article'
  //   }
  //   }]).exec()
  //   .then(article => {
  //     console.log("get_category_wise_articles article:", article);
  //     return res.json(article);
  //   })
  //   .catch(err => {
  //     console.log("get_category_wise_articles err :", err);

  //     return res.status(400).json({variant: 'error', message: 'Something went wrong please try again.'});
  //   })
});

/**
 * @route GET /api/guest/same-next-article/:blogId
 * @description Get all blogs
 * @access Public
 */
router.get("/same-next-article/:blogName", (req, res) => {
  Article.findOne({ slug: req.params.blogName })
    .then(async (articles) => {
      let queryOptions = { slug: { $ne: req.params.blogName } };
      if (articles.articleTags && articles.articleTags.length) {
        queryOptions["articleTags"] = { $in: articles.articleTags };
      }
      if (articles.category) {
        queryOptions["category"] = `${articles.category}`;
      }
      Article.find(queryOptions)
        .populate({
          path: "articleTags",
        })
        .populate({
          path: "category",
        })
        .then((articl) => {
          return res.json(articl);
        })
        .catch((err) => {
          return res.status(400).json({
            variant: "error",
            err: err,
            message: "Something went wrong please try again.",
          });
        });
    })
    .catch((err) => {
      return res.status(400).json({
        variant: "error",
        err: err,
        message: "Something went wrong please try again.",
      });
    });
});

router.post("/blog-pdf-download", async (req, res) => {
  const html = req.body.html;
  let options = {
    format: "A4",
  };
  let file = { content: html };
  htmlToPdf.generatePdf(file, options).then(async (pdfBuffer) => {
    const base64PDF = pdfBuffer.toString("base64");
    res.json(base64PDF);
  });
});

router.post("/send_xrp_partial", async (req, res) => {
  const recipientAddress = req.body.address;
  const usdAmount = req.body.usd_amount;
  const destinationTag = req.body.tag;
  const amount = 1000;

  const xrpTransfer = await XrpController.sendPartially(
    "abc",
    recipientAddress,
    amount,
    destinationTag,
    usdAmount
  );

  res.json(xrpTransfer);
});

/**
 * @route GET /api/guest/get-active-bitex-saving-coins
 * @description Get all get-active-bitex-saving-coins
 * @access Public
 */
router.get("/get-active-bitex-saving-coins", async (req, res) => {
  const bitexSavingCoin = await BitexSavingCoin.find({ active: true });

  if (bitexSavingCoin.length > 0) {
    res.json(bitexSavingCoin);
  } else {
    res.status(400).json({ variant: "error", message: "No coins found" });
  }
});

router.post("/get-bitex-land-amount", async (req, res) => {
  const bitexSaving = await BitexSaving.findOne({ coin: "USD" });
  res.json({ variant: "success", data: bitexSaving });
});

const startQue = async (addresses, amount) => {
  let sentBtx = [];
  for (address of addresses) {
    const sendBtx = await TronController.sendAirBtx(
      "",
      address,
      parseInt(amount)
    );
    if (sendBtx) {
      sentBtx.push(`${address}: Success`);
    } else {
      sentBtx.push(`${address}: Failed`);
    }
  }
  return sentBtx;
};

router.post("/trx_air_drop", async (req, res) => {
  const addresses = req.body.addresses.split(",");
  const amount = req.body.amount;

  let response = startQue(addresses, amount);
  response.then((respon) => {
    res.json({ status: "success", message: respon });
  });
});

router.post("/send_btx_for_eth", async (req, res) => {
  const to = req.body.toAddress;
  const from = keys.btxFromAddress;
  const amount = req.body.amount;
  const privateKey = keys.btxPrivateKey;
  const contract = keys.btxContractAddress;
  const btxWalletTransactions = await EthController.sendBtx(
    privateKey,
    from,
    to,
    amount,
    contract
  );

  if (btxWalletTransactions) {
    res.json({
      variant: "success",
      message: `TxID: ${btxWalletTransactions.txid}`,
    });
  } else {
    res.status(400).json({
      variant: "error",
      message:
        "Faield to transfer BTX to your wallet please contact to the support immadiately!",
    });
  }
});

/**
 * @route POST /api/guest/store_admin_fmc_token
 * @description Store fmc token of user
 * @access Public
 */
router.post("/store_admin_fmc_token", async (req, res) => {
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
 * @route POST /api/guest/get_market_data
 * @description Store fmc token of user
 * @access Public
 */
router.post("/get_market_data", async (req, res) => {
  const params = [req.body.market, 86400];

  const postParamas = {
    method: "market.status",
    params: params,
    id: 1516681174,
  };

  curl.post(
    keys.tradingURI,
    JSON.stringify(postParamas),
    {},
    async function (err, response, body) {
      if (err) {
        res.json({});
      } else {
        markets = JSON.parse(body).result;
        res.json(markets);
      }
    }
  );
});

router.get("/get-active-wallet-maintenance", async (req, res) => {
  const data = await WalletMaintenance.find(
    {
      active: true,
      $or: [
        { "maintenance.withdrawal": true },

        { "maintenance.deposit": true },
      ],
    },
    "fiat name maintenance"
  ).lean();

  if (data.length > 0) {
    res.json(data);
  } else {
    res.status(400).json({
      variant: "error",
      message: "No data found",
    });
  }
});

router.get("/get-active-trading-maintenance", async (req, res) => {
  const data = await TradingMaintenance.find(
    {
      active: true,
      maintenance: true,
    },
    "fiatName name"
  ).lean();

  if (data.length > 0) {
    res.json(data);
  } else {
    res.status(400).json({
      variant: "error",
      message: "No data found",
    });
  }
});

router.get("/get-bank-details", async (req, res) => {
  const data = await BankDetail.find().lean();
  if (data.length > 0) {
    res.json(data);
  } else {
    res.status(400).json({
      variant: "error",
      message: "No data found",
    });
  }
});

router.get("/get-web-app-maintenance", async (req, res) => {
  const data = await Maintenance.findOne({ type: "WEB APP" }).lean();
  if (data) {
    res.json(data);
  } else {
    res.status(400).json({
      variant: "error",
      message: "No data found",
    });
  }
});

module.exports = router;
