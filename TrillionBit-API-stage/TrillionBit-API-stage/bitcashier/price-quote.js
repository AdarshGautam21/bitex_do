const https = require('https');
const WebSocket = require('ws');
const crypto = require("crypto");
const { send } = require('q');

const apiKey = '92138946-1ef5-467e-a73c-34370772e5d6';
const apiSecret = 'DOWZTf9mJ2rBATmtlcQbxltgnKEL8T82';
const host = 'api.bitcashier.io';
const wsServerUrl = 'wss://' + host;
const httpServerUrl = 'https://' + host;
const path = '/v1/price-quote/1b398df9-7ce1-4678-82ac-f35068017dcf?primaryAsset=BTC&secondaryAsset=EUR&primaryAmount=0.1';
const nonce = Date.now().toString();
const body = '';

function encrypt(key, str) {
    const hmac = crypto.createHmac("sha512", key);
    return hmac.update(Buffer.from(str, 'utf-8')).digest("base64");
}

const hmacInput = 'GET' + path + body + nonce;
const hmacCode = encrypt(apiSecret, hmacInput);

const headers = {
    "X-Api-Key": apiKey,
    "X-Nonce": nonce,
    "X-Hmac": hmacCode,
};

const options = {
    method: 'GET',
    headers: headers,
};

const req = https.request(httpServerUrl + path, options, function (res) {
    const status = res.statusCode;
    res.on('data', function (body) {
        if (res.statusCode !== 200) {
            console.log("Authentication failure: " + status + " " + body);
            process.exit(1);
        }
        let quote = JSON.parse(body);
        console.log("Price Quote: ", quote);
    });
});

req.end();

function open_ws_conn(token) {
    const ws_path = '/v1/ws?token=' + token
    console.log(wsServerUrl + ws_path);
    const ws = new WebSocket(wsServerUrl + ws_path);

    function send(msgJson) {
        const msgString = JSON.stringify(msgJson);
        ws.send(msgString);
        console.log('SENT: ' + msgString)
    }

    ws.on('open', function open() {
        console.debug("websocket connected");
        const sub_btc_eur = {
            type: "subscribe_prices",
            payload: {
                primaryAsset: "BTC",
                secondaryAsset: "EUR",
                primaryAmount: 1.0,
                tag: "btc/eur"
        }
        };

        send(sub_btc_eur);

        const sub_balances = { type: "subscribe_balances" };
        send(sub_balances);

        const buy_btc = {
            type: "create_order",
            reqId: "1",
            payload: {
                    primaryAsset: "BTC",
                    secondaryAsset: "EUR",
                    amount: 0.01,
                    assetSide: "Primary",
                    operation: "Buy",
                    orderType: "Market"
                }
        };

        const sell_btc = JSON.parse(JSON.stringify(buy_btc));
        sell_btc.payload.operation = "Sell";
        sell_btc.reqId = "2";

        send(buy_btc);
        send(sell_btc);

        setTimeout(() => {

            const unsub_btc_eur = {
                type: "unsubscribe_prices",
                payload: {
                    tag: "btc/eur"
                }
            };
            const unsub_balances = {
                type: "unsubscribe_balances"
            };

            send(unsub_btc_eur);
            send(unsub_balances);
        ws.close();
        },
        2000)

    });

    ws.on('close', function open() {
        console.debug("websocket closed");
    });

    ws.on('message', (data) => {
        console.log('RECV: ' + JSON.stringify(JSON.parse(data)));
    });
}

module.exports = send;
