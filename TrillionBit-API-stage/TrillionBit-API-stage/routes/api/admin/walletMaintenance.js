const express = require("express");
const { truncate } = require("fs");
const router = express.Router();
const WalletMaintenance = require("../../../models/maintenance/WalletMaintenance");
const Asset = require("../../../models/trading/Assets");
const isEmpty = require("../../../validation/isEmpty");

/**
 * @route GET /api/admin/walletMaintenance/walletMaintenance
 * @description Get all walletMaintenance
 * @access Public
 */

router.get("/get-wallet-maintenance", async (req, res) => {
	const walletMaintenance = await WalletMaintenance.find(
		{},
		"_id fiat name displayName active maintenance updatedAt createdAt"
	);
	if (walletMaintenance.length > 0) {
		res.json(walletMaintenance);
	} else {
		res.status(400).json({
			variant: "error",
			message: "No walletMaintenance found",
		});
	}
});

router.get("/insert-wallet-maintenance", async (req, res) => {
	await WalletMaintenance.deleteMany({});
	await WalletMaintenance.remove({});
	const activeMarkets = await Asset.find({ active: true });
	let i = activeMarkets.length;
	let insertData = [];
	while (i--) {
		insertData.unshift({
			name: activeMarkets[i].name,
			displayName: activeMarkets[i].displayName,
			fiat: activeMarkets[i].fiat,
			active: activeMarkets[i].active,
		});
	}

	const walletMaintenance = await WalletMaintenance.insertMany(insertData);
	if (walletMaintenance.length > 0) {
		res.json(walletMaintenance);
	} else {
		res.status(400).json({
			variant: "error",
			message: "No walletMaintenance found",
		});
	}
});

router.get("/get-wallet-maintenance-with-pagination", async (req, res) => {
	let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
	let page = req.query.page ? req.query.page : 1;
	let queryOptions = {};
	let sort = {};
	if (!isEmpty(req.query.search)) {
		let searchText = req.query.search.trim();
		let regex = new RegExp(searchText, "i");
		queryOptions = {
			$or: [
				{
					name: regex,
				},

				{
					displayName: regex,
				},
			],
		};
	}

	if (req.query.sortColumn) {
		sort = {
			[req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1,
		};
	}

	if (!isEmpty(req.query.filters)) {
		const filters = JSON.parse(req.query.filters);
		filters.map((fil) => {
			queryOptions[fil.name] =
				fil.value.length === 1 ? fil.value[0] : { $in: fil.value };
		});
	}
	try {
		let walletMaintenance = await WalletMaintenance.paginate(queryOptions, {
			select: "_id  name displayName fiat active maintenance updatedAt createdAt",
			lean: true,
			page: parseInt(page),
			limit: parseInt(perPage),
			sort: sort,
		});
		return res.json(walletMaintenance);
	} catch (error) {
		return res.json([]);
	}
});

/**
 * @route GET /api/admin/walletMaintenance/get-active-wallet-maintenance
 * @description Get all get-active-wallet-maintenance
 * @access Public
 */
router.get("/get-active-wallet-maintenance", async (req, res) => {
	const data = await WalletMaintenance.find(
		{
			active: true,
			$or: [ 
				{ 'maintenance.withdrawal': true }, 
				
				{ 'maintenance.deposit': true } 
			],
		},
		"fiat name maintenance"
	).lean();

	if (data.length > 0) {
		res.json(data);
	} else {
		res.status(400).json({
			variant: "error",
			message: "No data found",
		});
	}
});
/**
 * @route Post /api/admin/walletMaintenance/create-wallet-maintenance
 * @description Create walletMaintenance
 * @access Public
 */
router.post("/create-wallet-maintenance", async (req, res) => {
	const exist = await WalletMaintenance.findOne({ name: req.body.name });
	if (!isEmpty(exist))
		return res
			.status(400)
			.json({ name: "WalletMaintenance already exists." });
	try {
		const data = {
			name: req.body.name,
			displayName: req.body.displayName,
			fiat: req.body.fiat,
			active: req.body.active,
			maintenance: req.body.maintenance,
		};
		await WalletMaintenance.create(data);
		res.json({
			variant: "success",
			message: "WalletMaintenance created successfully.",
		});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to create WalletMaintenance.",
		});
	}
});
/**
 * @route Post /api/admin/walletMaintenance/:id
 * @description Update walletMaintenance
 * @access Public
 */
router.post("/update-wallet-maintenance/:id", async (req, res) => {
	const exist = await WalletMaintenance.findOne({
		name: req.body.name,
		_id: { $ne: req.params.id },
	});
	if (!isEmpty(exist))
		return res
			.status(400)
			.json({ name: "wallet-maintenance already exists." });
	try {
		const data = {
			name: req.body.name,
			displayName: req.body.displayName,
			fiat: req.body.fiat,
			active: req.body.active,
			maintenance: req.body.maintenance,
		};
		const updatedData = await WalletMaintenance.findOneAndUpdate(
			{ _id: req.params.id },
			data,
			{
				upsert: true,
				new: true,
			}
		);
		if (!isEmpty(updatedData))
			res.json({
				variant: "success",
				message: "WalletMaintenance updated successfully.",
			});
		else
			res.json({
				variant: "error",
				message: "Falied to update WalletMaintenance.",
			});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to update WalletMaintenance.",
		});
	}
});

/**
 * @route GET /api/admin/walletMaintenance/remove-wallet-maintenance/:id
 * @description Remove walletMaintenance
 * @access Public
 */
router.delete("/remove-wallet-maintenance/:id", async (req, res) => {
	try {
		const walletMaintenance = await WalletMaintenance.findOne({
			_id: req.params.id,
		});
		await walletMaintenance.remove();
		res.json({
			variant: "success",
			message: "walletMaintenance removed successfully.",
		});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to remove walletMaintenance.",
		});
	}
});

/**
 * @route Post /api/admin/walletMaintenance/toggle-active-wallet-maintenance/:id
 * @description Update toggle-active-wallet-maintenance
 * @access Public
 */
router.post("/toggle-wallet-maintenance/:id", async (req, res) => {
	try {
		const toggleName = req.body.name;
		const toggleType = req.body.type;
		const walletMaintenance = await WalletMaintenance.findOne({
			_id: req.params.id,
		});
		if(toggleName === "active")
		walletMaintenance[toggleName] = !walletMaintenance[toggleName];
		else {
			walletMaintenance[toggleName][toggleType] = !walletMaintenance[toggleName][toggleType];
		}
		await walletMaintenance.save();
		res.json({
			variant: "success",
			message: "walletMaintenance updated successfully.",
		});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to remove walletMaintenance.",
		});
	}
});

module.exports = router;
