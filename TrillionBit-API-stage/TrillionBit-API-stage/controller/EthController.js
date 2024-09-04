const express = require('express');
const router = express.Router();
const axios = require('axios');

const eth = require('./eth/eth.js');
const addressService = require('./eth/services/address.service');
const EthAdminWallet = require('../models/eth/EthAdminWallet');

const keys = require('../config/key');

const createWallet = async () => {
	// console.log('Creating eth wallet....');
	return await eth.newAccount().then(async function(value) {
		console.log(value);
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
	// console.log('Creating eth admin wallet....');
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

const balance = async (ethId, contract=false) => {
	return addressService.getAddressbyID(ethId).then(async result=> {
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
			// console.log(error);
		    return false;
		  })
		}
	}).catch(err => {
		// console.log(err);
		return false;
	});
}

const adminBalance = async (contract=false) => {
	const ethAdminWallet = await EthAdminWallet.find();
	return addressService.getAddressbyID(ethAdminWallet[0].clientId).then(async result=> {
		if (!contract) {
			const balRes = await axios.get(`https://api.etherscan.io/api?module=account&action=balance&address=0x48aeb90fe0a82952ff74c5abe10345c46640ab81&tag=latest&apikey=${keys.etherScanKey}`);
			if (balRes.data.status === '1') {
				return parseFloat(balRes.data.result)/1e18;
			} else {
				return false;
			}
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

const adminUsdtBalance = async (contract=false) => {
	const ethAdminWallet = await EthAdminWallet.find();
	return addressService.getAddressbyID(ethAdminWallet[0].clientId).then(async result=> {
		if (!contract) {
			const balRes = await axios.get(`https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=0xdAC17F958D2ee523a2206206994597C13D831ec7&address=0xaB36D95C833A769810Ac8eB114aC671C5365026f&tag=latest&apikey=${keys.etherScanKey}`);
			if (balRes.data.status === '1') {
				return `${parseFloat(balRes.data.result)/1e6}`;
			} else {
				return false;
			}
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

const transactions = async (ethId, contract=false) => {
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

const sendBtx = async (privateKey, from, to, amount, contract) => {
	return await eth.transferBtx(privateKey, from, to, amount, contract).then(value => {
		return value;
	}).catch(error => {
		return false;
	})
}

const send = async (from, to, amount, contract=false) => {
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
			// console.log(from, to, amount, contract, 'BTX Send');
			return await eth.transferToken(privateKey, fromAddress, to, amount, contract).then(async value => {
				return await value;
			}).catch(error => {
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

const sendAll = async (from, amount, contract=false) => {
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

const sendFromAdmin = async (to, amount, contract=false) => {
	const ethAdminWallet = await EthAdminWallet.find();

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
		    return await eth.transferToken(privateKey, fromAddress, to, amount, contract).then(async value => {
		      return await value;
		    }).catch(error => {
		      return false;
		    })
		  }
	})
}

const getTransactionsByAddress = async (address) => {
	return eth.listTransactionsByAddress(address)
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
	sendBtx,
	createAdminWallet,
	sendAll,
	sendFromAdmin,
	adminBalance,
	adminUsdtBalance,
	getTransactionsByAddress,
	getTokenTransactionsByAddress,
};