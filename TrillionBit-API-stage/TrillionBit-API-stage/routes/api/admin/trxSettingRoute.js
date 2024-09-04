const express = require('express');
const router = express.Router();

const TrxWalletSetting = require('../../../controller/trx/models/wallets');

/**
 * @route GET /api/admin/trx-setting/get
 * @description Get all xrp settings.
 * @access Public
 */
router.get('/get', (req, res) => {

	TrxWalletSetting.find()
  	.then(trxWalletSetting => {
		res.json(trxWalletSetting[0]);
  	})
  	.catch(err => {
  		res.status(400).json({message: "No settings found"});
  	});

});

module.exports = router;
