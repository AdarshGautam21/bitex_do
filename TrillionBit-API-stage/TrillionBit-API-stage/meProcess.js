const axios = require('axios');
const schedule = require('node-schedule');
const mongoose = require('mongoose');

const redis = require("redis");
const client = redis.createClient();

const Referral = require('./models/referral/Referral');
const ReferralSetting = require('./models/referral/ReferralSetting');
const ReferralTree = require('./models/referral/ReferralTree');
const UserWallet = require('./models/UserWallet');
const Order = require('./eorder');
const User = require('./models/User');
const UserProfile = require('./models/UserProfile');

const AgentUsers = require('./models/agent/AgentUsers');
const InrTraderLevel = require('./models/trading/InrTraderLevel');
const AgentTraderLevel = require('./models/agent/AgentTraderLevel');
const SubAgentTraderLevel = require('./models/agent/SubAgentTraderLevel');
const AgentClientTraderLevel = require('./models/agent/AgentClientTraderLevel');
const UserMarginWallet = require('./models/margin/UserMarginWallet');

const isEmpty = require('./validation/isEmpty');


const CurrencySetting = require('./models/trading/CurrencySetting');

// DB Config
// const db = "mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex";
// const db = "mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex";
const db = "mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex";


// Connect to mongoDB
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        // console.log(db + 'MongoDB connected');
    })
    .catch(err => {
        // console.log(err);
        process.exit();
    });

client.on("error", function(error) {
    // console.error(error);
    process.exit();
});

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

getAssetCoin = marketName => {
    let marketCoin = {
        crypto: 'tbtc',
        fiat: 'AED',
        lastBuy: lastBtcBuy,
        lastSell: lastBtcSell,
    };
    if(marketName === 'tbtcAED') {
        marketCoin = {
            crypto: 'tbtc',
            fiat: 'AED',
            lastBuy: lastBtcBuy,
            lastSell: lastBtcSell,
        };
        coinLastPrice['tbtcAED'] = {
            lastBuy: lastBtcBuy,
            lastSell: lastBtcSell,
        };
    }
    if(marketName === 'tbchAED') {
        marketCoin = {
            crypto: 'tbch',
            fiat: 'AED',
            lastBuy: lastBchBuy,
            lastSell: lastBchSell,
        };
        coinLastPrice['tbctbchAEDh'] = {
            lastBuy: lastBchBuy,
            lastSell: lastBchSell,
        };
    }
    if(marketName === 'tltcAED') {
        marketCoin = {
            cypro: 'tltc',
            fiat: 'AED',
            lastBuy: lastLtcBuy,
            lastSell: lastLtcSell,
        };
        coinLastPrice['tltcAED'] = {
            lastBuy: lastLtcBuy,
            lastSell: lastLtcSell,
        };
    }
    if(marketName === 'tbtcINR') {
        marketCoin = {
            crypto: 'tbtc',
            fiat: 'INR',
            lastBuy: lastBtcInrBuy,
            lastSell: lastBtcInrSell,
        };
        coinLastPrice['tbtcINR'] = {
            lastBuy: lastBtcInrBuy,
            lastSell: lastBtcInrSell,
        };
    }
    if(marketName === 'tbchINR') {
        marketCoin = {
            crypto: 'tbch',
            fiat: 'INR',
            lastBuy: lastBchInrBuy,
            lastSell: lastBchInrSell,
        };
        coinLastPrice['tbchINR'] = {
            lastBuy: lastBchInrBuy,
            lastSell: lastBchInrSell,
        };
    }
    if(marketName === 'tltcINR') {
        marketCoin = {
            cypro: 'tltc',
            fiat: 'INR',
            lastBuy: lastLtcInrBuy,
            lastSell: lastLtcInrSell,
        };
        coinLastPrice['tltcINR'] = {
            lastBuy: lastLtcInrBuy,
            lastSell: lastLtcInrSell,
        };
    }
    if(marketName === 'tzecAED') {
        marketCoin = {
            crypto: 'tzec',
            fiat: 'AED',
        };
    }
    if(marketName === 'txlmAED') {
        marketCoin = {
            crypto: 'txlm',
            fiat: 'AED',
        };
    }
    if(marketName === 'tdashAED') {
        marketCoin = {
            crypto: 'tdash',
            fiat: 'AED',
        };
    }
    if(marketName === 'BTCAED') {
        marketCoin = {
            crypto: 'BTC',
            fiat: 'AED',
            lastBuy: lastBtcBuy,
            lastSell: lastBtcSell,
        };
        coinLastPrice['BTCAED'] = {
            lastBuy: lastBtcBuy,
            lastSell: lastBtcSell,
        };
    }
    if(marketName === 'BCHAED') {
        marketCoin = {
            crypto: 'BCH',
            fiat: 'AED',
            lastBuy: lastBchBuy,
            lastSell: lastBchSell,
        };
        coinLastPrice['BCHAED'] = {
            lastBuy: lastBchBuy,
            lastSell: lastBchSell,
        };
    }
    if(marketName === 'LTCAED') {
        marketCoin = {
            crypto: 'LTC',
            fiat: 'AED',
            lastBuy: lastLtcBuy,
            lastSell: lastLtcSell,
        };
        coinLastPrice['LTCAED'] = {
            lastBuy: lastLtcBuy,
            lastSell: lastLtcSell,
        };
    }
    if(marketName === 'XRPAED') {
        marketCoin = {
            crypto: 'XRP',
            fiat: 'AED',
            lastBuy: lastXrpBuy,
            lastSell: lastXrpSell,
        };
        coinLastPrice['XRPAED'] = {
            lastBuy: lastXrpBuy,
            lastSell: lastXrpSell,
        };
    }
    if(marketName === 'ETHAED') {
        marketCoin = {
            crypto: 'ETH',
            fiat: 'AED',
            lastBuy: lastEthBuy,
            lastSell: lastEthSell,
        };
        coinLastPrice['ETHAED'] = {
            lastBuy: lastEthBuy,
            lastSell: lastEthSell,
        };
    }
    if(marketName === 'BTCINR') {
        marketCoin = {
            crypto: 'BTC',
            fiat: 'INR',
            lastBuy: lastBtcInrBuy,
            lastSell: lastBtcInrSell,
        };
        coinLastPrice['BTCINR'] = {
            lastBuy: lastBtcInrBuy,
            lastSell: lastBtcInrSell,
        };
    }
    if(marketName === 'BCHINR') {
        marketCoin = {
            crypto: 'BCH',
            fiat: 'INR',
            lastBuy: lastBchInrBuy,
            lastSell: lastBchInrSell,
        };
        coinLastPrice['BCHINR'] = {
            lastBuy: lastBchInrBuy,
            lastSell: lastBchInrSell,
        };
    }
    if(marketName === 'LTCINR') {
        marketCoin = {
            crypto: 'LTC',
            fiat: 'INR',
            lastBuy: lastLtcInrBuy,
            lastSell: lastLtcInrSell,
        };
        coinLastPrice['LTCINR'] = {
            lastBuy: lastLtcInrBuy,
            lastSell: lastLtcInrSell,
        };
    }
    if(marketName === 'XRPINR') {
        marketCoin = {
            crypto: 'XRP',
            fiat: 'INR',
            lastBuy: lastXrpInrBuy,
            lastSell: lastXrpInrSell,
        };
        coinLastPrice['XRPINR'] = {
            lastBuy: lastXrpInrBuy,
            lastSell: lastXrpInrSell,
        };
    }
    if(marketName === 'ETHINR') {
        marketCoin = {
            crypto: 'ETH',
            fiat: 'INR',
            lastBuy: lastEthInrBuy,
            lastSell: lastEthInrSell,
        };
        coinLastPrice['ETHINR'] = {
            lastBuy: lastEthInrBuy,
            lastSell: lastEthInrSell,
        };
    }
    return marketCoin;
}
    
let processingOrder = [];

updateOpenOrders = async (lastBuy, lastSell, market, order, assetCoin) => {
    // const orders = await Order.find({market: market, status: 'Open'});
    // if (orders.length > 0) {
    //     for (order of orders) {
            if (order.side === 1) {
                // if ( (parseFloat(order.price) < parseFloat(lastBuy)) && (order.market === market) && order.market.includes(assetCoin.crypto)) {
                if ( (order.market === market) && order.market.includes(assetCoin.crypto)) {
                    // if (processingOrder.includes(order._id)) {
                        //     console.log(`${order._id} Sell order already processing...`);
                        // } else {
                        // processingOrder.push(order._id);
                        // client.set(`${order._id}`, 'Open');
                        // console.log(order._id, lastBuy, lastSell, order.price);
                        order.status = 'Finished';
                        order.price = lastBuy;
                        order.dealMoney = lastBuy;
                        order.updateDate = Date.now();
                        await order.save()
                            .then(async order => {
                                let asssetCoin = getAssetCoin(order.market);

                                let taker_fee_rate = order.takerFee;
                                let _is_agent = false;
                                let agent_taker_fee = 0;
                                let agent;

                                const user = await User.findOne({_id: order.userId});
                                if (user) {
                                    const userProfile = await UserProfile.findOne({userId: user._id});
                                    const agentUser = await AgentUsers.findOne({userId: user._id});

                                    if (agentUser) {
                                        agent = await User.findOne({_id: agentUser.agentId});
                                        if (agent) {
                                            _is_agent = true;
                                            const agentProfile = await UserProfile.findOne({userId: agent._id});

                                            if (agent.agent) {
                                                const agentTraderLevel = await AgentTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
                                                agent_taker_fee = parseFloat(agentTraderLevel.taker_fee)/100;
                                            } else if (agent.subAgent) {
                                                const agentTraderLevel = await SubAgentTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
                                                agent_taker_fee = parseFloat(agentTraderLevel.taker_fee)/100;
                                            }

                                            let clientTraderLevel = await AgentClientTraderLevel.findOne({clientId: user._id, name: `${userProfile.traderLevel}`});
                                            if (clientTraderLevel) {
                                                taker_fee_rate = parseFloat(clientTraderLevel.taker_fee)/100;
                                            } else {
                                                clientTraderLevel = await InrTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
                                                if (clientTraderLevel) {
                                                    taker_fee_rate = parseFloat(clientTraderLevel.taker_fee)/100;
                                                }
                                            }
                                        }
                                    }
                                }

                                let userWallet;
                                if(order.margin) {
                                    userWallet = await UserMarginWallet.findOne({userId: order.userId, coin: asssetCoin.fiat})
                                } else {
                                    userWallet = await UserWallet.findOne({userId: order.userId, coin: asssetCoin.fiat});
                                }

                                if(userWallet) {
                                        let dealFinalPrice = (parseFloat(order.amount) * parseFloat(lastBuy)) - ((parseFloat(order.amount) * parseFloat(lastBuy)) * (parseFloat(taker_fee_rate)));
                                        let agentDealFinalFee = ((parseFloat(order.amount) * parseFloat(lastBuy)) * (parseFloat(agent_taker_fee)));
                                        // let depositReqest = await WalletController.depositeWallet(userWallet, parseFloat(dealFinalPrice));
                                        // if (depositReqest) {
                                        //     console.log(`viabtc balance updated ${order.userId}`);
                                        // } else {
                                        //     console.log(`viabtc balance failed ${order.userId}`);
                                        // }
                                        userWallet.walletAmount = (parseFloat(userWallet.walletAmount) + parseFloat(dealFinalPrice)).toFixed(2);
                                        await userWallet.save();

                                        if (_is_agent) {
                                            if (user) {
                                                if(agent) {
                                                    let agentFiatWallet;
                                                    if(order.margin) {
                                                        agentFiatWallet = await UserMarginWallet.findOne({userId: agent._id, coin: asssetCoin.fiat});
                                                    } else {
                                                        agentFiatWallet = await UserWallet.findOne({userId: agent._id, coin: asssetCoin.fiat});
                                                    }
                
                                                    // Fiat wallet Update
                                                    // let withdrawReqest = await WalletController.withdrawWallet(userWallet, parseFloat(agentDealFinalFee));
                                                    // if (withdrawReqest) {
                                                    //     console.log(`viabtc balance updated ${order.userId}`);
                                                    // } else {
                                                    //     console.log(`viabtc balance failed ${order.userId}`);
                                                    // }
                                                    agentFiatWallet.walletAmount = (parseFloat(agentFiatWallet.walletAmount) - agentDealFinalFee).toFixed(2);
                                                    agentFiatWallet.save();
                                                }
                                            }
                                        }

                                        const index = processingOrder.indexOf(order._id);
                                        if (index > -1) {
                                            processingOrder.splice(index, 1);
                                        }
                                        // console.log(market + ' Sell order closed ' + order._id);
                                        // client.get(`${order._id}`, function(err, reply) {
                                        //     // reply is null when the key is missing
                                        //     // console.log(reply);
                                        //     if (reply) {
                                        //         client.del(`${order._id}`);
                                        //     } else {
        
                                        //     }
                                        // });
                                        // depositeWallet(userWallet, parseFloat(dealFinalPrice));
                                        ReferralTree.findOne({referredUser: order.userId})
                                            .then(referralTree => {
                                                if(referralTree) {
                                                    ReferralSetting.find()
                                                        .then(referralSettings => {
                                                            if(referralSettings.length > 0) {
                                                                let refEarn = (((parseFloat(order.amount) * parseFloat(lastBuy)) * (parseFloat(order.takerFee)))) * parseFloat(referralSettings[0].commissionPercentage);
                                                                referralTree.referredUserEarning = (parseFloat(referralTree.referredUserEarning) + parseFloat(refEarn)).toFixed(4);
                                                                referralTree.save();
                                                                Referral.findOne({_id: referralTree.referralId})
                                                                    .then(referral => {
                                                                        if(referral) {
                                                                            referral.totalReferralEarnings = (parseFloat(referral.totalReferralEarnings) + parseFloat(refEarn)).toFixed(4);
                                                                            referral.save();
                                                                        } else {
                                                                            //
                                                                        }
                                                                    })
                                                                    .catch(err => {
                                                                        //
                                                                    })
                                                            } else {
                                                                //
                                                            }
                                                        })
                                                } else {
                                                    //
                                                }
                                            })
                                            .catch(err => {
                                                //
                                            })
                                            return true;
                                }
                            })
                            .catch(err => {
                                const index = processingOrder.indexOf(order._id);
                                if (index > -1) {
                                    processingOrder.splice(index, 1);
                                }
                                // console.log(market + ' Sell order closed ' + order._id);
                                // client.get(`${order._id}`, function(err, reply) {
                                //     // reply is null when the key is missing
                                //     // console.log(reply);
                                //     if (reply) {
                                //         client.del(`${order._id}`);
                                //     } else {

                                //     }
                                // });
                                return true;
                            })
                        // console.log(market + ' Sell order closed ' + order._id);
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
                // if ((parseFloat(order.price) > parseFloat(lastSell)) && (order.market === market) && order.market.includes(assetCoin.crypto)) {
                if ((order.market === market) && order.market.includes(assetCoin.crypto)) {
                    // console.log(order._id, lastSell, lastBuy, order.price);
                    // if (processingOrder.includes(order._id)) {
                    //     console.log(`${order._id} Buy order already processing...`);
                    // } else {
                        // processingOrder.push(order._id);
                        // client.set(`${order._id}`, 'Open');
                        order.status = 'Finished';
                        order.price = lastSell;
                        order.dealMoney = lastSell;
                        order.updateDate = Date.now();
                        await order.save()
                            .then(async order => {
                                let asssetCoin = getAssetCoin(order.market);

                                let _is_agent = false;
                                let agent_taker_fee = 0;
                                let agent;

                                const user = await User.findOne({_id: order.userId});
                                if (user) {
                                    const agentUser = await AgentUsers.findOne({userId: user._id});

                                    if (agentUser) {
                                        agent = await User.findOne({_id: agentUser.agentId});
                                        if (agent) {
                                            _is_agent = true;
                                            const agentProfile = await UserProfile.findOne({userId: agent._id});

                                            if (agent.agent) {
                                                const agentTraderLevel = await AgentTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
                                                agent_taker_fee = parseFloat(agentTraderLevel.taker_fee)/100;
                                            } else if (agent.subAgent) {
                                                const agentTraderLevel = await SubAgentTraderLevel.findOne({name: `${agentProfile.traderLevel}`});
                                                agent_taker_fee = parseFloat(agentTraderLevel.taker_fee)/100;
                                            }
                                        }
                                    }
                                }

                                let userWallet;
                                if(order.margin) {
                                    userWallet = await UserMarginWallet.findOne({userId: order.userId, coin: asssetCoin.crypto})
                                } else {
                                    userWallet = await UserWallet.findOne({userId: order.userId, coin: asssetCoin.crypto});
                                }

                                if(userWallet) {
                                    let agentDealFinalFee = ((parseFloat(order.amount) * parseFloat(lastSell)) * (parseFloat(agent_taker_fee)));

                                    // let depositReqest = await WalletController.depositeWallet(userWallet, parseFloat(order.amount));
                                    // if (depositReqest) {
                                    //     console.log(`viabtc balance updated ${order.userId}`);
                                    // } else {
                                    //     console.log(`viabtc balance failed ${order.userId}`);
                                    // }
                                    userWallet.walletAmount = (parseFloat(userWallet.walletAmount) + parseFloat(order.amount)).toFixed(8);
                                    await userWallet.save();

                                    if (_is_agent) {
                                        if (user) {
                                            if(agent) {
                                                let agentFiatWallet;
                                                if(order.margin) {
                                                    agentFiatWallet = await UserMarginWallet.findOne({userId: agent._id, coin: asssetCoin.fiat});
                                                } else {
                                                    agentFiatWallet = await UserWallet.findOne({userId: agent._id, coin: asssetCoin.fiat});
                                                }
            
                                                // Fiat wallet Update
                                                // let withdrawReqest = await WalletController.withdrawWallet(userWallet, parseFloat(agentDealFinalFee));
                                                // if (withdrawReqest) {
                                                //     console.log(`viabtc balance updated ${order.userId}`);
                                                // } else {
                                                //     console.log(`viabtc balance failed ${order.userId}`);
                                                // }
                                                agentFiatWallet.walletAmount = (parseFloat(agentFiatWallet.walletAmount) - agentDealFinalFee).toFixed(8);
                                                agentFiatWallet.save();
                                            }
                                        }
                                    }

                                    const index = processingOrder.indexOf(order._id);
                                    if (index > -1) {
                                        processingOrder.splice(index, 1);
                                    }
                                    // console.log(market + 'Buy order closed ' + order._id);
                                    // client.get(`${order._id}`, function(err, reply) {
                                    //     // reply is null when the key is missing
                                    //     // console.log(reply);
                                    //     if (reply) {
                                    //         client.del(`${order._id}`);
                                    //     } else {
    
                                    //     }
                                    // });
                                    // depositeWallet(userWallet, parseFloat(dealFinalPrice));
                                    await ReferralTree.findOne({referredUser: order.userId})
                                        .then(referralTree => {
                                            if(referralTree) {
                                                ReferralSetting.find()
                                                    .then(referralSettings => {
                                                        if(referralSettings.length > 0) {
                                                            let refEarn = (((parseFloat(order.amount) * parseFloat(lastSell)) * (parseFloat(order.takerFee)))) * parseFloat(referralSettings[0].commissionPercentage);
                                                            referralTree.referredUserEarning = (parseFloat(referralTree.referredUserEarning) + parseFloat(refEarn)).toFixed(4);
                                                            referralTree.save();
                                                            Referral.findOne({_id: referralTree.referralId})
                                                                .then(referral => {
                                                                    if(referral) {
                                                                        referral.totalReferralEarnings = (parseFloat(referral.totalReferralEarnings) + parseFloat(refEarn)).toFixed(4);
                                                                        referral.save();
                                                                    } else {
                                                                        //
                                                                    }
                                                                })
                                                                .catch(err => {
                                                                    //
                                                                })
                                                        } else {
                                                            //
                                                        }
                                                    })
                                            } else {
                                                //
                                            }
                                        })
                                        .catch(err => {
                                            //
                                        })
                                        return true;
                                }
                            })
                            .catch(err => {
                                const index = processingOrder.indexOf(order._id);
                                if (index > -1) {
                                    processingOrder.splice(index, 1);
                                }
                                // console.log(market + 'Buy order closed ' + order._id);
                                // client.get(`${order._id}`, function(err, reply) {
                                //     // reply is null when the key is missing
                                //     // console.log(reply);
                                //     if (reply) {
                                //         client.del(`${order._id}`);
                                //     } else {

                                //     }
                                // });
                                return true;
                            })
                        // console.log(market + 'Buy order closed ' + order._id);
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
}

updateLimitOrder = async (lastAsks, lastBids, market, orders, assetCoin) => {
    for (order of orders) {
        if (market === order.market) {
            // console.log(lastAsks, lastBids, market, order.market, assetCoin);
            await updateOpenOrders(lastAsks, lastBids, order.market, order, assetCoin);
        }
        // const assetCoin = await getAssetCoin(order.market);


        // const currencySetting = await CurrencySetting.findOne({currency: assetCoin.fiat});
        // const assetCurrencyValue = (parseFloat(currencySetting.value) + (parseFloat(currencySetting.value) * (parseFloat(currencySetting.premium)/100)));
        // const orderbookStreamv2 = await axios.get(`https://api3.binance.com/api/v3/ticker/bookTicker?symbol=${assetCoin.crypto}USDT`);
        // if (!isEmpty(orderbookStreamv2.data)) {
        //     const lastAsks = (parseFloat(orderbookStreamv2.data.askPrice) + (parseFloat(orderbookStreamv2.data.askPrice) * 0.001)) * assetCurrencyValue;
        //     const lastBids = (parseFloat(orderbookStreamv2.data.bidPrice) - (parseFloat(orderbookStreamv2.data.bidPrice) * 0.001)) * assetCurrencyValue;
        //     console.log(order._id, order.price, order.market, lastAsks, lastBids, assetCurrencyValue, assetCoin.fiat, assetCoin.crypto);
        // }


        // if (order.market.includes(assetCoin.crypto)) {
        //     // const orderbookParse = JSON.parse(orderbookStream.stream);
        //     if (parseFloat(order.price) && order.market.includes(assetCoin.crypto) && order.market.includes(assetCoin.fiat)) {
        //         // const orderbookStream = await OrderbookStream.findOne({coin: assetCoin.crypto});

        //             // await client.set(`${order._id}`, "Open")
        //             // let key = await client.get(`${order._id}`, function(err, reply) {
        //             //     // reply is null when the key is missing
        //             //     return reply;
        //             //   });
        //             client.get(`${order._id}`, async function(err, reply) {
        //                 // reply is null when the key is missing
        //                 // console.log(reply);
        //                 if (reply) {
        //                     console.log(`${order._id} Order is already processing`, order.price, lastAsks, lastBids, order.market, assetCoin.crypto, assetCoin.fiat);
        //                     // client.del(`${order._id}`);
        //                 } else {
        //                     if (order.side === 2) {
        //                         if ((parseFloat(order.price) > parseFloat(lastBids)) && order.market.includes(assetCoin.crypto) && order.market.includes(assetCoin.fiat)) {
        //                             console.log(lastAsks, lastBids, order.market, assetCoin.crypto, assetCoin.fiat, order.price, order._id);
        //                             client.set(`${order._id}`, 'Open');
        //                             console.log(`${order._id}`, 'process order');
        //                             await updateOpenOrders(lastAsks, lastBids, order.market, order, assetCoin);
        //                         }
        //                     }
        //                     if (order.side === 1) {
        //                         if ( (parseFloat(order.price) < parseFloat(lastAsks)) && order.market.includes(assetCoin.crypto) && order.market.includes(assetCoin.fiat)) {
        //                             console.log(lastAsks, lastBids, order.market, assetCoin.crypto, assetCoin.fiat, order.price, order._id);
        //                             client.set(`${order._id}`, 'Open');
        //                             console.log(`${order._id}`, 'process order');
        //                             await updateOpenOrders(lastAsks, lastBids, order.market, order, assetCoin);
        //                         }
        //                     }
        //                 }
        //             });
    
        //             // client.get(`${order._id}`, (err, reply) => {
        //             //     if (err) throw err;
        //             //     console.log(reply);
        //             // });
        //             // console.log(processingOrder.includes(order._id));
    
        //             // if (processingOrder.includes(order._id)) {
        //             //     console.log(`${order._id} ${order.side === 2 ? 'Buy' : 'Sell'} order already processing...`);
        //             // } else {
        //             //     processingOrder.push(order._id);
        //             //     // let lorder = await Order.find({status: 'Open', side: 1, price: { $lt: [/^\d+$/, lastBids] }});
        //             //     // let lorder = await Order.find({status: 'Open', side: 1, price: { $lt: lastBids }});
        //             //     // console.log(processingOrder, 'order to process....');
        //             //     // await updateOpenOrders(lastAsks, lastBids, order.market, order, assetCoin);
        //             // }
        //     }
        // }
    }
    // console.log(assetCoin, order);
    return true;
}

// schedule.scheduleJob('*/4 * * * * *', async () => {

//     const markets = ['BTCINR'];

//     for (market of markets) {
//         const assetCoin = await getAssetCoin(market);
//         const currencySetting = await CurrencySetting.findOne({currency: assetCoin.fiat});
//         const assetCurrencyValue = (parseFloat(currencySetting.value) + (parseFloat(currencySetting.value) * (parseFloat(currencySetting.premium)/100)));

//         const orderbookStreamv2 = await axios.get(`https://api3.binance.com/api/v3/ticker/bookTicker?symbol=${assetCoin.crypto}USDT`);
//         if (!isEmpty(orderbookStreamv2.data)) {
//             const lastAsks = (parseFloat(orderbookStreamv2.data.askPrice) + (parseFloat(orderbookStreamv2.data.askPrice) * 0.001)) * assetCurrencyValue;
//             const lastBids = (parseFloat(orderbookStreamv2.data.bidPrice) - (parseFloat(orderbookStreamv2.data.bidPrice) * 0.001)) * assetCurrencyValue;

//             const sellOrders = await Order.find({side: 1, status: 'Open',market: market, price: { $lte: lastAsks }});

//             console.log(lastAsks, lastBids, assetCurrencyValue, assetCoin.crypto, assetCoin.fiat);
//             if (sellOrders.length > 0) {
//                 console.log(sellOrders.length);
//             } else {
//                 console.log('No sell orders');
//             }

//             const buyOrders = await Order.find({side: 2, status: 'Open', market: market, price: { $gte: lastBids }});

//             if (buyOrders.length > 0) {
//                 for (buyOrder of buyOrders) {
//                     console.log(buyOrder.price);
//                 }
//             } else {
//                 console.log('No buy orders');
//             }
//         }
//     }

//     // let orders = await Order.find({status: 'Open'});
//     // for (order of orders) {
//     //     console.log(order.price);
//     //     if (order) {
//     //         // await updateLimitOrder(order);
//     //     }
//     // }
// });

let changeOrderPrice = async () => {
    const orders = await Order.find({ 'price' : { $type : 2 } });
    for (order of orders) {
        // console.log(order.price);
        if (order) {
            try {
                let updateOrder = await Order.updateOne({ _id: order._id }, { price: new Number(order.price) });
                // console.log(updateOrder);
                // console.log(`${updateOrder.n} Order updated ${updateOrder.nModified}`);
            } catch (e) {
                // console.log(`${order._id} failed to save`);
            }
            // await updateLimitOrder(order);
        }
    }
}

checkOrder = async () => {
    // console.log('--- Start Check ------------------------------');
    const markets = [
        'BTCINR', 'BCHINR', 'LTCINR', 'XRPINR', 'ETHINR',
        'BTCAED', 'BCHAED', 'LTCAED', 'XRPAED', 'ETHAED',
        // 'BTCUSD', 'BCHUSD', 'LTCUSD', 'XRPUSD', 'ETHUSD',
    ];

    let index = 1;
    for (market of markets) {
        const assetCoin = await getAssetCoin(market);
        const currencySetting = await CurrencySetting.findOne({currency: assetCoin.fiat});
        const assetCurrencyValue = (parseFloat(currencySetting.value) + (parseFloat(currencySetting.value) * (parseFloat(currencySetting.premium)/100)));

        const orderbookStreamv2 = await axios.get(`https://api3.binance.com/api/v3/ticker/bookTicker?symbol=${assetCoin.crypto}USDT`);
        if (!isEmpty(orderbookStreamv2.data)) {
            const lastAsks = (parseFloat(orderbookStreamv2.data.askPrice) + (parseFloat(orderbookStreamv2.data.askPrice) * 0.001)) * assetCurrencyValue;
            const lastBids = (parseFloat(orderbookStreamv2.data.bidPrice) - (parseFloat(orderbookStreamv2.data.bidPrice) * 0.001)) * assetCurrencyValue;

            const sellOrders = await Order.find({side: 1, type: 1, status: 'Open', market: market, price: { $lt: lastAsks }});

            // console.log(lastAsks, lastBids, assetCurrencyValue, assetCoin.crypto, assetCoin.fiat);

            if (sellOrders.length > 0) {
                // console.log(sellOrders, lastAsks);
                const updateSellOrders = await Order.updateMany({side: 1, type: 1, status: 'Open', market: market, price: { $lt: lastAsks }}, {status: 'Finished', updateDate: Date.now()});
                if (updateSellOrders.n > 0) {
                    // await updateLimitOrder(sellOrders);
                    await updateLimitOrder(lastAsks, lastBids, market, sellOrders, assetCoin);
                }
            } else {
                // console.log('No sell orders');
            }

            const buyOrders = await Order.find({side: 2, type: 1, status: 'Open', market: market, price: { $gt: lastBids }});

            if (buyOrders.length > 0) {
                // console.log(buyOrders, lastBids);
                // console.log(lastAsks, lastBids, market, assetCoin);
                const updateBuyOrders = await Order.updateMany({side: 2, type: 1, status: 'Open', market: market, price: { $gt: lastBids }}, {status: 'Finished', updateDate: Date.now()});
                if (updateBuyOrders.n > 0) {
                    await updateLimitOrder(lastAsks, lastBids, market, buyOrders, assetCoin);
                }
            } else {
                // console.log('No buy orders');
            }

        }

        if (index === markets.length) {
            console.log('--- End Check ------------------------------');
            checkOrder();
        }
        index = index + 1;
    }
}

checkOrder();
// schedule.scheduleJob('*/6 * * * * *', async () => {
//     // changeOrderPrice();
// });
