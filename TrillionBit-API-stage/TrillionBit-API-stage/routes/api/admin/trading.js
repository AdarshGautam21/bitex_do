const express = require('express');
const router = express.Router();

const TraderLevel = require('../../../models/trading/TraderLevel');
const InrTraderLevel = require('../../../models/trading/InrTraderLevel');
const UsdTraderLevel = require('../../../models/trading/UsdTraderLevel');
const AgentTraderLevel = require('../../../models/agent/AgentTraderLevel');
const SubAgentTraderLevel = require('../../../models/agent/SubAgentTraderLevel');
const Assets = require('../../../models/trading/Assets');
const CurrencySetting = require('../../../models/trading/CurrencySetting');
const CurrencyAdvanceSetting = require('../../../models/trading/CurrencyAdvanceSetting');

const validateTraderLevelInput = require("../../../validation/admin/traderLevel");
const validateCurrencyAssetsInput = require("../../../validation/admin/currencyAssets.js");
const validateCurrencyAdvanceSettingsInput = require("../../../validation/admin/currencyAdvanceSettings");

/**
 * @route GET /api/admin/trading/get_trader_levels
 * @description Get all trader levels
 * @access Public
 */
router.get('/get_trader_levels', async (req, res) => {
	const traderLevels = await TraderLevel.find();

	if(traderLevels.length > 0) {
		res.json(traderLevels);
	} else {
		res.status(400).json({variant: 'error', message: 'No trader levels found'});
	}
});

/**
 * @route GET /api/admin/trading/get_inr_trader_levels
 * @description Get all trader levels
 * @access Public
 */
router.get('/get_inr_trader_levels', async (req, res) => {
	const inrTraderLevels = await InrTraderLevel.find();

	if(inrTraderLevels.length > 0) {
		res.json(inrTraderLevels);
	} else {
		res.status(400).json({variant: 'error', message: 'No trader levels found'});
	}
});

/**
 * @route GET /api/admin/trading/get_agent_trader_levels
 * @description Get all trader levels
 * @access Public
 */
router.get('/get_agent_trader_levels', async (req, res) => {
	const agentTraderLevels = await AgentTraderLevel.find();

	if(agentTraderLevels.length > 0) {
		res.json(agentTraderLevels);
	} else {
		res.status(400).json({variant: 'error', message: 'No agent trader levels found'});
	}
});

/**
 * @route GET /api/admin/trading/get_sub_agent_trader_levels
 * @description Get all trader levels
 * @access Public
 */
router.get('/get_sub_agent_trader_levels', async (req, res) => {
	const subAgentTraderLevels = await SubAgentTraderLevel.find();

	if(subAgentTraderLevels.length > 0) {
		res.json(subAgentTraderLevels);
	} else {
		res.status(400).json({variant: 'error', message: 'No agent trader levels found'});
	}
});

/**
 * @route Post /api/admin/trading/create_trader_level
 * @description Create trader level
 * @access Public
 */
router.post('/create_trader_level', async (req, res) => {
	const { errors, isValid } = validateTraderLevelInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Falied to create trader level.'});
	}
	const traderLevel = new TraderLevel({
		name: req.body.name,
		fromAmount: req.body.fromAmount,
		toAmount: req.body.toAmount,
		maker_fee: req.body.makerFee,
		taker_fee: req.body.takerFee,
	});
	traderLevel.save()
		.then(traderLevel => {
			res.json({variant: 'success', message: 'Trader level created successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to create trader level.'});
		});
});

/**
 * @route Post /api/admin/trading/create_inr_trader_level
 * @description Create trader level
 * @access Public
 */
router.post('/create_inr_trader_level', async (req, res) => {
	const { errors, isValid } = validateTraderLevelInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Falied to create trader level.'});
	}
	const inrTraderLevel = new InrTraderLevel({
		name: req.body.name,
		fromAmount: req.body.fromAmount,
		toAmount: req.body.toAmount,
		maker_fee: req.body.makerFee,
		taker_fee: req.body.takerFee,
	});
	inrTraderLevel.save()
		.then(inrTraderLevel => {
			res.json({variant: 'success', message: 'Trader level created successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to create trader level.'});
		});
});

/**
 * @route Post /api/admin/trading/create_agent_trader_level
 * @description Create trader level
 * @access Public
 */
router.post('/create_agent_trader_level', async (req, res) => {
	const { errors, isValid } = validateTraderLevelInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Falied to create trader level.'});
	}
	const agentTraderLevel = new AgentTraderLevel({
		name: req.body.name,
		fromAmount: req.body.fromAmount,
		toAmount: req.body.toAmount,
		maker_fee: req.body.makerFee,
		taker_fee: req.body.takerFee,
	});
	agentTraderLevel.save()
		.then(agentTraderLevel => {
			res.json({variant: 'success', message: 'Trader level created successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to create trader level.'});
		});
});

/**
 * @route Post /api/admin/trading/create_sub_agent_trader_level
 * @description Create trader level
 * @access Public
 */
router.post('/create_sub_agent_trader_level', async (req, res) => {
	const { errors, isValid } = validateTraderLevelInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Falied to create trader level.'});
	}
	const subAgentTraderLevel = new SubAgentTraderLevel({
		name: req.body.name,
		fromAmount: req.body.fromAmount,
		toAmount: req.body.toAmount,
		maker_fee: req.body.makerFee,
		taker_fee: req.body.takerFee,
	});
	subAgentTraderLevel.save()
		.then(subAgentTraderLevel => {
			res.json({variant: 'success', message: 'Trader level created successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to create trader level.'});
		});
});

/**
 * @route Post /api/admin/trading/update_trader_level/:treaderId
 * @description Update trader level
 * @access Public
 */
router.post('/update_trader_level/:treaderId', async (req, res) => {
	const { errors, isValid } = validateTraderLevelInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Falied to update trader level.'});
	}

	const traderLevel = await TraderLevel.findOne({_id: req.params.treaderId});

	traderLevel.name = req.body.name;
	traderLevel.fromAmount = req.body.fromAmount;
	traderLevel.toAmount = req.body.toAmount;
	traderLevel.maker_fee = req.body.makerFee;
	traderLevel.taker_fee = req.body.takerFee;
	traderLevel.save()
		.then(traderLevel => {
			res.json({variant: 'success', message: 'Trader level updated successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to update trader level.'});
		});
});

/**
 * @route Post /api/admin/trading/update_inr_trader_level/:treaderId
 * @description Update trader level
 * @access Public
 */
router.post('/update_inr_trader_level/:treaderId', async (req, res) => {
	const { errors, isValid } = validateTraderLevelInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Falied to update trader level.'});
	}

	const inrTraderLevel = await InrTraderLevel.findOne({_id: req.params.treaderId});

	inrTraderLevel.name = req.body.name;
	inrTraderLevel.fromAmount = req.body.fromAmount;
	inrTraderLevel.toAmount = req.body.toAmount;
	inrTraderLevel.maker_fee = req.body.makerFee;
	inrTraderLevel.taker_fee = req.body.takerFee;
	inrTraderLevel.save()
		.then(inrTraderLevel => {
			res.json({variant: 'success', message: 'Trader level updated successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to update trader level.'});
		});
});

/**
 * @route Post /api/admin/trading/update_agent_trader_level/:treaderId
 * @description Update trader level
 * @access Public
 */
router.post('/update_agent_trader_level/:treaderId', async (req, res) => {
	const { errors, isValid } = validateTraderLevelInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Falied to update trader level.'});
	}

	const agentTraderLevel = await AgentTraderLevel.findOne({_id: req.params.treaderId});

	agentTraderLevel.name = req.body.name;
	agentTraderLevel.fromAmount = req.body.fromAmount;
	agentTraderLevel.toAmount = req.body.toAmount;
	agentTraderLevel.maker_fee = req.body.makerFee;
	agentTraderLevel.taker_fee = req.body.takerFee;
	agentTraderLevel.save()
		.then(agentTraderLevel => {
			res.json({variant: 'success', message: 'Trader level updated successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to update trader level.'});
		});
});

/**
 * @route Post /api/admin/trading/update_sub_agent_trader_level/:treaderId
 * @description Update trader level
 * @access Public
 */
router.post('/update_sub_agent_trader_level/:treaderId', async (req, res) => {
	const { errors, isValid } = validateTraderLevelInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Falied to update trader level.'});
	}

	const subAgentTraderLevel = await SubAgentTraderLevel.findOne({_id: req.params.treaderId});

	subAgentTraderLevel.name = req.body.name;
	subAgentTraderLevel.fromAmount = req.body.fromAmount;
	subAgentTraderLevel.toAmount = req.body.toAmount;
	subAgentTraderLevel.maker_fee = req.body.makerFee;
	subAgentTraderLevel.taker_fee = req.body.takerFee;
	subAgentTraderLevel.save()
		.then(subAgentTraderLevel => {
			res.json({variant: 'success', message: 'Trader level updated successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to update trader level.'});
		});
});

/**
 * @route GET /api/admin/trading/remove_trader_level/:treaderId
 * @description Remove trader level
 * @access Public
 */
router.get('/remove_trader_level/:treaderId', async (req, res) => {

	const traderLevel = await TraderLevel.findOne({_id: req.params.treaderId});

	traderLevel.remove()
		.then(traderLevel => {
			res.json({variant: 'success', message: 'Trader level removed successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to remove trader level.'});
		});
});

/**
 * @route GET /api/admin/trading/remove_inr_trader_level/:treaderId
 * @description Remove trader level
 * @access Public
 */
router.get('/remove_inr_trader_level/:treaderId', async (req, res) => {

	const inrTraderLevel = await InrTraderLevel.findOne({_id: req.params.treaderId});

	inrTraderLevel.remove()
		.then(inrTraderLevel => {
			res.json({variant: 'success', message: 'Trader level removed successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to remove trader level.'});
		});
});

/**
 * @route GET /api/admin/trading/remove_agent_trader_level/:treaderId
 * @description Remove trader level
 * @access Public
 */
router.get('/remove_agent_trader_level/:treaderId', async (req, res) => {

	const agentTraderLevel = await AgentTraderLevel.findOne({_id: req.params.treaderId});

	agentTraderLevel.remove()
		.then(agentTraderLevel => {
			res.json({variant: 'success', message: 'Trader level removed successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to remove trader level.'});
		});
});

/**
 * @route GET /api/admin/trading/remove_sub_agent_trader_level/:treaderId
 * @description Remove trader level
 * @access Public
 */
router.get('/remove_sub_agent_trader_level/:treaderId', async (req, res) => {

	const subAgentTraderLevel = await SubAgentTraderLevel.findOne({_id: req.params.treaderId});

	subAgentTraderLevel.remove()
		.then(subAgentTraderLevel => {
			res.json({variant: 'success', message: 'Trader level removed successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to remove trader level.'});
		});
});

/**
 * @route GET /api/admin/trading/get_assets_currency
 * @description Get asset currency
 * @access Public
 */
router.get('/get_assets_currency', (req, res) => {
	CurrencySetting.find()
		.then(async currencySettings => {
			let currencySettingsArr = [];
			for(key in currencySettings) {
				let assets = await Assets.findOne({_id: currencySettings[key].assetsId});
				if (assets) {
					let currencyAsset = {
						_id: currencySettings[key]._id,
						name: currencySettings[key].name,
						assets: assets.name,
						currency: currencySettings[key].currency,
						value: currencySettings[key].value,
						premium: currencySettings[key].premium,
						discount: currencySettings[key].discount,
						spread: currencySettings[key].spread,
					}
					currencySettingsArr.push(currencyAsset);
				}
			}
			res.json(currencySettingsArr);
		})
})

/**
 * @route POST /api/admin/trading/create_assets_currency
 * @description Post asset currency
 * @access Public
 */
router.post('/create_assets_currency', (req, res) => {
	const { errors, isValid } = validateCurrencyAssetsInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Invalid inputs.'});
	}

	const currencyAssets = new CurrencySetting;
	currencyAssets.assetsId = req.body.assetsId;
	currencyAssets.name = req.body.name;
	currencyAssets.currency = req.body.currency;
	currencyAssets.value = req.body.value;
	currencyAssets.save();
	res.json({variant: 'success', message: 'Assets currency added successfully'});
})

/**
 * @route POST /api/admin/trading/update_assets_currency
 * @description Update asset currency
 * @access Public
 */
router.post('/update_assets_currency/:currencyId', async (req, res) => {
	const currencyAssets = await CurrencySetting.findOne({_id: req.body._id});
	currencyAssets.value = req.body.value;
	currencyAssets.premium = req.body.premium;
	currencyAssets.discount = req.body.discount;
	currencyAssets.spread = req.body.spread;
	currencyAssets.save()
		.then(currencyAsset => {
			res.json({variant: 'success', message: 'Trader level updated successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to update trader level.'});
		});
})

/**
 * @route GET /api/admin/trading/get_currency_advance_settings
 * @description Get currency advance settings
 * @access Public
 */
router.get('/get_currency_advance_settings', async (req, res) => {
	const currencyAdvanceSettings = await CurrencyAdvanceSetting.find({});
	res.json(currencyAdvanceSettings);
});

/**
 * @route POST /api/admin/trading/add_currency_advance_setting
 * @description Get currency advance settings
 * @access Public
 */
router.post('/add_currency_advance_setting', async (req, res) => {
	const { errors, isValid } = validateCurrencyAdvanceSettingsInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Invalid inputs.'});
	}

	const currencyAdvanceSetting = new CurrencyAdvanceSetting;
	currencyAdvanceSetting.settingName = req.body.settingName;
	currencyAdvanceSetting.value = req.body.value;
	await currencyAdvanceSetting.save();
	res.json({variant: 'success', message: 'Currency setting added successfully'});
});

/**
 * @route POST /api/admin/trading/update_currency_advance_setting/:settingId
 * @description Get currency advance settings
 * @access Public
 */
router.post('/update_currency_advance_setting/:settingId', async (req, res) => {
	const { errors, isValid } = validateCurrencyAdvanceSettingsInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Invalid inputs.'});
	}

	const currencyAdvanceSetting = await CurrencyAdvanceSetting.findOne({_id: req.params.settingId});
	currencyAdvanceSetting.settingName = req.body.settingName;
	currencyAdvanceSetting.value = req.body.value;
	currencyAdvanceSetting.save();
	res.json({variant: 'success', message: 'Currency setting updated successfully'});
});

/**
 * @route GET /api/admin/trading/remove_currency_advance_setting/:settingId
 * @description Remove trader level
 * @access Public
 */
router.get('/remove_currency_advance_setting/:settingId', async (req, res) => {

	const currencyAdvanceSetting = await CurrencyAdvanceSetting.findOne({_id: req.params.settingId});

	currencyAdvanceSetting.remove()
		.then(currencyAdvanceSetting => {
			res.json({variant: 'success', message: 'Setting removed successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to remove setting.'});
		});
});


/**
 * @route GET /api/admin/trading/get_usd_trader_levels
 * @description Get all trader levels
 * @access Public
 */
router.get('/get_usd_trader_levels', async (req, res) => {
	const usdTraderLevels = await UsdTraderLevel.find();

	if(usdTraderLevels.length > 0) {
		res.json(usdTraderLevels);
	} else {
		res.status(400).json({variant: 'error', message: 'No trader levels found'});
	}
});

/**
 * @route Post /api/admin/trading/create_usd_trader_level
 * @description Create trader level
 * @access Public
 */
router.post('/create_usd_trader_level', async (req, res) => {
	const { errors, isValid } = validateTraderLevelInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Falied to create trader level.'});
	}
	const usdTraderLevel = new UsdTraderLevel({
		name: req.body.name,
		fromAmount: req.body.fromAmount,
		toAmount: req.body.toAmount,
		maker_fee: req.body.makerFee,
		taker_fee: req.body.takerFee,
	});
	usdTraderLevel.save()
		.then(usd => {
			res.json({variant: 'success', message: 'Trader level created successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to create trader level.'});
		});
});

/**
 * @route Post /api/admin/trading/update_usd_trader_level/:treaderId
 * @description Update trader level
 * @access Public
 */
router.post('/update_usd_trader_level/:treaderId', async (req, res) => {
	const { errors, isValid } = validateTraderLevelInput(req.body);

	// Check Validation
	if (!isValid) {
		return res.status(400).json({variant: 'error', message: 'Falied to update trader level.'});
	}

	const usdTraderLevel = await UsdTraderLevel.findOne({_id: req.params.treaderId});

	usdTraderLevel.name = req.body.name;
	usdTraderLevel.fromAmount = req.body.fromAmount;
	usdTraderLevel.toAmount = req.body.toAmount;
	usdTraderLevel.maker_fee = req.body.makerFee;
	usdTraderLevel.taker_fee = req.body.takerFee;
	usdTraderLevel.save()
		.then(usd => {
			res.json({variant: 'success', message: 'Trader level updated successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to update trader level.'});
		});
});

/**
 * @route GET /api/admin/trading/remove_usd_trader_level/:treaderId
 * @description Remove trader level
 * @access Public
 */
router.get('/remove_usd_trader_level/:treaderId', async (req, res) => {

	const usdTraderLevel = await UsdTraderLevel.findOne({_id: req.params.treaderId});
	usdTraderLevel.remove()
		.then(usdTrader => {
			res.json({variant: 'success', message: 'Trader level removed successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to remove trader level.'});
		});
});


module.exports = router;