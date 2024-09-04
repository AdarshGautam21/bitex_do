const express = require('express');
const router = express.Router();
const axios = require('axios');

const Markets = require('../../models/trading/Markets');
const Assets = require('../../models/trading/Assets');
const CryptoHistory = require('../../models/trading/CryptoHistory');
const AssetsMarketLast = require('../../models/trading/AssetsMarketLast');
const isEmpty = require("../../validation/isEmpty");

const unified_crypto = {
    "BTC": {
        "unified_crypto_id": 1,
        "min_withdrawal": 0.001,
    },
    "BCH": {
        "unified_crypto_id": 1831,
        "min_withdrawal": 0.002,
    },
    "LTC": {
        "unified_crypto_id": 2,
        "min_withdrawal": 0.002,
    },
    "XRP": {
        "unified_crypto_id": 52,
        "min_withdrawal": 0.5,
    },
    "ETH": {
        "unified_crypto_id": 1027,
        "min_withdrawal": 0.01,
    },
}

/**
 * @route GET /api/spot/summary
 * @description Get all market summary
 * @access Public
 */
router.get('/summary', (req, res) => {
    let res_markets = [];
    Markets.find({ active: true })
        .then(async markets => {
            for (market of markets) {
                const assetMarketLast = await AssetsMarketLast.findOne({
                    market: market.stock, currency: `USD to ${market.money}`
                });
                if (assetMarketLast) {
                    const res_market = {
                        "trading_pairs": `${market.stock}_${market.money}`,
                        "last_price": assetMarketLast.last,
                        "lowest_ask": assetMarketLast.ask,
                        "highest_bid": assetMarketLast.bid,
                        "base_volume": assetMarketLast.volume,
                        "quote_volume": assetMarketLast.deal,
                        "price_change_percent_24h": ((parseFloat(assetMarketLast.last) - parseFloat(assetMarketLast.open))/parseFloat(assetMarketLast.open))*100,
                        "highest_price_24h": assetMarketLast.high,
                        "lowest_price_24h": assetMarketLast.low,
                    }
                    res_markets.push(res_market);
                }
            }
            res.json(res_markets);
        })
        .catch(err => {
            res.status(400).json({variant: 'error', message: 'No markets found'});
        })
});

/**
 * @route GET /api/spot/assets
 * @description Get all market assets
 * @access Public
 */
router.get('/assets', (req, res) => {
    let res_assets = {};
    Assets.find({ active: true, fiat: false })
        .then(async assets => {
            for (asset of assets) {
                if (unified_crypto[asset.name]) {
                    let res_asset = {
                        "name": asset.displayName,
                        "unified_cryptoasset_id" : unified_crypto[asset.name].unified_crypto_id,
                        "can_withdraw": true,
                        "can_deposit": true,
                        "min_withdraw": unified_crypto[asset.name].min_withdrawal,
                        "max_withdraw": 0.00,
                        "maker_fee": 0.002,
                        "taker_fee": 0.002,
                    }
                    res_assets[asset.name] = res_asset;
                }
            }
            res.json(res_assets);
        })
        .catch(err => {
            res.status(400).json({variant: 'error', message: 'No assets found'});
        })
});

/**
 * @route GET /api/spot/ticker
 * @description Get all market ticker
 * @access Public
 */
router.get('/ticker', (req, res) => {
    let res_markets = [];
    Markets.find({ active: true })
        .then(async markets => {
            for (market of markets) {
                const assetMarketLast = await AssetsMarketLast.findOne({
                    market: market.stock, currency: `USD to ${market.money}`
                });
                if (assetMarketLast) {
                    if (unified_crypto[market.stock]) {
                        let res_market = {
                            "trading_pairs": `${market.stock}_${market.money}`,
                            "base_id": unified_crypto[market.stock].unified_crypto_id,
                            "quote_id": 0,
                            "last_price": assetMarketLast.last,
                            "base_volume": assetMarketLast.volume,
                            "quote_volume": assetMarketLast.deal,
                            "isFrozen": 0,
                        }
                        res_markets.push(res_market);
                    }
                }
            }
            res.json(res_markets);
        })
        .catch(err => {
            res.status(400).json({variant: 'error', message: 'No tiker found'});
        })
});

/**
 * @route GET /api/spot/orderbook/market_pair
 * @description Get market orderbook.
 * @access Public
 */
router.get('/orderbook/:market_pair', async (req, res) => {
    const currency_pair = await req.params.market_pair;
    axios.post('http://139.162.234.246:8080/', {"method": "order.depth", "params": [currency_pair, 100, "0"], "id": 1})
        .then(async response => {
            if (response.data.error) {
                // console.log(`${currency_pair} falied to save last market bid`);
            } else {
                try {
                    let data = response.data.result;
                    let orderbook = {
                        timestamp: Date.now(),
                        asks: data.asks,
                        bids: data.bids,
                    }
                    res.json(orderbook);
                } catch {
                    res.status(400).json({variant: 'error', message: 'No orderbook found'});
                }
            }
        });
  });

/**
 * @route GET /api/spot/trades/market_pair
 * @description Get market trades.
 * @access Public
 */
router.get('/trades/:market_pair', async (req, res) => {
    const currency_pair = await req.params.market_pair;
    axios.post('http://139.162.234.246:8080/', {"method": "market.deals", "params": [currency_pair, 9999, 0], "id": 1})
        .then(async response => {
            if (response.data.error) {
                res.status(400).json({variant: 'error', message: 'No trades found'});
            } else {
                try {
                    let data = response.data.result;
                    let all_trades = [];
                    for(trade of data) {
                        let a_trade = {
                            "trade_id": trade.id,
                            "price": trade.price,
                            "base_volume": trade.amount,
                            "quote_volume": (parseFloat(trade.price)*parseFloat(trade.amount)),
                            "timestamp": trade.time,
                            "type": trade.type
                        }
                        all_trades.push(a_trade);
                    }
                    res.json(all_trades);
                } catch {
                    res.status(400).json({variant: 'error', message: 'No trades found'});
                }
            }
        });
  });

module.exports = router;
