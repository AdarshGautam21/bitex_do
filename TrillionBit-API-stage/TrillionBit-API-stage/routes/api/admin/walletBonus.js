const express = require('express');
const router = express.Router();
const WalletBonus = require('../../../models/WalletBonus');
const validateCreatWalletBonusInput = require("../../../validation/admin/walletBonus");
const validateUpdateWalletBonusInput = require("../../../validation/admin/walletBonus");

/**
 * @route GET /api/admin/wallet-bonus/get_wallet_bonus
 * @description Get all trader levels
 * @access Public
 */
router.get('/get_wallet_bonus', async (req, res) => {
	const walletBonus = await WalletBonus.find();

	if(walletBonus.length > 0) {
		res.json(walletBonus);
	} else {
		res.status(400).json({variant: 'error', message: 'No wallet bonus found'});
	}
});

/**
 * @route Post /api/admin/wallet-bonus/create_trader_level
 * @description Create trader level
 * @access Public
 */
router.post('/create_wallet_bonus', async (req, res) => {
	const { errors, isValid } = validateCreatWalletBonusInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Falied to create wallet bonus.', errors: errors});
	}
	const walletBonus = new WalletBonus({
		name: req.body.name,
		type: req.body.type,
		coin: req.body.coin,
		couponCode: req.body.couponCode,
		value: (req.body.value) ? req.body.value : '',
		active: (req.body.active) ? req.body.active : false,

	});
	walletBonus.save()
		.then(walletBonu => {
			res.json({variant: 'success', message: 'wallet bonus created successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to create wallet bonus.'});
		});
});
/**
 * @route Post /api/admin/wallet-bonus/update_wallet_bonus/:bonusId
 * @description Update wallet bonus level
 * @access Public
 */
router.post('/update_wallet_bonus/:bonusId', async (req, res) => {
	const { errors, isValid } = validateUpdateWalletBonusInput(req.body);
	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Falied to update wallet bonus.', errors: errors});
	}
	const walletBonus = await WalletBonus.findOne({_id: req.params.bonusId});
	walletBonus.name = req.body.name;
	walletBonus.type = req.body.type;
	walletBonus.coin = req.body.coin,
	walletBonus.couponCode = req.body.couponCode;
	walletBonus.value = (req.body.value) ? req.body.value : '';
	walletBonus.active = (req.body.active) ? req.body.active : false;
	walletBonus.save()
		.then(walletBonus => {
			res.json({variant: 'success', message: 'wallet bonus updated successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to update wallet bonus.'});
		});
});


/**
 * @route GET /api/admin/trading/remove_wallet_bonus/:bonusId
 * @description Remove wallet bonus
 * @access Public
 */
router.get('/remove_wallet_bonus/:bonusId', async (req, res) => {

	const walletBonus = await WalletBonus.findOne({_id: req.params.bonusId});

	walletBonus.remove()
		.then(walletBonus => {
			res.json({variant: 'success', message: ' wallet bonus removed successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to remove  wallet bonus.'});
		});
});


/**
 * @route Post /api/admin/wallet-bonus/toggle_wallet_balance/:bonusId
 * @description Update wallet bonus level
 * @access Public
 */
router.post('/toggle_wallet_balance/:bonusId', async (req, res) => {

	const walletBonus = await WalletBonus.findOne({_id: req.params.bonusId});
	walletBonus.active = !walletBonus.active;
	walletBonus.save()
		.then(walletBonus => {
			res.json({variant: 'success', message: 'wallet bonus updated successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to update wallet bonus.'});
		});
});

module.exports = router;