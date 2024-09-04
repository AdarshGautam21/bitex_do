const express = require("express");
const router = express.Router();
const BitexSavingCoin = require("../../../models/bitexSaving/BitexSavingCoin");
const BitexSavingUserWalletHistory = require("../../../models/bitexSaving/BitexSavingUserWalletHistory");
const isEmpty = require("../../../validation/isEmpty");

/**
 * @route GET /api/admin/bitex-saving/get-bitex-saving-coins
 * @description Get all article-categories
 * @access Public
 */
router.get("/get-bitex-saving-coins", async (req, res) => {
	const bitexSavingCoin = await BitexSavingCoin.find();

	if (bitexSavingCoin.length > 0) {
		res.json(bitexSavingCoin);
	} else {
		res.status(400).json({ variant: "error", message: "No coins found" });
	}
});

/**
 * @route GET /api/admin/bitex-saving/get-bitex-saving-coins
 * @description Get all article-categories
 * @access Public
 */
router.get("/get-bitex-saving-plan-with-pagination", async (req, res) => {
	let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
	let page = req.query.page ? req.query.page : 1;
	let sort = { createdAt: -1 };
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
					coin: regex,
				},
				{
					"days.numberOfDays": regex,
				},
				{
					"days.interestRate": regex,
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
		let bitexSavingCoins = await BitexSavingCoin.paginate(queryOptions, {
			lean: true,
			page: parseInt(page),
			limit: parseInt(perPage),
			sort: sort,
		});
		return res.json(bitexSavingCoins);
	} catch (error) {
		return res.json([]);
	}
});

/**
 * @route GET /api/admin/bitex-saving/get-active-bitex-saving-coins
 * @description Get all get-active-bitex-saving-coins
 * @access Public
 */
router.get("/get-active-bitex-saving-coins", async (req, res) => {
	const bitexSavingCoin = await BitexSavingCoin.find({ active: true });

	if (bitexSavingCoin.length > 0) {
		res.json(bitexSavingCoin);
	} else {
		res.status(400).json({ variant: "error", message: "No coins found" });
	}
});

/**
 * @route Post /api/admin/bitex-saving/create-bitex-saving-coins
 * @description Create articles categories
 * @access Public
 */
router.post("/create-bitex-saving-coins", async (req, res) => {
	// console.log("bitexSavingCoin", req.body.days);
	const bitexSavingCoin = new BitexSavingCoin({
		coin: req.body.coin,
		name: req.body.name,
		days: req.body.days,
		annualizedInterestRate: req.body.annualizedInterestRate
			? req.body.annualizedInterestRate
			: "",
		active: req.body.active == true ? true : false,
	});
	bitexSavingCoin
		.save()
		.then((bitexSavingCoin) => {
			res.json({
				variant: "success",
				message: "bitex savings coin created successfully.",
			});
		})
		.catch((err) => {
			res.json({
				variant: "error",
				message: "Falied to create saving coin.",
			});
		});
});
/**
 * @route Post /api/admin/bitex-saving/:id
 * @description Update Bitex Saving
 * @access Public
 */
router.post("/update-bitex-saving-coins/:id", async (req, res) => {
	const bitexSavingCoin = await BitexSavingCoin.findOne({
		_id: req.params.id,
	});
	bitexSavingCoin.coin = req.body.coin;
	bitexSavingCoin.name = req.body.name;
	bitexSavingCoin.days = req.body.days;
	bitexSavingCoin.annualizedInterestRate = req.body.annualizedInterestRate
		? req.body.annualizedInterestRate
		: "";
	bitexSavingCoin.active = req.body.active == true ? req.body.active : false;
	bitexSavingCoin
		.save()
		.then((bitexSavingCoin) => {
			res.json({
				variant: "success",
				message: "Bitex saving coin updated successfully.",
			});
		})
		.catch((err) => {
			res.json({
				variant: "error",
				message: "Falied to update bitex saving coin.",
			});
		});
});

/**
 * @route GET /api/admin/bitex-saving/remove-bitex-saving-coins/:id
 * @description Remove Bitex Saving
 * @access Public
 */
router.get("/remove-bitex-saving-coins/:id", async (req, res) => {
	const bitexSavingCoin = await BitexSavingCoin.findOne({
		_id: req.params.id,
	});
	bitexSavingCoin
		.remove()
		.then((bitexSavingCoin) => {
			res.json({
				variant: "success",
				message: "Bitex saving coin removed successfully.",
			});
		})
		.catch((err) => {
			res.json({
				variant: "error",
				message: "Falied to remove bitex saving coin.",
			});
		});
});

/**
 * @route Post /api/admin/bitex-saving/toggle-bitex-saving-coins/:id
 * @description Update toggle Bitex Saving
 * @access Public
 */
router.post("/toggle-bitex-saving-coins/:id", async (req, res) => {
	const bitexSavingCoin = await BitexSavingCoin.findOne({
		_id: req.params.id,
	});
	bitexSavingCoin.active = bitexSavingCoin.active == true ? false : true;
	bitexSavingCoin
		.save()
		.then((bitexSavingCoin) => {
			res.json({
				variant: "success",
				message: "bitex saving coin updated successfully.",
			});
		})
		.catch((err) => {
			res.json({
				variant: "error",
				message: "Falied to update bitex saving coin.",
			});
		});
});

/**
 * @route GET /api/admin/bitex-saving/get-bitex-saving-wallet-history
 * @description GET all get-bitex-saving-wallet-history
 * @access Public
 */
router.get("/get-bitex-saving-wallet-history", async (req, res) => {
	let queryOptions = {};
	let perPage = req.query.rows ? req.query.rows : 10;
	let page = req.query.page ? req.query.page : 1;

	if (!isEmpty(req.query.search)) {
		try {
			const search = JSON.parse(req.query.search);
			if (!isEmpty(search.search)) {
				let searchText = search.search.trim();
				let regex = new RegExp(searchText, "i");
				queryOptions = {
					$or: [
						{
							coin: regex,
						},
						{
							lockDay: regex,
						},
						{
							amount: regex,
						},
						{
							status: regex,
						},
					],
				};
			}
			if (!isEmpty(search.name)) {
				let searchText = search.name.trim();
				let regex = new RegExp(searchText, "i");
				let userQueryOptions = {
					$or: [
						{
							firstname: regex,
						},
						{
							email: regex,
						},
						{
							lastname: regex,
						},
					],
				};
				let users = await User.find(userQueryOptions, "_id").lean();
				let usersIdList = [];
				let i = users.length;
				while (i--) {
					usersIdList.push(users[i]._id);
				}
				queryOptions["userId"] = { $in: usersIdList };
			}
		} catch (error) {
			console.log("search error", error);
		}
	}

	let sort = { createdAt: -1 };
	if (req.query.sortColumn) {
		sort[req.query.sortColumn] = req.query.sort === "asc" ? 1 : -1;
	}

	if (req.query.filters) {
		const filters = JSON.parse(req.query.filters);
		filters.map((fil) => {
			if (fil.name === "createdAt") {
				if (fil.value[0] && fil.value[1])
					queryOptions["createdAt"] = {
						$gte: new Date(fil.value[0]),
						$lte: new Date(fil.value[1]),
					};
			} else {
				queryOptions[fil.name] =
					fil.value.length === 1 ? fil.value[0] : { $all: fil.value };
			}
		});
	}
	try {
		const bitexSavingUserWalletHistory =
			await BitexSavingUserWalletHistory.paginate(queryOptions, {
				select: "_id user userId coin annualizedInterestRate amount interestAmount totalAmount durationDay lockDay redemptionDate status createdAt",
				page: parseInt(page),
				limit: parseInt(perPage),
				populate: {
					path: "user",
					select: "_id firstname lastname",
					options: { lean: true },
				},
				sort: sort,
				lean: true,
			});
		return res.json(bitexSavingUserWalletHistory);
	} catch (error) {
		return res.json([]);
	}
});

module.exports = router;
