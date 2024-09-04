const express = require("express");
const router = express.Router();
const Asset = require("../../../models/trading/Assets");
const isEmpty = require("../../../validation/isEmpty");

/**
 * @route GET /api/admin/assets/assets
 * @description Get all assets
 * @access Public
 */

router.get("/get-assets", async (req, res) => {
	const assets = await Asset.find();

	if (assets.length > 0) {
		res.json(assets);
	} else {
		res.status(400).json({ variant: "error", message: "No assets found" });
	}
});

router.get("/get-assets-with-pagination", async (req, res) => {
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
					alias: regex,
				},
				{
					displayName: regex,
				},
				{
					depositFee: regex,
				},
				{
					withdrawalFee: regex,
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
		let assets = await Assets.paginate(queryOptions, {
			select: "_id availableCount name alias totalBalance displayName availableBalance freezeCount freezeBalance fiat bitgo active depositFee withdrawalFee description createTime updateDate",
			lean: true,
			page: parseInt(page),
			limit: parseInt(perPage),
			sort: sort,
		});
		return res.json(assets);
	} catch (error) {
		return res.json([]);
	}
});

/**
 * @route GET /api/admin/assets/get-active-assets
 * @description Get all get-active-assets
 * @access Public
 */
router.get("/get-active-assets", async (req, res) => {
	const activeMarkets = await Asset.find({ active: true });

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
 * @route Post /api/admin/assets/create-assets
 * @description Create assets
 * @access Public
 */
router.post("/create-assets", async (req, res) => {
	const existAsset = await Asset.findOne({ name: req.body.name });
	if (!isEmpty(existAsset))
		return res.status(400).json({ name: "Assets already exists." });
	try {
		const assetsData = {
			availableCount: req.body.availableCount,
			alias: req.body.alias,
			name: req.body.name,
			displayName: req.body.displayName,
			totalBalance: req.body.totalBalance,
			availableBalance: req.body.availableBalance,
			freezeCount: req.body.freezeCount,
			freezeBalance: req.body.freezeBalance,
			fiat: req.body.fiat,
			bitgo: req.body.bitgo,
			active: req.body.active,
			depositFee: req.body.depositFee,
			withdrawalFee: req.body.withdrawalFee,
			description: req.body.description,
			updateDate: new Date(),
		};
		await Asset.create(assetsData);
		res.json({
			variant: "success",
			message: "Assets created successfully.",
		});
	} catch (error) {
		res.json({ variant: "error", message: "Falied to create Assets." });
	}
});
/**
 * @route Post /api/admin/assets/:id
 * @description Update assets
 * @access Public
 */
router.post("/update-assets/:id", async (req, res) => {
	const existAssets = await Asset.findOne({
		name: req.body.name,
		_id: { $ne: req.params.id },
	});
	if (!isEmpty(existAssets))
		return res.status(400).json({ name: "Assets already exists." });
	try {
		const assetsData = {
			availableCount: req.body.availableCount,
			alias: req.body.alias,
			name: req.body.name,
			displayName: req.body.displayName,
			totalBalance: req.body.totalBalance,
			availableBalance: req.body.availableBalance,
			freezeCount: req.body.freezeCount,
			freezeBalance: req.body.freezeBalance,
			fiat: req.body.fiat,
			bitgo: req.body.bitgo,
			active: req.body.active,
			depositFee: req.body.depositFee,
			withdrawalFee: req.body.withdrawalFee,
			description: req.body.description,
			updateDate: new Date(),
		};
		const updatedAsset = await Asset.findOneAndUpdate(
			{ _id: req.params.id },
			assetsData,
			{
				upsert: true,
				new: true,
			}
		);
		if (!isEmpty(updatedAsset))
			res.json({
				variant: "success",
				message: "Assets updated successfully.",
			});
		else
			res.json({ variant: "error", message: "Falied to update Assets." });
	} catch (error) {
		res.json({ variant: "error", message: "Falied to update Assets." });
	}
});

/**
 * @route GET /api/admin/assets/remove-assets/:id
 * @description Remove assets
 * @access Public
 */
router.delete("/remove-assets/:id", async (req, res) => {
	try {
		const assets = await Asset.findOne({ _id: req.params.id });
		await assets.remove();
		res.json({
			variant: "success",
			message: "assets removed successfully.",
		});
	} catch (error) {
		res.json({ variant: "error", message: "Falied to remove assets." });
	}
});

/**
 * @route Post /api/admin/assets/toggle-active-assets/:id
 * @description Update toggle-active-assets
 * @access Public
 */
router.post("/toggle-assets/:id", async (req, res) => {
	try {
		const toggleName = req.body.name;
		const assets = await Asset.findOne({ _id: req.params.id });
		assets[toggleName] = !assets[toggleName];
		await assets.save();
		res.json({
			variant: "success",
			message: "assets updated successfully.",
		});
	} catch (error) {
		res.json({ variant: "error", message: "Falied to remove assets." });
	}
});

module.exports = router;
