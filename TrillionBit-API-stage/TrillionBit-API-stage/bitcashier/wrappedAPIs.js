const express = require('express');
const mongoose = require('mongoose');
const app = express();

const PORT = process.env.PORT || 3000;
const uri = 'mongodb+srv://shreyanbharadwaj12:KB6WiK6B37H0MuW0@cluster0.zfddy.mongodb.net/dex';

const assetPairs = require('./asset-pairs');
const processOrders = require('./orders');
const send = require('./price-quote');

app.use(express.json());

// Mongo
mongoose.set("strictQuery", false);
mongoose.connect(uri)
.then(() => {
    console.log("Connected to mongoDB");
}).catch((error) => {
    console.error("Error connecting to MongoDB", error);
})

/**
 * @route GET /api/bitcahierAPI
 * @description Get 3 bitcashier APIs
 * @access Public
 */
app.get('/api/v1/assets/asset-pairs', (req, res) => {
    try {
        res.status(200).json(assetPairs.assetPairs);
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.get('/api/v1/orders', (req, res) => {
    // const id = req.query.id;
    // const minPrimaryAmount = 1;
    // const maxPrimaryAmount = 1000;
    // const minSecondaryAmount = 1;
    // const maxSecondaryAmount = 1000;
    // const primaryAsset = 'USD';
    // const secondaryAsset = 'ETH';
    // const operationType = 'SELL';
    // const timeFrom = from;
    // const timeTo = to;
    // const limit = 100;
    // const offset = 0;
    // const orderType = 'MARKET';
    // const externalId = 'Congra';
    try {
        res.status(200).json({ message: "Orders are:", data: processOrders.processOrders });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.get('/api/v1/price-quote', (req, res) => {
    // const primaryAsset = req.query.primaryAsset;
    // const secondaryAsset = req.query.secondaryAsset;
    // const primaryAmount = req.query.primaryAmount;
    try {
        res.status(200).json({ message: "Price Quote:", data: send.send });
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});
