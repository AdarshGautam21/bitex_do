const express = require("express");
const router = express.Router();
const Markets = require("../../../models/trading/Markets");
const isEmpty = require("../../../validation/isEmpty");

/**
 * @route GET /api/admin/market/market
 * @description Get all markets
 * @access Public
 */

router.get("/get-markets", async (req, res) => {
	const markets = await Markets.find();

	if (markets.length > 0) {
		res.json(markets);
	} else {
		res.status(400).json({ variant: "error", message: "No markets found" });
	}
});

/**
 * @route GET /api/admin/market/get-active-market
 * @description Get all get-active-market
 * @access Public
 */
router.get("/get-active-markets", async (req, res) => {
	const activeMarkets = await Markets.find({ active: true });

	if (activeMarkets.length > 0) {
		res.json(activeMarkets);
	} else {
		res.status(400).json({
			variant: "error",
			message: "No activeMarkets found",
		});
	}
});

/**
 * @route GET /api/admin/market/get-active-market
 * @description Get all get-active-market
 * @access Public
 */
router.get("/get-active-with-select-markets", async (req, res) => {
	const activeMarkets = await Markets.find(
		{ active: true },
		"name stock money"
	).lean();

	if (activeMarkets.length > 0) {
		res.json(activeMarkets);
	} else {
		res.status(400).json({
			variant: "error",
			message: "No activeMarkets found",
		});
	}
});

router.get("/get-market-with-pagination", async (req, res) => {
	let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
	let page = req.query.page ? req.query.page : 1;
	let sort = { updateDate: -1 };
	let queryOptions = {};

	if (!isEmpty(req.query.sortColumn)) {
		sort = { [req.query.sortColumn]: req.query.sort === "asc" ? 1 : -1 };
	}
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

	if (!isEmpty(req.query.filters)) {
		const filters = JSON.parse(req.query.filters);
		filters.map((fil) => {
			queryOptions[fil.name] =
				fil.value.length === 1 ? fil.value[0] : { $in: fil.value };
		});
	}
	try {
		let markets = await Markets.paginate(queryOptions, {
			lean: true,
			page: parseInt(page),
			limit: parseInt(perPage),
			sort: sort,
		});
		return res.json(markets);
	} catch (error) {
		return res.json([]);
	}
});

/**
 * @route Post /api/admin/market/create-market
 * @description Create market
 * @access Public
 */
router.post("/create-market", async (req, res) => {
	const existMarket = await Markets.findOne({ name: req.body.name });
	if (!isEmpty(existMarket))
		return res.status(400).json({ name: "Market already exists." });
	try {
		const marketData = {
			name: req.body.name,
			displayName: req.body.displayName,
			priority: req.body.priority,
			spreadBid: req.body.spreadBid,
			spreadAsk: req.body.spreadAsk,
			min_amount: req.body.min_amount,
			money: req.body.money,
			stock: req.body.stock,
			fee_prec: req.body.fee_prec,
			money_prec: req.body.money_prec,
			stock_prec: req.body.stock_prec,
			active: req.body.active,
		};
		!isEmpty(req.body.limitOrderRange)
			? (marketData["limitOrderRange"] = req.body.limitOrderRange)
			: null;
		!isEmpty(req.body.marketOrderRange)
			? (marketData["marketOrderRange"] = req.body.marketOrderRange)
			: null;
		!isEmpty(req.body.quantityRange)
			? (marketData["quantityRange"] = req.body.quantityRange)
			: null;
		!isEmpty(req.body.priceRange)
			? (marketData["priceRange"] = req.body.priceRange)
			: null;
		await Markets.create(marketData);
		res.json({
			variant: "success",
			message: "Market created successfully.",
		});
	} catch (error) {
		res.json({ variant: "error", message: "Falied to create Market." });
	}
});
/**
 * @route Post /api/admin/market/:id
 * @description Update market
 * @access Public
 */
router.post("/update-market/:id", async (req, res) => {
	const market = await Markets.findOne({ _id: req.params.id });
	if (!isEmpty(market)) {
		const existmMarket = await Markets.findOne({
			name: req.body.name,
			_id: { $ne: req.params.id },
		});
		if (!isEmpty(existmMarket))
			return res.status(400).json({ name: "Market already exists." });
		try {
			market.name = req.body.name;
			market.displayName = req.body.displayName;
			market.priority = req.body.priority;
			market.spreadBid = req.body.spreadBid;
			market.spreadAsk = req.body.spreadAsk;
			market.min_amount = req.body.min_amount;
			market.money = req.body.money;
			market.stock = req.body.stock;
			market.fee_prec = req.body.fee_prec;
			market.money_prec = req.body.money_prec;
			market.stock_prec = req.body.stock_prec;
			market.active = req.body.active;
			!isEmpty(req.body.limitOrderRange)
				? (market["limitOrderRange"] = req.body.limitOrderRange)
				: null;
			!isEmpty(req.body.marketOrderRange)
				? (market["marketOrderRange"] = req.body.marketOrderRange)
				: null;
			!isEmpty(req.body.quantityRange)
				? (market["quantityRange"] = req.body.quantityRange)
				: null;
			!isEmpty(req.body.priceRange)
				? (market["priceRange"] = req.body.priceRange)
				: null;
			await market.save();
			res.json({
				variant: "success",
				message: "Market updated successfully.",
			});
		} catch (error) {
			res.json({ variant: "error", message: "Falied to update Market." });
		}
	} else {
		res.json({ variant: "error", message: "Falied to update Market." });
	}
});

/**
 * @route GET /api/admin/market/remove-market/:id
 * @description Remove market
 * @access Public
 */
router.delete("/remove-market/:id", async (req, res) => {
	try {
		const market = await Markets.findOne({ _id: req.params.id });
		await market.remove();
		res.json({
			variant: "success",
			message: "market removed successfully.",
		});
	} catch (error) {
		res.json({ variant: "error", message: "Falied to remove market." });
	}
});

/**
 * @route Post /api/admin/market/toggle-active-market/:id
 * @description Update toggle-active-market
 * @access Public
 */
router.post("/toggle-active-market/:id", async (req, res) => {
	try {
		const market = await Markets.findOne({ _id: req.params.id });
		market.active = !market.active;
		await market.save();
		res.json({
			variant: "success",
			message: "market updated successfully.",
		});
	} catch (error) {
		res.json({ variant: "error", message: "Falied to updated market." });
	}
});

module.exports = router;
