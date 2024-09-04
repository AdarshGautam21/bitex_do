const keyPairs = require('ripple-keypairs');
const { RippleAPI } = require('ripple-lib');
const { v4: uuid } = require('uuid');

const api = new RippleAPI({
//   server: 'wss://s.altnet.rippletest.net:51233',
  server: 'wss://s1.ripple.com'
  // this is the public mainnet server
});

const XrpWallet = require('../models/xrp/XrpWallet');
const WithdrawXrpWallet = require('../models/xrp/WithdrawXrpWallet');
const WalletTransactions = require('../models/wallet/WalletTransactions');
const isEmpty = require('../validation/isEmpty');

const createWallet = async () => {
	try {
	    await api.connect();
	    const addressInfo = api.generateAddress();
	    const keyPair = keyPairs.deriveKeypair(addressInfo.secret);
	    const clientId = uuid();
	    const document = {
	      ...keyPair,
	      clientId: clientId,
	      secret: addressInfo.secret,
		  address: addressInfo.address,
		  lastDestinationTag: 10000001,
	    };

	    const xrpWallet = XrpWallet(document);
	    xrpWallet.save()
	    	.then((err, xrpWallet) => {
	    		if(err) {
	    			return false
	    		}
	    		return xprWallet;
	    	});
	  } catch (err) {
	  	return false;
	  }
}

const createWithdrawWallet = async () => {
	try {
	    await api.connect();
		// console.log(api.generateAddress());
		const addressInfo = api.generateAddress();
	    const keyPair = keyPairs.deriveKeypair(addressInfo.secret);
	    const clientId = uuid();
	    const document = {
	      ...keyPair,
	      clientId: clientId,
	      secret: addressInfo.secret,
		  address: addressInfo.address,
		  lastDestinationTag: 10000001,
	    };

	    const withdrawXrpWallet = WithdrawXrpWallet(document);
	    return withdrawXrpWallet.save()
	    	.then((err, withdrawXrpWallet) => {
	    		if(err) {
					// console.log(err);
	    			return false
	    		}
	    		return withdrawXrpWallet;
	    	});
	  } catch (err) {
		// console.log(err);
	  	return false;
	  }
}

const withdrawBalance = async (clientId) => {

	if (!clientId) {
		return { error: 'No clientId sent' };
	}

	try {
		const xrpWallet = await WithdrawXrpWallet.findOne({ clientId: clientId });

		if(xrpWallet) {
			await api.connect();
			const balances = await api.getBalances('rnb8V1qDZy2t6johDy6CQ2Rk4pELdqCXRS');
			return { ...balances[0] }
		} else {
			let error = {
		  		error: 'Wallet not found'
		  	}
		  	return error;
		}

	} catch (err) {
		// console.log(err);
		let error = {
	  		error: 'Unable to find balance'
	  	}
	  	return error;
	}
}

const createUserWallet = async () => {
	try {
		const xrpWallet = await XrpWallet.find()
			.then(async xrpWallets => {
				if(xrpWallets.length > 0) {
					let lastDestinationTag = (xrpWallets[0].lastDestinationTag + 1);
					xrpWallets[0].lastDestinationTag = lastDestinationTag;
					await xrpWallets[0].save();

					return xrpWallets[0];
				} else {
					return false;
				}
			})
			.catch(err => {
				return false;
			});
		if (xrpWallet) {
			return xrpWallet;
		} else {
			return false;
		}
	} catch (err) {
		// console.log(err);
		return false;
	}
}

const internalDepositToWithdrawSend = async (toAddress, amount) => {
	const xrpWallet = await XrpWallet.find();

  	const senderAddress = xrpWallet[0].address;
	const accountSecret = xrpWallet[0].secret;

	try {
		await api.connect();
		const trans = await api.preparePayment(senderAddress, {
			source: {
				address: senderAddress,
				maxAmount: {
					value: `${amount}`,
					currency: 'XRP',
				},
			},
			destination: {
				address: toAddress,
				amount: {
					value: `${amount}`,
					currency: 'XRP',
				},
			},
		});
		const signedTrans = await api.sign(trans.txJSON, accountSecret);
		const signedTransSecond = await api.submit(signedTrans.signedTransaction);
		await api.disconnect();

		if (signedTransSecond.engine_result === 'tesSUCCESS') {
			return {
				transfer: {
					txid: signedTransSecond.tx_json.hash,
					fee: parseFloat(signedTransSecond.tx_json.Fee) / 1000000,
					state: 'signed',
				}
			}
		} else {
			return { error: "Error sending, please try again" };
		}
	} catch (err) {
		// console.log(err);
		let error = {
			error: 'Unable to send transaction'
		}
		return error;
	}
}

const sendPartially = async (clientId, recipientAddress, amount, destinationTag, usdAmount) => {

  if (!clientId || !recipientAddress || !amount) {
    return { error: 'Invalid/incomplete data sent' };
  }

  const xrpWallet = await WithdrawXrpWallet.find();

  if(xrpWallet) {
	// const userTag = parseInt(xrpWallet[0].lastDestinationTag);
  	// const senderAddress = xrpWallet[0].address;
	// const accountSecret = xrpWallet[0].secret;

	// const senderAddress = 'rNRQ9HrhSwYEDZtxBGnhiY7D4P8yTMThzQ';
	// const accountSecret = 'ssvwYa55EQXT9ic8ZaS9o8zToKrKu';
	const senderAddress = 'rGozSFbsV3S7Ng2vNxEjFYkXs4EPnb6Er6';
	const accountSecret = 'shTQAg8Yd5trTFbaHZeQp46vyQf6B';

	let destination = {
		address: recipientAddress,
		amount: {
			value: `${amount}`,
			currency: 'XRP',
		},
	};

	if (!isEmpty(destinationTag)) {
		destination = {
			address: recipientAddress,
			tag: parseInt(destinationTag),
			amount: {
				value: `${amount}`,
				currency: 'XRP',
			},
		};
	}

	try {
		await api.connect();
		const trans = await api.preparePayment(senderAddress, {
			source: {
				address: senderAddress,
				// tag: userTag,
				maxAmount: {
					value: `0.0008`,
					currency: 'USD',
					counterparty: 'rvYAfWj5gh67oV6fW32ZzP3Aw4Eubs59B',
				},
			},
			destination: destination,
			allowPartialPayment: true,
		});
		const signedTrans = await api.sign(trans.txJSON, accountSecret);
		const signedTransSecond = await api.submit(signedTrans.signedTransaction);
		await api.disconnect();

		// console.log(signedTransSecond);

		if (signedTransSecond.engine_result === 'tesSUCCESS') {
			return {
				transfer: {
					txid: signedTransSecond.tx_json.hash,
					fee: parseFloat(signedTransSecond.tx_json.Fee) / 1000000,
					state: 'signed',
				}
			}
		} else {
			return { error: "Error sending, please try again" };
		}
	} catch (err) {
		// console.log(err);
		let error = {
			error: 'Unable to send transaction'
		}
		return error;
	}
  } else {
	// console.log(err);
  	let error = {
  		error: 'Wallet not found'
  	}
  	return error;
  }
}

const send = async (clientId, recipientAddress, amount, destinationTag) => {

  if (!clientId || !recipientAddress || !amount) {
    return { error: 'Invalid/incomplete data sent' };
  }

  const xrpWallet = await WithdrawXrpWallet.find();

  if(xrpWallet) {
	// const userTag = parseInt(xrpWallet[0].lastDestinationTag);
  	const senderAddress = xrpWallet[0].address;
	const accountSecret = xrpWallet[0].secret;

	let destination = {
		address: recipientAddress,
		amount: {
			value: `${amount}`,
			currency: 'XRP',
		},
	};

	if (!isEmpty(destinationTag)) {
		destination = {
			address: recipientAddress,
			tag: parseInt(destinationTag),
			amount: {
				value: `${amount}`,
				currency: 'XRP',
			},
		};
	}

	try {
		await api.connect();
		const trans = await api.preparePayment(senderAddress, {
			source: {
				address: senderAddress,
				// tag: userTag,
				maxAmount: {
					value: `${amount}`,
					currency: 'XRP',
				},
			},
			destination: destination,
		});
		const signedTrans = await api.sign(trans.txJSON, accountSecret);
		const signedTransSecond = await api.submit(signedTrans.signedTransaction);
		await api.disconnect();

		if (signedTransSecond.engine_result === 'tesSUCCESS') {
			return {
				transfer: {
					txid: signedTransSecond.tx_json.hash,
					fee: parseFloat(signedTransSecond.tx_json.Fee) / 1000000,
					state: 'signed',
				}
			}
		} else {
			return { error: "Error sending, please try again" };
		}
	} catch (err) {
		// console.log(err);
		let error = {
			error: 'Unable to send transaction'
		}
		return error;
	}
  } else {
	// console.log(err);
  	let error = {
  		error: 'Wallet not found'
  	}
  	return error;
  }
}


const xrpSend = async (xrpWallet, recipientAddress, amount, destinationTag) => {

	if (!recipientAddress || !amount) {
	  return { error: 'Invalid/incomplete data sent' };
	}

	if(xrpWallet) {
	  // const userTag = parseInt(xrpWallet[0].lastDestinationTag);
		const senderAddress = xrpWallet.address;
	  	const accountSecret = xrpWallet.secret;

	  let destination = {
		  address: recipientAddress,
		  amount: {
			  value: `${amount}`,
			  currency: 'XRP',
		  },
	  };

	  if (!isEmpty(destinationTag)) {
		  destination = {
			  address: recipientAddress,
			  tag: parseInt(destinationTag),
			  amount: {
				  value: `${amount}`,
				  currency: 'XRP',
			  },
		  };
	  }
  
	  try {
		  await api.connect();
		  const trans = await api.preparePayment(senderAddress, {
			  source: {
				  address: senderAddress,
				  // tag: userTag,
				  maxAmount: {
					  value: `${amount}`,
					  currency: 'XRP',
				  },
			  },
			  destination: destination,
		  });
		  const signedTrans = await api.sign(trans.txJSON, accountSecret);
		  const signedTransSecond = await api.submit(signedTrans.signedTransaction);
		  await api.disconnect();
  
		  if (signedTransSecond.engine_result === 'tesSUCCESS') {
			  return {
				  transfer: {
					  txid: signedTransSecond.tx_json.hash,
					  fee: parseFloat(signedTransSecond.tx_json.Fee) / 1000000,
					  state: 'signed',
				  }
			  }
		  } else {
			//   console.log(signedTransSecond);
			  return { error: "Error sending, please try again" };
		  }
	  } catch (err) {
		  let error = {
			  error: 'Unable to send transaction'
		  }
		  return error;
	  }
	} else {
	//   console.log(err);
		let error = {
			error: 'Wallet not found'
		}
		return error;
	}
}

const xrpBalance = async (xrpWallet) => {

	if (!xrpWallet) {
		return { error: 'No clientId sent' };
	}

	try {
		// const xrpWallet = await XrpWallet.findOne({ clientId: clientId });

		if(xrpWallet) {
			await api.connect();
			const balances = await api.getBalances(xrpWallet.address);
			return { ...balances[0] }
		} else {
			let error = {
		  		error: 'Wallet not found'
		  	}
		  	return error;
		}

	} catch (err) {
		// console.log(err.data.error_message);
		let error = {
	  		error: 'Unable to find balance'
	  	}
	  	return error;
	}
}

const balance = async (clientId) => {

	if (!clientId) {
		return { error: 'No clientId sent' };
	}

	try {
		const xrpWallet = await XrpWallet.findOne({ clientId: clientId });

		if(xrpWallet) {
			await api.connect();
			const balances = await api.getBalances(xrpWallet.address);
			return { ...balances[0] }
		} else {
			let error = {
		  		error: 'Wallet not found'
		  	}
		  	return error;
		}

	} catch (err) {
		let error = {
	  		error: 'Unable to find balance'
	  	}
	  	return error;
	}
}

const address = async (clientId) => {

	if (!clientId) {
		let error = {
	  		error: 'No clientId sent'
	  	}
	  	return error;
	}

	try {
		const xrpWallet = await XrpWallet.findOne({ clientId: clientId });

		if(xrpWallet) {
			return { address: userAccount.address };
		} else {
			let error = {
		  		error: 'Wallet not found'
		  	}
		  	return error;
		}
	} catch (err) {
		let error = {
	  		error: 'Unable to find address'
	  	}
	  	return error;
	}
}

const transactions = async (clientId) => {

  if (!clientId) {
  	let error = {
  		error: 'No clientId sent'
  	}
  	return error;
  }

  try {
  	const xrpWallet = XrpWallet.findOne({ clientId: clientId });

	if(xrpWallet) {

		await api.connect();
	    const serverInfo = await api.getServerInfo();
	    const ledgers = serverInfo.completeLedgers;
	    const [minLedgerVersion, maxLedgerVersion] = ledgers.split('-');
	    const transactions = await api.getTransactions(xrpWallet.address, {
	      minLedgerVersion: parseInt(minLedgerVersion, 10),
	      maxLedgerVersion: parseInt(maxLedgerVersion, 10),
	    });

	    return transactions;
	} else {
		let error = {
	  		error: 'Wallet not found'
	  	}
	  	return error;
	}
  } catch (err) {
  	let error = {
  		error: 'Unable to find transactions'
  	}
  	return error;
  }
}

module.exports = {
	createWallet,
	createUserWallet,
	send,
	internalDepositToWithdrawSend,
	balance,
	address,
	transactions,
	createWithdrawWallet,
	withdrawBalance,
	xrpBalance,
	xrpSend,
	sendPartially,
};
