const axios = require("axios");
const BitGoJS = require("bitgo");
const curl = require("curl");
const UserWallet = require("../models/UserWallet");
const ApiWallet = require("../models/wallet/ApiWallet");
const UserMarginWallet = require("../models/margin/UserMarginWallet");
const WalletAddress = require("../models/wallet/WalletAddress");
const WalletTransactions = require("../models/wallet/WalletTransactions");
const WalletMaintenance = require("../models/maintenance/WalletMaintenance");
const BitgoSetting = require("../models/BitgoSetting");
const BitgoWalletIdentifier = require("../models/BitgoWalletIdentifier");
const WalletSettings = require("../models/wallet/WalletSettings");
const User = require("../models/User");
const { Encode } = require("xrpl-tagged-address-codec");
const WAValidator = require("multicoin-address-validator");

const BCHJS = require("@chris.troutner/bch-js");
const bchjs = new BCHJS({ restURL: `http://decatur.hopto.org:12400/v3/` });

const depositEmail = require("../emails/DepositEmail");
const withdrawEmail = require("../emails/WithdrawEmail");

const Assets = require("../models/trading/Assets");

var cron = require("node-cron");

const XrpController = require("./XrpController");
const TronController = require("./TronController");
const EthController = require("./EthController");
const TetherController = require("./TetherController");

const keys = require("../config/key");
const isEmpty = require("../validation/isEmpty");

const sgMail = require("@sendgrid/mail");
const key = require("../config/key");
const { post } = require("request");
const { readSync } = require("fs");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// const contractAddress = '0x40483B7c7B6deAacF6aD5eF678E6316e96175C8F';
const contractAddress = "0x207335749Ac86B2dae43b36E259eFa252b90779F";
const usdtContractAddress = "0xdac17f958d2ee523a2206206994597c13d831ec7";

const getMarketCoin = (marketName) => {
  if (marketName) {
    return marketName.toLowerCase();
  } else {
    marketName;
  }
};

const getAsset = async (symbol) => {
  let asset = await Assets.findOne({ name: symbol });
  if (asset) {
    return asset;
  } else {
    return false;
  }
};

const getViabtcMarginWalletBalance = async (userWallet, user) => {
  if (user.marginWalletId) {
    //
  } else {
    let walletSettings = await WalletSettings.find({});

    if (walletSettings.length > 0) {
      let marginWalletId = walletSettings[0].walletLastId + 1;
      // Update last viabtc wallet Id
      walletSettings[0].marginWalletLastId = marginWalletId;
      await walletSettings[0].save();

      user.marginWalletId = marginWalletId;
      await user.save();
    }
  }

  const params = [user.marginWalletId, userWallet.coin];

  const postParamas = {
    method: "balance.query",
    params: params,
    id: 1516681174,
  };

  let walletBalance = false;

  return axios
    .post(key.tradingURI, JSON.stringify(postParamas))
    .then((response) => {
      walletBalance = response.data.result;
      return walletBalance;
    });
};

const updateViaWalletBalance = async (userWallet, walletId) => {
  // let updateAmount = (parseFloat(userWallet.walletAmount) - parseFloat(walletAmount));
  const params = [
    walletId,
    userWallet.coin,
    "deposit",
    new Date().getTime(),
    "" + userWallet.walletAmount,
    {},
  ];

  const postParamas = {
    method: "balance.update",
    params: params,
    id: 1516681174,
  };

  let walletBalance = false;

  return axios
    .post(key.tradingURI, JSON.stringify(postParamas))
    .then((response) => {
      // console.log('wallet bbalance updated');
      walletBalance = response.data.result;
      return walletBalance;
    });
};

const updateViabtcWalletBalance = async (
  userWallet,
  walletAmount,
  walletId
) => {
  let updateAmount =
    parseFloat(userWallet.walletAmount) - parseFloat(walletAmount);
  const params = [
    walletId,
    userWallet.coin,
    "deposit",
    new Date().getTime(),
    "" + updateAmount,
    {},
  ];

  const postParamas = {
    method: "balance.update",
    params: params,
    id: 1516681174,
  };

  let walletBalance = false;

  return axios
    .post(key.tradingURI, JSON.stringify(postParamas))
    .then((response) => {
      // console.log('wallet bbalance updated');
      walletBalance = response.data.result;
      return walletBalance;
    });
};

const getViabtcWalletBalance = async (userWallet, walletId) => {
  const params = [parseInt(walletId), userWallet.coin];

  // console.log(parseInt(parseInt(userWallet.userId.replace(/\D/g,'')).toString().substring(0, 19)));

  const postParamas = {
    method: "balance.query",
    params: params,
    id: 1516681174,
  };

  let walletBalance = false;

  return axios
    .post(key.tradingURI, JSON.stringify(postParamas))
    .then((response) => {
      if (walletId) {
        walletBalance = response.data.result;
        return walletBalance[userWallet.coin].available;
      } else {
        return 0;
      }
    });
};

const depositeMarginWallet = async (userWallet, value, user) => {
  if (user.marginWalletId) {
    //
  } else {
    let walletSettings = await WalletSettings.find({});

    if (walletSettings.length > 0) {
      let marginWalletId = walletSettings[0].walletLastId + 1;
      // Update last viabtc wallet Id
      walletSettings[0].marginWalletLastId = marginWalletId;
      await walletSettings[0].save();

      user.marginWalletId = marginWalletId;
      await user.save();
    }
  }

  const params = [
    user.marginWalletId,
    userWallet.coin,
    "deposit",
    new Date().getTime(),
    value + "",
    {},
  ];

  const postParamas = {
    method: "balance.update",
    params: params,
    id: 1516681174,
  };

  return axios
    .post(keys.tradingURI, JSON.stringify(postParamas))
    .then((response) => {
      if (response.data.error === null) {
        return true;
      } else {
        return false;
      }
    });
};

const depositeWallet = async (userWallet, value) => {
  const user = await User.findOne({ _id: userWallet.userId });

  if (user.walletId) {
    //
  } else {
    let walletSettings = await WalletSettings.find({});

    if (walletSettings.length > 0) {
      let walletId = walletSettings[0].walletLastId + 1;
      // Update last viabtc wallet Id
      walletSettings[0].walletLastId = walletId;
      await walletSettings[0].save();

      user.walletId = walletId;
      await user.save();
    }
  }

  const params = [
    user.viabtcUserId,
    userWallet.coin,
    "deposit",
    new Date().getTime(),
    value + "",
    {},
  ];

  const postParamas = {
    method: "balance.update",
    params: params,
    id: 1516681174,
  };

  return axios
    .post(keys.tradingURI, JSON.stringify(postParamas))
    .then((response) => {
      console.log(response.data, value);
      if (response.data.error === null) {
        // console.log(`Created: userId: ${userWallet.userId} walletId: ${userWallet._id}`, user.walletId, value, userWallet.coin);
        return true;
      } else {
        // console.log(response.data);
        // console.log(`Failed to create: userId: ${userWallet.userId} walletId: ${userWallet._id}`);
        return false;
      }
    });
};

const withdrawMarginWallet = async (userWallet, value, user) => {
  if (user.marginWalletId) {
    //
  } else {
    let walletSettings = await WalletSettings.find({});

    if (walletSettings.length > 0) {
      let marginWalletId = walletSettings[0].walletLastId + 1;
      // Update last viabtc wallet Id
      walletSettings[0].marginWalletLastId = marginWalletId;
      await walletSettings[0].save();

      user.marginWalletId = marginWalletId;
      await user.save();
    }
  }

  // console.log(marginWalletId);

  const params = [
    user.marginWalletId,
    userWallet.coin,
    "deposit",
    new Date().getTime(),
    "-" + value,
    {},
  ];

  const postParamas = {
    method: "balance.update",
    params: params,
    id: 1516681174,
  };

  // console.log(postParamas);

  return axios
    .post(keys.tradingURI, JSON.stringify(postParamas))
    .then((response) => {
      //  console.log(response);
      if (response.data.error === null) {
        return true;
      } else {
        return false;
      }
    });
};

const withdrawWallet = async (userWallet, value) => {
  const user = await User.findOne({ _id: userWallet.userId });

  if (user.walletId) {
    //
  } else {
    let walletSettings = await WalletSettings.find({});

    if (walletSettings.length > 0) {
      let walletId = walletSettings[0].walletLastId + 1;
      // Update last viabtc wallet Id
      walletSettings[0].walletLastId = walletId;
      await walletSettings[0].save();

      user.walletId = walletId;
      await user.save();
    }
  }

  const params = [
    user.viabtcUserId,
    userWallet.coin,
    "deposit",
    new Date().getTime(),
    "-" + value,
    {},
  ];

  const postParamas = {
    method: "balance.update",
    params: params,
    id: 1516681174,
  };

  return axios
    .post(keys.tradingURI, JSON.stringify(postParamas))
    .then((response) => {
      if (response.data.error === null) {
        // console.log(`Created userId: ${userWallet.userId} walletId: ${userWallet.walletId}`, user.walletId, value, userWallet.coin);
        return true;
      } else {
        return false;
      }
    });
};

const getBitgoStatus = async () => {
  let bitgoSetting = await BitgoSetting.find();
  let bitgoLiveStatus = "test";
  if (bitgoSetting.length > 0) {
    bitgoLiveStatus = bitgoSetting[0].live === true ? "prod" : "test";
  }
  return bitgoLiveStatus;
};

const getBitgoWallet = async (coin, walletType, wcoin) => {
  try {
    const bitgoStatus = await getBitgoStatus();
    // Read the user authentication section to get your API access token
    const bitgo = new BitGoJS.BitGo({
      env: bitgoStatus,
      accessToken: keys.bitgoAccessKey,
    });

    const bitgoWalletIdentifier = await BitgoWalletIdentifier.find({
      name: wcoin,
      type: walletType,
    });

    if (bitgoWalletIdentifier) {
      return bitgo
        .coin(coin)
        .wallets()
        .get({ id: bitgoWalletIdentifier[0].identifier });
    } else {
      return bitgo.coin(coin).wallets().get({ id: keys.bitgoDepositeWallet });
    }
  } catch (error) {
    console.log("ERROR WHILE GETTING WALLET -------");
    return null;
  }
};

const getBitgoWalletByAddress = async (coin, walletAddress) => {
  const bitgoStatus = await getBitgoStatus();
  // Read the user authentication section to get your API access token
  const bitgo = new BitGoJS.BitGo({
    env: bitgoStatus,
    accessToken: keys.bitgoAccessKey,
  });

  return bitgo
    .coin(coin)
    .wallets()
    .getWalletByAddress({ address: walletAddress });
};

const getBitgoAdminWallet = async (coin) => {
  let walletId = "622dc7a262aa9c0007431f092eca35f5";
  const bitgoStatus = await getBitgoStatus();
  // Read the user authentication section to get your API access token
  const bitgo = new BitGoJS.BitGo({
    env: bitgoStatus,
    accessToken: keys.bitgoAccessKey,
  });

  bitgo
    .coin(coin)
    .wallets()
    .get({ id: walletId })
    .then(function (wallet) {
      // print the wallet
      console.log(wallet._wallet);
    });
};

const createMarginWallet = async (userId, asset, walletAmount = null) => {
  if (asset.bitgo) {
    const bitgoWallet = getBitgoWallet(
      getMarketCoin(asset.alias),
      "deposit",
      asset.name
    );
    let userWallet;
    return await bitgoWallet.then(async function (wallet) {
      let params = {
        label: asset.name + "_" + userId,
      };
      return await wallet.createAddress(params).then(async (address) => {
        userWallet = new UserMarginWallet();
        userWallet.userId = userId;
        userWallet.walletId = address.wallet;
        userWallet.coin = asset.name;
        userWallet.fiat = asset.fiat;
        userWallet.bitgo = asset.bitgo;
        userWallet.walletAddress = address.address;
        userWallet.walletAmount = walletAmount ? walletAmount : 0;
        userWallet.borrowAmount = 0;
        await userWallet.save();

        let userWalletAddress = new WalletAddress();
        userWalletAddress.userId = userId;
        userWalletAddress.userWalletId = userWallet._id;
        userWalletAddress.walletAddress = address.address;
        userWalletAddress.save();

        return userWallet;
      });
    });
  } else if (asset.name === "XRP") {
    const xrpWallet = await XrpController.createUserWallet();

    const xAddress = Encode({
      account: xrpWallet.address,
      tag: xrpWallet.lastDestinationTag,
    });

    const userWallet = new UserMarginWallet();
    userWallet.userId = userId;
    userWallet.walletId = xrpWallet.clientId;
    userWallet.coin = asset.name;
    userWallet.walletAddress = xrpWallet.address;
    userWallet.walletXAddress = xAddress;
    userWallet.destinationTag = xrpWallet.lastDestinationTag;
    userWallet.walletAmount = walletAmount ? walletAmount : 0;
    userWallet.borrowAmount = 0;
    await userWallet.save();
    return userWallet;
  } else if (asset.name === "ETH") {
    const ethWallet = await EthController.createWallet();
    if (ethWallet) {
      // const ethWalletAddress = await EthController.createAddress(ethWallet);
      const userWallet = new UserMarginWallet();
      userWallet.userId = userId;
      userWallet.walletId = ethWallet._id;
      userWallet.coin = asset.name;
      userWallet.walletAddress = ethWallet.address;
      userWallet.walletAmount = walletAmount ? walletAmount : 0;
      userWallet.borrowAmount = 0;
      await userWallet.save();
      return userWallet;
    }
  } else if (asset.name === "USDT") {
    const tetherWallet = await TetherController.createWallet();
    if (tetherWallet) {
      // const ethWalletAddress = await EthController.createAddress(ethWallet);
      const userWallet = new UserMarginWallet();
      userWallet.userId = userId;
      userWallet.walletId = tetherWallet._id;
      userWallet.coin = asset.name;
      userWallet.walletAddress = tetherWallet.address;
      userWallet.walletAmount = walletAmount ? walletAmount : 0;
      userWallet.borrowAmount = 0;
      await userWallet.save();
      return userWallet;
    }
  } else if (asset.name === "BTX") {
    const ethWallet = await EthController.createWallet();
    if (ethWallet) {
      // const ethWalletAddress = await EthController.createAddress(ethWallet);
      const userWallet = new UserMarginWallet();
      userWallet.userId = userId;
      userWallet.walletId = ethWallet._id;
      userWallet.coin = asset.name;
      userWallet.walletAddress = ethWallet.address;
      userWallet.walletAmount = walletAmount ? walletAmount : 0;
      userWallet.borrowAmount = 0;
      await userWallet.save();
      return userWallet;
    }
  } else {
    const userWallet = new UserMarginWallet();
    userWallet.userId = userId;
    userWallet.walletId = "";
    userWallet.coin = asset.name;
    userWallet.fiat = asset.fiat;
    userWallet.walletAddress = "";
    userWallet.walletAmount = walletAmount ? walletAmount : 0;
    userWallet.borrowAmount = 0;
    await userWallet.save();
    return userWallet;
  }
};

const createApiWallet = async (userId, asset, walletAmount = null) => {
  if (asset.bitgo) {
    const bitgoWallet = getBitgoWallet(
      getMarketCoin(asset.alias),
      "deposit",
      asset.name
    );
    let userWallet;
    return await bitgoWallet
      .then(async function (wallet) {
        let params = {
          label: asset.name + "_" + userId,
        };
        return await wallet.createAddress(params).then(async (address) => {
          userWallet = new ApiWallet();
          userWallet.userId = userId;
          userWallet.walletId = address.wallet;
          userWallet.coin = asset.name;
          userWallet.fiat = asset.fiat;
          userWallet.bitgo = asset.bitgo;
          userWallet.walletAddress = address.address;
          userWallet.walletAmount = walletAmount ? walletAmount : 0;
          await userWallet.save();

          let userWalletAddress = new WalletAddress();
          userWalletAddress.userId = userId;
          userWalletAddress.userWalletId = userWallet._id;
          userWalletAddress.walletAddress = address.address;
          userWalletAddress.save();

          return userWallet;
        });
      })
      .catch((err) => {
        return false;
      });
  } else if (asset.name === "XRP") {
    const xrpWallet = await XrpController.createUserWallet();

    const xAddress = Encode({
      account: xrpWallet.address,
      tag: xrpWallet.lastDestinationTag,
    });

    const userWallet = new ApiWallet();
    userWallet.userId = userId;
    userWallet.walletId = xrpWallet.clientId;
    userWallet.coin = asset.name;
    userWallet.walletAddress = xrpWallet.address;
    userWallet.walletXAddress = xAddress;
    userWallet.destinationTag = xrpWallet.lastDestinationTag;
    userWallet.walletAmount = walletAmount ? walletAmount : 0;
    await userWallet.save();
    return userWallet;
  } else if (asset.name === "ETH") {
    const ethWallet = await EthController.createWallet();
    if (ethWallet) {
      // const ethWalletAddress = await EthController.createAddress(ethWallet);
      const userWallet = new ApiWallet();
      userWallet.userId = userId;
      userWallet.walletId = ethWallet._id;
      userWallet.coin = asset.name;
      userWallet.walletAddress = ethWallet.address;
      userWallet.walletAmount = walletAmount ? walletAmount : 0;
      await userWallet.save();
      return userWallet;
    }
  } else if (asset.name === "USDT") {
    const tetherWallet = await TetherController.createWallet();
    if (tetherWallet) {
      // const ethWalletAddress = await EthController.createAddress(ethWallet);
      const userWallet = new ApiWallet();
      userWallet.userId = userId;
      userWallet.walletId = tetherWallet._id;
      userWallet.coin = asset.name;
      userWallet.walletAddress = tetherWallet.address;
      userWallet.walletAmount = walletAmount ? walletAmount : 0;
      await userWallet.save();
      return userWallet;
    }
  } else if (asset.name === "BTX") {
    const ethWallet = await EthController.createWallet();
    if (ethWallet) {
      // const ethWalletAddress = await EthController.createAddress(ethWallet);
      const userWallet = new ApiWallet();
      userWallet.userId = userId;
      userWallet.walletId = ethWallet._id;
      userWallet.coin = asset.name;
      userWallet.walletAddress = ethWallet.address;
      userWallet.walletAmount = walletAmount ? walletAmount : 0;
      await userWallet.save();
      return userWallet;
    }
  } else {
    const userWallet = new ApiWallet();
    userWallet.userId = userId;
    userWallet.walletId = "";
    userWallet.coin = asset.name;
    userWallet.fiat = asset.fiat;
    userWallet.walletAddress = "";
    userWallet.walletAmount = walletAmount ? walletAmount : 0;
    await userWallet.save();
    return userWallet;
  }
};

const createWallet = async (userId, asset, walletAmount = null) => {
  if (asset.bitgo) {
    const bitgoWallet = getBitgoWallet(
      getMarketCoin(asset.alias),
      "deposit",
      asset.name
    );
    console.log(bitgoWallet);
    let userWallet;
    return await bitgoWallet.then(async function (wallet) {
      let params = {
        label: asset.name + "_" + userId,
      };
      return await wallet.createAddress(params).then(async (address) => {
        userWallet = new UserWallet();
        userWallet.userId = userId;
        userWallet.walletId = address.wallet;
        userWallet.coin = asset.name;
        userWallet.fiat = asset.fiat;
        userWallet.bitgo = asset.bitgo;
        userWallet.walletAddress = address.address;
        userWallet.walletAmount = walletAmount ? walletAmount : 0;
        await userWallet.save();

        let userWalletAddress = new WalletAddress();
        userWalletAddress.userId = userId;
        userWalletAddress.userWalletId = userWallet._id;
        userWalletAddress.walletAddress = address.address;
        userWalletAddress.save();

        return userWallet;
      });
    });
  } else if (asset.name === "TRX") {
    const trxController = await TronController.createWallet();
    if (trxController) {
      const userWallet = new UserWallet();
      userWallet.userId = userId;
      userWallet.walletId = trxController.privateKey;
      userWallet.coin = asset.name;
      userWallet.walletAddress = trxController.address;
      userWallet.walletAmount = walletAmount ? walletAmount : 0;
      await userWallet.save();
      return userWallet;
    }
  } else if (asset.name === "XRP") {
    const xrpWallet = await XrpController.createUserWallet();

    const xAddress = Encode({
      account: xrpWallet.address,
      tag: xrpWallet.lastDestinationTag,
    });

    const userWallet = new UserWallet();
    userWallet.userId = userId;
    userWallet.walletId = xrpWallet.clientId;
    userWallet.coin = asset.name;
    userWallet.walletAddress = xrpWallet.address;
    userWallet.walletXAddress = xAddress;
    userWallet.destinationTag = xrpWallet.lastDestinationTag;
    userWallet.walletAmount = walletAmount ? walletAmount : 0;
    await userWallet.save();
    return userWallet;
  } else if (asset.name === "ETH") {
    const ethWallet = await EthController.createWallet();
    if (ethWallet) {
      // const ethWalletAddress = await EthController.createAddress(ethWallet);
      const userWallet = new UserWallet();
      userWallet.userId = userId;
      userWallet.walletId = ethWallet._id;
      userWallet.coin = asset.name;
      userWallet.walletAddress = ethWallet.address;
      userWallet.walletAmount = walletAmount ? walletAmount : 0;
      await userWallet.save();
      return userWallet;
    }
  } else if (asset.name === "USDT") {
    const tetherWallet = await TetherController.createWallet();
    if (tetherWallet) {
      // const ethWalletAddress = await EthController.createAddress(ethWallet);
      const userWallet = new UserWallet();
      userWallet.userId = userId;
      userWallet.walletId = tetherWallet._id;
      userWallet.coin = asset.name;
      userWallet.walletAddress = tetherWallet.address;
      userWallet.walletAmount = walletAmount ? walletAmount : 0;
      await userWallet.save();
      return userWallet;
    }
  } else if (asset.name === "BTX") {
    const ethWallet = await EthController.createWallet();
    if (ethWallet) {
      // const ethWalletAddress = await EthController.createAddress(ethWallet);
      const userWallet = new UserWallet();
      userWallet.userId = userId;
      userWallet.walletId = ethWallet._id;
      userWallet.coin = asset.name;
      userWallet.walletAddress = ethWallet.address;
      userWallet.walletAmount = walletAmount ? walletAmount : 0;
      await userWallet.save();
      return userWallet;
    }
  } else {
    const userWallet = new UserWallet();
    userWallet.userId = userId;
    userWallet.walletId = "";
    userWallet.coin = asset.name;
    userWallet.fiat = asset.fiat;
    userWallet.walletAddress = "";
    userWallet.walletAmount = walletAmount ? walletAmount : 0;
    await userWallet.save();
    return userWallet;
  }
};

const getWalletBalance = async (coin, userWallet) => {
  if (userWallet.bitgo) {
    const bitgoWallet = getBitgoWalletByAddress(
      getMarketCoin(coin),
      userWallet.walletAddress
    );
    bitgoWallet
      .then(function (wallet) {
        userWallet.walletAmount = wallet._wallet.balance;
        userWallet.save();
        return userWallet.walletAmount;
      })
      .catch(async function (err) {
        const bitgoWallet = await getBitgoWallet(
          getMarketCoin(coin),
          "deposit",
          coin
        );
        bitgoWallet
          .then(function (wallet) {
            let params = {
              label: coin + "_" + userId,
            };
            wallet
              .createAddress(params)
              .then(function (address) {
                let userWalletAddress = new WalletAddress();
                userWalletAddress.userId = req.params.userId;
                userWalletAddress.userWalletId = userWallet._id;
                userWalletAddress.walletAddress = address.address;
                userWalletAddress.save();

                userWallet.walletId = address.wallet;
                userWallet.walletAddress = address.address;
                userWallet.save();
                return userWallet.walletAmount;
              })
              .catch((err) => {
                let error = {
                  error: "Error on generating address",
                };
                return error;
              });
          })
          .catch((err) => {
            let error = {
              error: "Error on generating address",
            };
            return error;
          });
      });
  } else if (userWallet.coin === "XRP") {
    const xrpWalletBalance = await XrpController.balance(userWallet.walletId);
    if (xrpWalletBalance.error) {
      return xrpWalletBalance.error;
    } else {
      return xrpWalletBalance;
    }
  } else if (userWallet.coin === "ETH") {
    const ethWalletBalance = await EthController.balance(userWallet.walletId);
    if (ethWalletBalance) {
      return ethWalletBalance;
    } else {
      let error = {
        error: "Error on generating balance",
      };
      return error;
    }
  } else if (userWallet.coin === "USDT") {
    if (!userWallet.walletTrxAddress) {
      const createTrxWallet = await TronController.createBtxWallet();
      if (createTrxWallet) {
        userWallet.walletTrxAddress = createTrxWallet.address;
        userWallet.walletTrxId = createTrxWallet.privateKey;
        await userWallet.save();
      }
    }
    const tetherWalletBalance = await TetherController.balance(
      (ethId = userWallet.walletId),
      (contract = usdtContractAddress)
    );
    if (tetherWalletBalance) {
      return tetherWalletBalance;
    } else {
      let error = {
        error: "Error on generating balance",
      };
      return error;
    }
  } else if (userWallet.coin === "BTX") {
    if (!userWallet.walletTrxAddress) {
      const createTrxWallet = await TronController.createBtxWallet();
      if (createTrxWallet) {
        userWallet.walletTrxAddress = createTrxWallet.address;
        userWallet.walletTrxId = createTrxWallet.privateKey;
        await userWallet.save();
      }
    }
    const btxWalletBalance = await EthController.balance(
      userWallet.walletId,
      contractAddress
    );
    if (btxWalletBalance) {
      return btxWalletBalance;
    } else {
      let error = {
        error: "Error on generating balance",
      };
      return error;
    }
  } else {
    return userWallet.walletAmount;
  }
};

const generateAddress = async (userWallet) => {
  if (userWallet.bitgo) {
    // console.log(getMarketCoin(userWallet.coin), userWallet.coin);
    const bitgoWallet = getBitgoWallet(
      getMarketCoin(userWallet.coin),
      "deposit",
      userWallet.coin
    );

    return bitgoWallet.then(function (wallet) {
      let params = {
        label: userWallet.coin + "_" + userWallet.userId,
      };
      return wallet
        .createAddress(params)
        .then(function (address) {
          // print new address
          userWallet.walletAddress = address.address;
          userWallet.save();

          let userWalletAddress = new WalletAddress();
          userWalletAddress.userId = userWallet.userId;
          userWalletAddress.userWalletId = userWallet._id;
          userWalletAddress.walletAddress = address.address;
          userWalletAddress.save();

          return [userWalletAddress];
        })
        .catch((err) => {
          let error = {
            error: "Error on generating address",
          };
          return error;
        });
    });
  } else if (userWallet.coin === "XRP") {
    let xrpController = XrpController.address(userWallet.walletId);
    if (xrpController.error) {
      return xrpController;
    } else {
      let userWalletAddress = new WalletAddress();
      userWalletAddress.userId = userWallet.userId;
      userWalletAddress.userWalletId = userWallet._id;
      userWalletAddress.walletAddress = xrpController.walletAddress;
      userWalletAddress.save();

      return [userWalletAddress];
    }
  } else {
    let userWalletAddress = new WalletAddress();
    userWalletAddress.userId = userWallet.userId;
    userWalletAddress.userWalletId = userWallet._id;
    userWalletAddress.walletAddress = userWallet.walletAddress;
    userWalletAddress.save();

    return [userWalletAddress];
  }
};

const getTransactions = async (userWallet) => {
  if (userWallet.bitgo) {
    const bitgoWallet = await getBitgoWallet(
      getMarketCoin(userWallet.coin),
      "deposit",
      userWallet.coin
    );

    bitgoWallet.then(function (wallet) {
      wallet.transfers().then(function (transfers) {
        return transfers;
      });
    });
  } else if (userWallet.coin === "XRP") {
    const xrpWalletTransactions = await XrpController.transactions(
      userWallet.walletId
    );
    if (xrpWalletTransactions.error) {
      let error = {
        error: xrpWalletTransactions.error,
      };
      return error;
    } else {
      return xrpWalletTransactions;
    }
  } else if (userWallet.coin === "TRX") {
    const trxWalletTransactions = await TronController.transactions(
      userWallet.walletId
    );
    if (trxWalletTransactions) {
      return trxWalletTransactions;
    } else {
      let error = {
        error: "Error on fetching transactions",
      };
      return error;
    }
  } else if (userWallet.coin === "ETH") {
    const ethWalletTransactions = await EthController.transactions(
      userWallet.walletId
    );
    if (ethWalletTransactions) {
      return ethWalletTransactions;
    } else {
      let error = {
        error: "Error on fetching transactions",
      };
      return error;
    }
  } else if (userWallet.coin === "USDT") {
    const tetherWalletTransactions = await TetherController.transactions(
      userWallet.walletId,
      usdtContractAddress
    );
    if (tetherWalletTransactions) {
      return tetherWalletTransactions;
    } else {
      let error = {
        error: "Error on fetching transactions",
      };
      return error;
    }
  } else {
    return [];
  }
};

const sendCrypto = async (
  user,
  userWallet,
  to,
  from,
  amount,
  note = "",
  destinationTag
) => {
  let asset = await Assets.findOne({ name: userWallet.coin });

  let maint = await WalletMaintenance.findOne({ name: userWallet.coin });

  if (!maint.maintenance.withdrawal) {
    if (userWallet.bitgo) {
      let walletAddress = to;
      if (userWallet.coin === "BCH") {
        try {
          const isLegacyAddress =
            await bchjs.Address.isLegacyAddress(walletAddress);

          if (isLegacyAddress) {
            //
          } else {
            const isCashAddress =
              await bchjs.Address.isCashAddress(walletAddress);
            if (isCashAddress) {
              walletAddress =
                await bchjs.Address.toLegacyAddress(walletAddress);
            } else {
              let response = {
                varient: "error",
                message: "Not valid bitcoin cash address",
              };
              return response;
            }
          }
        } catch (err) {
          console.error(`BCH Error: `, err);
          let response = {
            varient: "error",
            message: "Error occurred, please try again later",
          };
          return response;
        }
      }
      const bitgoWallet = getBitgoWallet(
        getMarketCoin(userWallet.coin),
        "withdraw",
        userWallet.coin
      );

      let sendAmount = parseFloat(amount);

      const bitgoWalletResponse = bitgoWallet
        .then(function (wallet) {
          // console.log(parseInt((parseFloat(sendAmount) * 100000000)));
          return wallet.send(
            {
              address: walletAddress,
              amount: `${parseInt(parseFloat(sendAmount) * 100000000)}`,
              walletPassphrase: "Trillionbituae@1234",
            },
            function (err, result) {
              if (err) {
                // console.log("bitgoWallet: ", err);
                if (err.result.error.includes("insufficient")) {
                  let response = {
                    message: "Insufficient balance",
                  };
                  return response;
                } else {
                  let response = {
                    varient: "error",
                    message: "Error occured, please try again later",
                  };
                  return response;
                }
              }

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
                userWallet._id,
                sendAmount,
                asset.withdrawalFee,
                `${currentDate.getDate()}, ${
                  months[currentDate.getMonth()]
                } ${currentDate.getFullYear()}`,
                userWallet.coin,
                user.firstname + " " + user.lastname,
                note ? note : "",
                "Confirmed"
              );

              // let emailBody = '<p>Hi ' + user.firstname + ' ' + user.lastname + ',</p>';
              // emailBody += '<p>Your withdrawal request have successfully placed.</p>';
              // emailBody += '<p>Your withdrawal details are:</p>';
              // emailBody += '<p>Amount: <strong>' + amount + '</strong></p>';
              // emailBody += '<p>Coin: <strong>' + userWallet.coin + '</strong></p>';
              // emailBody += '<p>Address: <strong>' + to + '</strong></p>';
              // emailBody += '<p>Note Number: <strong>' + ((note) ? note : '') + '</strong></p>';

              const mailOptions = {
                from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
                to: user.email, // list of receivers
                subject: `Trillionbit: ${userWallet.coin} Withdrawal`, // Subject line
                html: emailBody, // plain text body
              };

              sgMail.send(mailOptions);
              // let response = {varient: "success", message: "Amount send successfully."}
              return result;
            }
          );
        })
        .catch((err) => {
          console.log(err);
          console.log("bitgoWallet catch: ", err);
          let response = {
            varient: "error",
            message: "Error occurred, please try again later",
          };
          return response;
        });

      return bitgoWalletResponse;
    } else if (asset.name === "TRX") {
      const sendTrx = await TronController.sendTrx(to, amount);
      if (sendTrx) {
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
          userWallet._id,
          amount,
          asset.withdrawalFee,
          `${currentDate.getDate()}, ${
            months[currentDate.getMonth()]
          } ${currentDate.getFullYear()}`,
          userWallet.coin,
          user.firstname + " " + user.lastname,
          note ? note : "",
          "Confirmed"
        );

        const mailOptions = {
          from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
          to: user.email, // list of receivers
          subject: `${userWallet.coin} Withdrawal`, // Subject line
          html: emailBody, // plain text body
        };

        await sgMail.send(mailOptions);

        return {
          transfer: {
            txid: sendTrx.txid,
            fee: 0.0,
            state: "signed",
          },
        };
      } else {
        let response = {
          varient: "error",
          message: "Error on fetching transactions",
        };
        return response;
      }
    } else if (userWallet.coin === "XRP") {
      let sendAmount = parseFloat(amount).toFixed(4);

      const xrpWalletTransactions = await XrpController.send(
        userWallet.walletId,
        to,
        sendAmount,
        parseInt(destinationTag)
      );
      if (xrpWalletTransactions.error) {
        let response = {
          varient: "error",
          message: xrpWalletTransactions.error,
        };
        return response;
      } else {
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
          userWallet._id,
          sendAmount,
          asset.withdrawalFee,
          `${currentDate.getDate()}, ${
            months[currentDate.getMonth()]
          } ${currentDate.getFullYear()}`,
          userWallet.coin,
          user.firstname + " " + user.lastname,
          note ? note : "",
          "Confirmed"
        );

        // let emailBody = '<p>Hi ' + user.firstname + ' ' + user.lastname + ',</p>';
        // emailBody += '<p>Your withdrawal request have successfully placed.</p>';
        // emailBody += '<p>Your withdrawal details are:</p>';
        // emailBody += '<p>Amount: <strong>' + amount + '</strong></p>';
        // emailBody += '<p>Coin: <strong>' + userWallet.coin + '</strong></p>';
        // emailBody += '<p>Address: <strong>' + to + '</strong></p>';
        // emailBody += '<p>Note Number: <strong>' + ((note) ? note : '') + '</strong></p>';

        const mailOptions = {
          from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
          to: user.email, // list of receivers
          subject: `Trillionbit: ${userWallet.coin} Withdrawal`, // Subject line
          html: emailBody, // plain text body
        };

        sgMail.send(mailOptions);

        return xrpWalletTransactions;
      }
    } else if (userWallet.coin === "ETH") {
      let sendAmount = parseFloat(amount);

      const ethWalletBalance = await EthController.balance(userWallet.walletId);

      if (parseFloat(sendAmount) > parseFloat(ethWalletBalance)) {
        const ethWalletAdminBalance = await EthController.adminBalance();

        if (parseFloat(ethWalletAdminBalance) > sendAmount) {
          const sendFromAdmin = await EthController.sendFromAdmin(
            to,
            sendAmount
          );
          if (sendFromAdmin) {
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
              userWallet._id,
              sendAmount,
              asset.withdrawalFee,
              `${currentDate.getDate()}, ${
                months[currentDate.getMonth()]
              } ${currentDate.getFullYear()}`,
              userWallet.coin,
              user.firstname + " " + user.lastname,
              note ? note : "",
              "Confirmed"
            );

            // let emailBody = '<p>Hi ' + user.firstname + ' ' + user.lastname + ',</p>';
            // emailBody += '<p>Your withdrawal request have successfully placed.</p>';
            // emailBody += '<p>Your withdrawal details are:</p>';
            // emailBody += '<p>Amount: <strong>' + amount + '</strong></p>';
            // emailBody += '<p>Coin: <strong>' + userWallet.coin + '</strong></p>';
            // emailBody += '<p>Address: <strong>' + to + '</strong></p>';
            // emailBody += '<p>Note Number: <strong>' + ((note) ? note : '') + '</strong></p>';

            const mailOptions = {
              from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
              to: user.email, // list of receivers
              subject: `${userWallet.coin} Withdrawal`, // Subject line
              html: emailBody, // plain text body
            };

            sgMail.send(mailOptions);

            // const sendAllToAdmin = await EthController.sendAll(userWallet.walletId, (parseFloat(userWallet.walletAmount) - 0.0002));
            // if (sendAllToAdmin) {
            // 	let currentDate = new Date();
            // 	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            // 	let emailBody = withdrawEmail(
            // 		userWallet._id, userWallet.walletAmount, '0.00',
            // 		`${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`, userWallet.coin, user.firstname + ' ' + user.lastname,
            // 		((note) ? note : ''));

            // 	const mailOptions = {
            // 		fromname: 'Trillionbit UAE',
            // 		from: 'admin@trillionbituae.com', // sender address
            // 		to: 'admin@trillionbituae.com', // list of receivers
            // 		subject: 'Trillionbituae: User All Send Back', // Subject line
            // 		html: emailBody// plain text body
            // 	};

            // 	sgMail.send(mailOptions);
            // } else {
            // 	let currentDate = new Date();
            // 	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            // 	let emailBody = withdrawEmail(
            // 		userWallet._id, userWallet.walletAmount, '0.00',
            // 		`${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`, userWallet.coin, user.firstname + ' ' + user.lastname,
            // 		((note) ? note : ''));

            // 	const mailOptions = {
            // 		fromname: 'Trillionbit UAE',
            // 		from: 'admin@trillionbituae.com', // sender address
            // 		to: 'admin@trillionbituae.com', // list of receivers
            // 		subject: 'Trillionbituae: User All Send Falied', // Subject line
            // 		html: emailBody// plain text body
            // 	};

            // 	sgMail.send(mailOptions);
            // }

            return {
              transfer: {
                txid: sendFromAdmin.receipt.transactionHash,
                fee: 0.0,
                state: "signed",
              },
            };
          } else {
            let response = {
              varient: "error",
              message: "Something went wrong. Please try agian later.",
            };
            return response;
          }
        } else {
          // console.log('Insufficient admin balance');
          let response = {
            varient: "warning",
            message: "Transaction sent! Waiting for an approval",
          };
          return response;
        }
      } else {
        // console.log('User wallet send');
        const ethWalletTransactions = await EthController.send(
          userWallet.walletId,
          to,
          sendAmount
        );
        if (ethWalletTransactions) {
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
            userWallet._id,
            sendAmount,
            asset.withdrawalFee,
            `${currentDate.getDate()}, ${
              months[currentDate.getMonth()]
            } ${currentDate.getFullYear()}`,
            userWallet.coin,
            user.firstname + " " + user.lastname,
            note ? note : "",
            "Confirmed"
          );

          // let emailBody = '<p>Hi ' + user.firstname + ' ' + user.lastname + ',</p>';
          // emailBody += '<p>Your withdrawal request have successfully placed.</p>';
          // emailBody += '<p>Your withdrawal details are:</p>';
          // emailBody += '<p>Amount: <strong>' + amount + '</strong></p>';
          // emailBody += '<p>Coin: <strong>' + userWallet.coin + '</strong></p>';
          // emailBody += '<p>Address: <strong>' + to + '</strong></p>';
          // emailBody += '<p>Note Number: <strong>' + ((note) ? note : '') + '</strong></p>';

          const mailOptions = {
            from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
            to: user.email, // list of receivers
            subject: `${userWallet.coin} Withdrawal`, // Subject line
            html: emailBody, // plain text body
          };

          await sgMail.send(mailOptions);

          return {
            transfer: {
              txid: ethWalletTransactions.receipt.transactionHash,
              fee: 0.0,
              state: "signed",
            },
          };
        } else {
          let response = {
            varient: "error",
            message: "Error on fetching transactions",
          };
          return response;
        }
      }
    } else if (userWallet.coin === "USDT") {
      console.log("Working");
      console.log(to);

      var isTRC20 = WAValidator.validate(to, "TRX");
      var isERC20 = WAValidator.validate(to, "ETH");

      if (isTRC20) {
        console.log("Yes");

        let sendAmount = parseInt(amount);

        const sendFromAd = await TronController.sendFromAdmin(to, sendAmount);
        console.log("------");
        console.log(sendFromAd);
        if (sendFromAd) {
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
            userWallet._id,
            sendAmount,
            asset.withdrawalFee,
            `${currentDate.getDate()}, ${
              months[currentDate.getMonth()]
            } ${currentDate.getFullYear()}`,
            userWallet.coin,
            user.firstname + " " + user.lastname,
            note ? note : "",
            "Confirmed"
          );

          const mailOptions = {
            from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
            to: user.email, // list of receivers
            subject: `${userWallet.coin} Withdrawal`, // Subject line
            html: emailBody, // plain text body
          };

          sgMail.send(mailOptions);

          return {
            transfer: {
              txid: sendFromAd,
              fee: 0.0,
              state: "signed",
            },
          };
        } else {
          let response = {
            varient: "error",
            message: "Something went wrong. Please try agian later.",
          };
          return response;
        }
      }

      if (isERC20) {
        let sendAmount = parseFloat(amount);

        console.log(sendAmount);

        const tetherWalletBalance = await TetherController.balance(
          userWallet.walletId,
          usdtContractAddress
        );

        console.log(`Wallet balance: ${tetherWalletBalance}`);

        if (parseFloat(sendAmount) > parseFloat(tetherWalletBalance)) {
          const tetherWalletAdminBalance =
            await TetherController.adminBalance();

          console.log(tetherWalletAdminBalance);

          if (parseFloat(tetherWalletAdminBalance) > sendAmount) {
            const sendFromAdmin = await TetherController.sendFromAdmin(
              to,
              sendAmount,
              usdtContractAddress
            );

            console.log(sendFromAdmin);
            if (sendFromAdmin) {
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
                userWallet._id,
                sendAmount,
                asset.withdrawalFee,
                `${currentDate.getDate()}, ${
                  months[currentDate.getMonth()]
                } ${currentDate.getFullYear()}`,
                userWallet.coin,
                user.firstname + " " + user.lastname,
                note ? note : "",
                "Confirmed"
              );

              const mailOptions = {
                from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
                to: user.email, // list of receivers
                subject: `${userWallet.coin} Withdrawal`, // Subject line
                html: emailBody, // plain text body
              };

              sgMail.send(mailOptions);

              return {
                transfer: {
                  txid: sendFromAdmin.receipt.transactionHash,
                  fee: 0.0,
                  state: "signed",
                },
              };
            } else {
              let response = {
                varient: "error",
                message: "Something went wrong. Please try agian later.",
              };
              return response;
            }
          } else {
            // console.log('Insufficient admin balance');
            let response = {
              varient: "warning",
              message: "Transaction sent! Waiting for an approval",
            };
            return response;
          }
        } else {
          // console.log('User wallet send');
          const tetherWalletBalance = await TetherController.balance(
            from,
            usdtContractAddress
          );

          // console.log('User Balance:', tetherWalletBalance);

          if (parseFloat(tetherWalletBalance) > sendAmount) {
            const sendFromAdmin = await TetherController.send(
              to,
              sendAmount,
              usdtContractAddress
            );
            if (sendFromAdmin) {
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
                userWallet._id,
                sendAmount,
                asset.withdrawalFee,
                `${currentDate.getDate()}, ${
                  months[currentDate.getMonth()]
                } ${currentDate.getFullYear()}`,
                userWallet.coin,
                user.firstname + " " + user.lastname,
                note ? note : "",
                "Confirmed"
              );

              const mailOptions = {
                from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
                to: user.email, // list of receivers
                subject: `${userWallet.coin} Withdrawal`, // Subject line
                html: emailBody, // plain text body
              };

              sgMail.send(mailOptions);

              return {
                transfer: {
                  txid: sendFromAdmin.receipt.transactionHash,
                  fee: 0.0,
                  state: "signed",
                },
              };
            } else {
              let response = {
                varient: "error",
                message: "Something went wrong. Please try agian later.",
              };
              return response;
            }
          } else {
            // console.log('Insufficient admin balance');
            let response = {
              varient: "warning",
              message: "Transaction sent! Waiting for an approval",
            };
            return response;
          }
        }
      } else {
        let response = {
          varient: "error",
          message: "Invalid Address",
        };
        return response;
      }
    } else if (userWallet.coin === "BTX") {
      let sendAmount = parseFloat(amount);

      const ethWalletBalance = await EthController.balance(
        userWallet.walletId,
        contractAddress
      );

      // console.log(ethWalletBalance, sendAmount, 'BTX balance');

      // if (parseFloat(sendAmount) > parseFloat(ethWalletBalance)) {
      // const ethWalletAdminBalance = await EthController.adminBalance(contractAddress);

      // 	if (parseFloat(ethWalletAdminBalance) > sendAmount) {
      // 		const sendFromAdmin = await EthController.sendFromAdmin(to, sendAmount, contractAddress);
      // 		if (sendFromAdmin) {
      // 			let currentDate = new Date();
      // 			let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      // 			let emailBody = withdrawEmail(
      // 				userWallet._id, sendAmount, asset.withdrawalFee,
      // 				`${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`, userWallet.coin, user.firstname + ' ' + user.lastname,
      // 				((note) ? note : ''), 'Confirmed');

      // 			const mailOptions = {
      // 				from: {name: 'Trillionbit', email: 'noreply@trillionbit.com'}, // sender address
      // 				to: user.email, // list of receivers
      // 				subject: `${userWallet.coin} Withdrawal`, // Subject line
      // 				html: emailBody// plain text body
      // 			};

      // 			sgMail.send(mailOptions);

      // 			return {
      // 				transfer: {
      // 					txid: sendFromAdmin.receipt.transactionHash,
      // 					fee: 0.00,
      // 					state: 'signed',
      // 				}
      // 			}
      // 		} else {
      // 			let response = {varient: "error", message: 'Something went wrong. Please try agian later.'}
      // 			return response;
      // 		}
      // 	} else {
      // 		console.log('Insufficient admin balance');
      // 		let response = {varient: "warning", message: 'Transaction sent! Waiting for an approval'}
      // 		return response;
      // 	}
      // } else {
      // console.log('User wallet send');
      const ethWalletTransactions = await EthController.send(
        userWallet.walletId,
        to,
        sendAmount,
        contractAddress
      );
      if (ethWalletTransactions) {
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
          userWallet._id,
          sendAmount,
          asset.withdrawalFee,
          `${currentDate.getDate()}, ${
            months[currentDate.getMonth()]
          } ${currentDate.getFullYear()}`,
          userWallet.coin,
          user.firstname + " " + user.lastname,
          note ? note : "",
          "Confirmed"
        );

        const mailOptions = {
          from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
          to: user.email, // list of receivers
          subject: `${userWallet.coin} Withdrawal`, // Subject line
          html: emailBody, // plain text body
        };

        await sgMail.send(mailOptions);

        return {
          transfer: {
            txid: ethWalletTransactions.receipt.transactionHash,
            fee: 0.0,
            state: "signed",
          },
        };
      } else {
        let response = {
          varient: "error",
          message: "Error on fetching transactions",
        };
        return response;
      }
      // } else {
      // 	let response = {varient: "error", message: 'Error on fetching transactions'}
      // 		return response;
      // }
    } else {
      return [];
    }
  } else {
    let response = {
      varient: "error",
      message: "Withdrawal under maintenance",
    };
    return response;
  }
};

const getBtxTransactions = async (userId) => {
  const userWallet = await UserWallet.find({ userId: userId, coin: "BTX" });
  if (userWallet.length > 0) {
    let btxWalletTransactions =
      await EthController.getTokenTransactionsByAddress(
        userWallet[0].walletAddress
      );
    if (btxWalletTransactions.length > 0) {
      const totalTransactions = await WalletTransactions.find({
        userId: userWallet[0].userId,
        coin: userWallet[0].coin,
        type: "Deposit",
        note: "BTX Transaction",
      });
      let totalTans = totalTransactions.length;
      if (btxWalletTransactions.length > totalTans) {
        for (let key in btxWalletTransactions) {
          if (btxWalletTransactions[key].tokenSymbol === "BTX") {
            const walletTransaction = await WalletTransactions.findOne({
              userId: userWallet[0].userId,
              txid: btxWalletTransactions[key].txid,
              type: "Deposit",
            });
            if (walletTransaction) {
              //
            } else {
              // const depositMarginWallet = await depositeWallet(userWallet, parseFloat(btxWalletTransactions[key].amount));

              let emailBody = "";
              let user = await User.findOne({ _id: userId });

              let newWalletTransaction = new WalletTransactions();
              // if (depositMarginWallet) {
              userWallet[0].walletAmount =
                parseFloat(userWallet[0].walletAmount) +
                btxWalletTransactions[key].amount;
              newWalletTransaction.userId = userId;
              newWalletTransaction.txid = btxWalletTransactions[key].txid;
              newWalletTransaction.value = parseFloat(
                btxWalletTransactions[key].amount
              );
              newWalletTransaction.type = "Deposit";
              newWalletTransaction.fees = btxWalletTransactions[key].fee;
              (newWalletTransaction.senderAddress =
                btxWalletTransactions.senderAddress),
                (newWalletTransaction.receiverAddress =
                  btxWalletTransactions.receiverAddress),
                (newWalletTransaction.confirmations =
                  btxWalletTransactions[key].confirmations);
              newWalletTransaction.date = new Date(
                btxWalletTransactions[key].time * 1000
              );
              newWalletTransaction.coin = userWallet[0].coin;
              newWalletTransaction.state = "Finished";
              newWalletTransaction.note = "BTX Transaction";

              let currentDate = new Date(`${newWalletTransaction.date}`);
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

              emailBody = depositEmail(
                newWalletTransaction._id,
                newWalletTransaction.value,
                "0.00",
                `${currentDate.getDate()}, ${
                  months[currentDate.getMonth()]
                } ${currentDate.getFullYear()}`,
                newWalletTransaction.coin,
                user.firstname + " " + user.lastname,
                newWalletTransaction.note ? newWalletTransaction.note : "",
                "Confirmed"
              );
              // } else {
              // 	// let newWalletTransaction = new WalletTransactions;
              // 	newWalletTransaction.userId = userId;
              // 	newWalletTransaction.txid = btxWalletTransactions[key].txid;
              // 	newWalletTransaction.value = parseFloat(btxWalletTransactions[key].amount);
              // 	newWalletTransaction.type = 'Deposit';
              // 	newWalletTransaction.fees = btxWalletTransactions[key].fee;
              // 	newWalletTransaction.senderAddress = btxWalletTransactions.senderAddress,
              // 	newWalletTransaction.receiverAddress = btxWalletTransactions.receiverAddress,
              // 	newWalletTransaction.confirmations = btxWalletTransactions[key].confirmations;
              // 	newWalletTransaction.date = new Date(btxWalletTransactions[key].time * 1000);
              // 	newWalletTransaction.coin = userWallet.coin;
              // 	newWalletTransaction.state = 'Transaction Error';
              // 	newWalletTransaction.note = "BTX Transaction Failed To Deposit To User's Wallet, Please contact to support";

              // 	let currentDate = new Date(`${newWalletTransaction.date}`);
              // 	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

              // 	emailBody = depositEmail(
              // 		newWalletTransaction._id, newWalletTransaction.value, '0.00',
              // 		`${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`, newWalletTransaction.coin, user.firstname + ' ' + user.lastname,
              // 		newWalletTransaction.note ? newWalletTransaction.note : '', 'Transaction Error');
              // }

              const params = [
                user.viabtcUserId,
                userWallet[0].coin,
                "deposit",
                new Date().getTime(),
                parseFloat(btxWalletTransactions[key].amount) + "",
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
                    await newWalletTransaction.save();
                    await userWallet[0].save();

                    const mailOptions = {
                      from: {
                        name: "Trillionbit",
                        email: "noreply@trillionbit.com",
                      }, // sender address
                      to: user.email, // list of receivers
                      subject: userWallet[0].coin + " Deposit", // Subject line
                      html: emailBody, // plain text body
                    };

                    sgMail.send(mailOptions);
                  } else {
                    return false;
                  }
                }
              );
            }
          }
        }
        return true;
      }
    }
  } else {
    return false;
  }
};

const getTrc20Transactions = async (userId, coin) => {
  // const test1 = getBitgoAdminWallet("bch");
  // console.log(test1);
  const userWallet = await UserWallet.find({ userId: userId, coin: coin });
  if (userWallet.length > 0) {
    const user = await User.findOne({ _id: userWallet[0].userId });
    let tronWalletTransactions = await TronController.trc20Transactions(
      userWallet[0].walletTrxAddress
    );

    var totalDepositCount = 0;
    for (var i = 0; i < tronWalletTransactions.length; i++) {
      var dep = tronWalletTransactions[i];
      if (dep.receiverAddress === userWallet[0].walletTrxAddress) {
        totalDepositCount = totalDepositCount + 1;
      }
    }
    console.log(totalDepositCount);

    if (totalDepositCount > 0) {
      const totalTransactions = await WalletTransactions.find({
        userId: userWallet[0].userId,
        coin: userWallet[0].coin,
        type: "Deposit",
        note: `${coin} TRC20 Transaction`,
      });
      let totalTans = totalTransactions.length;

      console.log(totalTans);

      // if (totalDepositCount >= totalTans) {
      for (let key in tronWalletTransactions) {
        if (
          tronWalletTransactions[key].receiverAddress ===
          userWallet[0].walletTrxAddress
        ) {
          // console.log(tronWalletTransactions[key]);
          const walletTransaction = await WalletTransactions.findOne({
            userId: userWallet[0].userId,
            txid: tronWalletTransactions[key].txid,
          });
          if (walletTransaction) {
            //
          } else {
            // const depositMarginWallet = await depositeWallet(userWallet, parseFloat(ethWalletTransactions[key].amount));

            if (user) {
              const params = [
                user.viabtcUserId,
                userWallet[0].coin,
                "deposit",
                new Date().getTime(),
                "" + tronWalletTransactions[key].amount,
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
                      let emailBody = "";
                      let user = await User.findOne({
                        _id: userId,
                      });

                      // if (depositMarginWallet) {
                      userWallet[0].walletAmount =
                        parseFloat(userWallet[0].walletAmount) +
                        tronWalletTransactions[key].amount;
                      let newWalletTransaction = new WalletTransactions();
                      newWalletTransaction.userId = userId;
                      newWalletTransaction.txid =
                        tronWalletTransactions[key].txid;
                      newWalletTransaction.value =
                        tronWalletTransactions[key].amount;
                      newWalletTransaction.type = "Deposit";
                      newWalletTransaction.fees =
                        tronWalletTransactions[key].fee;
                      (newWalletTransaction.senderAddress =
                        tronWalletTransactions[key].senderAddress),
                        (newWalletTransaction.receiverAddress =
                          tronWalletTransactions[key].receiverAddress),
                        (newWalletTransaction.confirmations =
                          tronWalletTransactions[key].confirmations);
                      newWalletTransaction.date = new Date(
                        tronWalletTransactions[key].time
                      );
                      newWalletTransaction.coin = userWallet[0].coin;
                      newWalletTransaction.state = "Finished";
                      newWalletTransaction.notes = `${coin} TRC20 Transaction`;

                      let currentDate = new Date(
                        `${newWalletTransaction.date}`
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

                      emailBody = depositEmail(
                        newWalletTransaction._id,
                        newWalletTransaction.value,
                        "0.00",
                        `${currentDate.getDate()}, ${
                          months[currentDate.getMonth()]
                        } ${currentDate.getFullYear()}`,
                        newWalletTransaction.coin,
                        user.firstname + " " + user.lastname,
                        newWalletTransaction.note
                          ? newWalletTransaction.note
                          : "",
                        "Confirmed"
                      );

                      await newWalletTransaction.save();
                      await userWallet[0].save();

                      let walletTrxBal = await TronController.getBalance(
                        tronWalletTransactions[key].receiverAddress
                      );

                      if (walletTrxBal < 40) {
                        const newAmount = Math.ceil(40 - walletTrxBal);
                        const sendTrx = await TronController.sendTrx(
                          tronWalletTransactions[key].receiverAddress,
                          newAmount
                        );

                        if (!sendTrx) {
                          const mailOptions = {
                            from: {
                              name: "Trillionbit",
                              email: "noreply@trillionbit.com",
                            }, // sender address
                            to: "trillionbituae@gmail.com", // list of receivers
                            subject: "TRX Admin Balance Low", // Subject line
                            html: "Tron Admin Wallet balance low. Please refill.", // plain text body
                          };

                          sgMail.send(mailOptions);
                        }
                      }

                      const mailOptions = {
                        from: {
                          name: "Trillionbit",
                          email: "noreply@trillionbit.com",
                        }, // sender address
                        to: user.email, // list of receivers
                        subject: userWallet[0].coin + " Deposit", // Subject line
                        html: emailBody, // plain text body
                      };

                      sgMail.send(mailOptions);

                      // const dateToAdd = new Date().setMinutes(new Date().getMinutes() + 2);
                      // console.log("Admin Transfer USDT-TRC Cron started");

                      // cron.schedule(dateToAdd, function() {
                      // 	let AdminTranfer = TronController.sendToAdmin(userWallet[0].walletTrxId, userWallet[0].walletTrxAddress);
                      // 	console.log(AdminTranfer);

                      // });

                      await new Promise((resolve) =>
                        setTimeout(resolve, 120000)
                      );

                      let AdminTranfer = await TronController.sendToAdmin(
                        userWallet[0].walletTrxId,
                        userWallet[0].walletTrxAddress
                      );
                      if (!AdminTranfer) {
                        const mailOptions = {
                          from: {
                            name: "Trillionbit",
                            email: "noreply@trillionbit.com",
                          }, // sender address
                          to: "trillionbituae@gmail.com", // list of receivers
                          subject: "TRC20 USDT not sent to Admin", // Subject line
                          html: `${userWallet[0].walletTrxAddress} not sent to Admin`, // plain text body
                        };

                        sgMail.send(mailOptions);
                      }
                    } else {
                      return false;
                    }
                  } else {
                    return false;
                  }
                }
              );
            } else {
              return false;
            }
          }
        }
      }
      return true;
      // }
    }
  } else {
    return false;
  }
};

const getTrxTransactions = async (userId) => {
  const userWallet = await UserWallet.find({ userId: userId, coin: "TRX" });
  if (userWallet.length > 0) {
    const user = await User.findOne({ _id: userWallet[0].userId });
    let tronWalletTransactions = await TronController.transactions(
      userWallet[0].walletAddress
    );

    var totalDepositCount = 0;
    for (var i = 0; i < tronWalletTransactions.length; i++) {
      var dep = tronWalletTransactions[i];
      if (dep.receiverAddress === userWallet[0].walletTrxAddress) {
        totalDepositCount = totalDepositCount + 1;
      }
    }

    if (totalDepositCount > 0) {
      const totalTransactions = await WalletTransactions.find({
        userId: userWallet[0].userId,
        coin: userWallet[0].coin,
        type: "Deposit",
        note: "TRX Transaction",
      });
      let totalTans = totalTransactions.length;
      if (totalDepositCount > totalTans) {
        for (let key in tronWalletTransactions) {
          const walletTransaction = await WalletTransactions.findOne({
            userId: userWallet[0].userId,
            txid: tronWalletTransactions[key].txid,
          });
          if (walletTransaction) {
            //
          } else {
            // const depositMarginWallet = await depositeWallet(userWallet, parseFloat(ethWalletTransactions[key].amount));
            if (user) {
              const params = [
                user.viabtcUserId,
                userWallet[0].coin,
                "deposit",
                new Date().getTime(),
                "" + tronWalletTransactions[key].amount,
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
                      let emailBody = "";
                      let user = await User.findOne({
                        _id: userId,
                      });

                      // if (depositMarginWallet) {
                      userWallet[0].walletAmount =
                        parseFloat(userWallet[0].walletAmount) +
                        tronWalletTransactions[key].amount;
                      let newWalletTransaction = new WalletTransactions();
                      newWalletTransaction.userId = userId;
                      newWalletTransaction.txid =
                        tronWalletTransactions[key].txid;
                      newWalletTransaction.value =
                        tronWalletTransactions[key].amount;
                      newWalletTransaction.type = "Deposit";
                      newWalletTransaction.fees =
                        tronWalletTransactions[key].fee;
                      (newWalletTransaction.senderAddress =
                        tronWalletTransactions[key].senderAddress),
                        (newWalletTransaction.receiverAddress =
                          tronWalletTransactions[key].receiverAddress),
                        (newWalletTransaction.confirmations =
                          tronWalletTransactions[key].confirmations);
                      newWalletTransaction.date = new Date(
                        tronWalletTransactions[key].time
                      );
                      newWalletTransaction.coin = userWallet[0].coin;
                      newWalletTransaction.state = "Finished";
                      newWalletTransaction.notes = "TRX Transaction";

                      let currentDate = new Date(
                        `${newWalletTransaction.date}`
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

                      emailBody = depositEmail(
                        newWalletTransaction._id,
                        newWalletTransaction.value,
                        "0.00",
                        `${currentDate.getDate()}, ${
                          months[currentDate.getMonth()]
                        } ${currentDate.getFullYear()}`,
                        newWalletTransaction.coin,
                        user.firstname + " " + user.lastname,
                        newWalletTransaction.note
                          ? newWalletTransaction.note
                          : "",
                        "Confirmed"
                      );

                      await newWalletTransaction.save();
                      await userWallet[0].save();

                      const mailOptions = {
                        from: {
                          name: "Trillionbit",
                          email: "noreply@trillionbit.com",
                        }, // sender address
                        to: user.email, // list of receivers
                        subject: userWallet[0].coin + " Deposit", // Subject line
                        html: emailBody, // plain text body
                      };

                      sgMail.send(mailOptions);
                    } else {
                      return false;
                    }
                  } else {
                    return false;
                  }
                }
              );
            } else {
              return false;
            }
          }
        }
        return true;
      }
    }
  } else {
    return false;
  }
};

const getUsdtTransactions = async (userId) => {
  const userWallet = await UserWallet.find({ userId: userId, coin: "USDT" });
  if (userWallet.length > 0) {
    const user = await User.findOne({ _id: userWallet[0].userId });
    let tetherWalletTransactions =
      await TetherController.getTokenTransactionsByAddress(
        userWallet[0].walletAddress
      );

    // console.log(tetherWalletTransactions);

    // var totalDepositCount;
    // for (var i=0; i < tetherWalletTransactions.length; i++) {
    // 	var dep = tetherWalletTransactions[i];
    // 	console.log(tetherWalletTransactions.length);
    // 	console.log(userWallet[0].walletAddress);
    // 	if(dep.receiverAddress === userWallet[0].walletAddress) {
    // 		console.log("T");
    // 		totalDepositCount += 1;
    // 	}
    // }

    // console.log("NNN", totalDepositCount);

    // const totalTransactions = await WalletTransactions.find({
    // 	userId: userWallet[0].userId,
    // 	coin: userWallet[0].coin,
    // 	type: "Deposit",
    // 	note: "USDT Transaction",
    // });
    // let totalTans = totalTransactions.length;
    // console.log("MMM", totalTans);

    for (let key in tetherWalletTransactions) {
      if (tetherWalletTransactions[key].tokenSymbol === "USDT") {
        if (
          tetherWalletTransactions[key].type === "receive" &&
          tetherWalletTransactions[key].receiverAddress.toLowerCase() ===
            userWallet[0].walletAddress.toLowerCase() &&
          tetherWalletTransactions[key].contractAddress ===
            "0xdac17f958d2ee523a2206206994597c13d831ec7"
        ) {
          const walletTransaction = await WalletTransactions.findOne({
            userId: userWallet[0].userId,
            txid: tetherWalletTransactions[key].txid,
          });
          // console.log("NHJH");
          if (walletTransaction) {
            //
          } else {
            // console.log("UIUIU");
            // const depositMarginWallet = await depositeWallet(userWallet, parseFloat(ethWalletTransactions[key].amount));
            if (user) {
              const params = [
                user.viabtcUserId,
                userWallet[0].coin,
                "deposit",
                new Date().getTime(),
                "" + tetherWalletTransactions[key].amount * 1e12,
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
                      let emailBody = "";
                      let user = await User.findOne({
                        _id: userId,
                      });

                      // if (depositMarginWallet) {
                      userWallet[0].walletAmount =
                        parseFloat(userWallet[0].walletAmount) +
                        tetherWalletTransactions[key].amount * 1e12;
                      let newWalletTransaction = new WalletTransactions();
                      newWalletTransaction.userId = userId;
                      newWalletTransaction.txid =
                        tetherWalletTransactions[key].txid;
                      newWalletTransaction.value =
                        tetherWalletTransactions[key].amount * 1e12;
                      newWalletTransaction.type = "Deposit";
                      newWalletTransaction.fees =
                        tetherWalletTransactions[key].fee;
                      (newWalletTransaction.senderAddress =
                        tetherWalletTransactions.senderAddress),
                        (newWalletTransaction.receiverAddress =
                          tetherWalletTransactions.receiverAddress),
                        (newWalletTransaction.confirmations =
                          tetherWalletTransactions[key].confirmations);
                      newWalletTransaction.date = new Date(
                        tetherWalletTransactions[key].time * 1000
                      );
                      newWalletTransaction.coin = userWallet[0].coin;
                      newWalletTransaction.state = "Finished";
                      newWalletTransaction.notes = "USDT Transaction";

                      let currentDate = new Date(
                        `${newWalletTransaction.date}`
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

                      emailBody = depositEmail(
                        newWalletTransaction._id,
                        newWalletTransaction.value,
                        "0.00",
                        `${currentDate.getDate()}, ${
                          months[currentDate.getMonth()]
                        } ${currentDate.getFullYear()}`,
                        newWalletTransaction.coin,
                        user.firstname + " " + user.lastname,
                        newWalletTransaction.note
                          ? newWalletTransaction.note
                          : "",
                        "Confirmed"
                      );
                      // } else {
                      // 	let newWalletTransaction = new WalletTransactions;
                      // 	newWalletTransaction.userId = userId;
                      // 	newWalletTransaction.txid = ethWalletTransactions[key].txid;
                      // 	newWalletTransaction.value = ethWalletTransactions[key].amount;
                      // 	newWalletTransaction.type = 'Deposit';
                      // 	newWalletTransaction.fees = ethWalletTransactions[key].fee;
                      // 	newWalletTransaction.senderAddress = ethWalletTransactions.senderAddress,
                      // 	newWalletTransaction.receiverAddress = ethWalletTransactions.receiverAddress,
                      // 	newWalletTransaction.confirmations = ethWalletTransactions[key].confirmations;
                      // 	newWalletTransaction.date = new Date(ethWalletTransactions[key].time * 1000);
                      // 	newWalletTransaction.coin = userWallet.coin;
                      // 	newWalletTransaction.state = 'Transaction Error';
                      // 	newWalletTransaction.note = "Ethereum Transaction Failed To Deposit To User's Wallet, Please contact to support";

                      // 	let currentDate = new Date(`${newWalletTransaction.date}`);
                      // 	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                      // 	emailBody = depositEmail(
                      // 		newWalletTransaction._id, newWalletTransaction.value, '0.00',
                      // 		`${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`, newWalletTransaction.coin, user.firstname + ' ' + user.lastname,
                      // 		newWalletTransaction.note ? newWalletTransaction.note : '', 'Transaction Error');
                      // }

                      await newWalletTransaction.save();
                      await userWallet[0].save();

                      const mailOptions = {
                        from: {
                          name: "Trillionbit",
                          email: "noreply@trillionbit.com",
                        }, // sender address
                        to: user.email, // list of receivers
                        subject: userWallet[0].coin + " Deposit", // Subject line
                        html: emailBody, // plain text body
                      };

                      // sgMail.send(mailOptions);
                    } else {
                      return false;
                    }
                  } else {
                    return false;
                  }
                }
              );
            } else {
              return false;
            }
          }
        }
      }
    }
    return true;
  } else {
    return false;
  }
};

const getEthTransactions = async (userId) => {
  const userWallet = await UserWallet.find({ userId: userId, coin: "ETH" });
  if (userWallet.length > 0) {
    const user = await User.findOne({ _id: userWallet[0].userId });
    let ethWalletTransactions = await EthController.getTransactionsByAddress(
      userWallet[0].walletAddress
    );

    var totalDepositCount = 0;
    for (var i = 0; i < ethWalletTransactions.length; i++) {
      var dep = ethWalletTransactions[i];
      if (dep.receiverAddress === userWallet[0].walletAddress) {
        totalDepositCount = totalDepositCount + 1;
      }
    }

    if (totalDepositCount > 0) {
      const totalTransactions = await WalletTransactions.find({
        userId: userWallet[0].userId,
        coin: userWallet[0].coin,
        type: "Deposit",
        note: "Ethereum Transaction",
      });
      let totalTans = totalTransactions.length;
      if (totalDepositCount > totalTans) {
        for (let key in ethWalletTransactions) {
          const walletTransaction = await WalletTransactions.findOne({
            txid: ethWalletTransactions[key].txid,
          });
          if (walletTransaction) {
            //
          } else {
            // const depositMarginWallet = await depositeWallet(userWallet, parseFloat(ethWalletTransactions[key].amount));
            if (user) {
              const params = [
                user.viabtcUserId,
                userWallet[0].coin,
                "deposit",
                new Date().getTime(),
                "" + ethWalletTransactions[key].amount,
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
                      let emailBody = "";
                      let user = await User.findOne({
                        _id: userId,
                      });

                      // if (depositMarginWallet) {
                      userWallet[0].walletAmount =
                        parseFloat(userWallet[0].walletAmount) +
                        ethWalletTransactions[key].amount;
                      let newWalletTransaction = new WalletTransactions();
                      newWalletTransaction.userId = userId;
                      newWalletTransaction.txid =
                        ethWalletTransactions[key].txid;
                      newWalletTransaction.value =
                        ethWalletTransactions[key].amount;
                      newWalletTransaction.type = "Deposit";
                      newWalletTransaction.fees =
                        ethWalletTransactions[key].fee;
                      (newWalletTransaction.senderAddress =
                        ethWalletTransactions[key].senderAddress),
                        (newWalletTransaction.receiverAddress =
                          ethWalletTransactions[key].receiverAddress),
                        (newWalletTransaction.confirmations =
                          ethWalletTransactions[key].confirmations);
                      newWalletTransaction.date = new Date(
                        ethWalletTransactions[key].time * 1000
                      );
                      newWalletTransaction.coin = userWallet[0].coin;
                      newWalletTransaction.state = "Finished";
                      newWalletTransaction.notes = "Ethereum Transaction";

                      let currentDate = new Date(
                        `${newWalletTransaction.date}`
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

                      emailBody = depositEmail(
                        newWalletTransaction._id,
                        newWalletTransaction.value,
                        "0.00",
                        `${currentDate.getDate()}, ${
                          months[currentDate.getMonth()]
                        } ${currentDate.getFullYear()}`,
                        newWalletTransaction.coin,
                        user.firstname + " " + user.lastname,
                        newWalletTransaction.note
                          ? newWalletTransaction.note
                          : "",
                        "Confirmed"
                      );
                      // } else {
                      // 	let newWalletTransaction = new WalletTransactions;
                      // 	newWalletTransaction.userId = userId;
                      // 	newWalletTransaction.txid = ethWalletTransactions[key].txid;
                      // 	newWalletTransaction.value = ethWalletTransactions[key].amount;
                      // 	newWalletTransaction.type = 'Deposit';
                      // 	newWalletTransaction.fees = ethWalletTransactions[key].fee;
                      // 	newWalletTransaction.senderAddress = ethWalletTransactions.senderAddress,
                      // 	newWalletTransaction.receiverAddress = ethWalletTransactions.receiverAddress,
                      // 	newWalletTransaction.confirmations = ethWalletTransactions[key].confirmations;
                      // 	newWalletTransaction.date = new Date(ethWalletTransactions[key].time * 1000);
                      // 	newWalletTransaction.coin = userWallet.coin;
                      // 	newWalletTransaction.state = 'Transaction Error';
                      // 	newWalletTransaction.note = "Ethereum Transaction Failed To Deposit To User's Wallet, Please contact to support";

                      // 	let currentDate = new Date(`${newWalletTransaction.date}`);
                      // 	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

                      // 	emailBody = depositEmail(
                      // 		newWalletTransaction._id, newWalletTransaction.value, '0.00',
                      // 		`${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`, newWalletTransaction.coin, user.firstname + ' ' + user.lastname,
                      // 		newWalletTransaction.note ? newWalletTransaction.note : '', 'Transaction Error');
                      // }

                      await newWalletTransaction.save();
                      await userWallet[0].save();

                      const mailOptions = {
                        from: {
                          name: "Trillionbit",
                          email: "noreply@trillionbit.com",
                        }, // sender address
                        to: user.email, // list of receivers
                        subject: userWallet[0].coin + " Deposit", // Subject line
                        html: emailBody, // plain text body
                      };

                      sgMail.send(mailOptions);
                    } else {
                      return false;
                    }
                  } else {
                    return false;
                  }
                }
              );
            }
          }
        }
        return true;
      }
    }
  } else {
    return false;
  }
};

const getApiEthTransactions = async (userId) => {
  const userWallet = await ApiWallet.findOne({ userId: userId, coin: "ETH" });
  if (userWallet) {
    let ethWalletTransactions = await EthController.getTransactionsByAddress(
      userWallet.walletAddress
    );

    var totalDepositCount = 0;
    for (var i = 0; i < ethWalletTransactions.length; i++) {
      var dep = ethWalletTransactions[i];
      if (dep.receiverAddress === userWallet[0].walletAddress) {
        totalDepositCount = totalDepositCount + 1;
      }
    }

    if (totalDepositCount > 0) {
      const totalTransactions = await WalletTransactions.find({
        userId: userWallet.userId,
        coin: userWallet.coin,
        type: "Deposit",
        note: "Ethereum Transaction",
      });
      let totalTans = totalTransactions.length;
      if (totalDepositCount > totalTans) {
        for (let key in ethWalletTransactions) {
          const walletTransaction = await WalletTransactions.findOne({
            txid: ethWalletTransactions[key].txid,
            type: "Deposit",
          });
          if (walletTransaction) {
            //
          } else {
            // const depositMarginWallet = await depositeWallet(userWallet, parseFloat(ethWalletTransactions[key].amount));

            let emailBody = "";
            let user = await User.findOne({ _id: userId });

            // if (depositMarginWallet) {
            userWallet.walletAmount =
              parseFloat(userWallet.walletAmount) +
              ethWalletTransactions[key].amount;
            let newWalletTransaction = new WalletTransactions();
            newWalletTransaction.userId = userId;
            newWalletTransaction.txid = ethWalletTransactions[key].txid;
            newWalletTransaction.value = ethWalletTransactions[key].amount;
            newWalletTransaction.type = "Deposit";
            newWalletTransaction.fees = ethWalletTransactions[key].fee;
            (newWalletTransaction.senderAddress =
              ethWalletTransactions[key].senderAddress),
              (newWalletTransaction.receiverAddress =
                ethWalletTransactions[key].receiverAddress),
              (newWalletTransaction.confirmations =
                ethWalletTransactions[key].confirmations);
            newWalletTransaction.date = new Date(
              ethWalletTransactions[key].time * 1000
            );
            newWalletTransaction.coin = userWallet.coin;
            newWalletTransaction.state = "Finished";
            newWalletTransaction.notes = "Ethereum Transaction";

            let currentDate = new Date(`${newWalletTransaction.date}`);
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

            emailBody = depositEmail(
              newWalletTransaction._id,
              newWalletTransaction.value,
              "0.00",
              `${currentDate.getDate()}, ${
                months[currentDate.getMonth()]
              } ${currentDate.getFullYear()}`,
              newWalletTransaction.coin,
              user.firstname + " " + user.lastname,
              newWalletTransaction.note ? newWalletTransaction.note : "",
              "Confirmed"
            );
            // } else {
            // 	let newWalletTransaction = new WalletTransactions;
            // 	newWalletTransaction.userId = userId;
            // 	newWalletTransaction.txid = ethWalletTransactions[key].txid;
            // 	newWalletTransaction.value = ethWalletTransactions[key].amount;
            // 	newWalletTransaction.type = 'Deposit';
            // 	newWalletTransaction.fees = ethWalletTransactions[key].fee;
            // 	newWalletTransaction.senderAddress = ethWalletTransactions.senderAddress,
            // 	newWalletTransaction.receiverAddress = ethWalletTransactions.receiverAddress,
            // 	newWalletTransaction.confirmations = ethWalletTransactions[key].confirmations;
            // 	newWalletTransaction.date = new Date(ethWalletTransactions[key].time * 1000);
            // 	newWalletTransaction.coin = userWallet.coin;
            // 	newWalletTransaction.state = 'Transaction Error';
            // 	newWalletTransaction.note = "Ethereum Transaction Failed To Deposit To User's Wallet, Please contact to support";

            // 	let currentDate = new Date(`${newWalletTransaction.date}`);
            // 	let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

            // 	emailBody = depositEmail(
            // 		newWalletTransaction._id, newWalletTransaction.value, '0.00',
            // 		`${currentDate.getDate()}, ${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`, newWalletTransaction.coin, user.firstname + ' ' + user.lastname,
            // 		newWalletTransaction.note ? newWalletTransaction.note : '', 'Transaction Error');
            // }

            await newWalletTransaction.save();
            await userWallet.save();

            const mailOptions = {
              from: { name: "Trillionbit", email: "noreply@trillionbit.com" }, // sender address
              to: user.email, // list of receivers
              subject: userWallet.coin + " Deposit", // Subject line
              html: emailBody, // plain text body
            };

            sgMail.send(mailOptions);
          }
        }
        return true;
      }
    }
  } else {
    return false;
  }
};

const getBtxTronTransactions = () => {
  // TronController.createBtxWallet();
};

module.exports = {
  createWallet,
  createApiWallet,
  getWalletBalance,
  generateAddress,
  getTransactions,
  sendCrypto,
  getBitgoStatus,
  getBtxTransactions,
  getEthTransactions,
  getApiEthTransactions,
  createMarginWallet,
  depositeWallet,
  depositeMarginWallet,
  withdrawWallet,
  withdrawMarginWallet,
  updateViabtcWalletBalance,
  getViabtcWalletBalance,
  getViabtcMarginWalletBalance,
  getUsdtTransactions,
  getTrxTransactions,
  getTrc20Transactions,
  getBtxTronTransactions,
  updateViaWalletBalance,
  getBitgoAdminWallet,
};
