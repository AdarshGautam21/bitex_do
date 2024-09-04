const keyPairs = require('ripple-keypairs');
const { RippleAPI } = require('ripple-lib');
const express = require('express');
const { v4: uuid } = require('uuid');

const route = express.Router();
const api = new RippleAPI({
  server: 'wss://s.altnet.rippletest.net:51233',
  // server: 'wss://s1.ripple.com',
  // this is the public mainnet server
});

let db;

const mongodb = require('./db');
mongodb.connectToServer(err => {
	db = mongodb.getDb();
});

route.post('/create', async (req, res) => {
  try {
    await api.connect();
    const addressInfo = api.generateAddress();
    const keyPair = keyPairs.deriveKeypair(addressInfo.secret);
    const clientId = uuid();
    const document = {
      ...keyPair,
      clientId,
      secret: addressInfo.secret,
      address: addressInfo.address,
    };

    await db
      .db()
      .collection('users')
      .insertOne(document);
    res.status(200).send({ clientId });
  } catch (err) {
  	// console.log(err);
    res.status(400).send({ error: 'Error in creating account keypair' });
  }
});

route.post('/send', async (req, res) => {
  const { clientId, recipientAddress, amount } = req.body;

  if (!clientId || !recipientAddress || !amount) {
    res.status(400).send({ error: 'Invalid/incomplete data sent' });
    return;
  }

  const [userAccount] = await db
    .db()
    .collection('users')
    .find({ clientId })
    .toArray();

  const { address: senderAddress, secret: accountSecret } = userAccount;

  try {
    await api.connect();
    const trans = await api.preparePayment(senderAddress, {
      source: {
        address: senderAddress,
        maxAmount: {
          value: amount,
          currency: 'XRP',
        },
      },
      destination: {
        address: recipientAddress,
        amount: {
          value: amount,
          currency: 'XRP',
        },
      },
    });
    const signedTrans = await api.sign(trans.txJSON, accountSecret);
    const signedTransSecond = await api.submit(signedTrans.signedTransaction);
    await api.disconnect();
    await db
      .db()
      .collection('transactions')
      .insertOne({ ...signedTransSecond, clientId });
    res.status(200).send(signedTransSecond);
  } catch (err) {
    res.status(400).send({ error: 'Unable to send transaction' });
  }
});

route.get('/balance/:clientId', async (req, res) => {
  const { clientId } = req.params;

  if (!clientId) {
    res.status(400).send({ error: 'No clientId sent' });
  }

  try {
    const [userAccount] = await db
      .db()
      .collection('users')
      .find({ clientId })
      .toArray();

    await api.connect();
    // console.log(userAccount);
    const balances = await api.getBalances(userAccount.address);
    res.status(200).send({ ...balances[0], clientId });
  } catch (err) {
  	// console.log(err);
    res.status(400).send({ error: 'Unable to find balance' });
  }
});

route.get('/address/:clientId', async (req, res) => {
  const { clientId } = req.params;

  if (!clientId) {
    res.status(400).send({ error: 'No clientId sent' });
  }

  try {
    const [userAccount] = await db
      .db()
      .collection('users')
      .find({ clientId })
      .toArray();

    res.status(200).send({ address: userAccount.address });
  } catch (err) {
    res.status(400).send({ error: 'Unable to find address' });
  }
});

route.get('/transactions/:clientId', async (req, res) => {
  const { clientId } = req.params;

  if (!clientId) {
    res.status(400).send({ error: 'No clientId sent' });
  }

  try {
    const [userAccount] = await db
      .db()
      .collection('users')
      .find({ clientId })
      .toArray();
    await api.connect();
    const serverInfo = await api.getServerInfo();
    const ledgers = serverInfo.completeLedgers;
    const [minLedgerVersion, maxLedgerVersion] = ledgers.split('-');
    const transactions = await api.getTransactions(userAccount.address, {
      minLedgerVersion: parseInt(minLedgerVersion, 10),
      maxLedgerVersion: parseInt(maxLedgerVersion, 10),
    });
    res.status(200).send({ transactions });
  } catch (err) {
    res.status(400).send({ error: 'Unable to find transactions' });
  }
});

module.exports = route;
