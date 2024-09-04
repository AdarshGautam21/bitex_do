// const noteRoutes = require('./note_routes');
// module.exports = function(app, db) {
//   noteRoutes(app, db);
// };

const express = require('express');
const router = express.Router();

const eth = require('../eth.js');
// const authService = require('../services/auth.service');
const addressService = require('../services/address.service');


/**
 * @route GET /test
 * @description Test route
 * @access Public
 */
router.get('/test', (req, res) => res.json({'msg': 'Auth works'}));


router.post('/wallet/create', (req, res) => {
	eth.newAccount().then(function(value) {
		var data = {};
		data.address = value.address;
		data.privateKey = value.privateKey;
		addressService.create(data).then(result=>{
			// console.log(result);
			res.send({status:true, data:{id:result.id}});
		}).catch(err => {
			res.send({status:false, message:err.message});
		});
	}, function(error) {
		res.send({status:false, message:error});
	});
});

/**
 * @route POST /wallet/get_address
 * @description get wallet address
 * @access Public
 */
router.post('/wallet/get_address', (req, res) => {
  let id = req.body.id;
  addressService.getAddressbyID(id).then(result=>{
  	res.send({address: result.address});
  }).catch(err => {
    res.send({status:false, message:err});
  });
});

/**
 * @route POST /wallet/balances
 * @description get wallet balances
 * @access Public
 */
router.post('/wallet/balances', (req, res) => {
	let id = req.body.id;
	let contract = req.body.contract;
	addressService.getAddressbyID(id).then(result=>{
		if (!contract) {
		  eth.getBalance(result.address).then(function(value) {
		    res.send({status:true, data:value});
		  }, function(error) {
		    res.send({status:false, message:error});
		  });
		} else {
		  eth.getTokenBalance(result.address, contract).then(function(value) {
		    res.send({status:true, data:value});
		  }, function(error) {
		    res.send({status:false, message:error});
		  })
		}
	}).catch(err => {
		res.send({status:false, message:err});
	});
});

/**
 * @route POST /wallet/transaction/list
 * @description get wallet transactions
 * @access Public
 */
router.post('/transaction/list', (req, res) => {
  let id = req.body.id;
  let contract = req.body.contract;
  addressService.getAddressbyID(id).then(result => {
    if (!contract) {
      eth.listTransactionsByAddress(result.address).then(function(value) {
        res.send({status:true, data:value});
      }, function(error) {
        res.send({status:false, message:error});
      })
    } else {
      eth.listTokenTransactionsByAddress(result.address, contract).then(value => {
        res.send({status:true, data:value});
      }).catch(err => {
        res.send({status:true, message:err});
      });
    }
  }).catch(err => {
    res.send({status:false, message:err.message});
  });
 });

/**
 * @route POST /wallet/transaction/create
 * @description create wallet transactions
 * @access Public
 */
router.post('/transaction/create', (req, res) => {
  let from = req.body.from;
  let to = req.body.to;
  let amount = req.body.amount;
  let contract = req.body.contract;

  addressService.getAddressbyID(from).then(result1 => {
    let fromAddress = result1.address;
    let privateKey = result1.privateKey;
    addressService.getAddressbyID(to).then(result2 => {
      let toAddress = result2.address;
      if (!contract) {
        eth.transfer(privateKey, fromAddress, toAddress, amount).then(value => {
          res.send({status:true, data:value});
        }).catch(error => {
          res.send({status:false, message:error});
        })
      } else {
        eth.transferToken(privateKey, fromAddress, toAddress, amount, contract).then(value => {
          res.send({status:true, data:value});
        }).catch(error => {
          res.send({status:false, message:error});
        })
      }
    }).catch(err => {
      res.send({status:false, message:err.message});
    })
  })
 });


module.exports = router;