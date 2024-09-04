const axios = require('axios');
const crypto = require('crypto');

const apiKey = '92138946-1ef5-467e-a73c-34370772e5d6';
const apiSecret = 'DOWZTf9mJ2rBATmtlcQbxltgnKEL8T82';
const host = 'api.bitcashier.io';
const httpServerUrl = 'https://' + host;
const path = '/v1/orders';
const nonce = Date.now().toString();
const hmacInput = 'GET' + path + '' + nonce;

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

async function getOrders() {
  const from = Date.now().toString();
  const to = Date.now().toString();

  const queryParams = {
    id: '1b398df9-7ce1-4678-82ac-f35068017dcf',
    minPrimaryAmount: 1,
    maxPrimaryAmount: 1000,
    minSecondaryAmount: 1,
    maxSecondaryAmount: 1000,
    primaryAsset: 'USD',
    secondaryAsset: 'ETH',
    operationType: 'SELL',
    timeFrom: from,
    timeTo: to,
    limit: 100,
    offset: 0,
    orderType: 'MARKET',
    externalId: 'Congra',
};

const options = {
    headers: headers,
    queryParams: queryParams,
  };

  try {
    const response = await axios.get(httpServerUrl + path, options);
    console.log("data after axios call" + JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error('Error fetching orders:', error.response.data);
    throw error;
  }
}

async function fillOrderDetails(order) {
  return order;
}

async function processOrders() {
  try { 
   const orders = await getOrders();
      const filledOrder = await fillOrderDetails(orders);
      console.log('Filled Order:', filledOrder);    
  } catch (error) {
    console.error('Error processing orders:', error);
  }
}

processOrders();

module.exports = processOrders;