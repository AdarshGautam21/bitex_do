const express = require("express");
const router = express.Router();
const TradingMaintenance = require("../../../models/maintenance/TradingMaintenance");
const Markets = require("../../../models/trading/Markets");
const isEmpty = require("../../../validation/isEmpty");

/**
 * @route GET /api/admin/tradingMaintenance/tradingMaintenance
 * @description Get all tradingMaintenance
 * @access Public
 */

router.get("/get-trading-maintenance", async (req, res) => {
	const tradingMaintenance = await TradingMaintenance.find(
		{},
		"_id  name displayName active fiatName maintenance updatedAt createdAt"
	);
	if (tradingMaintenance.length > 0) {
		res.json(tradingMaintenance);
	} else {
		res.status(400).json({
			variant: "error",
			message: "No tradingMaintenance found",
		});
	}
});

router.get("/insert-trading-maintenance", async (req, res) => {
	await TradingMaintenance.deleteMany({});
	await TradingMaintenance.remove({});
	const activeMarkets = await Markets.find({ active: true });
	let i = activeMarkets.length;
	let insertData = [];
	while (i--) {
		insertData.unshift({
			name: activeMarkets[i].name,
			displayName: activeMarkets[i].displayName,
			fiatName: activeMarkets[i].money,
			active: activeMarkets[i].active,
		});
	}

	const tradingMaintenance = await TradingMaintenance.insertMany(insertData);
	if (tradingMaintenance.length > 0) {
		res.json(tradingMaintenance);
	} else {
		res.status(400).json({
			variant: "error",
			message: "No tradingMaintenance found",
		});
	}
});

router.get("/get-trading-maintenance-with-pagination", async (req, res) => {
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
				{
					fiatName: regex,
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
		let tradingMaintenance = await TradingMaintenance.paginate(
			queryOptions,
			{
				select: "_id  name displayName fiatName active maintenance updatedAt createdAt",
				lean: true,
				page: parseInt(page),
				limit: parseInt(perPage),
				sort: sort,

			}
		);
		return res.json(tradingMaintenance);
	} catch (error) {
		return res.json([]);
	}
});

/**
 * @route GET /api/admin/tradingMaintenance/get-active-trading-maintenance
 * @description Get all get-active-trading-maintenance
 * @access Public
 */
router.get("/get-active-trading-maintenance", async (req, res) => {
	const data = await TradingMaintenance.find(
		{
			active: true,
			maintenance: true,
		},
		"fiatName name"
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
 * @route Post /api/admin/tradingMaintenance/create-trading-maintenance
 * @description Create tradingMaintenance
 * @access Public
 */
router.post("/create-trading-maintenance", async (req, res) => {
	const exist = await TradingMaintenance.findOne({ name: req.body.name });
	if (!isEmpty(exist))
		return res
			.status(400)
			.json({ name: "TradingMaintenance already exists." });
	try {
		const data = {
			name: req.body.name,
			displayName: req.body.displayName,
			active: req.body.active,
			maintenance: req.body.maintenance,
			fiatName: req.body.fiatName,
		};
		await TradingMaintenance.create(data);
		res.json({
			variant: "success",
			message: "TradingMaintenance created successfully.",
		});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to create TradingMaintenance.",
		});
	}
});
/**
 * @route Post /api/admin/tradingMaintenance/:id
 * @description Update tradingMaintenance
 * @access Public
 */
router.post("/update-trading-maintenance/:id", async (req, res) => {
	const exist = await TradingMaintenance.findOne({
		name: req.body.name,
		_id: { $ne: req.params.id },
	});
	if (!isEmpty(exist))
		return res
			.status(400)
			.json({ name: "trading-maintenance already exists." });
	try {
		const data = {
			name: req.body.name,
			displayName: req.body.displayName,
			fiat: req.body.fiat,
			active: req.body.active,
			maintenance: req.body.maintenance,
		};
		const updatedData = await TradingMaintenance.findOneAndUpdate(
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
				message: "TradingMaintenance updated successfully.",
			});
		else
			res.json({
				variant: "error",
				message: "Falied to update TradingMaintenance.",
			});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to update TradingMaintenance.",
		});
	}
});

/**
 * @route GET /api/admin/tradingMaintenance/remove-trading-maintenance/:id
 * @description Remove tradingMaintenance
 * @access Public
 */
router.delete("/remove-trading-maintenance/:id", async (req, res) => {
	try {
		const tradingMaintenance = await TradingMaintenance.findOne({
			_id: req.params.id,
		});
		await tradingMaintenance.remove();
		res.json({
			variant: "success",
			message: "tradingMaintenance removed successfully.",
		});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to remove tradingMaintenance.",
		});
	}
});

/**
 * @route Post /api/admin/tradingMaintenance/toggle-active-trading-maintenance/:id
 * @description Update toggle-active-trading-maintenance
 * @access Public
 */
router.post("/toggle-trading-maintenance/:id", async (req, res) => {
	try {
		const toggleName = req.body.name;
		const tradingMaintenance = await TradingMaintenance.findOne({
			_id: req.params.id,
		});
		tradingMaintenance[toggleName] = !tradingMaintenance[toggleName];
		await tradingMaintenance.save();
		res.json({
			variant: "success",
			message: "tradingMaintenance updated successfully.",
		});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to remove tradingMaintenance.",
		});
	}
});

module.exports = router;
