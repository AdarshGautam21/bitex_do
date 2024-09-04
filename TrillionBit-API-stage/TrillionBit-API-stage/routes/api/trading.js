const curl = require("curl");
const axios = require("axios");
const express = require("express");
const schedule = require("node-schedule");
const { v4: uuidv4 } = require("uuid");
const keys = require("../../config/key");
const WebSocket = require("ws");
const Queue = require("better-queue");

const Hb = require("hb-sdk");
const Referral = require("../../models/referral/Referral");
const ReferralSetting = require("../../models/referral/ReferralSetting");
const ReferralTree = require("../../models/referral/ReferralTree");
const UserWallet = require("../../models/UserWallet");
const Order = require("../../models/trading/Order");
const Assets = require("../../models/trading/Assets");
const Markets = require("../../models/trading/Markets");
const CurrencySetting = require("../../models/trading/CurrencySetting");
const CryptoHistory = require("../../models/trading/CryptoHistory");
const AssetsMarketLast = require("../../models/trading/AssetsMarketLast");
const BitstampMarket = require("../../models/trading/BitstampMarket");
const WalletTransactions = require("../../models/wallet/WalletTransactions");
const User = require("../../models/User");
const UserProfile = require("../../models/UserProfile");

const AgentUsers = require("../../models/agent/AgentUsers");
const TraderLevel = require("../../models/trading/TraderLevel");
const InrTraderLevel = require("../../models/trading/InrTraderLevel");
const AgentTraderLevel = require("../../models/agent/AgentTraderLevel");
const SubAgentTraderLevel = require("../../models/agent/SubAgentTraderLevel");
const AgentClientTraderLevel = require("../../models/agent/AgentClientTraderLevel");
const UserMarginWallet = require("../../models/margin/UserMarginWallet");
const UserOpenMargin = require("../../models/margin/UserOpenMargin");
const UserBorrowHolding = require("../../models/margin/UserBorrowHolding");
const FutureTicker = require("../../models/trading/FutureTicker");
const OrderbookStream = require("../../models/trading/OrderbookStream");

const WalletController = require("../../controller/WalletController");

const validateMarketOrderInput = require("../../validation/trading/marketOrder");
const validateLimitOrderInput = require("../../validation/trading/limitOrder");
const validateWalletDepositRequest = require("../../validation/user/walletDepositRequest");
const { parse } = require("basic-auth");

const sgMail = require("@sendgrid/mail");
const { isEmpty } = require("lodash");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const ippopayApiKey = process.env.IPPOPAY_API_KEY;
const ippopaySecretKey = process.env.IPPOPAY_API_SECRET;

// const options = {
//     apiBaseUrl: 'https://api.huobipro.com',
//     profileConfig: {
//         accessKey: '1qdmpe4rty-e0b88eae-a340e518-4a4c7',
//         secretKey: '25c1f4dc-5f4635f3-d27f4018-f6174',
//     },
// }

const hb = new Hb({
  accessKey: "1qdmpe4rty-e0b88eae-a340e518-4a4c7",
  secretKey: "25c1f4dc-5f4635f3-d27f4018-f6174",
  url: "api.huobi.pro",
});

const router = express.Router();

let lastBtcBuy = 0;
let lastBtcSell = 0;
let lastBchBuy = 0;
let lastBchSell = 0;
let lastLtcBuy = 0;
let lastLtcSell = 0;
let lastXrpBuy = 0;
let lastXrpSell = 0;
let lastEthBuy = 0;
let lastEthSell = 0;

let lastBtcInrBuy = 0;
let lastBtcInrSell = 0;
let lastBchInrBuy = 0;
let lastBchInrSell = 0;
let lastLtcInrBuy = 0;
let lastLtcInrSell = 0;
let lastXrpInrBuy = 0;
let lastXrpInrSell = 0;
let lastEthInrBuy = 0;
let lastEthInrSell = 0;

let coinLastPrice = [];

getAssetCoin = (marketName) => {
  let marketCoin = {
    crypto: "tbtc",
    fiat: "AED",
    lastBuy: lastBtcBuy,
    lastSell: lastBtcSell,
  };
  if (marketName === "tbtcAED") {
    marketCoin = {
      crypto: "tbtc",
      fiat: "AED",
      lastBuy: lastBtcBuy,
      lastSell: lastBtcSell,
    };
    coinLastPrice["tbtcAED"] = {
      lastBuy: lastBtcBuy,
      lastSell: lastBtcSell,
    };
  }
  if (marketName === "tbchAED") {
    marketCoin = {
      crypto: "tbch",
      fiat: "AED",
      lastBuy: lastBchBuy,
      lastSell: lastBchSell,
    };
    coinLastPrice["tbctbchAEDh"] = {
      lastBuy: lastBchBuy,
      lastSell: lastBchSell,
    };
  }
  if (marketName === "tltcAED") {
    marketCoin = {
      cypro: "tltc",
      fiat: "AED",
      lastBuy: lastLtcBuy,
      lastSell: lastLtcSell,
    };
    coinLastPrice["tltcAED"] = {
      lastBuy: lastLtcBuy,
      lastSell: lastLtcSell,
    };
  }
  if (marketName === "tbtcINR") {
    marketCoin = {
      crypto: "tbtc",
      fiat: "INR",
      lastBuy: lastBtcInrBuy,
      lastSell: lastBtcInrSell,
    };
    coinLastPrice["tbtcINR"] = {
      lastBuy: lastBtcInrBuy,
      lastSell: lastBtcInrSell,
    };
  }
  if (marketName === "tbchINR") {
    marketCoin = {
      crypto: "tbch",
      fiat: "INR",
      lastBuy: lastBchInrBuy,
      lastSell: lastBchInrSell,
    };
    coinLastPrice["tbchINR"] = {
      lastBuy: lastBchInrBuy,
      lastSell: lastBchInrSell,
    };
  }
  if (marketName === "tltcINR") {
    marketCoin = {
      cypro: "tltc",
      fiat: "INR",
      lastBuy: lastLtcInrBuy,
      lastSell: lastLtcInrSell,
    };
    coinLastPrice["tltcINR"] = {
      lastBuy: lastLtcInrBuy,
      lastSell: lastLtcInrSell,
    };
  }
  if (marketName === "tzecAED") {
    marketCoin = {
      crypto: "tzec",
      fiat: "AED",
    };
  }
  if (marketName === "txlmAED") {
    marketCoin = {
      crypto: "txlm",
      fiat: "AED",
    };
  }
  if (marketName === "tdashAED") {
    marketCoin = {
      crypto: "tdash",
      fiat: "AED",
    };
  }
  if (marketName === "BTCAED") {
    marketCoin = {
      crypto: "BTC",
      fiat: "AED",
      lastBuy: lastBtcBuy,
      lastSell: lastBtcSell,
    };
    coinLastPrice["BTCAED"] = {
      lastBuy: lastBtcBuy,
      lastSell: lastBtcSell,
    };
  }
  if (marketName === "BCHAED") {
    marketCoin = {
      crypto: "BCH",
      fiat: "AED",
      lastBuy: lastBchBuy,
      lastSell: lastBchSell,
    };
    coinLastPrice["BCHAED"] = {
      lastBuy: lastBchBuy,
      lastSell: lastBchSell,
    };
  }
  if (marketName === "LTCAED") {
    marketCoin = {
      crypto: "LTC",
      fiat: "AED",
      lastBuy: lastLtcBuy,
      lastSell: lastLtcSell,
    };
    coinLastPrice["LTCAED"] = {
      lastBuy: lastLtcBuy,
      lastSell: lastLtcSell,
    };
  }
  if (marketName === "XRPAED") {
    marketCoin = {
      crypto: "XRP",
      fiat: "AED",
      lastBuy: lastXrpBuy,
      lastSell: lastXrpSell,
    };
    coinLastPrice["XRPAED"] = {
      lastBuy: lastXrpBuy,
      lastSell: lastXrpSell,
    };
  }
  if (marketName === "ETHAED") {
    marketCoin = {
      crypto: "ETH",
      fiat: "AED",
      lastBuy: lastEthBuy,
      lastSell: lastEthSell,
    };
    coinLastPrice["ETHAED"] = {
      lastBuy: lastEthBuy,
      lastSell: lastEthSell,
    };
  }
  if (marketName === "TRXAED") {
    marketCoin = {
      crypto: "TRX",
      fiat: "AED",
      lastBuy: lastEthBuy,
      lastSell: lastEthSell,
    };
    coinLastPrice["TRXAED"] = {
      lastBuy: lastEthBuy,
      lastSell: lastEthSell,
    };
  }
  if (marketName === "BTCINR") {
    marketCoin = {
      crypto: "BTC",
      fiat: "INR",
      lastBuy: lastBtcInrBuy,
      lastSell: lastBtcInrSell,
    };
    coinLastPrice["BTCINR"] = {
      lastBuy: lastBtcInrBuy,
      lastSell: lastBtcInrSell,
    };
  }
  if (marketName === "BCHINR") {
    marketCoin = {
      crypto: "BCH",
      fiat: "INR",
      lastBuy: lastBchInrBuy,
      lastSell: lastBchInrSell,
    };
    coinLastPrice["BCHINR"] = {
      lastBuy: lastBchInrBuy,
      lastSell: lastBchInrSell,
    };
  }
  if (marketName === "LTCINR") {
    marketCoin = {
      crypto: "LTC",
      fiat: "INR",
      lastBuy: lastLtcInrBuy,
      lastSell: lastLtcInrSell,
    };
    coinLastPrice["LTCINR"] = {
      lastBuy: lastLtcInrBuy,
      lastSell: lastLtcInrSell,
    };
  }
  if (marketName === "XRPINR") {
    marketCoin = {
      crypto: "XRP",
      fiat: "INR",
      lastBuy: lastXrpInrBuy,
      lastSell: lastXrpInrSell,
    };
    coinLastPrice["XRPINR"] = {
      lastBuy: lastXrpInrBuy,
      lastSell: lastXrpInrSell,
    };
  }
  if (marketName === "ETHINR") {
    marketCoin = {
      crypto: "ETH",
      fiat: "INR",
      lastBuy: lastEthInrBuy,
      lastSell: lastEthInrSell,
    };
    coinLastPrice["ETHINR"] = {
      lastBuy: lastEthInrBuy,
      lastSell: lastEthInrSell,
    };
  }
  if (marketName === "TRXINR") {
    marketCoin = {
      crypto: "TRX",
      fiat: "INR",
      lastBuy: lastEthInrBuy,
      lastSell: lastEthInrSell,
    };
    coinLastPrice["TRXINR"] = {
      lastBuy: lastEthInrBuy,
      lastSell: lastEthInrSell,
    };
  }
  if (marketName === "BTCUSDT") {
    marketCoin = {
      crypto: "BTC",
      fiat: "USDT",
      lastBuy: lastBtcBuy,
      lastSell: lastBtcSell,
    };
    coinLastPrice["BTCUSDT"] = {
      lastBuy: lastBtcBuy,
      lastSell: lastBtcSell,
    };
  }
  if (marketName === "BCHUSDT") {
    marketCoin = {
      crypto: "BCH",
      fiat: "USDT",
      lastBuy: lastBchBuy,
      lastSell: lastBchSell,
    };
    coinLastPrice["BCHUSDT"] = {
      lastBuy: lastBchBuy,
      lastSell: lastBchSell,
    };
  }
  if (marketName === "LTCUSDT") {
    marketCoin = {
      cypro: "LTC",
      fiat: "USDT",
      lastBuy: lastLtcBuy,
      lastSell: lastLtcSell,
    };
    coinLastPrice["LTCUSDT"] = {
      lastBuy: lastLtcBuy,
      lastSell: lastLtcSell,
    };
  }
  if (marketName === "XRPUSDT") {
    marketCoin = {
      crypto: "XRP",
      fiat: "USDT",
      lastBuy: lastXrpInrBuy,
      lastSell: lastXrpInrSell,
    };
    coinLastPrice["XRPUSDT"] = {
      lastBuy: lastXrpInrBuy,
      lastSell: lastXrpInrSell,
    };
  }
  if (marketName === "ETHUSDT") {
    marketCoin = {
      crypto: "ETH",
      fiat: "USDT",
      lastBuy: lastEthInrBuy,
      lastSell: lastEthInrSell,
    };
    coinLastPrice["ETHUSDT"] = {
      lastBuy: lastEthInrBuy,
      lastSell: lastEthInrSell,
    };
  }
  if (marketName === "TRXUSDT") {
    marketCoin = {
      crypto: "TRX",
      fiat: "USDT",
      lastBuy: lastEthInrBuy,
      lastSell: lastEthInrSell,
    };
    coinLastPrice["TRXUSDT"] = {
      lastBuy: lastEthInrBuy,
      lastSell: lastEthInrSell,
    };
  }
  return marketCoin;
};

getMarketCoin = (marketName) => {
  let marketCoin = marketName;
  if (marketName === "tbtcAED") {
    marketCoin = "btcusd";
  }
  if (marketName === "BTCAED") {
    marketCoin = "btcusd";
  }
  if (marketName === "tbtcINR") {
    marketCoin = "btcusd";
  }
  if (marketName === "BTCINR") {
    marketCoin = "btcusd";
  }
  if (marketName === "tbchAED") {
    marketCoin = "bchusd";
  }
  if (marketName === "BCHAED") {
    marketCoin = "bchusd";
  }
  if (marketName === "tbchINR") {
    marketCoin = "bchusd";
  }
  if (marketName === "BCHINR") {
    marketCoin = "bchusd";
  }
  if (marketName === "tltcAED") {
    marketCoin = "ltcusd";
  }
  if (marketName === "LTCAED") {
    marketCoin = "ltcusd";
  }
  if (marketName === "tltcINR") {
    marketCoin = "ltcusd";
  }
  if (marketName === "LTCINR") {
    marketCoin = "ltcusd";
  }
  if (marketName === "tzecAED") {
    marketCoin = "zecusd";
  }
  if (marketName === "txlmAED") {
    marketCoin = "xlmusd";
  }
  if (marketName === "tdashAED") {
    marketCoin = "dashusd";
  }
  if (marketName === "XRPAED") {
    marketCoin = "xrpusd";
  }
  if (marketName === "ETHAED") {
    marketCoin = "ethusd";
  }
  if (marketName === "XRPINR") {
    marketCoin = "xrpusd";
  }
  if (marketName === "ETHINR") {
    marketCoin = "ethusd";
  }
  if (marketName === "BTCUSDT") {
    marketCoin = "btcusdt";
  }
  if (marketName === "BCHUSDT") {
    marketCoin = "bchusdt";
  }
  if (marketName === "LTCUSDT") {
    marketCoin = "ltcusdt";
  }
  if (marketName === "XRPUSDT") {
    marketCoin = "xrpusdt";
  }
  if (marketName === "ETHUSDT") {
    marketCoin = "ethusdt";
  }
  return marketCoin;
};

startOrderMarket = () => {
  Markets.find({ active: true })
    .then((markets) => {
      markets.map((market) => {
        // console.log(getMarketCoin(market.name));
        // wsConnect(getMarketCoin(market.name), market.name);
      });
    })
    .catch((err) => {
      // console.log(err);
    });
};

// startOrderMarket();
let processingOrder = [];

updateOpenOrders = async (lastBuy, lastSell, market, order, assetCoin) => {
  // const orders = await Order.find({market: market, status: 'Open'});
  // if (orders.length > 0) {
  //     for (order of orders) {
  if (order.side === 1) {
    if (
      parseFloat(order.price) < parseFloat(lastBuy) &&
      order.market === market &&
      order.market.includes(assetCoin.crypto)
    ) {
      // if (processingOrder.includes(order._id)) {
      //     console.log(`${order._id} Sell order already processing...`);
      // } else {
      // processingOrder.push(order._id);
      // console.log(order._id, lastBuy, lastSell, order.price);
      order.status = "Finished";
      order.price = lastBuy;
      order.dealMoney = lastBuy;
      order.updateDate = Date.now();
      await order
        .save()
        .then(async (order) => {
          let asssetCoin = getAssetCoin(order.market);

          let taker_fee_rate = order.takerFee;
          let _is_agent = false;
          let agent_taker_fee = 0;
          let agent;

          const user = await User.findOne({ _id: order.userId });
          if (user) {
            const userProfile = await UserProfile.findOne({ userId: user._id });
            const agentUser = await AgentUsers.findOne({ userId: user._id });

            if (agentUser) {
              agent = await User.findOne({ _id: agentUser.agentId });
              if (agent) {
                _is_agent = true;
                const agentProfile = await UserProfile.findOne({
                  userId: agent._id,
                });

                if (agent.agent) {
                  const agentTraderLevel = await AgentTraderLevel.findOne({
                    name: `${agentProfile.traderLevel}`,
                  });
                  agent_taker_fee =
                    parseFloat(agentTraderLevel.taker_fee) / 100;
                } else if (agent.subAgent) {
                  const agentTraderLevel = await SubAgentTraderLevel.findOne({
                    name: `${agentProfile.traderLevel}`,
                  });
                  agent_taker_fee =
                    parseFloat(agentTraderLevel.taker_fee) / 100;
                }

                let clientTraderLevel = await AgentClientTraderLevel.findOne({
                  clientId: user._id,
                  name: `${userProfile.traderLevel}`,
                });
                if (clientTraderLevel) {
                  taker_fee_rate =
                    parseFloat(clientTraderLevel.taker_fee) / 100;
                } else {
                  clientTraderLevel = await InrTraderLevel.findOne({
                    name: `${agentProfile.traderLevel}`,
                  });
                  if (clientTraderLevel) {
                    taker_fee_rate =
                      parseFloat(clientTraderLevel.taker_fee) / 100;
                  }
                }
              }
            }
          }

          let userWallet;
          if (order.margin) {
            userWallet = await UserMarginWallet.findOne({
              userId: order.userId,
              coin: asssetCoin.fiat,
            });
          } else {
            userWallet = await UserWallet.findOne({
              userId: order.userId,
              coin: asssetCoin.fiat,
            });
          }

          if (userWallet) {
            let dealFinalPrice =
              parseFloat(order.amount) * parseFloat(lastBuy) -
              parseFloat(order.amount) *
                parseFloat(lastBuy) *
                parseFloat(taker_fee_rate);
            let agentDealFinalFee =
              parseFloat(order.amount) *
              parseFloat(lastBuy) *
              parseFloat(agent_taker_fee);
            // let depositReqest = await WalletController.depositeWallet(userWallet, parseFloat(dealFinalPrice));
            // if (depositReqest) {
            //     console.log(`viabtc balance updated ${order.userId}`);
            // } else {
            //     console.log(`viabtc balance failed ${order.userId}`);
            // }
            userWallet.walletAmount = (
              parseFloat(userWallet.walletAmount) + parseFloat(dealFinalPrice)
            ).toFixed(2);
            await userWallet.save();

            if (_is_agent) {
              if (user) {
                if (agent) {
                  let agentFiatWallet;
                  if (order.margin) {
                    agentFiatWallet = await UserMarginWallet.findOne({
                      userId: agent._id,
                      coin: asssetCoin.fiat,
                    });
                  } else {
                    agentFiatWallet = await UserWallet.findOne({
                      userId: agent._id,
                      coin: asssetCoin.fiat,
                    });
                  }

                  // Fiat wallet Update
                  // let withdrawReqest = await WalletController.withdrawWallet(userWallet, parseFloat(agentDealFinalFee));
                  // if (withdrawReqest) {
                  //     console.log(`viabtc balance updated ${order.userId}`);
                  // } else {
                  //     console.log(`viabtc balance failed ${order.userId}`);
                  // }
                  agentFiatWallet.walletAmount = (
                    parseFloat(agentFiatWallet.walletAmount) - agentDealFinalFee
                  ).toFixed(2);
                  agentFiatWallet.save();
                }
              }
            }

            const index = processingOrder.indexOf(order._id);
            if (index > -1) {
              processingOrder.splice(index, 1);
            }
            // depositeWallet(userWallet, parseFloat(dealFinalPrice));
            ReferralTree.findOne({ referredUser: order.userId })
              .then((referralTree) => {
                if (referralTree) {
                  ReferralSetting.find().then((referralSettings) => {
                    if (referralSettings.length > 0) {
                      let refEarn =
                        parseFloat(order.amount) *
                        parseFloat(lastBuy) *
                        parseFloat(order.takerFee) *
                        parseFloat(referralSettings[0].commissionPercentage);
                      referralTree.referredUserEarning = (
                        parseFloat(referralTree.referredUserEarning) +
                        parseFloat(refEarn)
                      ).toFixed(4);
                      referralTree.save();
                      Referral.findOne({ _id: referralTree.referralId })
                        .then((referral) => {
                          if (referral) {
                            referral.totalReferralEarnings = (
                              parseFloat(referral.totalReferralEarnings) +
                              parseFloat(refEarn)
                            ).toFixed(4);
                            referral.save();
                          } else {
                            //
                          }
                        })
                        .catch((err) => {
                          //
                        });
                    } else {
                      //
                    }
                  });
                } else {
                  //
                }
              })
              .catch((err) => {
                //
              });
            return true;
          }
        })
        .catch((err) => {
          const index = processingOrder.indexOf(order._id);
          if (index > -1) {
            processingOrder.splice(index, 1);
          }
          return true;
        });
      console.log(market + " Sell order closed " + order._id);
      // }
    } else {
      // for (bid of allBids) {
      // // allBids.map(bid => {
      //     if((parseFloat(order.price) === (parseFloat(bid[0]) * aedToUsd)) && (order.market === market)) {
      //         console.log(order._id, lastBuy, order.price);
      //         if (processingOrder.includes(order._id)) {
      //             console.log(`${order._id} Sell order already processing...`);
      //         } else {
      //             processingOrder.push(order._id);
      //             order.status = 'Finished';
      //             order.updateDate = Date.now();
      //             await order.save()
      //             .then(async order => {
      //                 let asssetCoin = getAssetCoin(order.market);
      //                 let taker_fee_rate = order.takerFee;
      //                 let _is_agent = false;
      //                 let agent_taker_fee = 0;
      //                 let agent;
      //                 const user = await User.findOne({_id: order.userId});
      //                 if (user) {
      //                     const userProfile = await UserProfile.findOne({userId: user._id});
      //                     const agentUser = await AgentUsers.findOne({userId: user._id});
      //                     if (agentUser) {
      //                         agent = await User.findOne({_id: agentUser.agentId});
      //                         if (agent) {
      //                             _is_agent = true;
      //                             const agentProfile = await UserProfile.findOne({userId: agent._id});
      //                             if (agent.agent) {
      //                                 const agentTraderLevel = await AgentTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
      //                                 agent_taker_fee = parseFloat(agentTraderLevel.taker_fee)/100;
      //                             } else if (agent.subAgent) {
      //                                 const agentTraderLevel = await SubAgentTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
      //                                 agent_taker_fee = parseFloat(agentTraderLevel.taker_fee)/100;
      //                             }
      //                             let clientTraderLevel = await AgentClientTraderLevel.findOne({clientId: user._id, name: `${userProfile.traderLevel}`});
      //                             if (clientTraderLevel) {
      //                                 taker_fee_rate = parseFloat(clientTraderLevel.taker_fee)/100;
      //                             } else {
      //                                 clientTraderLevel = await InrTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
      //                                 if (clientTraderLevel) {
      //                                     taker_fee_rate = parseFloat(clientTraderLevel.taker_fee)/100;
      //                                 }
      //                             }
      //                         }
      //                     }
      //                 }
      //                 let userWallet;
      //                 if(order.margin) {
      //                     userWallet = await UserMarginWallet.findOne({userId: order.userId, coin: asssetCoin.fiat});
      //                 } else {
      //                     userWallet = await UserWallet.findOne({userId: order.userId, coin: asssetCoin.fiat});
      //                 }
      //                 if(userWallet) {
      //                     let dealFinalPrice = (parseFloat(order.amount) * parseFloat(order.price)) - ((parseFloat(order.amount) * parseFloat(order.price)) * (parseFloat(taker_fee_rate)));
      //                     let agentDealFinalFee = ((parseFloat(order.amount) * parseFloat(order.price)) * (parseFloat(agent_taker_fee)));
      //                     userWallet.walletAmount = (parseFloat(userWallet.walletAmount) + parseFloat(dealFinalPrice)).toFixed(2);
      //                     await userWallet.save();
      //                     if (_is_agent) {
      //                         if (user) {
      //                             if(agent) {
      //                                 let agentFiatWallet;
      //                                 if(order.margin) {
      //                                     agentFiatWallet = await UserMarginWallet.findOne({userId: agent._id, coin: asssetCoin.fiat});
      //                                 } else {
      //                                     agentFiatWallet = await UserWallet.findOne({userId: agent._id, coin: asssetCoin.fiat});
      //                                 }
      //                                 // Fiat wallet Update
      //                                 agentFiatWallet.walletAmount = (parseFloat(agentFiatWallet.walletAmount) - agentDealFinalFee).toFixed(2);
      //                                 agentFiatWallet.save();
      //                             }
      //                         }
      //                     }
      //                     const index = processingOrder.indexOf(order._id);
      //                     if (index > -1) {
      //                         processingOrder.splice(index, 1);
      //                     }
      //                     // depositeWallet(userWallet, parseFloat(dealFinalPrice));
      //                     ReferralTree.findOne({referredUser: order.userId})
      //                     .then(referralTree => {
      //                         if(referralTree) {
      //                             ReferralSetting.find()
      //                                 .then(referralSettings => {
      //                                     if(referralSettings.length > 0) {
      //                                         let refEarn = (((parseFloat(order.amount) * parseFloat(order.price)) * (parseFloat(order.takerFee)))) * parseFloat(referralSettings[0].commissionPercentage);
      //                                         referralTree.referredUserEarning = (parseFloat(referralTree.referredUserEarning) + parseFloat(refEarn)).toFixed(4);
      //                                         referralTree.save();
      //                                         Referral.findOne({_id: referralTree.referralId})
      //                                             .then(referral => {
      //                                                 if(referral) {
      //                                                     referral.totalReferralEarnings = (parseFloat(referral.totalReferralEarnings) + parseFloat(refEarn)).toFixed(4);
      //                                                     referral.save();
      //                                                 } else {
      //                                                     //
      //                                                 }
      //                                             })
      //                                             .catch(err => {
      //                                                 //
      //                                             })
      //                                     } else {
      //                                         //
      //                                     }
      //                                 })
      //                         } else {
      //                             //
      //                         }
      //                     })
      //                     .catch(err => {
      //                         //
      //                     })
      //                 }
      //             })
      //             .catch(err => {
      //                 const index = processingOrder.indexOf(order._id);
      //                 if (index > -1) {
      //                     processingOrder.splice(index, 1);
      //                 }
      //             })
      //             console.log(market + 'Sell order closed');
      //         }
      //     }
      // }
    }
  }
  if (order.side === 2) {
    if (
      parseFloat(order.price) > parseFloat(lastSell) &&
      order.market === market &&
      order.market.includes(assetCoin.crypto)
    ) {
      // console.log(order._id, lastSell, lastBuy, order.price);
      // if (processingOrder.includes(order._id)) {
      //     console.log(`${order._id} Buy order already processing...`);
      // } else {
      // processingOrder.push(order._id);
      order.status = "Finished";
      order.price = lastSell;
      order.dealMoney = lastSell;
      order.updateDate = Date.now();
      await order
        .save()
        .then(async (order) => {
          let asssetCoin = getAssetCoin(order.market);

          let _is_agent = false;
          let agent_taker_fee = 0;
          let agent;

          const user = await User.findOne({ _id: order.userId });
          if (user) {
            const agentUser = await AgentUsers.findOne({ userId: user._id });

            if (agentUser) {
              agent = await User.findOne({ _id: agentUser.agentId });
              if (agent) {
                _is_agent = true;
                const agentProfile = await UserProfile.findOne({
                  userId: agent._id,
                });

                if (agent.agent) {
                  const agentTraderLevel = await AgentTraderLevel.findOne({
                    name: `${agentProfile.traderLevel}`,
                  });
                  agent_taker_fee =
                    parseFloat(agentTraderLevel.taker_fee) / 100;
                } else if (agent.subAgent) {
                  const agentTraderLevel = await SubAgentTraderLevel.findOne({
                    name: `${agentProfile.traderLevel}`,
                  });
                  agent_taker_fee =
                    parseFloat(agentTraderLevel.taker_fee) / 100;
                }
              }
            }
          }

          let userWallet;
          if (order.margin) {
            userWallet = await UserMarginWallet.findOne({
              userId: order.userId,
              coin: asssetCoin.crypto,
            });
          } else {
            userWallet = await UserWallet.findOne({
              userId: order.userId,
              coin: asssetCoin.crypto,
            });
          }

          if (userWallet) {
            let agentDealFinalFee =
              parseFloat(order.amount) *
              parseFloat(lastSell) *
              parseFloat(agent_taker_fee);

            // let depositReqest = await WalletController.depositeWallet(userWallet, parseFloat(order.amount));
            // if (depositReqest) {
            //     console.log(`viabtc balance updated ${order.userId}`);
            // } else {
            //     console.log(`viabtc balance failed ${order.userId}`);
            // }
            userWallet.walletAmount = (
              parseFloat(userWallet.walletAmount) + parseFloat(order.amount)
            ).toFixed(8);
            await userWallet.save();

            if (_is_agent) {
              if (user) {
                if (agent) {
                  let agentFiatWallet;
                  if (order.margin) {
                    agentFiatWallet = await UserMarginWallet.findOne({
                      userId: agent._id,
                      coin: asssetCoin.fiat,
                    });
                  } else {
                    agentFiatWallet = await UserWallet.findOne({
                      userId: agent._id,
                      coin: asssetCoin.fiat,
                    });
                  }

                  // Fiat wallet Update
                  // let withdrawReqest = await WalletController.withdrawWallet(userWallet, parseFloat(agentDealFinalFee));
                  // if (withdrawReqest) {
                  //     console.log(`viabtc balance updated ${order.userId}`);
                  // } else {
                  //     console.log(`viabtc balance failed ${order.userId}`);
                  // }
                  agentFiatWallet.walletAmount = (
                    parseFloat(agentFiatWallet.walletAmount) - agentDealFinalFee
                  ).toFixed(8);
                  agentFiatWallet.save();
                }
              }
            }

            const index = processingOrder.indexOf(order._id);
            if (index > -1) {
              processingOrder.splice(index, 1);
            }
            // depositeWallet(userWallet, parseFloat(dealFinalPrice));
            await ReferralTree.findOne({ referredUser: order.userId })
              .then((referralTree) => {
                if (referralTree) {
                  ReferralSetting.find().then((referralSettings) => {
                    if (referralSettings.length > 0) {
                      let refEarn =
                        parseFloat(order.amount) *
                        parseFloat(lastSell) *
                        parseFloat(order.takerFee) *
                        parseFloat(referralSettings[0].commissionPercentage);
                      referralTree.referredUserEarning = (
                        parseFloat(referralTree.referredUserEarning) +
                        parseFloat(refEarn)
                      ).toFixed(4);
                      referralTree.save();
                      Referral.findOne({ _id: referralTree.referralId })
                        .then((referral) => {
                          if (referral) {
                            referral.totalReferralEarnings = (
                              parseFloat(referral.totalReferralEarnings) +
                              parseFloat(refEarn)
                            ).toFixed(4);
                            referral.save();
                          } else {
                            //
                          }
                        })
                        .catch((err) => {
                          //
                        });
                    } else {
                      //
                    }
                  });
                } else {
                  //
                }
              })
              .catch((err) => {
                //
              });
            return true;
          }
        })
        .catch((err) => {
          const index = processingOrder.indexOf(order._id);
          if (index > -1) {
            processingOrder.splice(index, 1);
          }
          return true;
        });
      console.log(market + "Buy order closed " + order._id);
      // }
    } else {
      // for (ask of allAsks) {
      // // allAsks.map(ask => {
      //     if((parseFloat(order.price) === (parseFloat(ask[0]) * aedToUsd)) && (order.market === market)) {
      //         console.log(order._id, lastSell, order.price);
      //         if (processingOrder.includes(order._id)) {
      //             console.log(`${order._id} Buy order already processing...`);
      //         } else {
      //             processingOrder.push(order._id);
      //             order.status = 'Finished';
      //             order.updateDate = Date.now();
      //             order.save()
      //                 .then(async order => {
      //                     let asssetCoin = getAssetCoin(order.market);
      //                     let _is_agent = false;
      //                     let agent_taker_fee = 0;
      //                     let agent;
      //                     const user = await User.findOne({_id: order.userId});
      //                     if (user) {
      //                         const agentUser = await AgentUsers.findOne({userId: user._id});
      //                         if (agentUser) {
      //                             agent = await User.findOne({_id: agentUser.agentId});
      //                             if (agent) {
      //                                 _is_agent = true;
      //                                 const agentProfile = await UserProfile.findOne({userId: agent._id});
      //                                 if (agent.agent) {
      //                                     const agentTraderLevel = await AgentTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
      //                                     agent_taker_fee = parseFloat(agentTraderLevel.taker_fee)/100;
      //                                 } else if (agent.subAgent) {
      //                                     const agentTraderLevel = await SubAgentTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
      //                                     agent_taker_fee = parseFloat(agentTraderLevel.taker_fee)/100;
      //                                 }
      //                             }
      //                         }
      //                     }
      //                     let userWallet;
      //                     if(order.margin) {
      //                         userWallet = await UserMarginWallet.findOne({userId: order.userId, coin: asssetCoin.crypto});
      //                     } else {
      //                         userWallet = await UserWallet.findOne({userId: order.userId, coin: asssetCoin.crypto});
      //                     }
      //                     if(userWallet) {
      //                         let agentDealFinalFee = ((parseFloat(order.amount) * parseFloat(order.price)) * (parseFloat(agent_taker_fee)));
      //                         userWallet.walletAmount = (parseFloat(userWallet.walletAmount) + parseFloat(order.amount)).toFixed(2);
      //                         await userWallet.save();
      //                         if (_is_agent) {
      //                             if (user) {
      //                                 if(agent) {
      //                                     let agentFiatWallet;
      //                                     if(order.margin) {
      //                                         agentFiatWallet = await UserMarginWallet.findOne({userId: agent._id, coin: asssetCoin.fiat});
      //                                     } else {
      //                                         agentFiatWallet = await UserWallet.findOne({userId: agent._id, coin: asssetCoin.fiat});
      //                                     }
      //                                     // Fiat wallet Update
      //                                     agentFiatWallet.walletAmount = (parseFloat(agentFiatWallet.walletAmount) - agentDealFinalFee).toFixed(8);
      //                                     agentFiatWallet.save();
      //                                 }
      //                             }
      //                         }
      //                         const index = processingOrder.indexOf(order._id);
      //                         if (index > -1) {
      //                             processingOrder.splice(index, 1);
      //                         }
      //                         // depositeWallet(userWallet, parseFloat(dealFinalPrice));
      //                         ReferralTree.findOne({referredUser: order.userId})
      //                         .then(referralTree => {
      //                             if(referralTree) {
      //                                 ReferralSetting.find()
      //                                     .then(referralSettings => {
      //                                         if(referralSettings.length > 0) {
      //                                             let refEarn = (((parseFloat(order.amount) * parseFloat(order.price)) * (parseFloat(order.takerFee)))) * parseFloat(referralSettings[0].commissionPercentage);
      //                                             referralTree.referredUserEarning = (parseFloat(referralTree.referredUserEarning) + parseFloat(refEarn)).toFixed(4);
      //                                             referralTree.save();
      //                                             Referral.findOne({_id: referralTree.referralId})
      //                                                 .then(referral => {
      //                                                     if(referral) {
      //                                                         referral.totalReferralEarnings = (parseFloat(referral.totalReferralEarnings) + parseFloat(refEarn)).toFixed(4);
      //                                                         referral.save();
      //                                                     } else {
      //                                                         //
      //                                                     }
      //                                                 })
      //                                                 .catch(err => {
      //                                                     //
      //                                                 })
      //                                         } else {
      //                                             //
      //                                         }
      //                                     })
      //                             } else {
      //                                 //
      //                             }
      //                         })
      //                         .catch(err => {
      //                             //
      //                         })
      //                     }
      //                 })
      //                 .catch(err => {
      //                     const index = processingOrder.indexOf(order._id);
      //                     if (index > -1) {
      //                         processingOrder.splice(index, 1);
      //                     }
      //                 })
      //             console.log(market + 'Buy order closed ' + order._id);
      //         }
      //     }
      // }
    }
  }
  //     }
  // }
};

serializeData = async (data, market) => {
  let currencies = await CurrencySetting.find({});

  for (let key in currencies) {
    let aedToUsd = currencies[key];
    if (aedToUsd.name === "USD to AED" && market.includes("AED")) {
      let allAsks = [];
      let allBids = [];
      let lastSell = 0;
      let lastBuy = 0;
      if (data.asks.length > 0) {
        lastSell = (
          parseFloat(data.asks[0][0]) * parseFloat(aedToUsd.value)
        ).toFixed(2);
        allAsks = data.asks;
      }
      if (data.bids.length > 0) {
        lastBuy = (
          parseFloat(data.bids[0][0]) * parseFloat(aedToUsd.value)
        ).toFixed(2);
        allBids = data.bids;
      }

      if (lastSell > 0 && lastBuy > 0) {
        if (market.includes("BTC") || market.includes("tbtc")) {
          lastBtcBuy = lastBuy;
          lastBtcSell = lastSell;
        }
        if (market.includes("BCH") || market.includes("tbch")) {
          lastBchBuy = lastBuy;
          lastBchSell = lastSell;
        }
        if (market.includes("LTC") || market.includes("tltc")) {
          lastLtcBuy = lastBuy;
          lastLtcSell = lastSell;
        }
        if (market.includes("XRP")) {
          lastXrpBuy = lastBuy;
          lastXrpSell = lastSell;
        }
        if (market.includes("ETH")) {
          lastEthBuy = lastBuy;
          lastEthSell = lastSell;
        }
        // console.log(lastBuy, lastSell, market);
        updateOpenOrders(
          lastBuy,
          lastSell,
          market,
          allAsks,
          allBids,
          parseFloat(aedToUsd.value)
        );
      }
    }

    if (aedToUsd.name === "USD to INR" && market.includes("INR")) {
      // console.log(aedToUsd.value);
      let allInrAsks = [];
      let allInrBids = [];
      let lastInrSell = 0;
      let lastInrBuy = 0;
      if (data.asks.length > 0) {
        lastInrSell = (
          parseFloat(data.asks[0][0]) * parseFloat(aedToUsd.value)
        ).toFixed(2);
        allInrAsks = data.asks;
      }
      if (data.bids.length > 0) {
        lastInrBuy = (
          parseFloat(data.bids[0][0]) * parseFloat(aedToUsd.value)
        ).toFixed(2);
        allInrBids = data.bids;
      }

      // console.log(lastInrSell, lastInrBuy);

      if (lastInrSell > 0 && lastInrBuy > 0) {
        if (market.includes("BTC") || market.includes("tbtc")) {
          lastBtcInrBuy = lastInrBuy;
          lastBtcInrSell = lastInrSell;
        }
        if (market.includes("BCH") || market.includes("tbch")) {
          lastBchInrBuy = lastInrBuy;
          lastBchInrSell = lastInrSell;
        }
        if (market.includes("LTC") || market.includes("tltc")) {
          lastLtcInrBuy = lastInrBuy;
          lastLtcInrSell = lastInrSell;
        }
        if (market.includes("XRP")) {
          lastXrpInrBuy = lastInrBuy;
          lastXrpInrSell = lastInrSell;
        }
        if (market.includes("ETH")) {
          lastEthInrBuy = lastInrBuy;
          lastEthInrSell = lastInrSell;
        }

        // console.log(lastInrBuy, lastInrSell, market);
        updateOpenOrders(
          lastInrBuy,
          lastInrSell,
          market,
          allInrAsks,
          allInrBids,
          parseFloat(aedToUsd.value)
        );
      }
    }
  }
};

wsConnect = (market, bmarket) => {
  let ws = new WebSocket("wss://ws.bitstamp.net");

  ws.onopen = () => {
    // console.log(`${market} Order ws connected!`);
    let subscribeMsg = {
      event: "bts:subscribe",
      data: {
        channel: `order_book_${market}`,
      },
    };

    ws.send(JSON.stringify(subscribeMsg));
  };

  ws.onmessage = (evt) => {
    const message = JSON.parse(evt.data);
    /**
     * This switch statement handles message logic. It processes data in case of data event
     * and it reconnects if the server requires.
     */
    switch (message.event) {
      case "data": {
        if (message.channel === `order_book_${market}`) {
          serializeData(message.data, bmarket);
        }
        break;
      }
      case "bts:request_reconnect": {
        // this.wsConnect();
        break;
      }
      default:
      // this.wsConnect();
    }
  };

  /**
   * In case of unexpected close event, try to reconnect.
   */
  ws.onclose = function () {
    // console.log('Websocket connection closed');
    // startOrderMarket();
  };

  ws.onerror = function (err) {
    // console.log('Websocket connection closed');
    // startOrderMarket();
  };
};

get_trader_level = async (traderLevelValue) => {
  let result = {};
  let traderLevel = await TraderLevel.findOne({ name: traderLevelValue });
  if (traderLevel) {
    result.takerFee = traderLevel.taker_fee;
    result.makerFee = traderLevel.maker_fee;
    return result;
  } else {
    return result;
  }
};

router.post("/get_order_key", async (req, res) => {
  const { errors, isValid } = validateWalletDepositRequest(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  const user = await User.findOne({ _id: req.body.userId });

  if (user) {
    const token = Buffer.from(
      `${ippopayApiKey}:${ippopaySecretKey}`,
      "utf8"
    ).toString("base64");

    const url = "https://api.ippopay.com/v1/order/create";
    const data = {
      amount: req.body.amount,
      currency: req.body.coin,
      payment_modes: "cc,db,nb,upi",
      customer: {
        name: `${user.firstname} ${user.lastname}`,
        email: user.email,
        phone: {
          country_code: "+91",
          national_number: user.phone.split(" ")[1],
        },
      },
    };

    axios
      .post(url, data, {
        headers: {
          Authorization: `Basic ${token}`,
        },
      })
      .then((response) => {
        // console.log(response.data);
        return res.json(response.data.data.order);
      })
      .catch((err) => {
        // console.log(err);
        return res
          .status(400)
          .json({ depositAmount: "Failed to create an order." });
      });
  } else {
    return res
      .status(400)
      .json({ depositAmount: "Failed to create an order." });
  }
});

/**
 * @route GET /api/trading/get_active_wallets
 * @description Get active assets info object.
 * @access Public
 */
router.get("/get_active_wallets/", (req, res) => {
  Assets.find({ active: true })
    .sort({ priority: -1 })
    .then(async (assets) => {
      if (assets.length > 0) {
        let activeAssets = [];
        for (let i = 0; i < assets.length; i++) {
          if (assets[i].active) {
            activeAssets.push(assets[i]);
          }
        }
        res.json(activeAssets);
      } else {
        res.json([]);
      }
    })
    .catch((err) => {
      res.json([]);
    });
});

/**
 * @route POST /api/trading/assets/lists
 * @description Get assets list.
 * @access Public
 */
router.get("/assets/lists", async (req, res) => {
  let assets = await Assets.find({});
  return res.json(assets);

  // const postParamas = {
  //     method: 'asset.summary',
  //     params: [],
  //     id: 1516681174
  // }

  // curl.post(keys.tradingURI, JSON.stringify(postParamas), {}, async function(err, response, body) {
  //     let assets = [];
  //     const tradingAssets = JSON.parse(body).result;
  //     for(let i = 0; i < tradingAssets.length; i++) {
  //         await Assets.findOne({ name: tradingAssets[i].name })
  //             .then( asset => {
  //                 if(asset) {
  //                     asset.availableCount = tradingAssets[i].available_count;
  //                     asset.totalBalance = tradingAssets[i].total_balance;
  //                     asset.availableBalance = tradingAssets[i].available_balance;
  //                     asset.freezeCount = tradingAssets[i].freeze_count;
  //                     asset.freezeBalance = tradingAssets[i].freeze_balance;
  //                     asset.save();
  //                     assets.push(asset);
  //                 } else {
  //                     let newAsset = new Assets({
  //                         availableCount: tradingAssets[i].available_count,
  //                         name: tradingAssets[i].name,
  //                         totalBalance: tradingAssets[i].total_balance,
  //                         availableBalance: tradingAssets[i].available_balance,
  //                         freezeCount: tradingAssets[i].freeze_count,
  //                         freezeBalance: tradingAssets[i].freeze_balance,
  //                     });
  //                     newAsset.save();
  //                     assets.push(newAsset);
  //                 }
  //             });

  //     }
  //     res.json(assets);
  // });
});

/**
 * @route POST /api/trading/assets/update/:assetId
 * @description Get assets update.
 * @access Public
 */
router.get("/assets/update/:assetID", (req, res) => {
  Assets.findOne({ _id: req.params.assetID })
    .then((asset) => {
      if (asset) {
        asset.active = asset.active ? false : true;
        asset.save();

        res.json({ variant: "success", message: asset.name + " is updated." });
      } else {
        res.json({ variant: "error", message: "Failed to update asset." });
      }
    })
    .catch((err) => {
      // console.log(err);
      res
        .status(400)
        .json({ variant: "error", message: "Failed to update asset." });
    });
});

/**
 * @route POST /api/trading/assets/priority_update/:assetId
 * @description Get assets update.
 * @access Public
 */
router.post("/assets/priority_update/:assetID", (req, res) => {
  Assets.findOne({ _id: req.params.assetID }).then((asset) => {
    if (asset) {
      asset.priority = req.body.priority;
      asset.alias = req.body.alias;
      asset.displayName = req.body.displayName;
      asset.depositFee = req.body.depositFee;
      asset.withdrawalFee = req.body.withdrawalFee;
      asset.description = req.body.description;
      asset.save();
      res.json({ variant: "success", message: asset.name + " is updated." });
    } else {
      res.json({ variant: "error", message: "Failed to update asset." });
    }
  });
});

/**
 * @route POST /api/trading/assets/update_fiat/:assetId
 * @description Get assets update.
 * @access Public
 */
router.get("/assets/update_fiat/:assetID", (req, res) => {
  Assets.findOne({ _id: req.params.assetID }).then((asset) => {
    if (asset) {
      asset.fiat = asset.fiat ? false : true;
      asset.save();

      res.json({ variant: "success", message: asset.name + " is updated." });
    } else {
      res.json({ variant: "error", message: "Failed to update asset." });
    }
  });
});

/**
 * @route POST /api/trading/assets/update_bitgo/:assetId
 * @description Get assets update.
 * @access Public
 */
router.get("/assets/update_bitgo/:assetID", (req, res) => {
  Assets.findOne({ _id: req.params.assetID }).then((asset) => {
    if (asset) {
      asset.bitgo = asset.bitgo ? false : true;
      asset.save();

      res.json({ variant: "success", message: asset.name + " is updated." });
    } else {
      res.json({ variant: "error", message: "Failed to update asset." });
    }
  });
});

/**
 * @route POST /api/trading/assets/update_testmode/:assetId
 * @description Get assets update.
 * @access Public
 */
router.get("/assets/update_testmode/:assetID", (req, res) => {
  Assets.findOne({ _id: req.params.assetID }).then((asset) => {
    if (asset) {
      asset.testMode = asset.testMode ? false : true;
      asset.save();

      res.json({ variant: "success", message: asset.name + " is updated." });
    } else {
      res.json({ variant: "error", message: "Failed to update asset." });
    }
  });
});

// /**
//  * @route POST /api/trading/order/assets/lists
//  * @description Get assets list.
//  * @access Public
//  */
// router.post('/asset/lists', (req, res) => {

//     const postParamas = {
//         method: 'asset.list',
//         params: [],
//         id: 1516681174
//     }

//     curl.post(keys.tradingURI, JSON.stringify(postParamas), {}, function(err, response, body) {
//         res.json(JSON.parse(body));
//     });
// });

/**
 * @route GET /api/trading/market/lists
 * @description Get market list.
 * @access Public
 */
router.get("/market/lists", (req, res) => {
  Markets.find({ active: true })
    .sort({ priority: 1 })
    .then((markets) => {
      res.json(markets);
    })
    .catch((err) => {
      res.status(400).json({ variant: "error", message: "No markets found" });
    });
});

/**
 * @route POST /api/trading/order/depth
 * @description Get order depth array.
 * @access Public
 */
router.post("/order/depth", (req, res) => {
  const params = [req.body.market, parseInt(req.body.limit), req.body.interval];

  const postParamas = {
    method: "order.depth",
    params: params,
    id: 1516681174,
  };

  curl.post(
    keys.tradingURI,
    JSON.stringify(postParamas),
    {},
    function (err, response, body) {
      if (err) {
        res.json({});
      } else {
        res.json(JSON.parse(body));
      }
    }
  );
});

/**
 * @route POST /api/trading/order/margin_limit
 * @description Create limit order.
 * @access Public
 */
router.post("/order/margin_limit", async (req, res) => {
  const { errors, isValid } = validateLimitOrderInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // let userBuyOpenMargin = await UserOpenMargin.findOne({
  //     userId: req.body.userId,
  //     coin: req.body.crypto,
  //     market: req.body.market,
  //     type: 'buy'
  // });
  // let userSellOpenMargin = await UserOpenMargin.findOne({
  //     userId: req.body.userId,
  //     coin: req.body.crypto,
  //     market: req.body.market,
  //     type: 'sell'
  // });

  // if (!userBuyOpenMargin) {
  //     userBuyOpenMargin = new UserOpenMargin;
  //     userBuyOpenMargin.userId = req.body.userId;
  //     userBuyOpenMargin.type = 'buy';
  //     userBuyOpenMargin.totalOpenMargins = 0;
  //     userBuyOpenMargin.coin = req.body.crypto;
  //     userBuyOpenMargin.market = req.body.market;
  //     userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //     await userBuyOpenMargin.save();
  // }

  // if (!userSellOpenMargin) {
  //     userSellOpenMargin = new UserOpenMargin;
  //     userSellOpenMargin = req.body.userId;
  //     userSellOpenMargin.type = 'sell';
  //     userSellOpenMargin.totalOpenMargins = 0;
  //     userSellOpenMargin.coin = req.body.crypto;
  //     userSellOpenMargin.market = req.body.market;
  //     userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //     await userSellOpenMargin.save();
  // }

  // let order = new Order;
  // order.userId = req.body.userId;
  // order.orderId = uuidv4();
  // order.side = parseInt(req.body.side);
  // order.type = 1;
  // order.market = req.body.market;
  // order.takerFee = req.body.taker_fee_rate;
  // order.makerFee = req.body.maker_fee_rate;
  // order.amount = req.body.amount;
  // order.price = req.body.price;
  // order.margin = true;
  // order.mTime = Date.now();
  // order.cTime = Date.now();
  // // const walletTransactions = new WalletTransactions({
  // //     userId: order.userId,
  // //     txid: order.orderId,
  // //     confirmations: 0,
  // //     type: 'Limit',
  // //     rate: order.price,
  // //     value: order.amount,
  // //     fees: 0,
  // //     coin: order.market,
  // //     state: 'Open',
  // // })
  // // walletTransactions.save();

  // const userFiatWallet = await UserMarginWallet.findOne({userId: req.body.userId, coin: req.body.fiat});

  // if (userFiatWallet && userFiatWallet.active) {
  //     if(order.side === 2) {
  //         let takerValue = (parseFloat(order.price) * parseFloat(order.amount));
  //         let takerAmount = takerValue + (takerValue * parseFloat(req.body.taker_fee_rate));

  //         UserMarginWallet.findOne({userId: req.body.userId, coin: req.body.fiat})
  //             .then(userWallet => {
  //                 if ((parseFloat(userWallet.walletAmount) >= takerAmount) && (parseFloat(userWallet.walletAmount) > 0)) {
  //                     order.save()
  //                         .then(async order => {
  //                             userWallet.walletAmount = (parseFloat(userWallet.walletAmount) - takerAmount).toFixed(2);
  //                             userWallet.save();

  //                             // if (parseFloat(userSellOpenMargin.totalOpenMargins) > parseFloat(userBuyOpenMargin.totalOpenMargins)) {
  //                             //     userSellOpenMargin.totalOpenMargins = parseFloat(userSellOpenMargin.totalOpenMargins) - parseFloat(userBuyOpenMargin.totalOpenMargins);
  //                             //     userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                             //     userSellOpenMargin.save();
  //                             // } else if (parseFloat(userSellOpenMargin.totalOpenMargins) < parseFloat(userBuyOpenMargin.totalOpenMargins)) {
  //                             //     if (parseFloat(userSellOpenMargin.totalOpenMargins) < (parseFloat(req.body.amount))) {
  //                             //         userBuyOpenMargin.totalOpenMargins = (parseFloat(userBuyOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount))) - parseFloat(userSellOpenMargin.totalOpenMargins);
  //                             //         userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                             //         await userBuyOpenMargin.save();
  //                             //         userSellOpenMargin.totalOpenMargins = 0;
  //                             //         userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                             //         await userSellOpenMargin.save();
  //                             //     } else {
  //                             //         userSellOpenMargin.totalOpenMargins = parseFloat(userSellOpenMargin.totalOpenMargins) - (parseFloat(req.body.amount));
  //                             //         userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                             //         await userSellOpenMargin.save();
  //                             //         userBuyOpenMargin.totalOpenMargins = (parseFloat(userBuyOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount))) - parseFloat(userSellOpenMargin.totalOpenMargins);
  //                             //         userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                             //         await userBuyOpenMargin.save();
  //                             //     }
  //                             // } else {
  //                             //     console.log('save user buy open')
  //                             //     userBuyOpenMargin.totalOpenMargins = (parseFloat(userBuyOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount)).toFixed(8));
  //                             //     userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                             //     await userBuyOpenMargin.save();
  //                             // }

  //                             return res.json({variant: 'success', order: order});
  //                         })
  //                         .catch(err => {
  //                             console.log(err);
  //                             return res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
  //                         })
  //                     // withdrawWallet(userWallet, takerAmount);
  //                     // if(parseFloat(resBody.result.left) > 0) {
  //                     //     let makerValue = (parseFloat(resBody.result.price) * parseFloat(resBody.result.amount));
  //                     //     let makerAmount = makerValue + (makerValue * parseFloat(req.body.maker_fee_rate));
  //                     //     userWallet.walletAmount = (parseFloat(userWallet.walletAmount) - makerAmount).toFixed(2);
  //                     //     userWallet.save();
  //                     //     withdrawWallet(userWallet, makerAmount);
  //                     // } else {
  //                     //     let takerValue = (parseFloat(resBody.result.price) * parseFloat(resBody.result.amount));
  //                     //     let takerAmount = takerValue + (takerValue * parseFloat(req.body.taker_fee_rate));
  //                     //     userWallet.walletAmount = (parseFloat(userWallet.walletAmount) - takerAmount).toFixed(2);
  //                     //     userWallet.save();
  //                     //     withdrawWallet(userWallet, takerAmount);
  //                     // }
  //                 } else {
  //                     res.status(400).json({variant: 'error', amount: 'Insufficient balance.'});
  //                 }
  //             })
  //             .catch(err => {
  //                 console.log(err);
  //                 return res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
  //             });
  //     }

  //     if(order.side === 1) {
  //         UserMarginWallet.findOne({userId: req.body.userId, coin: req.body.crypto})
  //             .then(userWallet => {
  //                 if ((parseFloat(userWallet.walletAmount) >= parseFloat(order.amount)) && (parseFloat(userWallet.walletAmount) > 0)) {
  //                     order.save()
  //                         .then(async order => {
  //                             userWallet.walletAmount = (parseFloat(userWallet.walletAmount) - parseFloat(order.amount)).toFixed(8);
  //                             userWallet.save();

  //                             // if (parseFloat(userBuyOpenMargin.totalOpenMargins) > parseFloat(userSellOpenMargin.totalOpenMargins)) {
  //                             //     userBuyOpenMargin.totalOpenMargins = parseFloat(userBuyOpenMargin.totalOpenMargins) - parseFloat(userSellOpenMargin.totalOpenMargins);
  //                             //     userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                             //     userBuyOpenMargin.save();
  //                             // } else if (parseFloat(userBuyOpenMargin.totalOpenMargins) < parseFloat(userSellOpenMargin.totalOpenMargins)) {
  //                             //     if (parseFloat(userBuyOpenMargin.totalOpenMargins) < (parseFloat(req.body.amount))) {
  //                             //         userSellOpenMargin.totalOpenMargins = (parseFloat(userSellOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount))) - parseFloat(userBuyOpenMargin.totalOpenMargins);
  //                             //         userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                             //         await userSellOpenMargin.save();
  //                             //         userBuyOpenMargin.totalOpenMargins = 0;
  //                             //         userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                             //         await userBuyOpenMargin.save();
  //                             //     } else {
  //                             //         userBuyOpenMargin.totalOpenMargins = parseFloat(userBuyOpenMargin.totalOpenMargins) - (parseFloat(req.body.amount));
  //                             //         userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                             //         await userBuyOpenMargin.save();
  //                             //         userSellOpenMargin.totalOpenMargins = (parseFloat(userSellOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount))) - parseFloat(userSellOpenMargin.totalOpenMargins);
  //                             //         userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                             //         await userSellOpenMargin.save();
  //                             //     }
  //                             // } else {
  //                             //     userSellOpenMargin.totalOpenMargins = (parseFloat(userSellOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount)).toFixed(8));
  //                             //     userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                             //     await userSellOpenMargin.save();
  //                             // }

  //                             return res.json({variant: 'success', order: order});
  //                         })
  //                         .catch(err => {
  //                             console.log(err);
  //                             return res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
  //                         })
  //                     // withdrawWallet(userWallet, parseFloat(order.amount));
  //                 } else {
  //                     return res.status(400).json({variant: 'error', amount: 'Insufficient balance.'});
  //                 }
  //             })
  //             .catch(err => {
  //                 console.log(err);
  //                 return res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
  //             });
  //     }
  // } else {
  //     return res.status(400).json({variant: 'error', amount: 'Selected fiat currency is not available in your region.'});
  // }

  const user = await User.findOne({ _id: req.body.userId });

  let marginWalletId = Math.floor(Math.random() * 900000);
  if (user.marginWalletId) {
    marginWalletId = user.marginWalletId;
  } else {
    user.marginWalletId = marginWalletId;
    await user.save();
  }

  const params = [
    user.marginWalletId,
    req.body.market,
    parseInt(req.body.side),
    req.body.amount,
    req.body.price,
    "0",
    "0",
    req.body.source,
  ];

  const postParamas = {
    method: "order.put_limit",
    params: params,
    id: 1516681174,
  };

  const userFiatWallet = await UserWallet.findOne({
    userId: req.body.userId,
    coin: req.body.fiat,
  });

  if (userFiatWallet && userFiatWallet.active) {
    curl.post(
      keys.tradingURI,
      JSON.stringify(postParamas),
      {},
      function (err, response, body) {
        let resBody = JSON.parse(body);

        if (JSON.parse(body).error === null) {
          let order = new Order();
          order.userId = req.body.userId;
          order.orderId = resBody.result.id;
          order.side = resBody.result.side;
          order.type = resBody.result.type;
          order.market = resBody.result.market;
          order.takerFee = resBody.result.taker_fee;
          order.makerFee = resBody.result.maker_fee;
          order.amount = resBody.result.amount;
          order.price = resBody.result.price;
          order.source = resBody.result.source;
          order.dealFee = resBody.result.deal_fee;
          order.dealMoney = resBody.result.deal_money;
          order.dealStock = resBody.result.deal_stock;
          order.margin = true;
          order.mTime = resBody.result.mtime;
          order.cTime = resBody.result.ctime;
          order.save();

          const walletTransactions = new WalletTransactions({
            userId: req.body.user_id,
            txid: resBody.result.id,
            confirmations: 0,
            type: "Limit",
            rate: resBody.result.price,
            value: resBody.result.amount,
            fees: resBody.result.deal_fee,
            coin: resBody.result.market,
            state: "",
          });
          walletTransactions.save();

          if (resBody.result.side === 2) {
            UserMarginWallet.findOne({
              userId: req.body.userId,
              coin: req.body.fiat,
            })
              .then(async (userWallet) => {
                if (parseFloat(resBody.result.left) > 0) {
                  let makerValue =
                    parseFloat(resBody.result.price) *
                    parseFloat(resBody.result.amount);
                  let makerAmount =
                    makerValue +
                    makerValue * parseFloat(req.body.maker_fee_rate);
                  userWallet.walletAmount = (
                    parseFloat(userWallet.walletAmount) - makerAmount
                  ).toFixed(2);
                  await userWallet.save();
                  // await WalletController.withdrawMarginWallet(userWallet, makerAmount, user);
                } else {
                  let takerValue =
                    parseFloat(resBody.result.price) *
                    parseFloat(resBody.result.amount);
                  let takerAmount =
                    takerValue +
                    takerValue * parseFloat(req.body.taker_fee_rate);
                  userWallet.walletAmount = (
                    parseFloat(userWallet.walletAmount) - takerAmount
                  ).toFixed(2);
                  await userWallet.save();
                  // await WalletController.withdrawMarginWallet(userWallet, takerAmount, user);
                }
              })
              .catch((err) => {
                //
              });
          }

          if (resBody.result.side === 1) {
            UserMarginWallet.findOne({
              userId: req.body.userId,
              coin: req.body.crypto,
            })
              .then(async (userWallet) => {
                userWallet.walletAmount = (
                  parseFloat(userWallet.walletAmount) -
                  parseFloat(resBody.result.amount)
                ).toFixed(8);
                await userWallet.save();
                // await WalletController.withdrawWallet(userWallet, parseFloat(resBody.result.amount));
              })
              .catch((err) => {
                //
              });
          }

          ReferralTree.findOne({ referredUser: req.body.userId })
            .then((referralTree) => {
              if (referralTree) {
                ReferralSetting.find().then((referralSettings) => {
                  if (referralSettings.length > 0) {
                    let refEarn =
                      parseFloat(resBody.result.price) *
                      parseFloat(req.body.maker_fee_rate) *
                      parseFloat(referralSettings[0].commissionPercentage);
                    referralTree.referredUserEarning = (
                      parseFloat(referralTree.referredUserEarning) +
                      parseFloat(refEarn)
                    ).toFixed(4);
                    referralTree.save();
                    Referral.findOne({ _id: referralTree.referralId })
                      .then((referral) => {
                        if (referral) {
                          referral.totalReferralEarnings = (
                            parseFloat(referral.totalReferralEarnings) +
                            parseFloat(refEarn)
                          ).toFixed(4);
                          referral.save();
                        } else {
                          //
                        }
                      })
                      .catch((err) => {
                        //
                      });
                  } else {
                    //
                  }
                });
              } else {
                //
              }
            })
            .catch((err) => {
              //
            });
        }
        res.json(JSON.parse(body));
      }
    );
  } else {
    return res.status(400).json({
      variant: "error",
      amount: "Selected fiat currency is not available in your region.",
    });
  }
});

/**
 * @route POST /api/trading/order/limit
 * @description Create limit order.
 * @access Public
 */
router.post("/order/limit", async (req, res) => {
  const { errors, isValid } = validateLimitOrderInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  if (
    req.body.crypto === "BTX" ||
    req.body.crypto === "BTC" ||
    req.body.crypto === "BCH" ||
    req.body.crypto === "LTC" ||
    req.body.crypto === "XRP" ||
    req.body.crypto === "ETH" ||
    req.body.crypto === "TRX" ||
    req.body.crypto === "USDT"
  ) {
    const user = await User.findOne({ _id: req.body.userId });
    let taker_fee_rate = 0;
    let maker_fee_rate = 0;

    if (user) {
      const userProfile = await UserProfile.findOne({ userId: user._id });
      const agentUser = await AgentUsers.findOne({ userId: user._id });

      if (agentUser) {
        agent = await User.findOne({ _id: agentUser.agentId });
        if (agent) {
          _is_agent = true;
          const agentProfile = await UserProfile.findOne({ userId: agent._id });

          if (agent.agent) {
            const agentTraderLevel = await AgentTraderLevel.findOne({
              name: `${agentProfile.traderLevel}`,
            });
            agent_taker_fee = parseFloat(agentTraderLevel.taker_fee) / 100;
            agent_maker_fee = parseFloat(agentTraderLevel.maker_fee) / 100;
          } else if (agent.subAgent) {
            const agentTraderLevel = await SubAgentTraderLevel.findOne({
              name: `${agentProfile.traderLevel}`,
            });
            agent_taker_fee = parseFloat(agentTraderLevel.taker_fee) / 100;
            agent_maker_fee = parseFloat(agentTraderLevel.maker_fee) / 100;
          }
          let clientTraderLevel = await AgentClientTraderLevel.findOne({
            clientId: user._id,
            name: `${userProfile.traderLevel}`,
          });
          if (clientTraderLevel) {
            taker_fee_rate = parseFloat(clientTraderLevel.taker_fee) / 100;
            maker_fee_rate = parseFloat(clientTraderLevel.maker_fee) / 100;
          } else {
            clientTraderLevel = await InrTraderLevel.findOne({
              name: `${agentProfile.traderLevel}`,
            });
            if (clientTraderLevel) {
              taker_fee_rate = parseFloat(clientTraderLevel.taker_fee) / 100;
              maker_fee_rate = parseFloat(clientTraderLevel.maker_fee) / 100;
            }
          }
        }
      } else {
        if (userProfile) {
          if (user.agent) {
            const traderLevel = await AgentTraderLevel.findOne({
              name: `${userProfile.traderLevel}`,
            });
            taker_fee_rate = parseFloat(traderLevel.taker_fee) / 100;
            maker_fee_rate = parseFloat(traderLevel.maker_fee) / 100;
          } else if (user.subAgent) {
            const traderLevel = await SubAgentTraderLevel.findOne({
              name: `${userProfile.traderLevel}`,
            });
            taker_fee_rate = parseFloat(traderLevel.taker_fee) / 100;
            maker_fee_rate = parseFloat(traderLevel.maker_fee) / 100;
          } else {
            const traderLevel = await TraderLevel.findOne({
              name: `${userProfile.traderLevel}`,
            });
            taker_fee_rate = parseFloat(traderLevel.taker_fee) / 100;
            maker_fee_rate = parseFloat(traderLevel.maker_fee) / 100;
          }
        }
      }
    }

    const params = [
      user.viabtcUserId,
      req.body.market,
      parseInt(req.body.side),
      req.body.amount,
      req.body.price,
      taker_fee_rate.toString(),
      maker_fee_rate.toString(),
      req.body.source,
    ];

    console.log(params);

    const postParamas = {
      method: "order.put_limit",
      params: params,
      id: 1516681174,
    };

    const userFiatWallet = await UserWallet.findOne({
      userId: req.body.userId,
      coin: req.body.fiat,
    });

    if (userFiatWallet && userFiatWallet.active) {
      curl.post(
        keys.tradingURI,
        JSON.stringify(postParamas),
        {},
        function (err, response, body) {
          let resBody = JSON.parse(body);

          if (JSON.parse(body).error === null) {
            let order = new Order();
            order.userId = req.body.userId;
            order.orderId = resBody.result.id;
            order.side = resBody.result.side;
            order.type = resBody.result.type;
            order.market = resBody.result.market;
            order.takerFee = resBody.result.taker_fee;
            order.makerFee = resBody.result.maker_fee;
            order.amount = resBody.result.amount;
            order.left = resBody.result.left;
            order.price = resBody.result.price;
            order.source = resBody.result.source;
            order.dealFee = resBody.result.deal_fee;
            order.dealMoney = resBody.result.deal_money;
            order.dealStock = resBody.result.deal_stock;
            order.mTime = resBody.result.mtime;
            order.cTime = resBody.result.ctime;
            order.save();

            const walletTransactions = new WalletTransactions({
              userId: req.body.user_id,
              txid: resBody.result.id,
              confirmations: 0,
              type: "Limit",
              rate: resBody.result.price,
              value: resBody.result.amount,
              fees: resBody.result.deal_fee,
              coin: resBody.result.market,
              state: "",
            });
            walletTransactions.save();

            if (resBody.result.side === 2) {
              UserWallet.findOne({
                userId: req.body.userId,
                coin: req.body.fiat,
              })
                .then(async (userWallet) => {
                  if (parseFloat(resBody.result.left) > 0) {
                    let makerValue =
                      parseFloat(resBody.result.price) *
                      parseFloat(resBody.result.amount);
                    let makerAmount = makerValue;
                    userWallet.walletAmount = (
                      parseFloat(userWallet.walletAmount) - makerAmount
                    ).toFixed(2);
                    await userWallet.save();
                    // await WalletController.withdrawWallet(userWallet, makerAmount);
                  } else {
                    let takerValue =
                      parseFloat(resBody.result.price) *
                      parseFloat(resBody.result.amount);
                    let takerAmount = takerValue;
                    userWallet.walletAmount = (
                      parseFloat(userWallet.walletAmount) - takerAmount
                    ).toFixed(2);
                    await userWallet.save();
                    // await WalletController.withdrawWallet(userWallet, takerAmount);
                  }
                })
                .catch((err) => {
                  //
                });
            }

            if (resBody.result.side === 1) {
              UserWallet.findOne({
                userId: req.body.userId,
                coin: req.body.crypto,
              })
                .then(async (userWallet) => {
                  userWallet.walletAmount = (
                    parseFloat(userWallet.walletAmount) -
                    parseFloat(resBody.result.amount)
                  ).toFixed(8);
                  await userWallet.save();
                  // await WalletController.withdrawWallet(userWallet, parseFloat(resBody.result.amount));
                })
                .catch((err) => {
                  //
                });
            }

            ReferralTree.findOne({ referredUser: req.body.userId })
              .then((referralTree) => {
                if (referralTree) {
                  ReferralSetting.find().then((referralSettings) => {
                    if (referralSettings.length > 0) {
                      let refEarn =
                        parseFloat(resBody.result.price) *
                        parseFloat(req.body.maker_fee_rate) *
                        parseFloat(referralSettings[0].commissionPercentage);
                      referralTree.referredUserEarning = (
                        parseFloat(referralTree.referredUserEarning) +
                        parseFloat(refEarn)
                      ).toFixed(4);
                      referralTree.save();
                      Referral.findOne({ _id: referralTree.referralId })
                        .then((referral) => {
                          if (referral) {
                            referral.totalReferralEarnings = (
                              parseFloat(referral.totalReferralEarnings) +
                              parseFloat(refEarn)
                            ).toFixed(4);
                            referral.save();
                          } else {
                            //
                          }
                        })
                        .catch((err) => {
                          //
                        });
                    } else {
                      //
                    }
                  });
                } else {
                  //
                }
              })
              .catch((err) => {
                //
              });
            return res.json({ variant: "success", order: order });
          } else {
            return res.status(400).json({
              variant: "error",
              amount: "Error placing an order. Please try again",
            });
          }
        }
      );
    } else {
      return res.status(400).json({
        variant: "error",
        amount: "Selected fiat currency is not available in your region.",
      });
    }
  } else {
    let order = new Order();
    order.userId = req.body.userId;
    order.orderId = uuidv4();
    order.side = parseInt(req.body.side);
    order.type = 1;
    order.market = req.body.market;
    order.takerFee = req.body.taker_fee_rate;
    order.makerFee = req.body.maker_fee_rate;
    order.amount = req.body.amount;
    order.price = req.body.price;
    order.dealMoney = req.body.price;
    order.dealStock = req.body.amount;
    order.mTime = Date.now();
    order.cTime = Date.now();

    const userFiatWallet = await UserWallet.findOne({
      userId: req.body.userId,
      coin: req.body.fiat,
    });

    if (userFiatWallet && userFiatWallet.active) {
      if (order.side === 2) {
        let takerValue = parseFloat(order.price) * parseFloat(order.amount);
        let takerAmount =
          takerValue + takerValue * parseFloat(req.body.taker_fee_rate);

        UserWallet.findOne({ userId: req.body.userId, coin: req.body.fiat })
          .then((userWallet) => {
            if (
              parseFloat(userWallet.walletAmount) >= takerAmount &&
              parseFloat(userWallet.walletAmount) > 0
            ) {
              order
                .save()
                .then(async (order) => {
                  console.log("order");
                  // let withdrawRequest = await WalletController.withdrawWallet(userWallet, parseFloat(takerAmount));
                  // if (withdrawRequest) {
                  //     console.log(`viabtc balance updated ${order.userId}`);
                  // } else {
                  //     console.log(`viabtc balance failed ${order.userId}`);
                  // }
                  userWallet.walletAmount = (
                    parseFloat(userWallet.walletAmount) - takerAmount
                  ).toFixed(2);
                  await userWallet.save();

                  return res.json({ variant: "success", order: order });
                })
                .catch((err) => {
                  // console.log(err);
                  return res.status(400).json({
                    variant: "error",
                    amount: "Error placing order, try again.",
                  });
                });
            } else {
              // console.log('order', takerAmount, userWallet.walletAmount);
              return res
                .status(400)
                .json({ variant: "error", amount: "Insufficient balance." });
            }
          })
          .catch((err) => {
            // console.log(err);
            return res.status(400).json({
              variant: "error",
              amount: "Error placing order, try again.",
            });
          });
      }

      if (order.side === 1) {
        UserWallet.findOne({ userId: req.body.userId, coin: req.body.crypto })
          .then((userWallet) => {
            if (
              parseFloat(userWallet.walletAmount) >= parseFloat(order.amount) &&
              parseFloat(userWallet.walletAmount) > 0
            ) {
              order
                .save()
                .then(async (order) => {
                  // let withdrawRequest = await WalletController.withdrawWallet(userWallet, parseFloat(order.amount));
                  // if (withdrawRequest) {
                  //     console.log(`viabtc balance updated ${order.userId}`);
                  // } else {
                  //     console.log(`viabtc balance failed ${order.userId}`);
                  // }
                  userWallet.walletAmount = (
                    parseFloat(userWallet.walletAmount) -
                    parseFloat(order.amount)
                  ).toFixed(8);
                  await userWallet.save();

                  return res.json({ variant: "success", order: order });
                })
                .catch((err) => {
                  // console.log(err);
                  return res.status(400).json({
                    variant: "error",
                    amount: "Error placing order, try again.",
                  });
                });
              // withdrawWallet(userWallet, parseFloat(order.amount));
            } else {
              return res
                .status(400)
                .json({ variant: "error", amount: "Insufficient balance." });
            }
          })
          .catch((err) => {
            // console.log(err);
            return res.status(400).json({
              variant: "error",
              amount: "Error placing order, try again.",
            });
          });
      }
    } else {
      return res.status(400).json({
        variant: "error",
        amount: "Selected fiat currency is not available in your region.",
      });
    }
  }
});

/**
 * @route POST /api/trading/order/margin_market
 * @description Create market order.
 * @access Public
 */
router.post("/order/margin_market", async (req, res) => {
  const { errors, isValid } = validateMarketOrderInput(req.body);

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // console.log(getAssetCoin(req.body.market), req.body.market);

  // if (getAssetCoin(req.body.market).lastBuy <= 0 || getAssetCoin(req.body.market).lastSell <= 0) {
  //     return res.status(400).json({variant: 'error', amount: 'Websocket error! please try again later.'});
  // }

  // let taker_fee_rate = req.body.taker_fee_rate;
  // let _is_agent = false;
  // let agent_taker_fee = 0;
  // let agent;
  // const user = await User.findOne({_id: req.body.userId});

  // if (user) {
  //     const userProfile = await UserProfile.findOne({userId: user._id});
  //     const agentUser = await AgentUsers.findOne({userId: user._id});

  //     if (agentUser) {
  //         agent = await User.findOne({_id: agentUser.agentId});
  //         if (agent) {
  //             _is_agent = true;
  //             const agentProfile = await UserProfile.findOne({userId: agent._id});

  //             if (agent.agent) {
  //                 const agentTraderLevel = await AgentTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
  //                 agent_taker_fee = parseFloat(agentTraderLevel.taker_fee)/100;
  //             } else if (agent.subAgent) {
  //                 const agentTraderLevel = await SubAgentTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
  //                 agent_taker_fee = parseFloat(agentTraderLevel.taker_fee)/100;
  //             }
  //             let clientTraderLevel = await AgentClientTraderLevel.findOne({clientId: user._id, name: `${userProfile.traderLevel}`});
  //             if (clientTraderLevel) {
  //                 taker_fee_rate = parseFloat(clientTraderLevel.taker_fee)/100;
  //             } else {
  //                 clientTraderLevel = await InrTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
  //                 if (clientTraderLevel) {
  //                     taker_fee_rate = parseFloat(clientTraderLevel.taker_fee)/100;
  //                 }
  //             }
  //         }
  //     } else {
  //         if (userProfile) {
  //             if (user.agent) {
  //                 const traderLevel = await AgentTraderLevel.findOne({name: `${userProfile.traderLevel}`});
  //                 taker_fee_rate = parseFloat(traderLevel.taker_fee)/100;
  //             } else if(user.subAgent) {
  //                 const traderLevel = await SubAgentTraderLevel.findOne({name: `${userProfile.traderLevel}`});
  //                 taker_fee_rate = parseFloat(traderLevel.taker_fee)/100;
  //             } else {
  //                 const traderLevel = await TraderLevel.findOne({name: `${userProfile.traderLevel}`});
  //                 taker_fee_rate = parseFloat(traderLevel.taker_fee)/100;
  //             }
  //         }
  //     }
  // }

  // let order = new Order;
  // order.userId = req.body.userId;
  // order.orderId = uuidv4();
  // order.side = parseInt(req.body.side);
  // order.type = 2;
  // order.market = req.body.market;
  // order.takerFee = taker_fee_rate;
  // order.makerFee = 0;
  // order.amount = req.body.amount;
  // order.price = parseInt(req.body.side) === 2 ? getAssetCoin(req.body.market).lastSell : getAssetCoin(req.body.market).lastBuy;
  // order.dealFee = taker_fee_rate;
  // order.dealMoney = 0 ? getAssetCoin(req.body.market).lastSell : getAssetCoin(req.body.market).lastBuy;
  // order.dealStock = parseInt(req.body.side) === 2 ? (parseFloat(req.body.amount) / parseFloat(parseInt(req.body.side) === 2 ? getAssetCoin(req.body.market).lastSell : getAssetCoin(req.body.market).lastBuy)).toFixed(8) : parseFloat(req.body.amount);
  // order.mTime = Date.now();
  // order.cTime = Date.now();
  // order.margin = true;
  // order.status = 'Finished';

  // let userBuyOpenMargin = await UserOpenMargin.findOne({
  //     userId: req.body.userId,
  //     coin: req.body.crypto,
  //     market: req.body.market,
  //     type: 'buy'
  // });
  // let userSellOpenMargin = await UserOpenMargin.findOne({
  //     userId: req.body.userId,
  //     coin: req.body.crypto,
  //     market: req.body.market,
  //     type: 'sell'
  // });

  // if (!userBuyOpenMargin) {
  //     userBuyOpenMargin = new UserOpenMargin;
  //     userBuyOpenMargin.userId = req.body.userId;
  //     userBuyOpenMargin.type = 'buy';
  //     userBuyOpenMargin.totalOpenMargins = 0;
  //     userBuyOpenMargin.coin = req.body.crypto;
  //     userBuyOpenMargin.market = req.body.market;
  //     userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //     userBuyOpenMargin.save();
  // }

  // if (!userSellOpenMargin) {
  //     userSellOpenMargin = new UserOpenMargin;
  //     userSellOpenMargin.userId = req.body.userId;
  //     userSellOpenMargin.type = 'sell';
  //     userSellOpenMargin.totalOpenMargins = 0;
  //     userSellOpenMargin.coin = req.body.crypto;
  //     userSellOpenMargin.market = req.body.market;
  //     userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //     userSellOpenMargin.save();
  // }

  // let userFiatWallet = await UserMarginWallet.findOne({userId: req.body.userId, coin: req.body.fiat});
  // let userCryptoWallet = await UserMarginWallet.findOne({userId: req.body.userId, coin: req.body.crypto});

  // if (userFiatWallet && userCryptoWallet) {
  //     if (!userFiatWallet.active) {
  //         return res.status(400).json({variant: 'error', amount: 'Selected fiat currency is not available in your region.'});
  //     }
  //     let dealFinalBuyPrice = (parseFloat(order.amount)) + ((parseFloat(order.amount)) * (parseFloat(order.takerFee)));
  //     let dealFinalSellPrice = (parseFloat(order.amount) * parseFloat(getAssetCoin(order.market).lastBuy)) - ((parseFloat(order.amount) * parseFloat(getAssetCoin(order.market).lastBuy)) * (parseFloat(order.takerFee)));

  //     let agentDealFinalBuyFee = ((parseFloat(order.amount)) * (parseFloat(agent_taker_fee)));
  //     let agentDealFinalSellFee = ((parseFloat(order.amount) * parseFloat(getAssetCoin(order.market).lastBuy)) * (parseFloat(agent_taker_fee)));

  //     if(order.side === 2) {
  //         if ((parseFloat(userFiatWallet.walletAmount) >= dealFinalBuyPrice) && (parseFloat(userFiatWallet.walletAmount) > 0)) {
  //             order.save()
  //                 .then(async order => {
  //                     // Fiat wallet Update
  //                     userFiatWallet.walletAmount = (parseFloat(userFiatWallet.walletAmount) - parseFloat(dealFinalBuyPrice)).toFixed(2);
  //                     userFiatWallet.save();
  //                     // withdrawWallet(userWallet, parseFloat(dealFinalPrice));

  //                     // Crypto Wallet update
  //                     console.log(getAssetCoin(req.body.market).lastBuy);
  //                     userCryptoWallet.walletAmount = (parseFloat(userCryptoWallet.walletAmount) + (parseFloat(order.amount) / parseFloat(getAssetCoin(order.market).lastSell))).toFixed(8);
  //                     userCryptoWallet.save();

  //                     if (_is_agent) {
  //                         if (user) {
  //                             if(agent) {
  //                                 let agentFiatWallet = await UserMarginWallet.findOne({userId: agent._id, coin: req.body.fiat});

  //                                 // Fiat wallet Update
  //                                 agentFiatWallet.walletAmount = (parseFloat(agentFiatWallet.walletAmount) - agentDealFinalBuyFee).toFixed(2);
  //                                 agentFiatWallet.save();
  //                             }
  //                         }
  //                     }

  //                     // if (parseFloat(userSellOpenMargin.totalOpenMargins) > parseFloat(userBuyOpenMargin.totalOpenMargins)) {
  //                     //     userSellOpenMargin.totalOpenMargins = parseFloat(userSellOpenMargin.totalOpenMargins) - parseFloat(userBuyOpenMargin.totalOpenMargins);
  //                     //     userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                     //     userSellOpenMargin.save();
  //                     // } else if (parseFloat(userSellOpenMargin.totalOpenMargins) < parseFloat(userBuyOpenMargin.totalOpenMargins)) {
  //                     //     if (parseFloat(userSellOpenMargin.totalOpenMargins) < (parseFloat(req.body.amount) / parseFloat(getAssetCoin(req.body.market).lastSell))) {
  //                     //         userBuyOpenMargin.totalOpenMargins = (parseFloat(userBuyOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount) / parseFloat(getAssetCoin(req.body.market).lastSell))) - parseFloat(userSellOpenMargin.totalOpenMargins);
  //                     //         userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                     //         await userBuyOpenMargin.save();
  //                     //         userSellOpenMargin.totalOpenMargins = 0;
  //                     //         userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                     //         await userSellOpenMargin.save();
  //                     //     } else {
  //                     //         userSellOpenMargin.totalOpenMargins = parseFloat(userSellOpenMargin.totalOpenMargins) - (parseFloat(req.body.amount) / parseFloat(getAssetCoin(req.body.market).lastSell));
  //                     //         userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                     //         await userSellOpenMargin.save();
  //                     //         userBuyOpenMargin.totalOpenMargins = (parseFloat(userBuyOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount) / parseFloat(getAssetCoin(req.body.market).lastSell))) - parseFloat(userSellOpenMargin.totalOpenMargins);
  //                     //         userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                     //         await userBuyOpenMargin.save();
  //                     //     }
  //                     // } else {
  //                     //     userBuyOpenMargin.totalOpenMargins = (parseFloat(userBuyOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount) / parseFloat(getAssetCoin(req.body.market).lastSell)).toFixed(8));
  //                     //     userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                     //     await userBuyOpenMargin.save();
  //                     // }

  //                     // const walletTransactions = new WalletTransactions({
  //                     //     userId: req.body.user_id,
  //                     //     txid: order.orderId,
  //                     //     confirmations: 0,
  //                     //     type: 'Market',
  //                     //     rate: req.body.marketSubtotal,
  //                     //     value: order.dealStock,
  //                     //     fees: order.dealFee,
  //                     //     coin: order.market,
  //                     //     state: '',
  //                     // })
  //                     // walletTransactions.save();

  //                     ReferralTree.findOne({referredUser: req.body.userId})
  //                         .then(referralTree => {
  //                             if(referralTree) {
  //                                 ReferralSetting.find()
  //                                     .then(referralSettings => {
  //                                         if(referralSettings.length > 0) {
  //                                             let refEarn = (parseFloat(order.amount) * parseFloat(order.takerFee)) * parseFloat(referralSettings[0].commissionPercentage);
  //                                             referralTree.referredUserEarning = (parseFloat(referralTree.referredUserEarning) + parseFloat(refEarn)).toFixed(4);
  //                                             referralTree.save();
  //                                             Referral.findOne({_id: referralTree.referralId})
  //                                                 .then(referral => {
  //                                                     if(referral) {
  //                                                         referral.totalReferralEarnings = (parseFloat(referral.totalReferralEarnings) + parseFloat(refEarn)).toFixed(4);
  //                                                         referral.save();
  //                                                     } else {
  //                                                         //
  //                                                     }
  //                                                 })
  //                                                 .catch(err => {
  //                                                     //
  //                                                 })
  //                                         } else {
  //                                             //
  //                                         }
  //                                     })
  //                             } else {
  //                                 //
  //                             }
  //                         })
  //                         .catch(err => {
  //                             //
  //                         });
  //                         res.json({variant: 'success', order: order});
  //                 })
  //                 .catch(err => {
  //                     res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
  //                 });
  //         } else {
  //             res.status(400).json({variant: 'error', amount: 'Insufficient balance.'});
  //         }
  //     } else {
  //         if ((parseFloat(userCryptoWallet.walletAmount) >= parseFloat(order.amount)) && (parseFloat(userCryptoWallet.walletAmount) > 0)) {
  //             order.save()
  //                 .then(async order => {
  //                     // Fiat wallet Update
  //                     userFiatWallet.walletAmount = (parseFloat(userFiatWallet.walletAmount) + parseFloat(dealFinalSellPrice)).toFixed(2);
  //                     userFiatWallet.save();

  //                     // Crypto Wallet update
  //                     userCryptoWallet.walletAmount = (parseFloat(userCryptoWallet.walletAmount) - parseFloat(order.amount)).toFixed(8);
  //                     userCryptoWallet.save();
  //                     // depositeWallet(userWallet, parseFloat(dealFinalPrice));

  //                     if (_is_agent) {
  //                         if (user) {
  //                             if(agent) {
  //                                 let agentFiatWallet = await UserMarginWallet.findOne({userId: agent._id, coin: req.body.fiat});

  //                                 // Fiat wallet Update
  //                                 agentFiatWallet.walletAmount = (parseFloat(agentFiatWallet.walletAmount) - agentDealFinalSellFee).toFixed(2);
  //                                 agentFiatWallet.save();
  //                             }
  //                         }
  //                     }

  //                     // if (parseFloat(userBuyOpenMargin.totalOpenMargins) > parseFloat(userSellOpenMargin.totalOpenMargins)) {
  //                     //     userBuyOpenMargin.totalOpenMargins = parseFloat(userBuyOpenMargin.totalOpenMargins) - parseFloat(userSellOpenMargin.totalOpenMargins);
  //                     //     userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                     //     userBuyOpenMargin.save();
  //                     // } else if (parseFloat(userBuyOpenMargin.totalOpenMargins) < parseFloat(userSellOpenMargin.totalOpenMargins)) {
  //                     //     if (parseFloat(userBuyOpenMargin.totalOpenMargins) < (parseFloat(req.body.amount))) {
  //                     //         userSellOpenMargin.totalOpenMargins = (parseFloat(userSellOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount))) - parseFloat(userBuyOpenMargin.totalOpenMargins);
  //                     //         userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                     //         await userSellOpenMargin.save();
  //                     //         userBuyOpenMargin.totalOpenMargins = 0;
  //                     //         userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                     //         await userBuyOpenMargin.save();
  //                     //     } else {
  //                     //         userBuyOpenMargin.totalOpenMargins = parseFloat(userBuyOpenMargin.totalOpenMargins) - (parseFloat(req.body.amount));
  //                     //         userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                     //         await userBuyOpenMargin.save();
  //                     //         userSellOpenMargin.totalOpenMargins = (parseFloat(userSellOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount))) - parseFloat(userSellOpenMargin.totalOpenMargins);
  //                     //         userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                     //         await userSellOpenMargin.save();
  //                     //     }
  //                     // } else {
  //                     //     userSellOpenMargin.totalOpenMargins = (parseFloat(userSellOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount)).toFixed(8));
  //                     //     userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                     //     await userSellOpenMargin.save();
  //                     // }

  //                     // const walletTransactions = new WalletTransactions({
  //                     //     userId: req.body.user_id,
  //                     //     txid: order.orderId,
  //                     //     confirmations: 0,
  //                     //     type: 'Market',
  //                     //     rate: req.body.marketSubtotal,
  //                     //     value: order.dealStock,
  //                     //     fees: order.dealFee,
  //                     //     coin: order.market,
  //                     //     state: '',
  //                     // })
  //                     // walletTransactions.save();

  //                     ReferralTree.findOne({referredUser: req.body.userId})
  //                         .then(referralTree => {
  //                             if(referralTree) {
  //                                 ReferralSetting.find()
  //                                     .then(referralSettings => {
  //                                         if(referralSettings.length > 0) {
  //                                             let orderAmount =(parseFloat(order.amount) * parseFloat(getAssetCoin(order.market).lastBuy)) * (parseFloat(order.takerFee));
  //                                             let refEarn = (parseFloat(orderAmount)) * parseFloat(referralSettings[0].commissionPercentage);
  //                                             referralTree.referredUserEarning = (parseFloat(referralTree.referredUserEarning) + parseFloat(refEarn)).toFixed(4);
  //                                             referralTree.save();
  //                                             Referral.findOne({_id: referralTree.referralId})
  //                                                 .then(referral => {
  //                                                     if(referral) {
  //                                                         referral.totalReferralEarnings = (parseFloat(referral.totalReferralEarnings) + parseFloat(refEarn)).toFixed(4);
  //                                                         referral.save();
  //                                                     } else {
  //                                                         //
  //                                                     }
  //                                                 })
  //                                                 .catch(err => {
  //                                                     //
  //                                                 })
  //                                         } else {
  //                                             //
  //                                         }
  //                                     })
  //                             } else {
  //                                 //
  //                             }
  //                         })
  //                         .catch(err => {
  //                             //
  //                         });
  //                         res.json({variant: 'success', order: order});
  //                 })
  //                 .catch(err => {
  //                     res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
  //                 });

  //         } else {
  //             res.status(400).json({variant: 'error', amount: 'Insufficient balance.'});
  //         }
  //     }
  // } else {
  //     res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
  // }

  let taker_fee_rate = req.body.taker_fee_rate;
  let _is_agent = false;
  let agent_taker_fee = 0;
  let agent;
  const user = await User.findOne({ _id: req.body.userId });
  let marginWalletId = Math.floor(Math.random() * 900000);
  if (user.marginWalletId) {
    marginWalletId = user.marginWalletId;
  } else {
    user.marginWalletId = marginWalletId;
    await user.save();
  }
  if (user) {
    const userProfile = await UserProfile.findOne({ userId: user._id });
    const agentUser = await AgentUsers.findOne({ userId: user._id });

    if (agentUser) {
      agent = await User.findOne({ _id: agentUser.agentId });
      if (agent) {
        _is_agent = true;
        const agentProfile = await UserProfile.findOne({ userId: agent._id });

        if (agent.agent) {
          const agentTraderLevel = await AgentTraderLevel.findOne({
            name: `${agentProfile.traderLevel}`,
          });
          agent_taker_fee = parseFloat(agentTraderLevel.taker_fee) / 100;
        } else if (agent.subAgent) {
          const agentTraderLevel = await SubAgentTraderLevel.findOne({
            name: `${agentProfile.traderLevel}`,
          });
          agent_taker_fee = parseFloat(agentTraderLevel.taker_fee) / 100;
        }
        let clientTraderLevel = await AgentClientTraderLevel.findOne({
          clientId: user._id,
          name: `${userProfile.traderLevel}`,
        });
        if (clientTraderLevel) {
          taker_fee_rate = parseFloat(clientTraderLevel.taker_fee) / 100;
        } else {
          clientTraderLevel = await InrTraderLevel.findOne({
            name: `${agentProfile.traderLevel}`,
          });
          if (clientTraderLevel) {
            taker_fee_rate = parseFloat(clientTraderLevel.taker_fee) / 100;
          }
        }
      }
    } else {
      if (userProfile) {
        if (user.agent) {
          const traderLevel = await AgentTraderLevel.findOne({
            name: `${userProfile.traderLevel}`,
          });
          taker_fee_rate = parseFloat(traderLevel.taker_fee) / 100;
        } else if (user.subAgent) {
          const traderLevel = await SubAgentTraderLevel.findOne({
            name: `${userProfile.traderLevel}`,
          });
          taker_fee_rate = parseFloat(traderLevel.taker_fee) / 100;
        } else {
          const traderLevel = await TraderLevel.findOne({
            name: `${userProfile.traderLevel}`,
          });
          taker_fee_rate = parseFloat(traderLevel.taker_fee) / 100;
        }
      }
    }
  }

  const params = [
    user.marginWalletId,
    req.body.market,
    parseInt(req.body.side),
    req.body.amount,
    req.body.taker_fee_rate + "",
    "",
  ];

  const postParamas = {
    method: "order.put_market",
    params: params,
    id: 1516681174,
  };

  // console.log(postParamas);

  curl.post(
    keys.tradingURI,
    JSON.stringify(postParamas),
    {},
    async function (err, response, body) {
      let resBody = JSON.parse(body);
      // console.log(resBody);

      if (JSON.parse(body).error === null) {
        let order = new Order();
        order.userId = req.body.userId;
        order.orderId = resBody.result.id;
        order.side = resBody.result.side;
        order.type = resBody.result.type;
        order.market = resBody.result.market;
        order.takerFee = resBody.result.taker_fee;
        order.makerFee = resBody.result.maker_fee;
        order.amount = resBody.result.amount;
        order.price = resBody.result.price;
        order.source = resBody.result.source;
        order.dealFee = resBody.result.deal_fee;
        order.dealMoney = resBody.result.deal_money;
        order.dealStock = resBody.result.deal_stock;
        order.mTime = resBody.result.mtime;
        order.cTime = resBody.result.ctime;
        order.margin = true;
        order.status = "Finished";

        let userFiatWallet = await UserMarginWallet.findOne({
          userId: req.body.userId,
          coin: req.body.fiat,
        });
        let userCryptoWallet = await UserMarginWallet.findOne({
          userId: req.body.userId,
          coin: req.body.crypto,
        });

        // console.log(userFiatWallet, userCryptoWallet);
        if (userFiatWallet && userCryptoWallet) {
          if (!userFiatWallet.active) {
            return res.status(400).json({
              variant: "error",
              amount: "Selected fiat currency is not available in your region.",
            });
          }
          let dealFinalBuyPrice =
            parseFloat(order.amount) +
            parseFloat(order.amount) * parseFloat(order.takerFee);
          let dealFinalSellPrice =
            parseFloat(order.amount) *
              parseFloat(getAssetCoin(order.market).lastBuy) -
            parseFloat(order.amount) *
              parseFloat(getAssetCoin(order.market).lastBuy) *
              parseFloat(order.takerFee);

          let agentDealFinalBuyFee =
            parseFloat(order.amount) * parseFloat(agent_taker_fee);
          let agentDealFinalSellFee =
            parseFloat(order.amount) *
            parseFloat(getAssetCoin(order.market).lastBuy) *
            parseFloat(agent_taker_fee);

          if (order.side === 2) {
            if (
              parseFloat(userFiatWallet.walletAmount) >= dealFinalBuyPrice &&
              parseFloat(userFiatWallet.walletAmount) > 0
            ) {
              order
                .save()
                .then(async (order) => {
                  // Fiat wallet Update
                  userFiatWallet.walletAmount = (
                    parseFloat(userFiatWallet.walletAmount) -
                    parseFloat(dealFinalBuyPrice)
                  ).toFixed(2);
                  userFiatWallet.save();
                  // withdrawWallet(userWallet, parseFloat(dealFinalPrice));

                  // Crypto Wallet update
                  // console.log(getAssetCoin(req.body.market).lastBuy);
                  userCryptoWallet.walletAmount = (
                    parseFloat(userCryptoWallet.walletAmount) +
                    parseFloat(order.amount) /
                      parseFloat(getAssetCoin(order.market).lastSell)
                  ).toFixed(8);
                  userCryptoWallet.save();

                  if (_is_agent) {
                    if (user) {
                      if (agent) {
                        let agentFiatWallet = await UserMarginWallet.findOne({
                          userId: agent._id,
                          coin: req.body.fiat,
                        });

                        // Fiat wallet Update
                        agentFiatWallet.walletAmount = (
                          parseFloat(agentFiatWallet.walletAmount) -
                          agentDealFinalBuyFee
                        ).toFixed(2);
                        agentFiatWallet.save();
                      }
                    }
                  }

                  // const walletTransactions = new WalletTransactions({
                  //     userId: req.body.user_id,
                  //     txid: order.orderId,
                  //     confirmations: 0,
                  //     type: 'Market',
                  //     rate: req.body.marketSubtotal,
                  //     value: order.dealStock,
                  //     fees: order.dealFee,
                  //     coin: order.market,
                  //     state: '',
                  // })
                  // walletTransactions.save();

                  ReferralTree.findOne({ referredUser: req.body.userId })
                    .then((referralTree) => {
                      if (referralTree) {
                        ReferralSetting.find().then((referralSettings) => {
                          if (referralSettings.length > 0) {
                            let refEarn =
                              parseFloat(order.amount) *
                              parseFloat(order.takerFee) *
                              parseFloat(
                                referralSettings[0].commissionPercentage
                              );
                            referralTree.referredUserEarning = (
                              parseFloat(referralTree.referredUserEarning) +
                              parseFloat(refEarn)
                            ).toFixed(4);
                            referralTree.save();
                            Referral.findOne({ _id: referralTree.referralId })
                              .then((referral) => {
                                if (referral) {
                                  referral.totalReferralEarnings = (
                                    parseFloat(referral.totalReferralEarnings) +
                                    parseFloat(refEarn)
                                  ).toFixed(4);
                                  referral.save();
                                } else {
                                  //
                                }
                              })
                              .catch((err) => {
                                //
                              });
                          } else {
                            //
                          }
                        });
                      } else {
                        //
                      }
                    })
                    .catch((err) => {
                      //
                    });
                  res.json({ variant: "success", order: order });
                })
                .catch((err) => {
                  // console.log(err);
                  res.status(400).json({
                    variant: "error",
                    amount: "Error placing order, try again.",
                  });
                });
            } else {
              res
                .status(400)
                .json({ variant: "error", amount: "Insufficient balance." });
            }
          } else {
            if (
              parseFloat(userCryptoWallet.walletAmount) >=
                parseFloat(order.amount) &&
              parseFloat(userCryptoWallet.walletAmount) > 0
            ) {
              order
                .save()
                .then(async (order) => {
                  // Fiat wallet Update
                  userFiatWallet.walletAmount = (
                    parseFloat(userFiatWallet.walletAmount) +
                    parseFloat(dealFinalSellPrice)
                  ).toFixed(2);
                  userFiatWallet.save();

                  // Crypto Wallet update
                  userCryptoWallet.walletAmount = (
                    parseFloat(userCryptoWallet.walletAmount) -
                    parseFloat(order.amount)
                  ).toFixed(8);
                  userCryptoWallet.save();
                  // depositeWallet(userWallet, parseFloat(dealFinalPrice));

                  if (_is_agent) {
                    if (user) {
                      if (agent) {
                        let agentFiatWallet = await UserMarginWallet.findOne({
                          userId: agent._id,
                          coin: req.body.fiat,
                        });

                        // Fiat wallet Update
                        agentFiatWallet.walletAmount = (
                          parseFloat(agentFiatWallet.walletAmount) -
                          agentDealFinalSellFee
                        ).toFixed(2);
                        agentFiatWallet.save();
                      }
                    }
                  }

                  // const walletTransactions = new WalletTransactions({
                  //     userId: req.body.user_id,
                  //     txid: order.orderId,
                  //     confirmations: 0,
                  //     type: 'Market',
                  //     rate: req.body.marketSubtotal,
                  //     value: order.dealStock,
                  //     fees: order.dealFee,
                  //     coin: order.market,
                  //     state: '',
                  // })
                  // walletTransactions.save();

                  ReferralTree.findOne({ referredUser: req.body.userId })
                    .then((referralTree) => {
                      if (referralTree) {
                        ReferralSetting.find().then((referralSettings) => {
                          if (referralSettings.length > 0) {
                            let orderAmount =
                              parseFloat(order.amount) *
                              parseFloat(getAssetCoin(order.market).lastBuy) *
                              parseFloat(order.takerFee);
                            let refEarn =
                              parseFloat(orderAmount) *
                              parseFloat(
                                referralSettings[0].commissionPercentage
                              );
                            referralTree.referredUserEarning = (
                              parseFloat(referralTree.referredUserEarning) +
                              parseFloat(refEarn)
                            ).toFixed(4);
                            referralTree.save();
                            Referral.findOne({ _id: referralTree.referralId })
                              .then((referral) => {
                                if (referral) {
                                  referral.totalReferralEarnings = (
                                    parseFloat(referral.totalReferralEarnings) +
                                    parseFloat(refEarn)
                                  ).toFixed(4);
                                  referral.save();
                                } else {
                                  //
                                }
                              })
                              .catch((err) => {
                                //
                              });
                          } else {
                            //
                          }
                        });
                      } else {
                        //
                      }
                    })
                    .catch((err) => {
                      //
                    });
                  res.json({ variant: "success", order: order });
                })
                .catch((err) => {
                  // console.log(err);
                  res.status(400).json({
                    variant: "error",
                    amount: "Error placing order, try again.",
                  });
                });
            } else {
              res
                .status(400)
                .json({ variant: "error", amount: "Insufficient balance." });
            }
          }
        } else {
          // console.log('error here...');
          res.status(400).json({
            variant: "error",
            amount: "Error placing order, try again.",
          });
        }
      } else {
        res.status(400).json({
          variant: "error",
          amount: "Error placing order, try again.",
        });
      }
    }
  );

  // const params = [
  //     parseInt(req.body.userId.replace(/\D/g,'')),
  //     req.body.market,
  //     parseInt(req.body.side),
  //     req.body.amount,
  //     req.body.taker_fee_rate+'',
  //     req.body.source,
  // ];

  // const postParamas = {
  //     method: 'order.put_market',
  //     params: params,
  //     id: 1516681174
  // }

  // curl.post(keys.tradingURI, JSON.stringify(postParamas), {}, async function(err, response, body) {
  //     let resBody = JSON.parse(body);

  //     if(JSON.parse(body).error === null) {
  //         let order = new Order;
  //         order.userId = req.body.userId;
  //         order.orderId = resBody.result.id;
  //         order.side = resBody.result.side;
  //         order.type = resBody.result.type;
  //         order.market = resBody.result.market;
  //         order.takerFee = resBody.result.taker_fee;
  //         order.makerFee = resBody.result.maker_fee;
  //         order.amount = resBody.result.amount;
  //         order.price = resBody.result.price;
  //         order.source = resBody.result.source;
  //         order.dealFee = resBody.result.deal_fee;
  //         order.dealMoney = resBody.result.deal_money;
  //         order.dealStock = resBody.result.deal_stock;
  //         order.mTime = resBody.result.mtime;
  //         order.cTime = resBody.result.ctime;
  //         order.status = 'Finished';

  //         let userFiatWallet = await UserMarginWallet.findOne({userId: req.body.userId, coin: req.body.fiat});
  //         let userCryptoWallet = await UserMarginWallet.findOne({userId: req.body.userId, coin: req.body.crypto});

  //         if (userFiatWallet && userCryptoWallet) {
  //             if (!userFiatWallet.active) {
  //                 return res.status(400).json({variant: 'error', amount: 'Selected fiat currency is not available in your region.'});
  //             }
  //             let dealFinalBuyPrice = (parseFloat(order.amount)) + ((parseFloat(order.amount)) * (parseFloat(order.takerFee)));
  //             let dealFinalSellPrice = (parseFloat(order.amount) * parseFloat(getAssetCoin(order.market).lastBuy)) - ((parseFloat(order.amount) * parseFloat(getAssetCoin(order.market).lastBuy)) * (parseFloat(order.takerFee)));

  //             let agentDealFinalBuyFee = ((parseFloat(order.amount)) * (parseFloat(agent_taker_fee)));
  //             let agentDealFinalSellFee = ((parseFloat(order.amount) * parseFloat(getAssetCoin(order.market).lastBuy)) * (parseFloat(agent_taker_fee)));

  //             if(order.side === 2) {
  //                 if ((parseFloat(userFiatWallet.walletAmount) >= dealFinalBuyPrice) && (parseFloat(userFiatWallet.walletAmount) > 0)) {
  //                     order.save()
  //                         .then(async order => {
  //                             // Fiat wallet Update
  //                             userFiatWallet.walletAmount = (parseFloat(userFiatWallet.walletAmount) - parseFloat(dealFinalBuyPrice)).toFixed(2);
  //                             userFiatWallet.save();
  //                             // withdrawWallet(userWallet, parseFloat(dealFinalPrice));

  //                             // Crypto Wallet update
  //                             console.log(getAssetCoin(req.body.market).lastBuy);
  //                             userCryptoWallet.walletAmount = (parseFloat(userCryptoWallet.walletAmount) + (parseFloat(order.amount) / parseFloat(getAssetCoin(order.market).lastSell))).toFixed(8);
  //                             userCryptoWallet.save();

  //                             if (_is_agent) {
  //                                 if (user) {
  //                                     if(agent) {
  //                                         let agentFiatWallet = await UserMarginWallet.findOne({userId: agent._id, coin: req.body.fiat});

  //                                         // Fiat wallet Update
  //                                         agentFiatWallet.walletAmount = (parseFloat(agentFiatWallet.walletAmount) - agentDealFinalBuyFee).toFixed(2);
  //                                         agentFiatWallet.save();
  //                                     }
  //                                 }
  //                             }

  //                             // if (parseFloat(userSellOpenMargin.totalOpenMargins) > parseFloat(userBuyOpenMargin.totalOpenMargins)) {
  //                             //     userSellOpenMargin.totalOpenMargins = parseFloat(userSellOpenMargin.totalOpenMargins) - parseFloat(userBuyOpenMargin.totalOpenMargins);
  //                             //     userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                             //     userSellOpenMargin.save();
  //                             // } else if (parseFloat(userSellOpenMargin.totalOpenMargins) < parseFloat(userBuyOpenMargin.totalOpenMargins)) {
  //                             //     if (parseFloat(userSellOpenMargin.totalOpenMargins) < (parseFloat(req.body.amount) / parseFloat(getAssetCoin(req.body.market).lastSell))) {
  //                             //         userBuyOpenMargin.totalOpenMargins = (parseFloat(userBuyOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount) / parseFloat(getAssetCoin(req.body.market).lastSell))) - parseFloat(userSellOpenMargin.totalOpenMargins);
  //                             //         userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                             //         await userBuyOpenMargin.save();
  //                             //         userSellOpenMargin.totalOpenMargins = 0;
  //                             //         userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                             //         await userSellOpenMargin.save();
  //                             //     } else {
  //                             //         userSellOpenMargin.totalOpenMargins = parseFloat(userSellOpenMargin.totalOpenMargins) - (parseFloat(req.body.amount) / parseFloat(getAssetCoin(req.body.market).lastSell));
  //                             //         userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                             //         await userSellOpenMargin.save();
  //                             //         userBuyOpenMargin.totalOpenMargins = (parseFloat(userBuyOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount) / parseFloat(getAssetCoin(req.body.market).lastSell))) - parseFloat(userSellOpenMargin.totalOpenMargins);
  //                             //         userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                             //         await userBuyOpenMargin.save();
  //                             //     }
  //                             // } else {
  //                             //     userBuyOpenMargin.totalOpenMargins = (parseFloat(userBuyOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount) / parseFloat(getAssetCoin(req.body.market).lastSell)).toFixed(8));
  //                             //     userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                             //     await userBuyOpenMargin.save();
  //                             // }

  //                             // const walletTransactions = new WalletTransactions({
  //                             //     userId: req.body.user_id,
  //                             //     txid: order.orderId,
  //                             //     confirmations: 0,
  //                             //     type: 'Market',
  //                             //     rate: req.body.marketSubtotal,
  //                             //     value: order.dealStock,
  //                             //     fees: order.dealFee,
  //                             //     coin: order.market,
  //                             //     state: '',
  //                             // })
  //                             // walletTransactions.save();

  //                             ReferralTree.findOne({referredUser: req.body.userId})
  //                                 .then(referralTree => {
  //                                     if(referralTree) {
  //                                         ReferralSetting.find()
  //                                             .then(referralSettings => {
  //                                                 if(referralSettings.length > 0) {
  //                                                     let refEarn = (parseFloat(order.amount) * parseFloat(order.takerFee)) * parseFloat(referralSettings[0].commissionPercentage);
  //                                                     referralTree.referredUserEarning = (parseFloat(referralTree.referredUserEarning) + parseFloat(refEarn)).toFixed(4);
  //                                                     referralTree.save();
  //                                                     Referral.findOne({_id: referralTree.referralId})
  //                                                         .then(referral => {
  //                                                             if(referral) {
  //                                                                 referral.totalReferralEarnings = (parseFloat(referral.totalReferralEarnings) + parseFloat(refEarn)).toFixed(4);
  //                                                                 referral.save();
  //                                                             } else {
  //                                                                 //
  //                                                             }
  //                                                         })
  //                                                         .catch(err => {
  //                                                             //
  //                                                         })
  //                                                 } else {
  //                                                     //
  //                                                 }
  //                                             })
  //                                     } else {
  //                                         //
  //                                     }
  //                                 })
  //                                 .catch(err => {
  //                                     //
  //                                 });
  //                                 res.json({variant: 'success', order: order});
  //                         })
  //                         .catch(err => {
  //                             res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
  //                         });
  //                 } else {
  //                     res.status(400).json({variant: 'error', amount: 'Insufficient balance.'});
  //                 }
  //             } else {
  //                 if ((parseFloat(userCryptoWallet.walletAmount) >= parseFloat(order.amount)) && (parseFloat(userCryptoWallet.walletAmount) > 0)) {
  //                     order.save()
  //                         .then(async order => {
  //                             // Fiat wallet Update
  //                             userFiatWallet.walletAmount = (parseFloat(userFiatWallet.walletAmount) + parseFloat(dealFinalSellPrice)).toFixed(2);
  //                             userFiatWallet.save();

  //                             // Crypto Wallet update
  //                             userCryptoWallet.walletAmount = (parseFloat(userCryptoWallet.walletAmount) - parseFloat(order.amount)).toFixed(8);
  //                             userCryptoWallet.save();
  //                             // depositeWallet(userWallet, parseFloat(dealFinalPrice));

  //                             if (_is_agent) {
  //                                 if (user) {
  //                                     if(agent) {
  //                                         let agentFiatWallet = await UserMarginWallet.findOne({userId: agent._id, coin: req.body.fiat});

  //                                         // Fiat wallet Update
  //                                         agentFiatWallet.walletAmount = (parseFloat(agentFiatWallet.walletAmount) - agentDealFinalSellFee).toFixed(2);
  //                                         agentFiatWallet.save();
  //                                     }
  //                                 }
  //                             }

  //                             // if (parseFloat(userBuyOpenMargin.totalOpenMargins) > parseFloat(userSellOpenMargin.totalOpenMargins)) {
  //                             //     userBuyOpenMargin.totalOpenMargins = parseFloat(userBuyOpenMargin.totalOpenMargins) - parseFloat(userSellOpenMargin.totalOpenMargins);
  //                             //     userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                             //     userBuyOpenMargin.save();
  //                             // } else if (parseFloat(userBuyOpenMargin.totalOpenMargins) < parseFloat(userSellOpenMargin.totalOpenMargins)) {
  //                             //     if (parseFloat(userBuyOpenMargin.totalOpenMargins) < (parseFloat(req.body.amount))) {
  //                             //         userSellOpenMargin.totalOpenMargins = (parseFloat(userSellOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount))) - parseFloat(userBuyOpenMargin.totalOpenMargins);
  //                             //         userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                             //         await userSellOpenMargin.save();
  //                             //         userBuyOpenMargin.totalOpenMargins = 0;
  //                             //         userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                             //         await userBuyOpenMargin.save();
  //                             //     } else {
  //                             //         userBuyOpenMargin.totalOpenMargins = parseFloat(userBuyOpenMargin.totalOpenMargins) - (parseFloat(req.body.amount));
  //                             //         userBuyOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastSell;
  //                             //         await userBuyOpenMargin.save();
  //                             //         userSellOpenMargin.totalOpenMargins = (parseFloat(userSellOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount))) - parseFloat(userSellOpenMargin.totalOpenMargins);
  //                             //         userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                             //         await userSellOpenMargin.save();
  //                             //     }
  //                             // } else {
  //                             //     userSellOpenMargin.totalOpenMargins = (parseFloat(userSellOpenMargin.totalOpenMargins) + (parseFloat(req.body.amount)).toFixed(8));
  //                             //     userSellOpenMargin.lastExecutedPrice = getAssetCoin(req.body.market).lastBuy;
  //                             //     await userSellOpenMargin.save();
  //                             // }

  //                             // const walletTransactions = new WalletTransactions({
  //                             //     userId: req.body.user_id,
  //                             //     txid: order.orderId,
  //                             //     confirmations: 0,
  //                             //     type: 'Market',
  //                             //     rate: req.body.marketSubtotal,
  //                             //     value: order.dealStock,
  //                             //     fees: order.dealFee,
  //                             //     coin: order.market,
  //                             //     state: '',
  //                             // })
  //                             // walletTransactions.save();

  //                             ReferralTree.findOne({referredUser: req.body.userId})
  //                                 .then(referralTree => {
  //                                     if(referralTree) {
  //                                         ReferralSetting.find()
  //                                             .then(referralSettings => {
  //                                                 if(referralSettings.length > 0) {
  //                                                     let orderAmount =(parseFloat(order.amount) * parseFloat(getAssetCoin(order.market).lastBuy)) * (parseFloat(order.takerFee));
  //                                                     let refEarn = (parseFloat(orderAmount)) * parseFloat(referralSettings[0].commissionPercentage);
  //                                                     referralTree.referredUserEarning = (parseFloat(referralTree.referredUserEarning) + parseFloat(refEarn)).toFixed(4);
  //                                                     referralTree.save();
  //                                                     Referral.findOne({_id: referralTree.referralId})
  //                                                         .then(referral => {
  //                                                             if(referral) {
  //                                                                 referral.totalReferralEarnings = (parseFloat(referral.totalReferralEarnings) + parseFloat(refEarn)).toFixed(4);
  //                                                                 referral.save();
  //                                                             } else {
  //                                                                 //
  //                                                             }
  //                                                         })
  //                                                         .catch(err => {
  //                                                             //
  //                                                         })
  //                                                 } else {
  //                                                     //
  //                                                 }
  //                                             })
  //                                     } else {
  //                                         //
  //                                     }
  //                                 })
  //                                 .catch(err => {
  //                                     //
  //                                 });
  //                                 res.json({variant: 'success', order: order});
  //                         })
  //                         .catch(err => {
  //                             res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
  //                         });

  //                 } else {
  //                     res.status(400).json({variant: 'error', amount: 'Insufficient balance.'});
  //                 }
  //             }
  //         } else {
  //             res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
  //         }

  // //         order.save();

  // //         const walletTransactions = new WalletTransactions({
  // //             userId: req.body.user_id,
  // //             txid: resBody.result.id,
  // //             confirmations: 0,
  // //             type: 'Market',
  // //             rate: req.body.marketSubtotal,
  // //             value: resBody.result.deal_stock,
  // //             fees: resBody.result.deal_fee,
  // //             coin: resBody.result.market,
  // //             state: '',
  // //         })
  // //         walletTransactions.save();

  // //         UserWallet.findOne({userId: req.body.userId, coin: req.body.fiat})
  // //             .then(userWallet => {
  // //                 if(resBody.result.side === 2) {
  // //                     let dealFinalPrice = parseFloat(order.amount) + (parseFloat(order.amount) * parseFloat(order.takerFee));
  // //                     userWallet.walletAmount = (parseFloat(userWallet.walletAmount) - parseFloat(dealFinalPrice)).toFixed(2);
  // //                     userWallet.save();
  // //                     withdrawWallet(userWallet, parseFloat(dealFinalPrice));
  // //                 } else {
  // //                     let dealFinalPrice = parseFloat(order.dealMoney) - (parseFloat(order.dealMoney) * parseFloat(order.takerFee));
  // //                     userWallet.walletAmount = (parseFloat(userWallet.walletAmount) + parseFloat(dealFinalPrice)).toFixed(2);
  // //                     userWallet.save();
  // //                     depositeWallet(userWallet, parseFloat(dealFinalPrice));
  // //                 }
  // //             })
  // //             .catch(err => {
  // //                 //
  // //             });

  // //         UserWallet.findOne({userId: req.body.userId, coin: req.body.crypto})
  // //             .then(userWallet => {
  // //                 if(resBody.result.side === 2) {
  // //                     userWallet.walletAmount = (parseFloat(userWallet.walletAmount) + parseFloat(resBody.result.deal_stock)).toFixed(8);
  // //                     depositeWallet(userWallet, parseFloat(resBody.result.deal_stock));
  // //                 } else {
  // //                     userWallet.walletAmount = (parseFloat(userWallet.walletAmount) - parseFloat(resBody.result.deal_stock)).toFixed(8);
  // //                     withdrawWallet(userWallet, parseFloat(resBody.result.deal_stock));
  // //                 }
  // //                 userWallet.save();
  // //             })
  // //             .catch(err => {
  // //                 //
  // //             });

  // //         ReferralTree.findOne({referredUser: req.body.userId})
  // //             .then(referralTree => {
  // //                 if(referralTree) {
  // //                     ReferralSetting.find()
  // //                         .then(referralSettings => {
  // //                             if(referralSettings.length > 0) {
  // //                                 let refEarn = (parseFloat(resBody.result.amount) * parseFloat(req.body.taker_fee_rate)) * parseFloat(referralSettings[0].commissionPercentage);
  // //                                 referralTree.referredUserEarning = (parseFloat(referralTree.referredUserEarning) + parseFloat(refEarn)).toFixed(4);
  // //                                 referralTree.save();
  // //                                 Referral.findOne({_id: referralTree.referralId})
  // //                                     .then(referral => {
  // //                                         if(referral) {
  // //                                             referral.totalReferralEarnings = (parseFloat(referral.totalReferralEarnings) + parseFloat(refEarn)).toFixed(4);
  // //                                             referral.save();
  // //                                         } else {
  // //                                             //
  // //                                         }
  // //                                     })
  // //                                     .catch(err => {
  // //                                         //
  // //                                     })
  // //                             } else {
  // //                                 //
  // //                             }
  // //                         })
  // //                 } else {
  // //                     //
  // //                 }
  // //             })
  // //             .catch(err => {
  // //                 //
  // //             })
  //     }
  //     res.json(JSON.parse(body));
  // });
});

/**
 * @route POST /api/trading/order/market
 * @description Create market order.
 * @access Public
 */
router.post("/order/market", async (req, res) => {
  const { errors, isValid } = validateMarketOrderInput(req.body);
  var isOrder = false;

  // Check Validation
  if (!isValid) {
    return res.status(400).json(errors);
  }

  // console.log(req.body);
  // const hbApi = new HbApi(options);
  //                 const CURRENCY_USDT = 'usdt';
  //                 const account = await hbApi.restApi({ path: `/v1/account/accounts`, method: 'GET' });
  //                 console.log('account:', { account });

  // const account = await hb.getAccountAccounts();
  // console.log(account);

  if (
    req.body.crypto === "BTX" ||
    req.body.crypto === "BTC" ||
    req.body.crypto === "BCH" ||
    req.body.crypto === "LTC" ||
    req.body.crypto === "XRP" ||
    req.body.crypto === "ETH" ||
    req.body.crypto === "TRX" ||
    req.body.crypto === "USDT" ||
    req.body.crypto === "EUR" ||
    req.body.crypto === "GBP"
  ) {
    const user = await User.findOne({ _id: req.body.userId });
    let taker_fee_rate = 0;

    if (user) {
      const userProfile = await UserProfile.findOne({ userId: user._id });
      const agentUser = await AgentUsers.findOne({ userId: user._id });

      if (agentUser) {
        agent = await User.findOne({ _id: agentUser.agentId });
        if (agent) {
          _is_agent = true;
          const agentProfile = await UserProfile.findOne({ userId: agent._id });

          if (agent.agent) {
            const agentTraderLevel = await AgentTraderLevel.findOne({
              name: `${agentProfile.traderLevel}`,
            });
            agent_taker_fee = parseFloat(agentTraderLevel.taker_fee) / 100;
          } else if (agent.subAgent) {
            const agentTraderLevel = await SubAgentTraderLevel.findOne({
              name: `${agentProfile.traderLevel}`,
            });
            agent_taker_fee = parseFloat(agentTraderLevel.taker_fee) / 100;
          }
          let clientTraderLevel = await AgentClientTraderLevel.findOne({
            clientId: user._id,
            name: `${userProfile.traderLevel}`,
          });
          if (clientTraderLevel) {
            taker_fee_rate = parseFloat(clientTraderLevel.taker_fee) / 100;
          } else {
            clientTraderLevel = await InrTraderLevel.findOne({
              name: `${agentProfile.traderLevel}`,
            });
            if (clientTraderLevel) {
              taker_fee_rate = parseFloat(clientTraderLevel.taker_fee) / 100;
            }
          }
        }
      } else {
        if (userProfile) {
          if (user.agent) {
            const traderLevel = await AgentTraderLevel.findOne({
              name: `${userProfile.traderLevel}`,
            });
            taker_fee_rate = parseFloat(traderLevel.taker_fee) / 100;
          } else if (user.subAgent) {
            const traderLevel = await SubAgentTraderLevel.findOne({
              name: `${userProfile.traderLevel}`,
            });
            taker_fee_rate = parseFloat(traderLevel.taker_fee) / 100;
          } else {
            const traderLevel = await TraderLevel.findOne({
              name: `${userProfile.traderLevel}`,
            });
            taker_fee_rate = parseFloat(traderLevel.taker_fee) / 100;
          }
        }
      }
    }
    const params = [
      user.viabtcUserId,
      req.body.market,
      parseInt(req.body.side),
      req.body.amount,
      taker_fee_rate.toString(),
      req.body.source,
    ];

    console.log(params);

    const postParamas = {
      method: "order.put_market",
      params: params,
      id: 1516681174,
    };

    curl.post(
      keys.tradingURI,
      JSON.stringify(postParamas),
      {},
      function (err, response, body) {
        let resBody = JSON.parse(body);
        resp = JSON.parse(body);

        if (JSON.parse(body).error === null) {
          console.log(resBody.result);
          let order = new Order();
          order.userId = req.body.userId;
          order.orderId = resBody.result.id;
          order.side = resBody.result.side;
          order.type = resBody.result.type;
          order.market = resBody.result.market;
          order.takerFee = resBody.result.taker_fee;
          order.makerFee = resBody.result.maker_fee;
          order.amount = resBody.result.amount;
          order.price =
            resBody.result.type === 2
              ? parseFloat(resBody.result.deal_money) /
                parseFloat(resBody.result.deal_stock)
              : resBody.result.price;
          order.source = resBody.result.source;
          order.dealFee = resBody.result.deal_fee;
          order.dealMoney = resBody.result.deal_money;
          order.dealStock = resBody.result.deal_stock;
          order.mTime = resBody.result.mtime;
          order.cTime = resBody.result.ctime;
          order.status = "Finished";
          order.save();

          UserWallet.findOne({ userId: req.body.userId, coin: req.body.fiat })
            .then((userWallet) => {
              if (resBody.result.side === 2) {
                let dealFinalPrice =
                  parseInt(req.body.side) === 2
                    ? parseFloat(resBody.result.deal_money) /
                      parseFloat(resBody.result.deal_stock)
                    : parseFloat(order.amount);
                userWallet.walletAmount = (
                  parseFloat(userWallet.walletAmount) -
                  parseFloat(dealFinalPrice)
                ).toFixed(2);
                userWallet.save();
                // withdrawWallet(userWallet, parseFloat(dealFinalPrice));
              } else {
                let dealFinalPrice = parseFloat(order.dealMoney);
                userWallet.walletAmount = (
                  parseFloat(userWallet.walletAmount) +
                  parseFloat(dealFinalPrice)
                ).toFixed(2);
                userWallet.save();
                // depositeWallet(userWallet, parseFloat(dealFinalPrice));
              }
            })
            .catch((err) => {
              // console.log(err);
            });

          UserWallet.findOne({ userId: req.body.userId, coin: req.body.crypto })
            .then((userWallet) => {
              if (resBody.result.side === 2) {
                userWallet.walletAmount = (
                  parseFloat(userWallet.walletAmount) +
                  parseFloat(order.dealStock)
                ).toFixed(8);
                // depositeWallet(userWallet, parseFloat(order.dealStock));
              } else {
                userWallet.walletAmount = (
                  parseFloat(userWallet.walletAmount) -
                  parseFloat(order.dealStock)
                ).toFixed(8);
                // withdrawWallet(userWallet, parseFloat(order.dealStock));
              }
              userWallet.save();
            })
            .catch((err) => {
              // console.log(err);
            });

          ReferralTree.findOne({ referredUser: req.body.userId })
            .then((referralTree) => {
              if (referralTree) {
                ReferralSetting.find().then((referralSettings) => {
                  if (referralSettings.length > 0) {
                    let refEarn =
                      (parseInt(req.body.side) === 2
                        ? parseFloat(resBody.result.deal_money) /
                          parseFloat(resBody.result.deal_stock)
                        : parseFloat(resBody.result.amount)) *
                      parseFloat(req.body.taker_fee_rate) *
                      parseFloat(referralSettings[0].commissionPercentage);
                    referralTree.referredUserEarning = (
                      parseFloat(referralTree.referredUserEarning) +
                      parseFloat(refEarn)
                    ).toFixed(4);
                    referralTree.save();
                    Referral.findOne({ _id: referralTree.referralId })
                      .then((referral) => {
                        if (referral) {
                          referral.totalReferralEarnings = (
                            parseFloat(referral.totalReferralEarnings) +
                            parseFloat(refEarn)
                          ).toFixed(4);
                          referral.save();
                        } else {
                          //
                        }
                      })
                      .catch((err) => {
                        //
                      });
                  } else {
                    //
                  }
                });
              } else {
                //
              }
            })
            .catch((err) => {
              // console.log(err);
            });

          // Huobi Orders //

          // if(parseInt(req.body.side) === 2) {
          //     const orderss = hb.postOrderOrdersPlace({
          //         'account-id': '17257278',
          //         symbol: req.body.market.toLowerCase(),
          //         type: 'buy-market',
          //         amount: req.body.amount,
          //       })
          //       orderss.then(function(result) {
          //         console.log('order', result);
          //      })
          // }

          // if(parseInt(req.body.side) === 1) {
          //     const orderss = hb.postOrderOrdersPlace({
          //         'account-id': '17257278',
          //         symbol: req.body.market.toLowerCase(),
          //         type: 'sell-market',
          //         amount: req.body.amount,
          //       })
          //       orderss.then(function(result) {
          //         console.log('order', result);
          //      })
          // }

          return res.json({ variant: "success", order: order });
        } else {
          return res.status(400).json({
            variant: "error",
            amount: "Error placing an order. Please try again",
          });
        }
        // res.json(JSON.parse(body));
      }
    );
  } else {
    // if (getAssetCoin(req.body.market).lastBuy <= 0 || getAssetCoin(req.body.market).lastSell <= 0) {
    //     return res.status(400).json({variant: 'error', amount: 'Websocket error! please try again later.'});
    // }
    // assetCoin = await getAssetCoin(req.body.market);
    // const currencySetting = await CurrencySetting.findOne({currency: assetCoin.fiat});
    // const assetCurrencyValue = (parseFloat(currencySetting.value) + (parseFloat(currencySetting.value) * (parseFloat(currencySetting.premium)/100)));
    // const orderbookStreamv2 = await axios.get(`https://api3.binance.com/api/v3/ticker/bookTicker?symbol=${assetCoin.crypto}USDT`);
    // let taker_fee_rate = req.body.taker_fee_rate;
    // let _is_agent = false;
    // let agent_taker_fee = 0;
    // let agent;
    // const user = await User.findOne({_id: req.body.userId});
    // if (user) {
    //     const userProfile = await UserProfile.findOne({userId: user._id});
    //     const agentUser = await AgentUsers.findOne({userId: user._id});
    //     if (agentUser) {
    //         agent = await User.findOne({_id: agentUser.agentId});
    //         if (agent) {
    //             _is_agent = true;
    //             const agentProfile = await UserProfile.findOne({userId: agent._id});
    //             if (agent.agent) {
    //                 const agentTraderLevel = await AgentTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
    //                 agent_taker_fee = parseFloat(agentTraderLevel.taker_fee)/100;
    //             } else if (agent.subAgent) {
    //                 const agentTraderLevel = await SubAgentTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
    //                 agent_taker_fee = parseFloat(agentTraderLevel.taker_fee)/100;
    //             }
    //             let clientTraderLevel = await AgentClientTraderLevel.findOne({clientId: user._id, name: `${userProfile.traderLevel}`});
    //             if (clientTraderLevel) {
    //                 taker_fee_rate = parseFloat(clientTraderLevel.taker_fee)/100;
    //             } else {
    //                 clientTraderLevel = await InrTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
    //                 if (clientTraderLevel) {
    //                     taker_fee_rate = parseFloat(clientTraderLevel.taker_fee)/100;
    //                 }
    //             }
    //         }
    //     } else {
    //         if (userProfile) {
    //             if (user.agent) {
    //                 const traderLevel = await AgentTraderLevel.findOne({name: `${userProfile.traderLevel}`});
    //                 taker_fee_rate = parseFloat(traderLevel.taker_fee)/100;
    //             } else if(user.subAgent) {
    //                 const traderLevel = await SubAgentTraderLevel.findOne({name: `${userProfile.traderLevel}`});
    //                 taker_fee_rate = parseFloat(traderLevel.taker_fee)/100;
    //             } else {
    //                 const traderLevel = await TraderLevel.findOne({name: `${userProfile.traderLevel}`});
    //                 taker_fee_rate = parseFloat(traderLevel.taker_fee)/100;
    //             }
    //         }
    //     }
    // }
    // // const params = [
    // //     user.walletId,
    // //     req.body.market,
    // //     parseInt(req.body.side),
    // //     req.body.amount,
    // //     req.body.taker_fee_rate+'',
    // //     '',
    // // ];
    // // const postParamas = {
    // //     method: 'order.put_market',
    // //     params: params,
    // //     id: 1516681174
    // // }
    // // curl.post(keys.tradingURI, JSON.stringify(postParamas), {}, async function(err, response, body) {
    // //     let resBody = JSON.parse(body);
    // //     console.log(resBody);
    // //     if(JSON.parse(body).error === null) {
    //     if (!isEmpty(orderbookStreamv2.data)) {
    //         const lastAsks = (parseFloat(orderbookStreamv2.data.askPrice) + (parseFloat(orderbookStreamv2.data.askPrice) * 0.001)) * assetCurrencyValue;
    //         const lastBids = (parseFloat(orderbookStreamv2.data.bidPrice) - (parseFloat(orderbookStreamv2.data.bidPrice) * 0.001)) * assetCurrencyValue;
    //         let orderPrice = parseInt(req.body.side) === 2 ? lastBids : lastAsks;
    //         let order = new Order;
    //         order.userId = req.body.userId;
    //         order.orderId = uuidv4();
    //         order.side = parseInt(req.body.side);
    //         order.type = 2;
    //         order.market = req.body.market;
    //         order.takerFee = taker_fee_rate;
    //         order.makerFee = req.body.maker_fee_rate;
    //         order.amount = req.body.amount;
    //         order.price = orderPrice;
    //         order.dealMoney = orderPrice;
    //         order.dealStock = req.body.amount;
    //         order.status = 'Finished';
    //         let userFiatWallet = await UserWallet.findOne({userId: req.body.userId, coin: req.body.fiat});
    //         let userCryptoWallet = await UserWallet.findOne({userId: req.body.userId, coin: req.body.crypto});
    //         if (userFiatWallet.coin === 'INR') {
    //             if (parseFloat(req.body.side) === 2) {
    //                 if (parseFloat(req.body.amount) < 100) {
    //                     return res.status(400).json({amount: 'Please enter more than 100 INR to place an ordder'});
    //                 }
    //             } else {
    //                 if (parseFloat(req.body.marketSubtotal) < 100) {
    //                     return res.status(400).json({amount: 'Please enter more than 100 INR to place an ordder'});
    //                 }
    //             }
    //         }
    //         if (userFiatWallet.coin === 'AED') {
    //             if (parseFloat(req.body.side) === 2) {
    //                 if (parseFloat(req.body.amount) < 20) {
    //                     return res.status(400).json({amount: 'Please enter more than 20 AED to place an ordder'});
    //                 }
    //             } else {
    //                 if (parseFloat(req.body.marketSubtotal) < 20) {
    //                     return res.status(400).json({amount: 'Please enter more than 20 AED to place an ordder'});
    //                 }
    //             }
    //         }
    //         if (userFiatWallet.coin === 'USD') {
    //             if (parseFloat(req.body.side) === 2) {
    //                 if (parseFloat(req.body.amount) < 2) {
    //                     return res.status(400).json({amount: 'Please enter more than 2 USD to place an ordder'});
    //                 }
    //             } else {
    //                 if (parseFloat(req.body.marketSubtotal) < 2) {
    //                     return res.status(400).json({amount: 'Please enter more than 2 USD to place an ordder'});
    //                 }
    //             }
    //         }
    //         // console.log(userFiatWallet, userCryptoWallet);
    //         if (userFiatWallet && userCryptoWallet) {
    //             if (!userFiatWallet.active) {
    //                 return res.status(400).json({variant: 'error', amount: 'Selected fiat currency is not available in your region.'});
    //             }
    //             let dealFinalBuyPrice = (parseFloat(order.amount)) + ((parseFloat(order.amount)) * (parseFloat(order.takerFee)));
    //             let dealFinalSellPrice = (parseFloat(order.amount) * parseFloat(order.price)) - ((parseFloat(order.amount) * parseFloat(order.price)) * (parseFloat(order.takerFee)));
    //             let agentDealFinalBuyFee = ((parseFloat(order.amount)) * (parseFloat(agent_taker_fee)));
    //             let agentDealFinalSellFee = ((parseFloat(order.amount) * parseFloat(order.price)) * (parseFloat(agent_taker_fee)));
    //             if(order.side === 2) {
    //                 if ((parseFloat(userFiatWallet.walletAmount) >= dealFinalBuyPrice) && (parseFloat(userFiatWallet.walletAmount) > 0)) {
    //                     order.save()
    //                         .then(async order => {
    //                             // Fiat wallet Update
    //                             // let withdrawRequest = await WalletController.withdrawWallet(userFiatWallet, parseFloat(dealFinalBuyPrice));
    //                             // if (withdrawRequest) {
    //                             //     console.log(`viabtc balance updated ${order.userId}`);
    //                             // } else {
    //                             //     console.log(`viabtc balance failed ${order.userId}`);
    //                             // }
    //                             userFiatWallet.walletAmount = (parseFloat(userFiatWallet.walletAmount) - parseFloat(dealFinalBuyPrice)).toFixed(2);
    //                             userFiatWallet.save();
    //                             // withdrawWallet(userWallet, parseFloat(dealFinalPrice));
    //                             // Crypto Wallet update
    //                             // console.log(order.price);
    //                             // let depositRequest = await WalletController.depositeWallet(userFiatWallet, parseFloat(dealFinalBuyPrice));
    //                             // if (depositRequest) {
    //                             //     console.log(`viabtc balance updated ${order.userId}`);
    //                             // } else {
    //                             //     console.log(`viabtc balance failed ${order.userId}`);
    //                             // }
    //                             userCryptoWallet.walletAmount = (parseFloat(userCryptoWallet.walletAmount) + (parseFloat(order.amount) / parseFloat(order.price))).toFixed(8);
    //                             userCryptoWallet.save();
    //                             if (_is_agent) {
    //                                 if (user) {
    //                                     if(agent) {
    //                                         let agentFiatWallet = await UserWallet.findOne({userId: agent._id, coin: req.body.fiat});
    //                                         // Fiat wallet Update
    //                                         // let awithdrawRequest = await WalletController.withdrawWallet(agentFiatWallet, parseFloat(agentDealFinalBuyFee));
    //                                         // if (awithdrawRequest) {
    //                                         //     console.log(`viabtc balance updated ${order.userId}`);
    //                                         // } else {
    //                                         //     console.log(`viabtc balance failed ${order.userId}`);
    //                                         // }
    //                                         agentFiatWallet.walletAmount = (parseFloat(agentFiatWallet.walletAmount) - agentDealFinalBuyFee).toFixed(2);
    //                                         agentFiatWallet.save();
    //                                     }
    //                                 }
    //                             }
    //                             // const walletTransactions = new WalletTransactions({
    //                             //     userId: req.body.user_id,
    //                             //     txid: order.orderId,
    //                             //     confirmations: 0,
    //                             //     type: 'Market',
    //                             //     rate: req.body.marketSubtotal,
    //                             //     value: order.dealStock,
    //                             //     fees: order.dealFee,
    //                             //     coin: order.market,
    //                             //     state: '',
    //                             // })
    //                             // walletTransactions.save();
    //                             ReferralTree.findOne({referredUser: req.body.userId})
    //                                 .then(referralTree => {
    //                                     if(referralTree) {
    //                                         ReferralSetting.find()
    //                                             .then(referralSettings => {
    //                                                 if(referralSettings.length > 0) {
    //                                                     let refEarn = (parseFloat(order.amount) * parseFloat(order.takerFee)) * parseFloat(referralSettings[0].commissionPercentage);
    //                                                     referralTree.referredUserEarning = (parseFloat(referralTree.referredUserEarning) + parseFloat(refEarn)).toFixed(4);
    //                                                     referralTree.save();
    //                                                     Referral.findOne({_id: referralTree.referralId})
    //                                                         .then(referral => {
    //                                                             if(referral) {
    //                                                                 referral.totalReferralEarnings = (parseFloat(referral.totalReferralEarnings) + parseFloat(refEarn)).toFixed(4);
    //                                                                 referral.save();
    //                                                             } else {
    //                                                                 //
    //                                                             }
    //                                                         })
    //                                                         .catch(err => {
    //                                                             //
    //                                                         })
    //                                                 } else {
    //                                                     //
    //                                                 }
    //                                             })
    //                                     } else {
    //                                         //
    //                                     }
    //                                 })
    //                                 .catch(err => {
    //                                     //
    //                                 });
    //                                 res.json({variant: 'success', order: order});
    //                         })
    //                         .catch(err => {
    //                             console.log(err);
    //                             res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
    //                         });
    //                 } else {
    //                     res.status(400).json({variant: 'error', amount: 'Insufficient balance.'});
    //                 }
    //             } else {
    //                 if ((parseFloat(userCryptoWallet.walletAmount) >= parseFloat(order.amount)) && (parseFloat(userCryptoWallet.walletAmount) > 0)) {
    //                     order.save()
    //                         .then(async order => {
    //                             // Fiat wallet Update
    //                             // let depositRequest = await WalletController.depositeWallet(userFiatWallet, parseFloat(dealFinalSellPrice));
    //                             // if (depositRequest) {
    //                             //     console.log(`viabtc balance updated ${order.userId}`);
    //                             // } else {
    //                             //     console.log(`viabtc balance failed ${order.userId}`);
    //                             // }
    //                             userFiatWallet.walletAmount = (parseFloat(userFiatWallet.walletAmount) + parseFloat(dealFinalSellPrice)).toFixed(2);
    //                             userFiatWallet.save();
    //                             // Crypto Wallet update
    //                             // let withdrawRequest = await WalletController.withdrawWallet(userCryptoWallet, parseFloat(order.amount));
    //                             // if (withdrawRequest) {
    //                             //     console.log(`viabtc balance updated ${order.userId}`);
    //                             // } else {
    //                             //     console.log(`viabtc balance failed ${order.userId}`);
    //                             // }
    //                             userCryptoWallet.walletAmount = (parseFloat(userCryptoWallet.walletAmount) - parseFloat(order.amount)).toFixed(8);
    //                             userCryptoWallet.save();
    //                             // depositeWallet(userWallet, parseFloat(dealFinalPrice));
    //                             if (_is_agent) {
    //                                 if (user) {
    //                                     if(agent) {
    //                                         let agentFiatWallet = await UserWallet.findOne({userId: agent._id, coin: req.body.fiat});
    //                                         // Fiat wallet Update
    //                                         // let awithdrawRequest = await WalletController.withdrawWallet(agentFiatWallet, parseFloat(agentDealFinalSellFee));
    //                                         // if (awithdrawRequest) {
    //                                         //     console.log(`viabtc balance updated ${order.userId}`);
    //                                         // } else {
    //                                         //     console.log(`viabtc balance failed ${order.userId}`);
    //                                         // }
    //                                         agentFiatWallet.walletAmount = (parseFloat(agentFiatWallet.walletAmount) - agentDealFinalSellFee).toFixed(2);
    //                                         agentFiatWallet.save();
    //                                     }
    //                                 }
    //                             }
    //                             // const walletTransactions = new WalletTransactions({
    //                             //     userId: req.body.user_id,
    //                             //     txid: order.orderId,
    //                             //     confirmations: 0,
    //                             //     type: 'Market',
    //                             //     rate: req.body.marketSubtotal,
    //                             //     value: order.dealStock,
    //                             //     fees: order.dealFee,
    //                             //     coin: order.market,
    //                             //     state: '',
    //                             // })
    //                             // walletTransactions.save();
    //                             ReferralTree.findOne({referredUser: req.body.userId})
    //                                 .then(referralTree => {
    //                                     if(referralTree) {
    //                                         ReferralSetting.find()
    //                                             .then(referralSettings => {
    //                                                 if(referralSettings.length > 0) {
    //                                                     let orderAmount =(parseFloat(order.amount) * parseFloat(getAssetCoin(order.market).lastBuy)) * (parseFloat(order.takerFee));
    //                                                     let refEarn = (parseFloat(orderAmount)) * parseFloat(referralSettings[0].commissionPercentage);
    //                                                     referralTree.referredUserEarning = (parseFloat(referralTree.referredUserEarning) + parseFloat(refEarn)).toFixed(4);
    //                                                     referralTree.save();
    //                                                     Referral.findOne({_id: referralTree.referralId})
    //                                                         .then(referral => {
    //                                                             if(referral) {
    //                                                                 referral.totalReferralEarnings = (parseFloat(referral.totalReferralEarnings) + parseFloat(refEarn)).toFixed(4);
    //                                                                 referral.save();
    //                                                             } else {
    //                                                                 //
    //                                                             }
    //                                                         })
    //                                                         .catch(err => {
    //                                                             //
    //                                                         })
    //                                                 } else {
    //                                                     //
    //                                                 }
    //                                             })
    //                                     } else {
    //                                         //
    //                                     }
    //                                 })
    //                                 .catch(err => {
    //                                     //
    //                                 });
    //                                 res.json({variant: 'success', order: order});
    //                         })
    //                         .catch(err => {
    //                             // console.log(err);
    //                             res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
    //                         });
    //                 } else {
    //                     res.status(400).json({variant: 'error', amount: 'Insufficient balance.'});
    //                 }
    //             }
    //         } else {
    //             // console.log('error here...');
    //             res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
    //         }
    //     } else {
    //         return res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
    //     }
    //     } else {
    //         res.status(400).json({variant: 'error', amount: 'Error placing order, try again.'});
    //     }
    // });
  }
});

/**
 * @route POST /api/trading/order/cancel
 * @description Cancel order.
 * @access Public
 */
router.post("/order/cancel", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userId });

  // console.log(req.body);

  if (
    req.body.coin === "BTX" ||
    req.body.coin === "BTC" ||
    req.body.coin === "BCH" ||
    req.body.coin === "LTC" ||
    req.body.coin === "XRP" ||
    req.body.coin === "ETH" ||
    req.body.coin === "TRX" ||
    req.body.coin === "USDT"
  ) {
    const user = await User.findOne({ _id: req.body.userId });
    const order = await Order.findOne({ _id: req.body.order_id });
    if (order) {
      const params = [
        user.viabtcUserId,
        req.body.market,
        parseInt(order.orderId),
      ];

      const postParamas = {
        method: "order.cancel",
        params: params,
        id: 1516681174,
      };

      curl.post(
        keys.tradingURI,
        JSON.stringify(postParamas),
        {},
        function (err, response, body) {
          if (err) {
            res.json({ variant: "error", message: `Failed to cancel.` });
          } else {
            let resBody = JSON.parse(body);
            // console.log(resBody);
            if (resBody.result.side === 2) {
              UserWallet.findOne({
                userId: req.body.userId,
                coin: req.body.fiat,
              })
                .then((userWallet) => {
                  let makerValue =
                    parseFloat(resBody.result.price) *
                    parseFloat(resBody.result.left);
                  let makerAmount =
                    makerValue +
                    makerValue * parseFloat(req.body.maker_fee_rate);
                  userWallet.walletAmount = (
                    parseFloat(userWallet.walletAmount) + makerAmount
                  ).toFixed(2);
                  userWallet.save();
                  // depositeWallet(userWallet, makerAmount);
                })
                .catch((err) => {
                  //
                });
            }

            if (resBody.result.side === 1) {
              UserWallet.findOne({
                userId: req.body.userId,
                coin: req.body.coin,
              })
                .then((userWallet) => {
                  userWallet.walletAmount = (
                    parseFloat(userWallet.walletAmount) +
                    parseFloat(resBody.result.left)
                  ).toFixed(8);
                  userWallet.save();
                  // depositeWallet(userWallet, parseFloat(resBody.result.amount));
                })
                .catch((err) => {
                  //
                });
            }
            order.remove();
            return res.json({
              variant: "success",
              message: `Order id: ${req.body.order_id} cancelled successfully.`,
            });
          }
        }
      );
    } else {
      return res.status(400).json({
        variant: "error",
        message: "Error on deleting order, please try again.",
      });
    }
  } else {
    Order.findOne({ _id: req.body.order_id }).then((order) => {
      if (order) {
        // const params = [
        //     user.walletId,
        //     req.body.market,
        //     parseInt(order.orderId),
        // ];

        // const postParamas = {
        //     method: 'order.cancel',
        //     params: params,
        //     id: 1516681174
        // }

        // curl.post(keys.tradingURI, JSON.stringify(postParamas), {}, async function(err, response, body) {
        //     if(JSON.parse(body).error === null) {
        let currentOrder = order;
        order.remove();
        if (currentOrder.side === 2) {
          let asssetCoin = getAssetCoin(currentOrder.market);
          if (order.margin) {
            UserMarginWallet.findOne({
              userId: req.body.userId,
              coin: asssetCoin.fiat,
            })
              .then((userMarginWallet) => {
                if (userMarginWallet) {
                  let takerValue =
                    parseFloat(currentOrder.price) *
                    parseFloat(currentOrder.amount);
                  let takerAmount =
                    takerValue + takerValue * parseFloat(currentOrder.takerFee);

                  userMarginWallet.walletAmount = (
                    parseFloat(userMarginWallet.walletAmount) + takerAmount
                  ).toFixed(2);
                  userMarginWallet.save();
                }
                // depositeWallet(userWallet, makerAmount);
              })
              .catch((err) => {
                //
              });
          } else {
            UserWallet.findOne({
              userId: req.body.userId,
              coin: asssetCoin.fiat,
            })
              .then((userWallet) => {
                if (userWallet) {
                  let makerValue =
                    parseFloat(currentOrder.price) *
                    parseFloat(currentOrder.amount);
                  let makerAmount =
                    makerValue + makerValue * parseFloat(currentOrder.takerFee);
                  userWallet.walletAmount = (
                    parseFloat(userWallet.walletAmount) + makerAmount
                  ).toFixed(2);
                  userWallet.save();
                  // depositeWallet(userWallet, makerAmount);
                }
              })
              .catch((err) => {
                //
              });
          }
        }

        if (currentOrder.side === 1) {
          let asssetCoin = getAssetCoin(currentOrder.market);
          if (order.margin) {
            UserMarginWallet.findOne({
              userId: req.body.userId,
              coin: asssetCoin.fiat,
            })
              .then((userMarginWallet) => {
                if (userMarginWallet) {
                  userMarginWallet.walletAmount = (
                    parseFloat(userMarginWallet.walletAmount) +
                    parseFloat(currentOrder.amount)
                  ).toFixed(8);
                  userMarginWallet.save();
                }
                // depositeWallet(userWallet, parseFloat(currentOrder.amount));
              })
              .catch((err) => {
                // console.log(err)
              });
          } else {
            UserWallet.findOne({
              userId: req.body.userId,
              coin: asssetCoin.crypto,
            })
              .then((userWallet) => {
                if (userWallet) {
                  userWallet.walletAmount = (
                    parseFloat(userWallet.walletAmount) +
                    parseFloat(currentOrder.amount)
                  ).toFixed(8);
                  userWallet.save();
                }
                // depositeWallet(userWallet, parseFloat(currentOrder.amount));
              })
              .catch((err) => {
                // console.log(err)
              });
          }
        }
        return res.json({
          variant: "success",
          message: `Order successfully cancelled.`,
        });
        //     } else {
        //         return res.status(400).json({variant: 'error', message: 'Error on deleting order, please try again.'});
        //     }
        // });
      }
    });
  }
});

/**
 * @route POST /api/trading/order/deals
 * @description Get order deals.
 * @access Public
 */
router.post("/order/deals", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userId });
  const params = [
    user.viabtcUserId,
    req.body.market,
    parseInt(req.body.order_id),
  ];

  const postParamas = {
    method: "order.deals",
    params: params,
    id: 1516681174,
  };

  curl.post(
    keys.tradingURI,
    JSON.stringify(postParamas),
    {},
    function (err, response, body) {
      res.json(JSON.parse(body));
    }
  );
});

/**
 * @route POST /api/trading/order/book
 * @description Get order book.
 * @access Public
 */
router.post("/order/book", (req, res) => {
  const params = [
    req.body.market,
    parseInt(req.body.side),
    parseInt(req.body.offset),
    parseInt(req.body.limit),
  ];

  const postParamas = {
    method: "order.book",
    params: params,
    id: 1516681174,
  };

  curl.post(
    keys.tradingURI,
    JSON.stringify(postParamas),
    {},
    function (err, response, body) {
      res.json(JSON.parse(body));
    }
  );
});

/**
 * @route POST /api/trading/order/pending
 * @description Get order pending.
 * @access Public
 */
router.post("/order/pending", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userId });

  if (user) {
    let pending_orders = [];
    let orders = await Order.find({ userId: user._id, status: "Open" }).sort({
      createTime: -1,
    });

    for (morder of orders) {
      const params = [morder.market, parseInt(morder.orderId)];

      const postParamas = {
        method: "order.pending_detail",
        params: params,
        id: 1516681174,
      };

      let orderStatus = await axios
        .post(keys.tradingURI, postParamas)
        .then(async (response) => {
          if (response.data.result) {
            return response.data.result;
          } else {
            return false;
          }
        })
        .catch((err) => {
          console.log(err);
          return false;
        });

      if (orderStatus) {
        if (parseFloat(morder.left) === parseFloat(orderStatus.left)) {
          //
        } else {
          morder.left = orderStatus.left;
          await morder.save();
        }
        pending_orders.push(morder);
      } else {
        morder.status = "Finished";
        morder.left = orderStatus.deal_stock;
        await morder.save();
      }
    }
    return res.json(pending_orders);
    // if (
    //     req.body.crypto === 'BTX' || req.body.crypto === 'BTC' || req.body.crypto === 'BCH'
    //     || req.body.crypto === 'LTC' || req.body.crypto === 'XRP' || req.body.crypto === 'ETH'
    //     || req.body.crypto === 'TRX'
    // ) {

    // } else {
    //     let orders = await Order.find({ userId: req.body.userId, status: "Open" }).sort({ createTime: -1 });
    //     return res.json(orders);
    // }
  } else {
    return res.json([]);
  }

  // const params = [
  //     parseInt(req.body.user_id),
  //     req.body.market,
  //     parseInt(req.body.offset),
  //     parseInt(req.body.limit),
  // ];

  // const postParamas = {
  //     method: 'order.pending',
  //     params: params,
  //     id: 1516681174
  // }

  // curl.post(keys.tradingURI, JSON.stringify(postParamas), {}, function(err, response, body) {
  //     res.json(JSON.parse(body));
  // });
});

/**
 * @route POST /api/trading/order/pending_detail
 * @description Get order pending detail.
 * @access Public
 */
router.post("/order/pending_detail", (req, res) => {
  const params = [req.body.market, parseInt(req.body.order_id)];

  const postParamas = {
    method: "order.pending_detail",
    params: params,
    id: 1516681174,
  };

  curl.post(
    keys.tradingURI,
    JSON.stringify(postParamas),
    {},
    function (err, response, body) {
      res.json(JSON.parse(body));
    }
  );
});

/**
 * @route POST /api/trading/order/finished
 * @description Get order finished.
 * @access Public
 */
router.post("/order/finished", async (req, res) => {
  const user = await User.findOne({ _id: req.body.userId });
  const params = [
    user.viabtcUserId,
    req.body.market,
    parseInt(req.body.start_time),
    parseInt(req.body.end_time),
    parseInt(req.body.offset),
    parseInt(req.body.limit),
    parseInt(req.body.side),
  ];

  const postParamas = {
    method: "order.finished",
    params: params,
    id: 1516681174,
  };

  curl.post(
    keys.tradingURI,
    JSON.stringify(postParamas),
    {},
    function (err, response, body) {
      res.json(JSON.parse(body));
    }
  );
});

/**
 * @route POST /api/trading/order/finished_detail
 * @description Get order finished details.
 * @access Public
 */
router.post("/order/finished_detail", (req, res) => {
  const params = [parseInt(req.body.order_id)];

  const postParamas = {
    method: "order.finished_detail",
    params: params,
    id: 1516681174,
  };

  curl.post(
    keys.tradingURI,
    JSON.stringify(postParamas),
    {},
    function (err, response, body) {
      res.json(JSON.parse(body));
    }
  );
});

/**
 * @route POST /api/trading/market_last
 * @description Get order market_last.
 * @access Public
 */
router.post("/market_last", (req, res) => {
  const params = [req.body.market];

  const postParamas = {
    method: "market.last",
    params: params,
    id: 1516681174,
  };

  curl.post(
    keys.tradingURI,
    JSON.stringify(postParamas),
    {},
    function (err, response, body) {
      res.json(JSON.parse(body));
    }
  );
});

/**
 * @route POST /api/trading/market_status_today
 * @description Get order market_last.
 * @access Public
 */
router.post("/market_status_today", (req, res) => {
  const params = [req.body.market];

  const postParamas = {
    method: "market.status_today",
    params: params,
    id: 1516681174,
  };

  curl.post(
    keys.tradingURI,
    JSON.stringify(postParamas),
    {},
    function (err, response, body) {
      res.json(JSON.parse(body));
    }
  );
});

/**
 * @route POST /api/trading/order/market_deals
 * @description Get order market_deals.
 * @access Public
 */
router.post("/order/market_deals", (req, res) => {
  const params = [
    req.body.market,
    parseInt(req.body.limit),
    parseInt(req.body.last_id),
  ];

  const postParamas = {
    method: "market.deals",
    params: params,
    id: 1516681174,
  };

  curl.post(
    keys.tradingURI,
    JSON.stringify(postParamas),
    {},
    function (err, response, body) {
      res.json(JSON.parse(body));
    }
  );
});

/**
 * @route POST /api/trading/order/all
 * @description Get all user orders.
 * @access Public
 */
router.post("/order/all", async (req, res) => {
  const userId = req.body.userId;
  const market = req.body.market;
  const coin = req.body.coin;
  const fiat = req.body.fiat;
  const startTime = req.body.startTime;
  const endTime = req.body.endTime;
  const offset = req.body.offset;
  const limit = req.body.limit;
  const side = req.body.side;

  Order.find({ userId: userId, status: { $nin: ["Open"] } })
    .limit(parseInt(limit))
    .sort("-createTime")
    .then((orders) => {
      res.json(orders);
    })
    .catch((err) => {
      res.json([]);
    });

  // let user_id = parseInt(userId.replace(/\D/g,''));
  // const params = [
  //     parseInt(user_id),
  //     market,
  //     parseInt(startTime),
  //     parseInt(endTime),
  //     parseInt(offset),
  //     parseInt(limit),
  //     parseInt(side),
  // ];

  // const postParamas = {
  //     method: 'order.finished',
  //     params: params,
  //     id: 1516681174
  // }

  // curl.post(keys.tradingURI, JSON.stringify(postParamas), {}, async function(err, response, body) {
  //     if(err) {
  //         res.json([]);
  //     } else {
  //         let finishedOrders = JSON.parse(body).result.records;
  //         let orders = [];
  //         for(key in finishedOrders){
  //             let finishedOrder = finishedOrders[key];
  //             let order = await Order.findOne({orderId: finishedOrder.id});
  //             let userProfile = await UserProfile.findOne({ userId: userId });

  //             if(order) {
  //                 if(order.status != 'Finished' || !order.status) {
  //                     order.status = 'Finished';
  //                     order.dealFee = finishedOrder.deal_fee;
  //                     order.dealStock = finishedOrder.deal_stock;
  //                     order.dealMoney = finishedOrder.deal_money;
  //                     order.save();

  //                     if(finishedOrder.side === 2) {
  //                         UserWallet.findOne({userId: userId, coin: coin})
  //                             .then(userWallet => {
  //                                 userWallet.walletAmount = (parseFloat(userWallet.walletAmount) + parseFloat(order.amount)).toFixed(8);
  //                                 userWallet.save();
  //                                 depositeWallet(userWallet, parseFloat(order.amount));
  //                             })
  //                             .catch(err => {
  //                                 //
  //                             });
  //                     }

  //                     if(finishedOrder.side === 1) {
  //                         UserWallet.findOne({userId: userId, coin: fiat})
  //                             .then(async userWallet => {
  //                                 let traderLevel = await get_trader_level(userProfile.traderLevel);
  //                                 let fiatFinalValue = (parseFloat(order.price) * parseFloat(order.amount)) - parseFloat(traderLevel.takerFee);
  //                                 userWallet.walletAmount = (parseFloat(userWallet.walletAmount) + parseFloat(fiatFinalValue)).toFixed(2);
  //                                 userWallet.save();
  //                                 depositeWallet(userWallet, parseFloat(order.price));
  //                             })
  //                             .catch(err => {
  //                                 //
  //                             });
  //                     }
  //                 }
  //                 orders.push(order);
  //             } else {
  //                 let order = new Order;
  //                 order.userId = userId;
  //                 order.orderId = finishedOrder.id;
  //                 order.side = finishedOrder.side;
  //                 order.type = finishedOrder.type;
  //                 order.market = finishedOrder.market;
  //                 order.takerFee = finishedOrder.taker_fee;
  //                 order.makerFee = finishedOrder.maker_fee;
  //                 order.amount = finishedOrder.amount;
  //                 order.price = finishedOrder.price;
  //                 order.source = finishedOrder.source;
  //                 order.dealFee = finishedOrder.deal_fee;
  //                 order.dealMoney = finishedOrder.deal_money;
  //                 order.dealStock = finishedOrder.deal_stock;
  //                 order.mTime = finishedOrder.ftime;
  //                 order.cTime = finishedOrder.ctime;
  //                 order.status = 'Finished';
  //                 order.save();
  //                 orders.push(order);
  //             }
  //         }
  //         res.json(orders);
  //     }
  // });

  // res.json([]);

  // Order.find({ userId: userId })
  //     .then( orders => {
  //         if(orders.length > 0) {
  //             res.json(orders);
  //         } else {
  //             res.json([]);
  //         }
  //     })
  //     .catch( err => {
  //         res.json([]);
  //     });
});

/**
 * @route POST /api/trading/order/last_five/:userId
 * @description Get all user last five orders.
 * @access Public
 */
router.get("/order/last_five/:userId", (req, res) => {
  const userId = req.params.userId;

  Order.find({ userId: userId })
    .sort("-createTime")
    .skip(0)
    .limit(5)
    .then((orders) => {
      if (orders.length > 0) {
        let orders_list = [];
        for (order of orders) {
          // console.log()
        }
        res.json(orders);
      } else {
        res.json([]);
      }
    })
    .catch((err) => {
      res.json([]);
    });
});

function createBitstampMarketLast(coniMarketApi, market, currency) {
  axios.get(coniMarketApi).then(async (response) => {
    if (response.data.error) {
      console.log(`${market} falied to save last market`);
    } else {
      let assetsMarketLast = await AssetsMarketLast.findOne({
        market: market,
        currency: currency,
      });
      try {
        let data = JSON.parse(response.data);
        let aedToUsd = await CurrencySetting.findOne({ name: currency });
        if (assetsMarketLast) {
          assetsMarketLast.currency = currency;
          assetsMarketLast.high =
            parseFloat(data.highPrice) *
            (parseFloat(aedToUsd.value) +
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.premium) / 100) -
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.discount) / 100));
          assetsMarketLast.low =
            parseFloat(data.lowPrice) *
            (parseFloat(aedToUsd.value) +
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.premium) / 100) -
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.discount) / 100));
          assetsMarketLast.last =
            parseFloat(data.lastPrice) *
            (parseFloat(aedToUsd.value) +
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.premium) / 100) -
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.discount) / 100));
          assetsMarketLast.open =
            parseFloat(data.openPrice) *
            (parseFloat(aedToUsd.value) +
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.premium) / 100) -
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.discount) / 100));
          assetsMarketLast.deal = data.deal;
          assetsMarketLast.volume = parseFloat(data.volume) * 0.0001;

          assetsMarketLast.ask =
            parseFloat(data.askPrice) *
            (parseFloat(aedToUsd.value) +
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.premium) / 100) -
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.discount) / 100));
          assetsMarketLast.bid =
            parseFloat(data.bidPrice) *
            (parseFloat(aedToUsd.value) +
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.premium) / 100) -
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.discount) / 100));
          assetsMarketLast.timestamp = data.timestamp;
          assetsMarketLast.save();
          // console.log(`${market} binance last market Updated for ${currency}`);
        } else {
          let newAssetsMarketLast = new AssetsMarketLast();
          newAssetsMarketLast.market = market;
          newAssetsMarketLast.currency = currency;
          newAssetsMarketLast.high =
            parseFloat(data.highPrice) *
            (parseFloat(aedToUsd.value) +
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.premium) / 100) -
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.discount) / 100));
          newAssetsMarketLast.low =
            parseFloat(data.lowPrice) *
            (parseFloat(aedToUsd.value) +
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.premium) / 100) -
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.discount) / 100));
          newAssetsMarketLast.last =
            parseFloat(data.lastPrice) *
            (parseFloat(aedToUsd.value) +
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.premium) / 100) -
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.discount) / 100));
          newAssetsMarketLast.open =
            parseFloat(data.openPrice) *
            (parseFloat(aedToUsd.value) +
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.premium) / 100) -
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.discount) / 100));
          newAssetsMarketLast.deal = data.deal;
          newAssetsMarketLast.volume = parseFloat(data.volume) * 0.0001;
          newAssetsMarketLast.ask =
            parseFloat(data.askPrice) *
            (parseFloat(aedToUsd.value) +
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.premium) / 100) -
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.discount) / 100));
          newAssetsMarketLast.bid =
            parseFloat(data.bidPrice) *
            (parseFloat(aedToUsd.value) +
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.premium) / 100) -
              parseFloat(aedToUsd.value) *
                (parseFloat(aedToUsd.discount) / 100));
          newAssetsMarketLast.timestamp = data.timestamp;
          newAssetsMarketLast.save();
          // console.log(`${market} binance last market Created for ${currency}`);
        }
      } catch {
        //
      }
    }
  });
}

function createMarketToday(coniMarketApi, market, currency) {
  const fiats = {
    "USD to AED": "AED",
    "USD to INR": "INR",
    "USD to USD": "USD",
  };
  axios
    .post(coniMarketApi, {
      method: "market.status_today",
      params: [`${market}${fiats[currency]}`],
      id: 1,
    })
    .then(async (response) => {
      if (response.data.error) {
        // console.log(`${market} falied to save last market bid`);
      } else {
        let assetsMarketLast = await AssetsMarketLast.findOne({
          market: market,
          currency: currency,
        });
        try {
          let data = response.data.result;
          let aedToUsd = await CurrencySetting.findOne({ name: currency });
          if (assetsMarketLast) {
            assetsMarketLast.currency = currency;
            assetsMarketLast.high = parseFloat(data.high);
            assetsMarketLast.low = parseFloat(data.low);
            assetsMarketLast.open = parseFloat(data.open);
            assetsMarketLast.last = parseFloat(data.last);
            assetsMarketLast.deal = parseFloat(data.deal) / 50;
            assetsMarketLast.volume = parseFloat(data.volume) / 50;
            // assetsMarketLast.timestamp = data.timestamp;
            assetsMarketLast.save();
            // console.log(`${market} last market Updated for ${currency}`);
          } else {
            let newAssetsMarketLast = new AssetsMarketLast();
            newAssetsMarketLast.market = market;
            newAssetsMarketLast.currency = currency;
            newAssetsMarketLast.high = parseFloat(data.high);
            newAssetsMarketLast.low = parseFloat(data.low);
            newAssetsMarketLast.open = parseFloat(data.open);
            newAssetsMarketLast.last = parseFloat(data.last);
            newAssetsMarketLast.deal = parseFloat(data.deal) / 50;
            newAssetsMarketLast.volume = parseFloat(data.volume) / 50;
            newAssetsMarketLast.save();
            // console.log(`${market} last market Created for ${currency}`);
          }
        } catch {
          //
        }
      }
    })
    .catch((e) => {
      // console.log(e.response.data);
    });
}

function createMarketAskBid(coniMarketApi, market, currency) {
  const fiats = {
    "USD to AED": "AED",
    "USD to INR": "INR",
    "USD to USD": "USD",
  };
  axios
    .post(coniMarketApi, {
      method: "order.depth",
      params: [`${market}${fiats[currency]}`, 101, "0"],
      id: 1,
    })
    .then(async (response) => {
      if (response.data.error) {
        // console.log(`${market} falied to save last market bid`);
      } else {
        let assetsMarketLast = await AssetsMarketLast.findOne({
          market: market,
          currency: currency,
        });
        try {
          let data = response.data.result;
          let aedToUsd = await CurrencySetting.findOne({ name: currency });
          if (assetsMarketLast) {
            assetsMarketLast.ask = parseFloat(data.asks[0][0]);
            assetsMarketLast.bid = parseFloat(data.bids[0][0]);
            // assetsMarketLast.timestamp = data.timestamp;
            assetsMarketLast.save();
            // console.log(`${market} bid ask market Updated for ${currency}`);
          } else {
            let newAssetsMarketLast = new AssetsMarketLast();
            newAssetsMarketLast.market = market;
            newAssetsMarketLast.currency = currency;
            newAssetsMarketLast.ask = parseFloat(data.asks[0][0]);
            newAssetsMarketLast.bid = parseFloat(data.bids[0][0]);
            newAssetsMarketLast.save();
            // console.log(`${market} bid ask market Created for ${currency}`);
          }
        } catch {
          //
        }
      }
    });
}

function createMarketLast(coniMarketApi, market, currency) {
  const fiats = {
    "USD to AED": "AED",
    "USD to INR": "INR",
    "USD to USD": "USD",
  };
  axios
    .post(coniMarketApi, {
      method: "market.status",
      params: [`${market}${fiats[currency]}`, 3600],
      id: 1,
    })
    .then(async (response) => {
      if (response.data.error) {
        // console.log(`${market} falied to save last market`);
      } else {
        let assetsMarketLast = await AssetsMarketLast.findOne({
          market: market,
          currency: currency,
        });
        try {
          let data = response.data.result;
          let aedToUsd = await CurrencySetting.findOne({ name: currency });
          if (assetsMarketLast) {
            assetsMarketLast.high =
              parseFloat(data.high) +
              parseFloat(data.high) * (parseFloat(aedToUsd.premium) / 100);
            assetsMarketLast.low =
              parseFloat(data.low) +
              parseFloat(data.low) * (parseFloat(aedToUsd.premium) / 100);
            assetsMarketLast.last =
              parseFloat(data.last) +
              parseFloat(data.last) * (parseFloat(aedToUsd.premium) / 100);
            assetsMarketLast.open =
              parseFloat(data.open) +
              parseFloat(data.open) * (parseFloat(aedToUsd.premium) / 100);
            // assetsMarketLast.volume = data.volume;
            // assetsMarketLast.ask = parseFloat(data.ask) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
            // assetsMarketLast.bid = parseFloat(data.bid) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
            // assetsMarketLast.timestamp = data.timestamp;
            assetsMarketLast.save();
            // console.log(`${market} last market Updated for ${currency}`);
          } else {
            let newAssetsMarketLast = new AssetsMarketLast();
            newAssetsMarketLast.market = market;
            newAssetsMarketLast.currency = currency;
            // newAssetsMarketLast.high = parseFloat(data.high);
            // newAssetsMarketLast.low = parseFloat(data.low);
            // newAssetsMarketLast.last = parseFloat(data.last);
            // newAssetsMarketLast.open = parseFloat(data.open);
            newAssetsMarketLast.high =
              parseFloat(data.high) +
              parseFloat(data.high) * (parseFloat(aedToUsd.premium) / 100);
            newAssetsMarketLast.low =
              parseFloat(data.low) +
              parseFloat(data.low) * (parseFloat(aedToUsd.premium) / 100);
            newAssetsMarketLast.last =
              parseFloat(data.last) +
              parseFloat(data.last) * (parseFloat(aedToUsd.premium) / 100);
            newAssetsMarketLast.open =
              parseFloat(data.open) +
              parseFloat(data.open) * (parseFloat(aedToUsd.premium) / 100);
            // newAssetsMarketLast.volume = data.volume;
            // newAssetsMarketLast.ask = parseFloat(data.ask) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
            // newAssetsMarketLast.bid = parseFloat(data.bid) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
            // newAssetsMarketLast.timestamp = data.timestamp;
            newAssetsMarketLast.save();
            // console.log(`${market} last market Created for ${currency}`);
          }
        } catch {
          //
        }
      }
    });
  // curl.get(coniMarketApi, {"method": "market.status", "params": [`${market}${fiats[currency]}`, 1000], "id": 1}, async function(err, response, body) {
  //     console.log(body);
  //     if (err) {
  //         console.log(`${market} falied to save last market`);
  //     } else {
  //         let assetsMarketLast = await AssetsMarketLast.findOne({market: market, currency: currency});
  //         try {
  //             let data = JSON.parse(body);
  //             let aedToUsd = await CurrencySetting.findOne({name: currency});
  //             if(assetsMarketLast) {
  //                 assetsMarketLast.currency = currency;
  //                 assetsMarketLast.high = parseFloat(data.high) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
  //                 assetsMarketLast.low = parseFloat(data.low) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
  //                 assetsMarketLast.last = parseFloat(data.last) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
  //                 assetsMarketLast.open = parseFloat(data.open) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
  //                 assetsMarketLast.volume = data.volume;
  //                 // assetsMarketLast.ask = parseFloat(data.ask) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
  //                 // assetsMarketLast.bid = parseFloat(data.bid) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
  //                 // assetsMarketLast.timestamp = data.timestamp;
  //                 assetsMarketLast.save();
  //                 console.log(`${market} last market Updated for ${currency}`);
  //             } else {
  //                 let newAssetsMarketLast = new AssetsMarketLast;
  //                 newAssetsMarketLast.market = market;
  //                 newAssetsMarketLast.currency = currency;
  //                 newAssetsMarketLast.high = parseFloat(data.high) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
  //                 newAssetsMarketLast.low = parseFloat(data.low) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
  //                 newAssetsMarketLast.last = parseFloat(data.last) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
  //                 newAssetsMarketLast.open = parseFloat(data.open) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
  //                 newAssetsMarketLast.volume = data.volume;
  //                 // newAssetsMarketLast.ask = parseFloat(data.ask) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
  //                 // newAssetsMarketLast.bid = parseFloat(data.bid) * ((parseFloat(aedToUsd.value) + (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.premium)/100))) - (parseFloat(aedToUsd.value) * (parseFloat(aedToUsd.discount)/100)));
  //                 // newAssetsMarketLast.timestamp = data.timestamp;
  //                 newAssetsMarketLast.save();
  //                 console.log(`${market} last market Created for ${currency}`);
  //             }
  //         } catch {
  //             //
  //         }
  //     }
  // });
}

function createHistoryChart(cointcapApi, chartHistoryName, currency) {
  curl.get(cointcapApi, {}, async function (err, response, body) {
    let currencySettings = await CurrencySetting.findOne({ name: currency });
    let currentHistories = [];
    try {
      if (JSON.parse(body).data) {
        currentHistories = JSON.parse(body).data.sort(function (x, y) {
          return y.time - x.time;
        });

        let storeHistory = [];
        for (key in currentHistories) {
          let historyObj = {
            price:
              parseFloat(currentHistories[key].priceUsd) *
              (parseFloat(currencySettings.value) +
                parseFloat(currencySettings.value) *
                  (parseFloat(currencySettings.premium) / 100) -
                parseFloat(currencySettings.value) *
                  (parseFloat(currencySettings.discount) / 100)),
            time: currentHistories[key].time,
          };
          storeHistory.push(historyObj);
        }

        let cryptoHistory = await CryptoHistory.findOne({
          name: chartHistoryName,
          currency: currency,
        });

        if (cryptoHistory) {
          cryptoHistory.currency = currency;
          if (storeHistory.length > 0) {
            cryptoHistory.history = JSON.stringify(storeHistory);
          }
          await cryptoHistory.save();
          // console.log(`${chartHistoryName} hitory Updated for ${currency}`);
        } else {
          let newCryptoHistory = new CryptoHistory();
          newCryptoHistory.name = chartHistoryName;
          newCryptoHistory.currency = currency;
          if (storeHistory.length > 0) {
            newCryptoHistory.history = JSON.stringify(storeHistory);
          }
          await newCryptoHistory.save();
          // console.log(`${chartHistoryName} hitory Created for ${currency}`);
        }
      }
    } catch (error) {
      //
    }
  });
}

function createKreakenFutureTiker(url) {
  axios.get(url).then(async (response) => {
    for (ticker of response.data.tickers) {
      if (ticker.tag === "quarter" && !ticker.suspended) {
        let futureTiker = await FutureTicker.findOne({
          tag: ticker.tag,
          symbol: ticker.symbol,
          suspended: false,
        });
        if (futureTiker) {
          //
        } else {
          let tpair = await ticker.pair.split(":");
          let newFutureTiker = new FutureTicker();
          newFutureTiker.tag = ticker.tag;
          newFutureTiker.name = `${tpair[0] === "XBT" ? "BTC" : tpair[0]}${tpair[1]}`;
          newFutureTiker.stock = tpair[0] === "XBT" ? "BTC" : tpair[0];
          newFutureTiker.money = tpair[1];
          newFutureTiker.pair = ticker.pair;
          newFutureTiker.symbol = ticker.symbol;
          newFutureTiker.markPrice = ticker.markPrice;
          newFutureTiker.bid = ticker.bid;
          newFutureTiker.bidSize = ticker.bidSize;
          newFutureTiker.ask = ticker.ask;
          newFutureTiker.askSize = ticker.askSize;
          newFutureTiker.vol24h = ticker.vol24h;
          newFutureTiker.openInterest = ticker.openInterest;
          newFutureTiker.open24h = ticker.open24h;
          newFutureTiker.last = ticker.last;
          newFutureTiker.lastTime = ticker.lastTime;
          newFutureTiker.lastSize = ticker.lastSize;
          newFutureTiker.suspended = ticker.suspended;
          await newFutureTiker.save();
        }
      }
    }
  });
}

// schedule.scheduleJob('2 */1 * * *', async function() {
//     axios.get('https://data.fixer.io/api/latest?access_key=28b483b19a849642e0476c76d83b6a5b&base=USD&symbols=AED,INR')
//         .then(async res => {
//             let currencySetting = await CurrencySetting.findOne({name: 'USD to INR'});
//             currencySetting.value = 84.00;
//             await currencySetting.save();
//         })
// });

schedule.scheduleJob("30 * * * *", function () {
  // console.log('Cron for crypto hisotry started for 5 mins');

  let coins = [
    "BTC",
    "BCH",
    "XRP",
    "LTC",
    "DASH",
    "ETH",
    "TRX",
    "USDT",
    "BTX",
    // 'tbtc', 'tbch', 'tltc', 'tzec', 'tdash', 'txlm'
  ];

  let currencies = ["USD to AED", "USD to INR", "USD to USD", "USD to USDT"];

  for (currency of currencies) {
    for (coin of coins) {
      if (coin === "BTC" || coin === "tbtc") {
        createHistoryChart(
          "https://api.coincap.io/v2/assets/bitcoin/history?interval=m30",
          coin,
          currency
        );
        // createMarketLast('http://139.162.234.246:8080/', coin, currency);
        // createBitstampMarketLast('http://45.79.125.236/bitstamp/getLastMarket.php?coin=BTCUSDT', coin, currency);
        createMarketToday("http://13.127.84.72:8085/", coin, currency);
        // createMarketAskBid('http://139.162.234.246:8080/', coin, currency);
      } else if (coin === "BCH" || coin === "tbch") {
        createHistoryChart(
          "https://api.coincap.io/v2/assets/bitcoin-cash/history?interval=m30",
          coin,
          currency
        );
        // createMarketLast('http://139.162.234.246:8080/', coin, currency);
        // createBitstampMarketLast('http://45.79.125.236/bitstamp/getLastMarket.php?coin=BCHUSDT', coin, currency);
        createMarketToday("http://13.127.84.72:8085/", coin, currency);
        // createMarketAskBid('http://139.162.234.246:8080/', coin, currency);
      } else if (coin === "XRP") {
        createHistoryChart(
          "https://api.coincap.io/v2/assets/xrp/history?interval=m30",
          coin,
          currency
        );
        // createMarketLast('http://139.162.234.246:8080/', coin, currency);
        // createBitstampMarketLast('http://45.79.125.236/bitstamp/getLastMarket.php?coin=XRPUSDT', coin, currency);
        createMarketToday("http://13.127.84.72:8085/", coin, currency);
        // createMarketAskBid('http://139.162.234.246:8080/', coin, currency);
      } else if (coin === "LTC" || coin === "tltc") {
        createHistoryChart(
          "https://api.coincap.io/v2/assets/litecoin/history?interval=m30",
          coin,
          currency
        );
        // createMarketLast('http://139.162.234.246:8080/', coin, currency);
        // createBitstampMarketLast('http://45.79.125.236/bitstamp/getLastMarket.php?coin=LTCUSDT', coin, currency);
        createMarketToday("http://13.127.84.72:8085/", coin, currency);
        // createMarketAskBid('http://139.162.234.246:8080/', coin, currency);
      } else if (coin === "ZEC" || coin === "tzec") {
        createHistoryChart(
          "https://api.coincap.io/v2/assets/zcash/history?interval=m30",
          coin,
          currency
        );
      } else if (coin === "DASH" || coin === "tdash") {
        createHistoryChart(
          "https://api.coincap.io/v2/assets/dash/history?interval=m30",
          coin,
          currency
        );
      } else if (coin === "ETH") {
        createHistoryChart(
          "https://api.coincap.io/v2/assets/ethereum/history?interval=m30",
          coin,
          currency
        );
        // createMarketLast('http://139.162.234.246:8080/', coin, currency);
        // createBitstampMarketLast('http://45.79.125.236/bitstamp/getLastMarket.php?coin=ETHUSDT', coin, currency);
        createMarketToday("http://13.127.84.72:8085/", coin, currency);
        // createMarketAskBid('http://139.162.234.246:8080/', coin, currency);
      } else if (coin === "TRX") {
        createHistoryChart(
          "https://api.coincap.io/v2/assets/tron/history?interval=m30",
          coin,
          currency
        );
        // createBitstampMarketLast('http://45.79.125.236/bitstamp/getLastMarket.php?coin=TRXUSDT', coin, currency);
        createMarketToday("http://13.127.84.72:8085/", coin, currency);
      } else if (coin === "XLM" || coin === "txlm") {
        createHistoryChart(
          "https://api.coincap.io/v2/assets/stellar/history?interval=m30",
          coin,
          currency
        );
      } else if (coin === "USDT") {
        createMarketToday("http://13.127.84.72:8085/", coin, currency);
        createHistoryChart(
          "https://api.coincap.io/v2/assets/tether/history?interval=m30",
          coin,
          currency
        );
      } else if (coin === "BTX") {
        createMarketToday("http://13.127.84.72:8085/", coin, currency);
      } else {
        // res.json([]);0.16959116
        // console.log('Hitory Started to upload for currency ' + currency);
      }
    }
  }

  // createKreakenFutureTiker('https://futures.kraken.com/derivatives/api/v3/tickers');

  // coins.map(coin => {
  //     if(coin === 'BTC' || coin === 'tbtc') {
  //         createHistoryChart('https://api.coincap.io/v2/assets/bitcoin/history?interval=m30', coin);
  //         createMarketLast('http://45.79.125.236/bitstamp/getMarketLast.php?coin=btcusd', coin);
  //     } else if(coin === 'BCH' || coin === 'tbch') {
  //         createHistoryChart('https://api.coincap.io/v2/assets/bitcoin-cash/history?interval=m30', coin);
  //         createMarketLast('http://45.79.125.236/bitstamp/getMarketLast.php?coin=bchusd', coin);
  //     } else if(coin === 'XRP') {
  //         createHistoryChart('https://api.coincap.io/v2/assets/ripple/history?interval=m30', coin);
  //         createMarketLast('http://45.79.125.236/bitstamp/getMarketLast.php?coin=xrpusd', coin);
  //     } else if(coin === 'LTC' || coin === 'tltc') {
  //         createHistoryChart('https://api.coincap.io/v2/assets/litecoin/history?interval=m30', coin);
  //         createMarketLast('http://45.79.125.236/bitstamp/getMarketLast.php?coin=ltcusd', coin);
  //     } else if(coin === 'ZEC' || coin === 'tzec') {
  //         createHistoryChart('https://api.coincap.io/v2/assets/zcash/history?interval=m30', coin);
  //     } else if(coin === 'DASH' || coin === 'tdash') {
  //         createHistoryChart('https://api.coincap.io/v2/assets/dash/history?interval=m30', coin);
  //     } else if(coin === 'ETH') {
  //         createHistoryChart('https://api.coincap.io/v2/assets/ethereum/history?interval=m30', coin);
  //         createMarketLast('http://45.79.125.236/bitstamp/getMarketLast.php?coin=ethusd', coin);
  //     } else if(coin === 'XLM' || coin === 'txlm') {
  //         createHistoryChart('https://api.coincap.io/v2/assets/stellar/history?interval=m30', coin);
  //     } else {
  //         // res.json([]);0.16959116
  //         console.log('Hitory Started to upload');
  //     }
  // })
});

let marginUserCalls = new Queue(function (input, cb) {
  // Some processing here ...
  // let encodedEmail = base64.encode(req.body.email);
  // let emailBody = forgotEmail(req.body.email, keys.hostURI + '/reset-password/' + encodedEmail);
  let emailBody =
    "<p>This is a final margin call please review your account and pay the remaining debt in order to save the loss</p>";

  const mailOptions = {
    from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
    to: input.email, // list of receivers
    subject: "Final Margin CALL!", // Subject line
    html: emailBody, // plain text body
  };

  try {
    sgMail.send(mailOptions);
  } catch (error) {
    console.log(error);
  }

  cb(null, result);
});

let closeMarginOrders = new Queue(async function (input, cb) {
  const orders = await Order.find({
    userId: input._id,
    status: "Open",
    margin: true,
  });
  let asssetCoin = getAssetCoin(currentOrder.market);
  let userMarginWalletFiat = await UserMarginWallet.findOne({
    userId: input._id,
    coin: asssetCoin.fiat,
  });
  let userMarginWalletCrypto = await UserMarginWallet.findOne({
    userId: input._id,
    coin: asssetCoin.crypto,
  });

  for (order of orders) {
    if (order) {
      let currentOrder = order;

      order.status = "Cancelled";
      await order.save();
      if (currentOrder.side === 2) {
        if (order.margin) {
          if (userMarginWalletFiat) {
            let makerValue =
              parseFloat(currentOrder.price) * parseFloat(currentOrder.amount);
            let makerAmount =
              makerValue + makerValue * parseFloat(req.body.maker_fee_rate);
            userMarginWalletFiat.walletAmount = (
              parseFloat(userMarginWalletFiat.walletAmount) + makerAmount
            ).toFixed(2);
            await userMarginWalletFiat.save();
          }
        }
      }

      if (currentOrder.side === 1) {
        if (order.margin) {
          if (userMarginWalletCrypto) {
            userMarginWalletCrypto.walletAmount = (
              parseFloat(userMarginWalletCrypto.walletAmount) +
              parseFloat(currentOrder.amount)
            ).toFixed(8);
            await userMarginWalletCrypto.save();
          }
        }
      }
    }
  }

  if (
    parseFloat(userMarginWalletFiat.walletAmount) <
    parseFloat(userMarginWalletFiat.borrowAmount) +
      parseFloat(userMarginWalletFiat.borrowIntrestAmount)
  ) {
    userMarginWalletFiat.walletAmount = 0;
    userMarginWalletFiat.borrowAmount = 0;
    userMarginWalletFiat.borrowIntrestAmount = 0;
    await userMarginWalletFiat.save();
  } else if (
    parseFloat(userMarginWalletFiat.walletAmount) >=
    parseFloat(userMarginWalletFiat.borrowAmount) +
      parseFloat(userMarginWalletFiat.borrowIntrestAmount)
  ) {
    userMarginWalletFiat.walletAmount =
      parseFloat(userMarginWalletFiat.walletAmount) -
      (parseFloat(userMarginWalletFiat.borrowAmount) +
        parseFloat(userMarginWalletFiat.borrowIntrestAmount));
    userMarginWalletFiat.borrowAmount = 0;
    userMarginWalletFiat.borrowIntrestAmount = 0;
    await userMarginWalletFiat.save();
  }

  if (
    parseFloat(userMarginWalletCrypto.walletAmount) <
    parseFloat(userMarginWalletCrypto.borrowAmount) +
      parseFloat(userMarginWalletCrypto.borrowIntrestAmount)
  ) {
    userMarginWalletCrypto.walletAmount = 0;
    userMarginWalletCrypto.borrowAmount = 0;
    userMarginWalletCrypto.borrowIntrestAmount = 0;
    await userMarginWalletCrypto.save();
  } else if (
    parseFloat(userMarginWalletCrypto.walletAmount) >=
    parseFloat(userMarginWalletCrypto.borrowAmount) +
      parseFloat(userMarginWalletCrypto.borrowIntrestAmount)
  ) {
    userMarginWalletCrypto.walletAmount =
      parseFloat(userMarginWalletCrypto.walletAmount) -
      (parseFloat(userMarginWalletCrypto.borrowAmount) +
        parseFloat(userMarginWalletCrypto.borrowIntrestAmount));
    userMarginWalletCrypto.borrowAmount = 0;
    userMarginWalletCrypto.borrowIntrestAmount = 0;
    await userMarginWalletCrypto.save();
  }
});

checkMarginLevel = async () => {
  // console.log('Checking marging....');
  const users = await User.find();

  for (user of users) {
    // let userOpenMargins = await UserOpenMargin.find({userId: user._id});
    let userMarginWallets = await UserMarginWallet.find({ userId: user._id });
    let userMarginFiatWallet = await UserMarginWallet.findOne({
      userId: user._id,
      fiat: true,
      active: true,
    });
    let totalCurrentAssetValue = 0;
    let totalDebtAssetValue = 0;
    for (userMarginWallet of userMarginWallets) {
      // console.log(parseFloat(userOpenMargin.lastExecutedPrice), (parseFloat(userMarginWallet.borrowAmount)*parseFloat(userOpenMargin.lastExecutedPrice)), ((parseFloat(userOpenMargin.totalOpenMargins) * parseFloat(userOpenMargin.lastExecutedPrice))/parseFloat(getAssetCoin(userOpenMargin.market).lastBuy)), (((parseFloat(userOpenMargin.totalOpenMargins) * parseFloat(userOpenMargin.lastExecutedPrice))/parseFloat(getAssetCoin(userOpenMargin.market).lastBuy))*parseFloat(userOpenMargin.lastExecutedPrice)));
      if (userMarginWallet) {
        if (
          userMarginWallet.coin === "BTC" ||
          userMarginWallet.coin === "tbtc"
        ) {
          totalCurrentAssetValue =
            totalCurrentAssetValue + parseFloat(userMarginWallet.walletAmount);
          totalDebtAssetValue =
            totalDebtAssetValue +
            (userMarginWallet.borrowAmount
              ? parseFloat(userMarginWallet.borrowAmount)
              : 0);
        } else if (userMarginWallet.fiat && userMarginWallet.active) {
          totalCurrentAssetValue =
            totalCurrentAssetValue +
            parseFloat(userMarginWallet.walletAmount) /
              parseFloat(getAssetCoin(`BTC${userMarginWallet.coin}`).lastBuy);
          totalDebtAssetValue =
            totalDebtAssetValue +
            (userMarginWallet.borrowAmount
              ? parseFloat(userMarginWallet.borrowAmount) /
                parseFloat(getAssetCoin(`BTC${userMarginWallet.coin}`).lastBuy)
              : 0);
        } else {
          if (userMarginWallet && userMarginFiatWallet) {
            let currentBtcPrice =
              (parseFloat(userMarginWallet.walletAmount) *
                parseFloat(
                  getAssetCoin(
                    `${userMarginWallet.coin}${userMarginFiatWallet.coin}`
                  ).lastBuy
                )) /
              parseFloat(
                getAssetCoin(`BTC${userMarginFiatWallet.coin}`).lastBuy
              );
            let currentBtcDebtPrice =
              ((userMarginWallet.borrowAmount
                ? parseFloat(userMarginWallet.borrowAmount)
                : 0) *
                parseFloat(
                  getAssetCoin(
                    `${userMarginWallet.coin}${userMarginFiatWallet.coin}`
                  ).lastBuy
                )) /
              parseFloat(
                getAssetCoin(`BTC${userMarginFiatWallet.coin}`).lastBuy
              );
            // console.log(currentBtcPrice, parseFloat(getAssetCoin(`${userMarginWallet.coin}${userMarginFiatWallet.coin}`).lastBuy));
            if (currentBtcPrice) {
              totalCurrentAssetValue = totalCurrentAssetValue + currentBtcPrice;
            }
            if (currentBtcDebtPrice) {
              totalDebtAssetValue = totalDebtAssetValue + currentBtcDebtPrice;
            }
          }
        }
        // totalCurrentAssetValues[userMarginWallet.coin] = (parseFloat(userMarginWallet.borrowAmount)*parseFloat(userOpenMargin.lastExecutedPrice))/(((parseFloat(userOpenMargin.totalOpenMargins) * parseFloat(userOpenMargin.lastExecutedPrice))/parseFloat(getAssetCoin(userOpenMargin.market).lastBuy))*parseFloat(userOpenMargin.lastExecutedPrice));

        // const activeBorrows = await UserBorrowHolding.find({userMarginWalletId: userMarginWallet._id, active: true});
        // let totalBorrowIntrests = 0;
        // if (activeBorrows.length > 0) {
        //     for (activeBorrow of activeBorrows) {
        //         let delta = Math.abs(Date.now() - (Date.parse(activeBorrow.createdAt))) / 1000;
        //         let hours = Math.ceil((Math.floor(delta / 3600) % 24) / 4) === 0 ? 1 : Math.ceil((Math.floor(delta / 3600) % 24) / 4);
        //         totalBorrowIntrests = totalBorrowIntrests + ((parseFloat(activeBorrow.borrowAmount) * 0.001) * hours);
        //     }
        // }
        // if (userMarginWallet) {
        //     totalBorrowAmounts[userOpenMargins.coin] = parseFloat(userMarginWallet.borrowAmount) + parseFloat(totalBorrowIntrests);
        // }
      }
    }
    const marginLevel = totalCurrentAssetValue / totalDebtAssetValue;
    if (marginLevel) {
      if (marginLevel > 1.1 && marginLevel <= 1.4) {
        if (!user.marginCall) {
          marginUserCalls.push(user);
          user.marginCall = true;
          user.marginCallAt = new Date.now();
          user.save();
        }
      } else {
        if (marginLevel <= 1.1) {
          closeMarginOrders.push(user);
        }
        user.marginCall = false;
        user.save();
      }
      // console.log(user.email, marginLevel, 'Margin level');
    }
  }
};

// schedule.scheduleJob('*/10 * * * * *', function() {
// 	// checkMarginLevel();
// 	console.log('Checking margin at every 10 seconds');
// });

function isFloat(n) {
  return Number(n) === n && n % 1 !== 0;
}

updateLimitOrder = async (order) => {
  assetCoin = await getAssetCoin(order.market);
  // console.log(assetCoin, order);
  if (order.market.includes(assetCoin.crypto)) {
    // const orderbookParse = JSON.parse(orderbookStream.stream);
    if (
      parseFloat(order.price) &&
      order.market.includes(assetCoin.crypto) &&
      order.market.includes(assetCoin.fiat)
    ) {
      const currencySetting = await CurrencySetting.findOne({
        currency: assetCoin.fiat,
      });
      const assetCurrencyValue =
        parseFloat(currencySetting.value) +
        parseFloat(currencySetting.value) *
          (parseFloat(currencySetting.premium) / 100);
      // const orderbookStream = await OrderbookStream.findOne({coin: assetCoin.crypto});
      const orderbookStreamv2 = await axios.get(
        `https://api3.binance.com/api/v3/ticker/bookTicker?symbol=${assetCoin.crypto}USDT`
      );
      if (!isEmpty(orderbookStreamv2.data)) {
        const lastAsks =
          (parseFloat(orderbookStreamv2.data.askPrice) +
            parseFloat(orderbookStreamv2.data.askPrice) * 0.001) *
          assetCurrencyValue;
        const lastBids =
          (parseFloat(orderbookStreamv2.data.bidPrice) -
            parseFloat(orderbookStreamv2.data.bidPrice) * 0.001) *
          assetCurrencyValue;
        // console.log(lastAsks, lastBids, order.market, assetCurrencyValue, assetCoin.crypto, assetCoin.fiat, order.price, order._id);

        // console.log(processingOrder.includes(order._id));
        if (processingOrder.includes(order._id)) {
          // console.log(`${order._id} ${order.side === 2 ? 'Buy' : 'Sell'} order already processing...`);
        } else {
          processingOrder.push(order._id);
          // let lorder = await Order.find({status: 'Open', side: 1, price: { $lt: [/^\d+$/, lastBids] }});
          // let lorder = await Order.find({status: 'Open', side: 1, price: { $lt: lastBids }});
          // console.log(processingOrder, 'order to process....');
          // await updateOpenOrders(lastAsks, lastBids, order.market, order, assetCoin);
        }
      }
    }
  }
  return true;
};

// schedule.scheduleJob('*/4 * * * * *', async () => {
//     processingOrder = [];
//     let orders = await Order.find({status: 'Open'});
//     for (order of orders) {
//         // console.log(order);
//         if (order) {
//             // await updateLimitOrder(order);
//         }
//     }
// });

/**
 * @route GET /api/trading/get_margin_level/:userId
 * @description Get user margin level.
 * @access Public
 */
router.get("/get_margin_level/:userId", async (req, res) => {
  let user = await User.findOne({ _id: req.params.userId });
  let userMarginWallets = await UserMarginWallet.find({ userId: user._id });
  let userMarginFiatWallet = await UserMarginWallet.findOne({
    userId: user._id,
    fiat: true,
    active: true,
  });
  let totalCurrentAssetValue = 0;
  let totalDebtAssetValue = 0;
  for (userMarginWallet of userMarginWallets) {
    if (userMarginWallet) {
      if (userMarginWallet.coin === "BTC" || userMarginWallet.coin === "tbtc") {
        totalCurrentAssetValue =
          totalCurrentAssetValue + parseFloat(userMarginWallet.walletAmount);
        totalDebtAssetValue =
          totalDebtAssetValue +
          (userMarginWallet.borrowAmount
            ? parseFloat(userMarginWallet.borrowAmount)
            : 0);
      } else if (userMarginWallet.fiat && userMarginWallet.active) {
        if (
          parseFloat(userMarginWallet.walletAmount) /
          parseFloat(getAssetCoin(`BTC${userMarginWallet.coin}`).lastBuy)
        ) {
          totalCurrentAssetValue =
            totalCurrentAssetValue +
            parseFloat(userMarginWallet.walletAmount) /
              parseFloat(getAssetCoin(`BTC${userMarginWallet.coin}`).lastBuy);
        }
        if (
          userMarginWallet.borrowAmount
            ? parseFloat(userMarginWallet.borrowAmount) /
              parseFloat(getAssetCoin(`BTC${userMarginWallet.coin}`).lastBuy)
            : 0
        ) {
          totalDebtAssetValue =
            totalDebtAssetValue +
            (userMarginWallet.borrowAmount
              ? parseFloat(userMarginWallet.borrowAmount) /
                parseFloat(getAssetCoin(`BTC${userMarginWallet.coin}`).lastBuy)
              : 0);
        }
      } else {
        let currentBtcPrice =
          (parseFloat(userMarginWallet.walletAmount) *
            parseFloat(
              getAssetCoin(
                `${userMarginWallet.coin}${userMarginFiatWallet.coin}`
              ).lastBuy
            )) /
          parseFloat(getAssetCoin(`BTC${userMarginFiatWallet.coin}`).lastBuy);
        let currentBtcDebtPrice =
          ((userMarginWallet.borrowAmount
            ? parseFloat(userMarginWallet.borrowAmount)
            : 0) *
            parseFloat(
              getAssetCoin(
                `${userMarginWallet.coin}${userMarginFiatWallet.coin}`
              ).lastBuy
            )) /
          parseFloat(getAssetCoin(`BTC${userMarginFiatWallet.coin}`).lastBuy);

        if (currentBtcPrice) {
          totalCurrentAssetValue = totalCurrentAssetValue + currentBtcPrice;
        }
        if (currentBtcDebtPrice) {
          totalDebtAssetValue = totalDebtAssetValue + currentBtcDebtPrice;
        }
      }
    }
  }
  const marginLevel = totalCurrentAssetValue / totalDebtAssetValue;

  return res.json({
    marginLevel: marginLevel
      ? marginLevel >= 999
        ? 999
        : marginLevel.toFixed(2)
      : 999,
    totalCurrentAssetValue: totalCurrentAssetValue
      ? totalCurrentAssetValue.toFixed(8)
      : 0,
    totalDebtAssetValue: totalDebtAssetValue
      ? totalDebtAssetValue.toFixed(8)
      : 0,
  });
});

/**
 * @route GET /api/trading/crypto_history
 * @description Get all user last five orders.
 * @access Public
 */
router.get("/crypto_history", async (req, res) => {
  CryptoHistory.find()
    .then((cryptoHistories) => {
      let market_graph = {};
      for (key in cryptoHistories) {
        market_graph[cryptoHistories[key].name] = cryptoHistories[key].history;
      }
      res.json(market_graph);
    })
    .catch((err) => {
      res.json({});
    });
});

/**
 * @route GET /api/trading/get_market_last
 * @description Get all market last values.
 * @access Public
 */
router.get("/get_market_last", async (req, res) => {
  AssetsMarketLast.find()
    .then((assetsMarketLasts) => {
      let assetMarketLast = {};
      for (key in assetsMarketLasts) {
        assetMarketLast[assetsMarketLasts[key].market + "AED"] =
          assetsMarketLasts[key];
      }
      res.json(assetMarketLast);
    })
    .catch((err) => {
      res.json([]);
    });
});

module.exports = router;
