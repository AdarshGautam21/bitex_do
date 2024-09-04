const express = require('express');
const router = express.Router();

const eth = require('./eth/eth.js');
const addressService = require('./eth/services/address.service');
const EthAdminWallet = require('../models/eth/EthAdminWallet');

const CONTRACT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7';

const createWallet = async () => {
	// console.log('Creating usdt wallet....');
	return await eth.newAccount().then(async function(value) {
		// console.log(value);
		var data = {};
		data.address = value.address;
		data.privateKey = value.privateKey;
		return await addressService.create(data).then(result => {
			return result;
		}).catch(err => {
			// console.log(err);
			return false;
		});
	}, function(err) {
		// console.log(err);
		return false;
	});
}

const createAdminWallet = async () => {
	// console.log('Creating usdt admin wallet....');
	return await eth.newAccount().then(async function(value) {
		var data = {};
		data.address = value.address;
		data.privateKey = value.privateKey;
		return await addressService.create(data).then(result => {
			const ethAdminWallet = new EthAdminWallet;
			ethAdminWallet.clientId = result._id;
			ethAdminWallet.privateKey = data.privateKey;
			ethAdminWallet.address =  result.address;
			ethAdminWallet.live = true;
			ethAdminWallet.save();

			return ethAdminWallet;
		}).catch(err => {
			// console.log(err);
			return false;
		});
	}, function(err) {
		// console.log(err);
		return false;
	});
}

const createAddress = async (ethId) => {
  return await addressService.getAddressbyID(ethId).then(result=> {
  	return result.address;
  }).catch(err => {
  	return false;
  });
}

const balance = async (ethId, contract=CONTRACT_ADDRESS) => {
	return addressService.getAddressbyID(ethId).then(async result=> {
		if (!contract) {
			return await eth.getBalance(result.address).then(async function(value) {
				return value;
			}, function(error) {
				return false;
			});
		} else {
			console.log("USDTT");
		  return await eth.getTokenBalance(result.address, contract).then(async function(value) {
			console.log(value);
		    return value;
		  }, function(error) {
			console.log(error);
		    return false;
		  })
		}
	}).catch(err => {
		// console.log(err);
		return false;
	});
}

const adminBalance = async (contract=CONTRACT_ADDRESS) => {
	const ethAdminWallet = await EthAdminWallet.find();
	return addressService.getAddressbyID(ethAdminWallet[0].clientId).then(async result=> {
		if (!contract) {
		  return await eth.getBalance(result.address).then(async function(value) {
		  	return value;
		  }, function(error) {
		    return false;
		  });
		} else {
		  return await eth.getTokenBalance(result.address, contract).then(async function(value) {
		    return value;
		  }, function(error) {
		    return false;
		  })
		}
	}).catch(err => {
		return false;
	});
}

const transactions = async (ethId, contract=CONTRACT_ADDRESS) => {
	return await addressService.getAddressbyID(ethId).then(async result => {
		if (!contract) {
		  return await eth.listTransactionsByAddress(result.address).then(async function(value) {
		  	return await value;
		  }, function(error) {
		  	return false;
		  })
		} else {
		  return await eth.listTokenTransactionsByAddress(result.address, contract).then(async value => {
		  	return await value;
		  }).catch(err => {
		  	return false;
		  });
		}
	}).catch(err => {
		// console.log(err);
		return false;
	});
}

const send = async (from, to, amount, contract=CONTRACT_ADDRESS) => {
	return addressService.getAddressbyID(from).then(async result1 => {
		let fromAddress = result1.address;
		let privateKey = result1.privateKey;
		if (!contract) {
			return await eth.transfer(privateKey, fromAddress, to, amount).then(async value => {
				return await value;
			}).catch(error => {
				// console.log(error);
				return false;
			})
		} else {
			// console.log(from, to, amount, contract, 'USDT Send');
			return await eth.transferToken(privateKey, fromAddress, to, amount, contract).then(async value => {
				return await value;
			}).catch(error => {
				// console.log(error);
				return false;
			})
		}
		// return await addressService.getAddressbyID(to).then(async result2 => {
		//   let toAddress = result2.address;

		// }).catch(err => {
		// 	console.log(err);
		//   return false;
		// })
	})
}

const sendAll = async (from, amount, contract=CONTRACT_ADDRESS) => {
	return await addressService.getAddressbyID(from).then(async result1 => {
		let fromAddress = result1.address;
		let privateKey = result1.privateKey;

		const ethAdminWallet = await EthAdminWallet.find();
		return await addressService.getAddressbyID(ethAdminWallet[0].clientId).then(async result2 => {
		  let toAddress = result2.address;
		  if (!contract) {
		    return await eth.transfer(privateKey, fromAddress, toAddress, amount).then(async value => {
		    	return await value;
		    }).catch(error => {
		    	return false;
		    })
		  } else {
		    return await eth.transferToken(privateKey, fromAddress, toAddress, amount, contract).then(async value => {
		      return await value;
		    }).catch(error => {
		      return false;
		    })
		  }
		}).catch(err => {
			// console.log(err);
		  return false;
		})
	})
}

const sendFromAdmin = async (to, amount, contract=CONTRACT_ADDRESS) => {
	const ethAdminWallet = await EthAdminWallet.find();

	console.log(ethAdminWallet);

	return await addressService.getAddressbyID(ethAdminWallet[0].clientId).then(async result1 => {
		let fromAddress = result1.address;
		let privateKey = result1.privateKey;

		if (!contract) {
		    return await eth.transfer(privateKey, fromAddress, to, amount).then(async value => {
		    	return await value;
		    }).catch(error => {
		    	return false;
		    })
		  } else {
			console.log(privateKey);
		    return await eth.transferUsdt(privateKey, fromAddress, to, amount, contract).then(async value => {
				console.log(value);
		      return await value;
		    }).catch(error => {
				console.log(error);
		      return false;
		    })
		  }
	})
}

const getTransactionsByAddress = async (address) => {
	return eth.listTokenTransactionsByAddress(address)
		.then(value => {
			return value;
		}).catch(error => {
			return false;
		})
}

const getTokenTransactionsByAddress = async (address) => {
	return eth.listTokenTransactionsByAddress(address)
		.then(value => {
			return value;
		}).catch(error => {
			return false;
		})
}

module.exports = {
	createWallet,
	createAddress,
	balance,
	transactions,
	send,
	createAdminWallet,
	sendAll,
	sendFromAdmin,
	adminBalance,
	getTransactionsByAddress,
	getTokenTransactionsByAddress,
};