const express = require('express');
const curl = require('curl');
const keys = require('../../config/key');
const router = express.Router();
const axios = require('axios');
const Markets = require('../../models/trading/Markets');
const Assets = require('../../models/trading/Assets');

const uniqueCryptoId = (crypto) => {
  let crypId = 0;
  switch(crypto) {
    case 'BTC':
      crypId = 1;
      break;
    case 'BCH':
      crypId = 1831;
      break;
    case 'LTC':
      crypId = 2;
      break;
    case 'XRP':
      crypId = 52;
      break;
    case 'ETH':
      crypId = 1027;
      break;
    case 'TRX':
      crypId = 1958;
      break;
    case 'USDT':
      crypId = 825;
      break;
    case 'BTX':
      crypId = 0;
      break;
    default:
      crypId = 0;
  };

  return crypId;
};

const getViabtcKline = async (market) => {
  const params = [
    market,
    86400
  ];

  const postParamas = {
    method: 'market.status',
    params: params,
    id: 1516681174
  }

  let response = await axios.post(keys.tradingURI, JSON.stringify(postParamas));
  
  if (response.data) {
    return response.data.result;
  } else {
    return false;
  }
}

const getViabtcStatusToday = async (market) => {
  const params = [
    market,
  ];

  const postParamas = {
    method: 'market.status_today',
    params: params,
    id: 1516681174
  }

  let response = await axios.post(keys.tradingURI, JSON.stringify(postParamas));
  
  if (response.data) {
    return response.data.result;
  } else {
    return false;
  }
}

const getViabtcLastAskBid = async (market, limit=1) => {
  const params = [
    market,
    limit,
    "0",
  ];

  const postParamas = {
    method: 'order.depth',
    params: params,
    id: 1516681174
  }

  let response = await axios.post(keys.tradingURI, JSON.stringify(postParamas));
  
  if (response.data) {
    return response.data.result;
  } else {
    return false;
  }
}

const getViabtcMarketDeals = async (market, limit=1) => {
  const params = [
    market,
    limit,
    1,
  ];

  const postParamas = {
    method: 'market.deals',
    params: params,
    id: 1516681174
  }

  let response = await axios.post(keys.tradingURI, JSON.stringify(postParamas));
  
  if (response.data) {
    return response.data.result;
  } else {
    return false;
  }
}

const getViabtcMarketLast = async (market) => {
  const params = [
    market
  ];

  const postParamas = {
    method: 'market.last',
    params: params,
    id: 1
  }

  let response = await axios.post(keys.tradingURI, JSON.stringify(postParamas));
  
  if (response.data) {
    return response.data.result;
  } else {
    return false;
  }
}

const getViabtcAssetSummary = async (asset) => {
  const params = [
    asset
  ];

  const postParamas = {
    method: 'asset.summary',
    params: params,
    id: 1
  }

  let response = await axios.post(keys.tradingURI, JSON.stringify(postParamas));
  
  if (response.data) {
    return response.data.result;
  } else {
    return false;
  }
}

/**
 * @route GET /v1/summary
 * @description Get market kline summary
 * @access Public
 */
 router.get('/summary', async (req, res) => {

  let market_kline_list = [];
  const markets = await Markets.find({active: true});

  if (markets.length > 0) {
    for(_market of markets) {
      let marketKline = await getViabtcKline(_market.name);
      let marketAskBid = await getViabtcLastAskBid(_market.name);
      if (marketKline) {
        let marketK = {};
        marketK = {
          "trading_pairs": _market.name,
          "base_currency": _market.stock,
          "quote_currency": _market.money,
          "last_price": marketKline.last,
          "lowest_ask": marketAskBid.asks[0][0],
          "highest_bid": marketAskBid.bids[0][0],
          "base_volume": marketKline.volume,
          "quote_volume": marketKline.volume,
          "price_change_percent_24h": (((parseFloat(marketKline.open) - parseFloat(marketKline.last))/parseFloat(marketKline.open))*100).toFixed(3),
          "highest_price_24h": marketKline.high,
          "lowest_price_24h": marketKline.low,
        }
        market_kline_list.push(marketK)
      }
    }
  }

  res.json(market_kline_list)
});

/**
 * @route GET /v1/summary/:market
 * @description Get market kline summary
 * @access Public
 */
 router.get('/summary/:market', async (req, res) => {

  let marketK = {};
  if (req.params.market) {
    const market = await Markets.findOne({name: req.params.market});
    if (market) {
      let marketKline = await getViabtcKline(req.params.market);
      let marketAskBid = await getViabtcLastAskBid(req.params.market);
      if (marketKline) {
        marketK = {
          "trading_pairs": market.name,
          "base_currency": market.stock,
          "quote_currency": market.money,
          "last_price": marketKline.last,
          "lowest_ask": marketAskBid.asks[0][0],
          "highest_bid": marketAskBid.bids[0][0],
          "base_volume": marketKline.volume,
          "quote_volume": marketKline.volume,
          "price_change_percent_24h": (((parseFloat(marketKline.open) - parseFloat(marketKline.last))/parseFloat(marketKline.open))*100).toFixed(3),
          "highest_price_24h": marketKline.high,
          "lowest_price_24h": marketKline.low,
        }
      }
    }
  }

  res.json(marketK)
});

/**
 * @route GET /v1/assets
 * @description Get market assets
 * @access Public
 */
 router.get('/assets', async (req, res) => {
  let assets_list = {};   
  const assets = await Assets.find({active: true});
  for (asset of assets) {
    assets_list[asset.name] = {
      "name": asset.displayName,
      "unified_cryptoasset_id": uniqueCryptoId(asset.name),
      "can_withdraw": true,
      "can_deposit": true,
      "min_withdraw": asset.name === 'INR' ? "2000" : asset.name === 'AED' ? "200" : asset.withdrawalFee,
      "max_withdraw": 0.00,
      "maker_fee": 0.02,
      "taker_fee": 0.02,
    }
  }
  res.json(assets_list);
});

/**
 * @route GET /v1/assets/:coin
 * @description Get market assets
 * @access Public
 */
 router.get('/assets/:coin', async (req, res) => {
  let assets_res = {};   
  if (req.params.coin) {
    const asset = await Assets.findOne({name: req.params.coin});
    if (asset) {
      assets_res = {
        "name": asset.displayName,
        "unified_cryptoasset_id": uniqueCryptoId(asset.name),
        "can_withdraw": true,
        "can_deposit": true,
        "min_withdraw": asset.name === 'INR' ? "2000" : asset.name === 'AED' ? "200" : asset.withdrawalFee,
        "max_withdraw": 0.00,
        "maker_fee": 0.02,
        "taker_fee": 0.02,
      }
    }
  }
  res.json(assets_res);
});

/**
 * @route GET /v1/orderbook/:market
 * @description Get market assets
 * @access Public
 */
 router.get('/orderbook/:market', async (req, res) => {
  if (req.params.market) {
    const order_book = await getViabtcLastAskBid(req.params.market, 100);
    res.json({
      timestamp: Date.now(),
      ...order_book,
    });
  } else {
    res.json({});
  }
});

/**
 * @route GET /v1/trades/:market
 * @description Get market assets
 * @access Public
 */
 router.get('/trades/:market', async (req, res) => {
   let trades_list = [];
  if (req.params.market) {
    const market_deals = await getViabtcMarketDeals(req.params.market, 100);
    if(market_deals.length > 0){
      for(market_deal of market_deals) {
        let current_trade = {
          "trade_id": market_deal.id,
          "price": market_deal.price,
          "base_volume": market_deal.price,
          "quote_volume": market_deal.amount,
          "timestamp": market_deal.time,
          "type": market_deal.type
        }
        trades_list.push(current_trade);
      }
    };
  }
  res.json(trades_list);
});

/**
 * @route GET /v1/ticker
 * @description Get all tickers
 * @access Public
 */
 router.get('/ticker', async (req, res) => {
  let ticker_list = {};   
  const markets = await Markets.find({active: true});
  for (market of markets) {
    let marketLast = await getViabtcMarketLast(market.name);
    let marketStatus = await getViabtcStatusToday(market.name);
    ticker_list[market.name] = {
      "base_id": uniqueCryptoId(market.stock),
      "quote_id": uniqueCryptoId(market.money),
      "last_price": marketLast,
      "quote_volume": marketStatus.deal,
      "base_volume": marketStatus.volume,   
      "isFrozen": 0
    }
  }
  res.json(ticker_list);
});

/**
 * @route GET /v1/ticker/:market
 * @description Get single tickers
 * @access Public
 */
 router.get('/ticker/:market', async (req, res) => {
  let ticker_list = {};   
  if (req.params.market) {
    const market = await Markets.findOne({name: req.params.market});
    if (market) {
      let marketLast = await getViabtcMarketLast(market.name);
      let marketStatus = await getViabtcStatusToday(market.name);
      ticker_list[market.name] = {
        "base_id": uniqueCryptoId(market.stock),
        "quote_id": uniqueCryptoId(market.money),
        "last_price": marketLast,
        "quote_volume": marketStatus.deal,
        "base_volume": marketStatus.volume,   
        "isFrozen": 0
      }
    }
  }
  res.json(ticker_list);
});

module.exports = router;