var Q = require('q');
var request = require("request");
var _ = require('lodash');
var Web3 = require('web3');
const { hash } = require('bcrypt');
var web3 = new Web3();
var Tx = require('ethereumjs-tx').Transaction;

const GAS_PRICE = 100000000;
const GAS_LIMIT = 800000;

// import smart contracts
// web3.setProvider(new web3.providers.HttpProvider(config.nodeServer.eth));
// web3.setProvider(new web3.providers.HttpProvider("https://mainnet.infura.io/swptqj6853hAYSLLRyPz"));
web3.setProvider(new web3.providers.HttpProvider("https://mainnet.infura.io/v3/88bfbbd123a24f5ca1121a6a7552eca9"));
// web3.setProvider(new web3.providers.HttpProvider("https://sleek-divine-glitter.discover.quiknode.pro/e4baad99e19b1c6f17bea2225712ff40538dd8c2/"));
// web3.setProvider(new web3.providers.HttpProvider("http://localhost:8545"));

// web3.eth.extend({
//   property: 'txpool',
//   methods: [{
//     name: 'content',
//     call: 'txpool_content'
//   },{
//     name: 'inspect',
//     call: 'txpool_inspect'
//   },{
//     name: 'status',
//     call: 'txpool_status'
//   }]
// });

var service = {};
service.newAccount = newAccount;
service.getBalance = getBalance;
service.transfer = transfer;
service.transferBtx = transferBtx;
service.listTransactionsByAddress = listTransactionsByAddress;
service.listTokenTransactionsByAddress = listTokenTransactionsByAddress;
service.getTokenBalance = getTokenBalance;
service.transferToken = transferToken;
service.transferUsdt = transferUsdt;

module.exports = service;


function newAccount() {
	let deferred = Q.defer();
	deferred.resolve(web3.eth.accounts.create());
    return deferred.promise;
}

function getFee(coin_type, amount) {
	let fee = (GAS_PRICE * GAS_LIMIT).toString();
	return web3.utils.fromWei(fee);
	// let deferred = Q.defer();
	// let fee = 0;
	// try {
	// 	fee = (GAS_PRICE * GAS_LIMIT /1e3).toFixed(9);
	// 	deferred.resolve(fee);
	// 	// web3.eth.getGasPrice().then(function(gasPrice) {
	// 	// 	if (coin_type == 'eth') {
	// 	// 		web3.eth.estimateGas({}).then(function(gasEstimate) {
	// 	// 			fee = (parseFloat(gasPrice) * parseFloat(gasEstimate) / 1e3).toFixed(9);
	// 	// 			deferred.resolve(fee);
	// 	// 		});
	// 	// 	} else { // For token, gasEstimate is 250K
	// 	// 		fee = (parseFloat(gasPrice) * 250000 / 1e3).toFixed(9);
	// 	// 		deferred.resolve(fee);
	// 	// 	}
	// 	// });

	// } catch(err) {
	// 	deferred.reject(err.message);
	// }
	// return deferred.promise;
}

function getBalance(address) {
	let deferred = Q.defer();
	if (!address) {
		deferred.reject('Invalid Address!');
	}
	try {
		web3.eth.getBalance(address).then(function(value) {
			deferred.resolve(web3.utils.fromWei(value.toString(), 'ether'));
	    }).catch(function(err) {
	    	deferred.reject(err.message);
	    });
	} catch(error) {
		deferred.reject(error.message);
	}
    return deferred.promise;
}

function transfer(pk, fromAddress, toAddress, p_amount) {
	let deferred = Q.defer();
	let tx_nonce = 0;

	try {
		let w_amount = web3.utils.toWei(p_amount.toString());
		getBalance(fromAddress).then(function(balance) {
			if (balance < p_amount) {
				throw {message: 'Insufficient funds!'};
			} else {
				return web3.eth.getTransactionCount(fromAddress);
			}
		}).then(function(nonce) {
			tx_nonce = nonce;
			return web3.eth.getGasPrice();
		}).then(function(estimated_gas_price) {
			let privateKey = new Buffer(pk.replace('0x',''),'hex');
			let rawTx = {
				nonce: tx_nonce,
				gasPrice: web3.utils.toBN(estimated_gas_price),
				gasLimit: web3.utils.toBN(GAS_LIMIT),
				to: toAddress,
				value: web3.utils.toBN(w_amount),
			};
			let tx = new Tx(rawTx);
			tx.sign(privateKey);

			let serializedTx = tx.serialize();

			let transaction = web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

			transaction.once('transactionHash', function(hash) {
				// deferred.resolve({txid: hash});
			});
			transaction.once('receipt', function(receipt){
				// console.log('work1')
				deferred.resolve({receipt: receipt});
			})
			transaction.once('error', function(err) {
				deferred.reject(err.message);
				// deferred.reject('Sorry, Ethereum network is busy now. Please try again in a few of minutes.');
			});
		}).catch(function(err) {
			deferred.reject(err.message);
		});
	} catch(error) {
		deferred.reject(error.message);
	}

	return deferred.promise;
}

function listTransactionsByAddress(addr) {
	let deferred = Q.defer();
	let return_txs = [];

	// if (pagenum === undefined) {
	// 	pagenum = 1;
	// }

	// if (limit === undefined) {
	// 	limit = 10;
	// }

	// let url = "https://api.etherscan.io/api?module=account&action=txlist&address=" + addr + "&startblock=0&endblock=99999999&page=" + pagenum + "&offset=" + limit + "&sort=desc&apikey=VG4EJ7WXR5P5SYPD5466QNRKEFV7T423WA"
	let url = "http://api.etherscan.io/api?module=account&action=txlist&address=" + addr + "&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=VG4EJ7WXR5P5SYPD5466QNRKEFV7T423WA"
	request({
		uri: url,
		method: "GET",
	}, function(error, response, body) {
		if (error) {
			deferred.reject('Error while getting the ETH transaction details by address');
		} else {
			let r_txs = [];
			if (body.length > 0) {
				r_txs = JSON.parse(body);
				if (Array.isArray(r_txs.result) && r_txs.result.length > 0) {
					_.each(r_txs.result, (tx) => {
						let amount = parseFloat(tx.value) / 1e18;
						let fee = parseFloat(tx.gasUsed) * parseFloat(tx.gasPrice) / 1e18;
						let sender_amount = amount + fee;
						if (tx.to.toLowerCase() == addr.toLowerCase()) {
							return_txs.push({
								txid: tx.hash,
								type: 'receive',
								time: tx.timeStamp,
								fee: fee,
								amount: amount,
								senderAddress: tx.from,
								receiverAddress: tx.to,
							});
						}
					});
				}
			}
			deferred.resolve(return_txs);
		}
	});
	return deferred.promise;
}

function listTokenTransactionsByAddress(address, contract_address) {
	let deferred = Q.defer();
	let return_txs = [];

	let url = "http://api.etherscan.io/api?module=account&action=tokentx&address=" + address + "&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=VG4EJ7WXR5P5SYPD5466QNRKEFV7T423WA"
	request({
		uri: url,
		method: "GET",
	}, function(error, response, body) {
		if (error) {
			deferred.reject('Error while getting the ETH transaction details by address');
		} else {
			let r_txs = [];
			if (body.length > 0) {
				r_txs = JSON.parse(body);
				if (Array.isArray(r_txs.result) && r_txs.result.length > 0) {
					_.each(r_txs.result, (tx) => {
						let tx_input = tx.input;
						let tx_method_id = tx_input.substring(0, 10);
						let tx_receiver = tx_input.substring(10, 74);
						let amount = tx.value / 1e18;

						// let r_address = address.substring(2)

						// if (tx.to.toLowerCase() == addr.toLowerCase()) {
						if (tx_receiver.toLowerCase().indexOf(address.substring(2).toLowerCase()) > -1) {
							return_txs.push({
								txid: tx.hash,
								tokenSymbol: tx.tokenSymbol,
								tokenDecimal: tx.tokenDecimal,
								type: 'send',
								time: tx.timeStamp,
								amount: amount,
								senderAddress: tx.from,
								receiverAddress: tx.to,
								contractAddress: tx.contractAddress
							});
						} else {
							return_txs.push({
								txid: tx.hash,
								tokenSymbol: tx.tokenSymbol,
								tokenDecimal: tx.tokenDecimal,
								type: 'receive',
								time: tx.timeStamp,
								amount: amount,
								senderAddress: tx.from,
								receiverAddress: tx.to,
								contractAddress: tx.contractAddress
							});
						}
					});
				}
			}
			deferred.resolve(return_txs);
		}
	});
	return deferred.promise;
}

function toHexString(byteArray) {
	return Array.from(byteArray, function(byte) {
	  return ('0' + (byte & 0xFF).toString(16)).slice(-2);
	}).join('')
}

function pad2(s) {
	var o = s.toFixed(0);
	while (o.length < 2) {
	  o = " " + o;
	}
	return o;
  }
  
  function pad(s) {
	var o = s.toFixed(18);
	while (o.length < 27) {
	  o = " " + o;
	}
	return o;
  }
  
  function padToken(s, decimals) {
	//   console.log(s, decimals);
	var o = s.toFixed(decimals);
	var l = parseInt(decimals)+12;
	while (o.length < l) {
	  o = " " + o;
	}
	return o;
  }

  var tokenFromBlock = 0;
  async function printTokenContractDetails(tokenContractAbi, tokenContractAddress) {
	// console.log("RESULT: tokenContractAddress=" + tokenContractAddress);
	if (tokenContractAddress != null && tokenContractAbi != null) {
	  var contract = new web3.eth.Contract(tokenContractAbi, tokenContractAddress);
	  var decimals = await contract.methods.decimals().call();
	//   console.log("RESULT: token.owner=" + await contract.methods.owner().call());
	//   console.log("RESULT: token.newOwner=" + await contract.methods.newOwner().call());
	//   console.log("RESULT: token.symbol=" + await contract.methods.symbol().call());
	//   console.log("RESULT: token.name=" + await contract.methods.name().call());
	//   console.log("RESULT: token.decimals=" + decimals);
	//   console.log("RESULT: token.totalSupply=" + await contract.methods.totalSupply().call());
	//   console.log("RESULT: token.transferable=" + await contract.methods.transferable().call());
	//   console.log("RESULT: token.mintable=" + await contract.methods.mintable().call());
	//   console.log("RESULT: token.minter=" + await contract.methods.minter().call());
	}
  }

async function printBalances(bttsTokenFactoryAbi, contractAddress, accounts) {
	var token = contractAddress == null || bttsTokenFactoryAbi == null ? null : new web3.eth.Contract(bttsTokenFactoryAbi, contractAddress);
	var decimals = token == null ? 18 : await token.methods.decimals().call();
	var i = 0;
	var totalTokenBalance = new web3.utils.BN(0);
	// console.log("RESULT:  # Account                                             EtherBalanceChange                          Token Name");
	// console.log("RESULT: -- ------------------------------------------ --------------------------- ------------------------------ ---------------------------");
	accounts.forEach(async function(e) {
		let baseBlock = await web3.eth.getBlockNumber();
	  var etherBalanceBaseBlock = web3.eth.getBalance(e.address, baseBlock);
	  var etherBalance = web3.utils.fromWei(web3.eth.getBalance(e.address), "ether");
	  var tokenBalance = token == null ? new web3.utils.BN(0) : await token.methods.balanceOf(e.address).call();
	  totalTokenBalance = totalTokenBalance.add(tokenBalance);
	//   console.log("RESULT: " + i + " " + e.address  + " " + etherBalance + " " + tokenBalance + " " + decimals + " ");
	  i++;
	});
	// console.log("RESULT: -- ------------------------------------------ --------------------------- ------------------------------ ---------------------------");
	// console.log("RESULT:                                                                           " + totalTokenBalance + " " + decimals + " Total Token Balances");
	// console.log("RESULT: -- ------------------------------------------ --------------------------- ------------------------------ ---------------------------");
	// console.log("RESULT: ");
  }


function getTokenBalance(address, contractAddress) {

	// web3.eth.txpool.status().then(status => {
	// 	console.log('status');
	// 	console.log(status);
	// }).catch(err => {
	// 	console.log('error');
	// 	console.log(err);
	// });

	let deferred = Q.defer();
	if (!address) {
		deferred.reject('Invalid Address!');
	}
	let tokenContract = null;
	let tokenDecimals = 0;
	try {
		_getABI(contractAddress).then(function(contractABI) {
			var bttsTokenFactoryAbi=[{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"}],"name":"signedApproveAndCallHash","outputs":[{"name":"hash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"name","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"minter","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"}],"name":"approve","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"spender","type":"address"}],"name":"nextNonce","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"}],"name":"signedApproveHash","outputs":[{"name":"hash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"totalSupply","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"spender","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"}],"name":"signedTransferFromHash","outputs":[{"name":"hash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"signedApproveAndCallSig","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"decimals","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"sig","type":"bytes"},{"name":"feeAccount","type":"address"}],"name":"signedTransferFrom","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"mintable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"accountLocked","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"signedTransferSig","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"balanceOf","outputs":[{"name":"balance","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"sig","type":"bytes"},{"name":"feeAccount","type":"address"}],"name":"signedTransfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"acceptOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"sig","type":"bytes"},{"name":"feeAccount","type":"address"}],"name":"signedTransferCheck","outputs":[{"name":"result","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"disableMinting","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnershipImmediately","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"bttsVersion","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"owner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenOwner","type":"address"}],"name":"unlockAccount","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"transferable","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"symbol","outputs":[{"name":"","type":"string"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"sig","type":"bytes"},{"name":"feeAccount","type":"address"}],"name":"signedApproveAndCallCheck","outputs":[{"name":"result","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"}],"name":"signedTransferHash","outputs":[{"name":"hash","type":"bytes32"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"signedApproveSig","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"to","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transfer","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"enableTransfers","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"signedTransferFromSig","outputs":[{"name":"","type":"bytes4"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"sig","type":"bytes"},{"name":"feeAccount","type":"address"}],"name":"signedApproveCheck","outputs":[{"name":"result","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"_data","type":"bytes"}],"name":"approveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"tokens","type":"uint256"},{"name":"lockAccount","type":"bool"}],"name":"mint","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"newOwner","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenAddress","type":"address"},{"name":"tokens","type":"uint256"}],"name":"transferAnyERC20Token","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"}],"name":"allowance","outputs":[{"name":"remaining","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"signingPrefix","outputs":[{"name":"","type":"bytes"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"sig","type":"bytes"},{"name":"feeAccount","type":"address"}],"name":"signedApprove","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"tokenOwner","type":"address"},{"name":"spender","type":"address"},{"name":"tokens","type":"uint256"},{"name":"_data","type":"bytes"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"sig","type":"bytes"},{"name":"feeAccount","type":"address"}],"name":"signedApproveAndCall","outputs":[{"name":"success","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"_newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"spender","type":"address"},{"name":"from","type":"address"},{"name":"to","type":"address"},{"name":"tokens","type":"uint256"},{"name":"fee","type":"uint256"},{"name":"nonce","type":"uint256"},{"name":"sig","type":"bytes"},{"name":"feeAccount","type":"address"}],"name":"signedTransferFromCheck","outputs":[{"name":"result","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_minter","type":"address"}],"name":"setMinter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"owner","type":"address"},{"name":"symbol","type":"string"},{"name":"name","type":"string"},{"name":"decimals","type":"uint8"},{"name":"initialSupply","type":"uint256"},{"name":"mintable","type":"bool"},{"name":"transferable","type":"bool"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"}],"name":"MinterUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"},{"indexed":false,"name":"lockAccount","type":"bool"}],"name":"Mint","type":"event"},{"anonymous":false,"inputs":[],"name":"MintingDisabled","type":"event"},{"anonymous":false,"inputs":[],"name":"TransfersEnabled","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"}],"name":"AccountUnlocked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"from","type":"address"},{"indexed":true,"name":"to","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Transfer","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"tokenOwner","type":"address"},{"indexed":true,"name":"spender","type":"address"},{"indexed":false,"name":"tokens","type":"uint256"}],"name":"Approval","type":"event"}]
			tokenContract = new web3.eth.Contract(bttsTokenFactoryAbi, contractAddress);
			if (typeof tokenContract.methods.decimals == 'function') {
				return tokenContract.methods.decimals().call();
			} else {
				return 0;
			}
		}).then(function(decimals) {
			tokenDecimals = parseFloat(decimals);
			return tokenContract.methods.balanceOf(address).call();
		}).then(function(balance) {
			deferred.resolve((balance / Math.pow(10, tokenDecimals)).toFixed(0));
	    }).catch(function(err) {
	    	deferred.reject(err.message);
	    });
	} catch(error) {
		deferred.reject(error.message);
	}
    return deferred.promise;
}


function transferUsdtt(pk, fromAddress, toAddress, p_amount, contractAddress) {

	let deferred = Q.defer();
	let tx_nonce = 0;
	let tokenContract;

	try {
		_getABI(contractAddress).then(async function(contractABI) {
			const contract = new web3.eth.Contract(contractABI, contractAddress);
			const data = contract.methods.transfer(toAddress, parseInt(p_amount)).encodeABI();
			var count = await web3.eth.getTransactionCount(fromAddress) + 1;
			// let estimateGas = contract.transfer.estimateGas(toAddress, token_val, {from: my_account});

			const gasPrice = await web3.eth.getGasPrice();
			const gasLimit = 90000;
			// console.log(web3.utils.toBN(gasPrice));
			const rawTransaction = {
				'from': fromAddress,
				'nonce': web3.utils.toHex(web3.eth.getTransactionCount(fromAddress)),
				// 'gasPrice': web3.utils.toHex(3 * 1e9),
				// 'gasLimit': web3.utils.toHex(3000000),
				'gasPrice': 30000,
				'gasLimit': gasLimit,
				'to': contractAddress,
				'value': "0x0",
				'data': data,
				'chainId': 9559
			};

			// console.log(`Raw of Transaction: \n${JSON.stringify(rawTransaction, null, '\t')}\n------------------------`);

			const privKey = new Buffer.alloc(pk.replace('0x',''), 'hex');
			const tx = new Tx(rawTransaction);
			tx.sign(privKey);
			const serializedTx = tx.serialize();

			console.log(tx);

			// Comment out these four lines if you don't really want to send the TX right now
		    // console.log(`Attempting to send signed tx:  ${serializedTx.toString('hex')}\n------------------------`);
		    var receipt = await web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));

			console.log(receipt);
		    // The receipt info of transaction, Uncomment for debug
		    // console.log(`Receipt info: \n${JSON.stringify(receipt, null, '\t')}\n------------------------`);
		    
		    // The balance may not be updated yet, but let's check
		    balance = await contract.methods.balanceOf(fromAddress).call();
		    // console.log(`Balance after send: ${financialMfil(balance)} MFIL`);

		    deferred.resolve({'txid': receipt});



			// web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'), async function (err, hash) {
			// 	if (err) {
			// 		console.log(err);
			// 		deferred.reject({status: false});
			// 	}

			// 	console.log({'txid': hash});
			// 	// return {'txid': hash};
			// 	deferred.resolve({'txid': hash});
			// });
		});
	} catch(error) {
		// console.log(error.message);
		deferred.reject({status: false});
		// return {status: false};
	}
	return deferred.promise;
}

function transferUsdt(pk, fromAddress, toAddress, p_amount, contractAddress) {


	web3.eth.accounts.wallet.add(pk);
	var contractAbi =  web3.eth.contract(abi).at(contractAddress);
	var tokenAddress = contractAddress;
	var fromAddress = fromAddress;
	var tokenInst = new web3.eth.Contract(contractAbi,tokenAddress);
	console.log(contractAbi);
	tokenInst.methods.transfer(toAddress, p_amount).send({from: fromAddress, gas: 1000000},function (error, result){ //get callback from function which is your transaction key
		if(!error){
			console.log("MM");
			console.log(result);
			handleSuccessTrue();
		} else{
			console.log(error);
			web3.eth.getBalance(fromAddress, (err,bal) => { alert('Your account has ' + web3.utils.fromWei(bal, 'ether') + ', Insufficient funds for gas * price + value on your wallet')});
			handleSuccessFalse();
		}
	});
	//Finally, you can check if usdt tranaction success through this code.
	tokenInst.methods.balanceOf(receiver).call().then(console.log)
	.catch(console.error);
}

async function transferBtx(pk, fromAddress, toAddress, p_amount, contractAddress) {
	let deferred = Q.defer();

	try {
		var count = await web3.eth.getTransactionCount(fromAddress);
		const postData = {
			"nonce": count,
			"from": fromAddress,
			"to": toAddress,
			"contractAddress": contractAddress,
			"digits": 18,
			"fee": {
				"gasLimit": "60000",
				"gasPrice": "45"
			},
			"amount": p_amount.toString(),
			"fromPrivateKey": pk
		}
		// console.log(postData);
		request({
			uri: "https://api-eu1.tatum.io/v3/ethereum/erc20/transaction",
			method: "POST",
			headers: {
				'content-type': 'application/json',
				'x-api-key': '1b422742-3369-4d01-892c-a111b1378917',
			},
			body: JSON.stringify(postData)
		}, function(error, response, body) {
			if (error) {
				deferred.reject({status: false});
			} else {
				deferred.resolve({txid: JSON.parse(body).txId});
			}
		});
	} catch (e) {
		deferred.reject({status: false});
	}

	return deferred.promise;
}

function transferToken(pk, fromAddress, toAddress, p_amount, contractAddress) {
	let deferred = Q.defer();

	let tokenContract = null;
	// let tokenDecimals = 3;
	let tx_nonce = 0;
	let tx_gas_price = GAS_PRICE;
	let tx_data = null;

	try {
		_getABI(contractAddress).then(function(contractABI) {
			tokenContract = new web3.eth.Contract(contractABI, contractAddress);
			return getTokenBalance(fromAddress, contractAddress);
		}).then(function(tokenBalance) {
			// console.log(tokenBalance, p_amount, 'Send amount');
			if (parseFloat(tokenBalance) < p_amount) {
				throw {message: 'Insufficient funds for GCC!'};
			} else {
				if (typeof tokenContract.methods.decimals == 'function') {
					return tokenContract.methods.decimals().call();
				} else {
					return 0;
				}
			}
		}).then(function(decimals) {
			// console.log(`${decimals} total decimal`);
			// tokenDecimals = parseFloat(decimals);
			let amount = parseFloat(web3.utils.toWei(p_amount.toString())) * Math.pow(10, parseFloat(decimals)) / 1e0;
			amount = "0x" + amount.toString(16);
			// console.log(amount, 'Amount to send');
			tx_data = tokenContract.methods.transfer(toAddress, 3000).encodeABI();
			// console.log(tx_data);
			return web3.eth.getTransactionCount(fromAddress);
		}).then(function(estimated_gas_limit) {
			// console.log(tx_data, 'again');
			let rawTx = {
				nonce: web3.utils.toHex(web3.eth.getTransactionCount(fromAddress)),
				gasPrice: web3.utils.toBN(tx_gas_price),
				gasLimit: web3.utils.toBN(GAS_LIMIT),
				to: contractAddress,
				value: '0x0',
				data: tx_data
			};

			// console.log(rawTx, 'Row tx');

			let tx = new Tx(rawTx);
			let privateKey = new Buffer(pk.replace('0x',''),'hex');
			tx.sign(privateKey);

			let serializedTx = tx.serialize();

			// console.log(serializedTx, 'TX');

			let transaction = web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex'));
			// transaction.once('transactionHash', function(hash) {
			// 	deferred.resolve({txid: hash});
			// });
			transaction.once('receipt', function(receipt) {
				deferred.resolve({receipt: receipt});
			});
			transaction.once('error', function(err) {
				// console.log(err);
				deferred.reject(err.message);
				// deferred.reject('Sorry, Ethereum network is busy now. Please try again in a few of minutes.');
			});
		}).catch(function(err) {
			// if (err.message == 'Insufficient funds!') {
			// 	transferGasFee(fromAddress).then(result => {
			// 		transferToken(pk, fromAddress, toAddress, p_amount, contractAddress).then(result => {
			// 			deferred.resolve(result);
			// 		}).catch(error => {
			// 			console.log('error3')
			// 			console.log(error)
			// 			deferred.reject(error)});
			// 	}).catch(error => {
			// 		console.log("error 2")
			// 		console.log(error)
			// 	})
			// }
			// console.log(err);
			if (err.message) {
				deferred.reject(err.message);
			} else {
				deferred.reject(err);
			}
		});
	} catch(error) {
		// console.log(error);
		deferred.reject(error.message);
	}

	return deferred.promise;
}

function _getABI(contract_address) {
	let deferred = Q.defer();
	let url = "http://api.etherscan.io/api?module=contract&action=getabi&address=" + contract_address + "&apikey=C85X766E2AKN8R132QQC1QZCHQAB3GJD28";
	request({
		uri: url,
		method: "GET",
	}, function(error, response, body) {
		if (error) {
			deferred.reject({message: 'Error while getting the ABI'});
		} else {
			let contractABI = null;
			
			if (body.length > 0) {
				let json_body = JSON.parse(body);
				if (json_body.status == 0 && json_body.result == "Invalid Address format") {
					deferred.reject({message: 'Invalid contract address'});
				} else {
					contractABI = json_body.result;
					if (contractABI && contractABI != '') {
						deferred.resolve(JSON.parse(contractABI));
					} else {
						deferred.resolve(sERC20ABI);
					}
				}
			} else {
				deferred.reject({message: 'Returned Empty Contract ABI!'});
			}
			
		}
	});

	return deferred.promise;
}
