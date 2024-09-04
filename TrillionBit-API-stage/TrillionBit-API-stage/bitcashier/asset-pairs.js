const axios = require('axios');
const crypto = require('crypto');

const apiKey = '92138946-1ef5-467e-a73c-34370772e5d6';
const apiSecret = 'DOWZTf9mJ2rBATmtlcQbxltgnKEL8T82';
const host = 'api.bitcashier.io';
const httpServerUrl = 'https://' + host;
const body = '';
const path = '/v1/assets/asset-pairs';
const nonce = Date.now().toString();
const hmacInput = 'GET' + path + body + nonce;

function encrypt(key, str) {
  const hmac = crypto.createHmac('sha512', key);
  return hmac.update(Buffer.from(str, 'utf-8')).digest('base64');
}

const hmacCode = encrypt(apiSecret, hmacInput);

const headers = {
  'X-Api-Key': apiKey,
  'X-Nonce': nonce,
  'X-Hmac': hmacCode,
};

const options = {
  headers: headers,
};

axios.get(httpServerUrl + path, options)
  .then((response) => {
    const assetPairs = response.data;
    console.log('Asset Pairs:', assetPairs);

    module.exports = assetPairs;
  })
  .catch((error) => {
    console.error('Error fetching asset pairs:', error.message);
    process.exit(1);
  });
