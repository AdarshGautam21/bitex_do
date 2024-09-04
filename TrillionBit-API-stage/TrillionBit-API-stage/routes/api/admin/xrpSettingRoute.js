const express = require('express');
const router = express.Router();

const XrpWallet = require('../../../models/xrp/XrpWallet');
const WithdrawXrpWallet = require('../../../models/xrp/WithdrawXrpWallet');
const XrpController = require('../../../controller/XrpController');
const WalletTransactions = require('../../../models/wallet/WalletTransactions');

/**
 * @route GET /api/admin/xrp-setting/get
 * @description Get all xrp settings.
 * @access Public
 */
router.get('/get', (req, res) => {

  XrpWallet.find()
  	.then(xrpSetting => {
  		res.json(xrpSetting[0]);
  	})
  	.catch(err => {
  		res.status(400).json({message: "No settings found"});
  	});

});

/**
 * @route GET /api/admin/xrp-setting/get-withdraw
 * @description Get all xrp withdraw settings.
 * @access Public
 */
router.get('/get-withdraw', (req, res) => {

	WithdrawXrpWallet.find()
		.then(withdrawXrpWallet => {
			res.json(withdrawXrpWallet[0]);
		})
		.catch(err => {
			res.status(400).json({message: "No settings found"});
		});

});

/**
 * @route GET /api/admin/xrp-setting/create
 * @description Get all xrp settings.
 * @access Public
 */
router.get('/create', async (req, res) => {

	XrpWallet.find()
	  	.then(xrpSetting => {
			if(xrpSetting.length > 0) {
				res.json(xrpSetting[0]);
			} else {
				const xrpSetting = XrpController.createWallet()
	    		res.json(xrpSetting);
			}
	  	})
	  	.catch(err => {
	  		const xrpSetting = XrpController.createWallet()
	    	res.json(xrpSetting);
	  	});

});


/**
 * @route GET /api/admin/xrp-setting/create-withdraw-wallet
 * @description Get all xrp withdraw settings.
 * @access Public
 */
router.get('/create-withdraw-wallet', async (req, res) => {

	WithdrawXrpWallet.find()
	  	.then(async withdrawXrpWallet => {
			if(withdrawXrpWallet.length > 0) {
				res.json(withdrawXrpWallet[0]);
			} else {
				const withdrawXrpWallet = await XrpController.createWithdrawWallet()
	    		res.json(withdrawXrpWallet);
			}
	  	})
	  	.catch(async err => {
	  		const withdrawXrpWallet = await XrpController.createWithdrawWallet()
	    	res.json(withdrawXrpWallet);
	  	});

});


/**
 * @route GET /api/admin/xrp-setting/update
 * @description Get all xrp settings.
 * @access Public
 */
router.get('/update/:xrpWalletId', async (req, res) => {

	let xrpSetting = XrpWallet.findOne({_id: req.params.xrpWalletId})
	  	.then(xrpSetting => {
	  		xrpSetting.live = !xrpSetting.live;
	  		xrpSetting.save();

	  		res.json({variant: 'success', message: "Setting successfully updated"});
	  	})
	  	.catch(err => {
	  		res.json({variant: 'error', message: "Error on update"});
	  	});

});

/**
 * @route GET /api/admin/xrp-setting/update-withdraw-wallet/:xrpWalletId
 * @description Get all xrp withdraw settings.
 * @access Public
 */
router.get('/update-withdraw-wallet/:xrpWalletId', async (req, res) => {

	let withdrawXrpWallet = WithdrawXrpWallet.findOne({_id: req.params.xrpWalletId})
	  	.then(withdrawXrpWallet => {
			withdrawXrpWallet.live = !withdrawXrpWallet.live;
			withdrawXrpWallet.save();

	  		res.json({variant: 'success', message: "Setting successfully updated"});
	  	})
	  	.catch(err => {
	  		res.json({variant: 'error', message: "Error on update"});
	  	});

});

/**
 * @route GET /api/admin/xrp-setting/get_balance/:xrpWallet/:xrpWalletId
 * @description Get all xrp withdraw settings.
 * @access Public
 */
router.get('/get_balance/:xrpWallet/:xrpWalletId', async (req, res) => {

	if (req.params.xrpWallet === 'withdraw') {
		WithdrawXrpWallet.findOne({_id: req.params.xrpWalletId})
			  .then(async withdrawXrpWallet => {
				const xrpWalletBalance = await XrpController.withdrawBalance(withdrawXrpWallet.clientId);
				if(xrpWalletBalance.error) {
					return res.send("Error on getting balance");
				} else {
					return res.json(xrpWalletBalance);
				}
			  })
			  .catch(err => {
				return res.send("Error on getting balance");
			  });
	}

	if (req.params.xrpWallet === 'deposit') {
		XrpWallet.findOne({_id: req.params.xrpWalletId})
			  .then(async xrpWallet => {
				const xrpWalletBalance = await XrpController.balance(xrpWallet.clientId);
				if(xrpWalletBalance.error) {
					return res.send("Error on getting balance");
				} else {
					return res.json(xrpWalletBalance);
				}
			  })
			  .catch(err => {
				return res.send("Error on getting balance");
			  });
	}

});

/**
 * @route POST /api/admin/xrp-setting/transfer_amount
 * @description Transfer XRP
 * @access Public
 */
router.post('/transfer_amount', async (req, res) => {

	let sendAmount = parseFloat(req.body.transferAmount).toFixed(4);

	const xrpWalletTransactions = await XrpController.internalDepositToWithdrawSend(req.body.toAddress, sendAmount);
	if(xrpWalletTransactions.error) {
		let response = {varient: "error", message: xrpWalletTransactions.error}
		return response;
	} else {
		const walletTransactions = new WalletTransactions;
		walletTransactions.userId = 'pfqv1owzsstp';
		walletTransactions.type = 'Withdrawal';
		walletTransactions.value = sendAmount;
		walletTransactions.receiverAddress = req.body.toAddress;
		walletTransactions.destinationTag = '';
		walletTransactions.senderAddress = req.body.fromAddress;
		walletTransactions.coin = 'XRP';
		walletTransactions.state = 'Finished';
		walletTransactions.save();

		let response = {varient: "success", message: 'Tranfer successful.'}
		return response;
	}

});

module.exports = router;
