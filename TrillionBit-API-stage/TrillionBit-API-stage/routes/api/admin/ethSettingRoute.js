const express = require('express');
const router = express.Router();

const EthAdminWallet = require('../../../models/eth/EthAdminWallet');
const EthController = require('../../../controller/EthController');


/**
 * @route GET /api/admin/eth-setting/get
 * @description Get all eth settings.
 * @access Public
 */
router.get('/get', (req, res) => {

    EthAdminWallet.find()
        .then(ethAdminWallet => {
            return res.json(ethAdminWallet);
        })
        .catch(err => {
          return res.status(400).json({message: "No settings found"});
        });

});

/**
 * @route GET /api/admin/eth-setting/create
 * @description Get all eth settings.
 * @access Public
 */
router.get('/create', async (req, res) => {

	EthAdminWallet.find()
	  	.then(ethAdminWallet => {
			if(ethAdminWallet.length > 0) {
				res.json(ethAdminWallet[0]);
			} else {
				const ethSetting = EthController.createAdminWallet()
	    		res.json(eth);
			}
	  	})
	  	.catch(err => {
	  		const ethSetting = EthController.createAdminWallet()
	    	res.json(ethSetting);
	  	});

});

/**
 * @route GET /api/admin/eth-setting/balance
 * @description Get all eth settings.
 * @access Public
 */
router.get('/balance', async (req, res) => {

	EthAdminWallet.find()
	  	.then(async ethAdminWallet => {
			if(ethAdminWallet.length > 0) {
				const ethSetting = await EthController.adminBalance();
	    		res.send({'value': `${ethSetting}`});
			} else {
				res.send('Error on getting balance.');
			}
	  	})
	  	.catch(err => {
				res.send('Error on getting balance.');
	  	});

});


/**
 * @route GET /api/admin/eth-setting/balance
 * @description Get all eth settings.
 * @access Public
 */
 router.get('/usdt_balance', async (req, res) => {

	EthAdminWallet.find()
	  	.then(async ethAdminWallet => {
			if(ethAdminWallet.length > 0) {
				const ethSetting = await EthController.adminUsdtBalance();
	    		res.send({'value': ethSetting});
			} else {
				res.send('Error on getting balance.');
			}
	  	})
	  	.catch(err => {
				console.log(err);
				res.send('Error on getting balance.');
	  	});

});

/**
 * @route GET /api/admin/eth-setting/update/:ethWalletId
 * @description Get all eth settings.
 * @access Public
 */
router.get('/update/:ethWalletId', async (req, res) => {

	let ethAdminWallet = EthAdminWallet.findOne({_id: req.params.ethWalletId})
	  	.then(ethAdminWallet => {
            ethAdminWallet.live = !ethAdminWallet.live;
            ethAdminWallet.save();

	  		res.json({variant: 'success', message: "Setting successfully updated"});
	  	})
	  	.catch(err => {
	  		res.json({variant: 'error', message: "Error on update"});
	  	});

});

module.exports = router;
