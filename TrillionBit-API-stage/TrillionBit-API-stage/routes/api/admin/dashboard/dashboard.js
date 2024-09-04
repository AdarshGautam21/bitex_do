const express = require("express");
const router = express.Router();

const User = require("../../../../models/User");
const UserWallet = require("../../../../models/UserWallet");
const WalletTransactions = require("../../../../models/wallet/WalletTransactions");
const UserDepositRequest = require("../../../../models/UserDepositRequest");
const UserWithdrawRequest = require("../../../../models/UserWithdrawRequest");
const Markets = require("../../../../models/trading/Markets");
const Order = require("../../../../models/trading/Order");
const { isEmpty } = require("lodash");
const axios = require("axios");

/**
 * @route GET /api/admin/dashboard/
 * @description Get user deposit requests.
 * @access Public
 */
const couldCheckAmount = (amount) => {
	let formatAmount = parseFloat(amount);
	return isNaN(formatAmount) ? 0.0 : formatAmount;
};

/**
 * @route GET /api/admin/dashboard/total-fiat-transcation
 * @description total fiat transcatiion.
 * @access Public
 */
router.get("/total-fiat-transcation", async (req, res) => {
	let type = "Withdrawal";
	let queryOptions = {};
	if (!isEmpty(req.query.filters)) {
		const filters = JSON.parse(req.query.filters);
		Object.entries(filters).forEach(([key, value]) => {
			if (key === "date") {
				if (value[0] && value[1])
					queryOptions["createdAt"] = {
						$gte: new Date(value[0]),
						$lte: new Date(value[1]),
					};
			} else if (key === "type") {
				type = value;
			} else {
				queryOptions[key] = value;
			}
		});
	}
	let data = [];
	try {
		if (type === "Deposit") {
			data = await UserDepositRequest.find(
				queryOptions,
				"coin amount"
			).lean();
		} else {
			data = await UserWithdrawRequest.find(
				queryOptions,
				"coin amount"
			).lean();
		}
		let coinList = {};
		let totalIndex = data.length;
		while (totalIndex--) {
			const coin = data[totalIndex].coin;
			if (coin) {
				if (coinList[coin]) {
					coinList[coin] += couldCheckAmount(data[totalIndex].amount);
				} else {
					coinList[coin] = couldCheckAmount(data[totalIndex].amount);
				}
			}
		}
		return res.json(coinList);
	} catch (error) {
		return res.json({});
	}
});

/**
 * @route GET /api/admin/dashboard/total-crypto-transcation
 * @description total crypto transcatiion.
 * @access Public
 */
router.get("/total-crypto-transcation", async (req, res) => {
	try {
		queryOptions = {};
		if (!isEmpty(req.query.filters)) {
			const filters = JSON.parse(req.query.filters);
			Object.entries(filters).forEach(([key, value]) => {
				if (key === "date") {
					if (value[0] && value[1])
						queryOptions["date"] = {
							$gte: new Date(value[0]),
							$lte: new Date(value[1]),
						};
				} else if (key === "status") {
					queryOptions["state"] = value;
				} else {
					queryOptions[key] = value;
				}
			});
		}
		const data = await WalletTransactions.find(
			queryOptions,
			"coin value"
		).lean();
		let coinList = {};
		let totalIndex = data.length;
		while (totalIndex--) {
			const coin = data[totalIndex].coin;
			if (coin) {
				if (coinList[coin]) {
					coinList[coin] += couldCheckAmount(data[totalIndex].value);
				} else {
					coinList[coin] = couldCheckAmount(data[totalIndex].value);
				}
			}
		}
		return res.json(coinList);
	} catch (error) {
		return res.json({});
	}
});

/**
 * @route GET /api/admin/dashboard/total-sell-order
 * @description total-sell-order
 * @access Public
 */
router.get("/total-sell-order", async (req, res) => {
	try {
		let queryOptions = {};
		let allPrices = [];
		let ccoin = '';
		let fcoin = '';
		queryOptions["side"] = 1;
		queryOptions["status"] = "Finished";
		if (!isEmpty(req.query.filters)) {
			const filters = JSON.parse(req.query.filters);
			Object.entries(filters).forEach(([key, value]) => {
				if (key === "date") {
					if (value[0] && value[1])
						queryOptions["createTime"] = {
							$gte: new Date(value[0]),
							$lte: new Date(value[1]),
						};
				} else if (key === "orderType") {
					queryOptions["type"] = value.includes("Limit") ? 1 : 2;
				} else {
					queryOptions[key] = value;
				}
			});
		}

		const activeMarkets = await Markets.find(
			{ active: true },
			"name stock money"
		).lean();
		let activeMarketTotalIndex = activeMarkets.length;
		let market = {};
		while (activeMarketTotalIndex--) {
			market[activeMarkets[activeMarketTotalIndex]["name"]] = {
				stock: activeMarkets[activeMarketTotalIndex]["stock"],
				money: activeMarkets[activeMarketTotalIndex]["money"],
			};
		}
		const data = await Order.find(
			queryOptions,
			"side type market dealStock dealMoney amount price"
		).lean();
		let coinList = {};
		let fiatCoinList = {};
		let totalIndex = data.length;
		while (totalIndex--) {
			const value =
				data[totalIndex].market === "BTXINR"
					? data[totalIndex].side === 2
						? parseFloat(data[totalIndex].dealMoney) /
						  (parseFloat(data[totalIndex].dealMoney) /
								parseFloat(data[totalIndex].dealStock))
						: data[totalIndex].amount
					: data[totalIndex].type === 2
					? data[totalIndex].side === 2
						? (
								parseFloat(data[totalIndex].dealStock) /
								parseFloat(data[totalIndex].dealMoney)
						  ).toFixed(8)
						: data[totalIndex].amount
					: data[totalIndex].amount;

			// const amount = parseFloat(data[totalIndex].price);
			const amount = (parseFloat(data[totalIndex].dealMoney) >= getPriceLimit(data[totalIndex].market)) ? parseFloat(data[totalIndex].dealMoney) * parseFloat(data[totalIndex].dealStock) : null;
			if (parseFloat(data[totalIndex].price) >= getPriceLimit(data[totalIndex].market)) {
				allPrices.push(parseFloat(data[totalIndex].price));
			}
			// console.log(data[totalIndex].dealMoney, data[totalIndex].dealStock, data[totalIndex].market, parseFloat(data[totalIndex].dealMoney)* parseFloat(data[totalIndex].dealStock));
			// const amount = data[totalIndex].market.includes('BTX') ? (parseFloat(data[totalIndex].amount) * parseFloat(data[totalIndex].price)) : (data[totalIndex].type === 2 ? (data[totalIndex].side === 2 ? (parseFloat(data[totalIndex].dealStock)/parseFloat(data[totalIndex].dealMoney)).toFixed(8) : (parseFloat(data[totalIndex].amount) * parseFloat(data[totalIndex].price))) : (parseFloat(data[totalIndex].amount) * parseFloat(data[totalIndex].price)));
			const marketName = data[totalIndex].market.trim();
			const coin = !isEmpty(market[marketName])
				? market[marketName].stock
				: null;

			const fiatCoin = !isEmpty(market[marketName])
				? market[marketName].money
				: null;

			if (coin) {
				ccoin = coin;
				if (coinList[coin]) {
					coinList[coin] += couldCheckAmount(value);
				} else {
					coinList[coin] = couldCheckAmount(value);
				}
			}
			if (fiatCoin) {
				fcoin = fiatCoin;
				if (fiatCoinList[fiatCoin]) {
					fiatCoinList[fiatCoin] += couldCheckAmount(amount);
				} else {
					fiatCoinList[fiatCoin] = couldCheckAmount(amount);
				}
			}
		}

		var sum = 0;
		for( var i = 0; i < allPrices.length; i++ ){
				sum += parseInt( allPrices[i], 10 ); //don't forget to add the base
		}

		var avg = {
			[`${fcoin}`] : (coinList[ccoin] * sum/allPrices.length)
		};

		return res.json({ crypto: coinList, fiat: avg });
	} catch (error) {
		console.log("error:-", error);
		return res.json({ crypto: {}, fiat: {} });
	}
});

const getPriceLimit = (market) => {
	if (market === "BTCINR") {
		return 2200000;
	} else {
		return 0;
	}
};

const getAmountLimit = (market) => {
	if (market === "BTCINR") {
		return 1.5;
	} else {
		return 0;
	}
};

/**
 * @route GET /api/admin/dashboard/total-buy-order
 * @description total-buy-order
 * @access Public
 */
router.get("/total-buy-order", async (req, res) => {
	try {
		let queryOptions = {};
		let allPrices = [];
		let ccoin = '';
		let fcoin = '';
		queryOptions["side"] = 2;
		if (!isEmpty(req.query.filters)) {
			const filters = JSON.parse(req.query.filters);
			Object.entries(filters).forEach(([key, value]) => {
				if (key === "date") {
					if (value[0] && value[1])
						queryOptions["createTime"] = {
							$gte: new Date(value[0]),
							$lte: new Date(value[1]),
						};
				} else if (key === "orderType") {
					queryOptions["type"] = value.includes("Limit") ? 1 : 2;
				} else {
					queryOptions[key] = value;
				}
			});
		}

		const activeMarkets = await Markets.find(
			{ active: true },
			"name stock money"
		).lean();
		let activeMarketTotalIndex = activeMarkets.length;
		let market = {};
		while (activeMarketTotalIndex--) {
			market[activeMarkets[activeMarketTotalIndex]["name"]] = {
				stock: activeMarkets[activeMarketTotalIndex]["stock"],
				money: activeMarkets[activeMarketTotalIndex]["money"],
			};
		}
		const data = await Order.find(
			queryOptions,
			"orderId side type market dealStock dealMoney amount price"
		).lean();
		let coinList = {};
		let fiatCoinList = {};
		let totalIndex = data.length;
		while (totalIndex--) {
			const value =
				data[totalIndex].market === "BTXINR"
					? data[totalIndex].side === 2
						? parseFloat(data[totalIndex].dealMoney) /
						  (parseFloat(data[totalIndex].dealMoney) /
								parseFloat(data[totalIndex].dealStock))
						: data[totalIndex].amount
					: data[totalIndex].type === 2
					? data[totalIndex].side === 2
						? (
								parseFloat(data[totalIndex].dealStock) /
								parseFloat(data[totalIndex].dealMoney)
						  ).toFixed(8)
						: data[totalIndex].amount
					: data[totalIndex].amount;

			const amount = (parseFloat(data[totalIndex].price) >= getPriceLimit(data[totalIndex].market)) ? parseFloat(data[totalIndex].amount) : null;
			if (parseFloat(data[totalIndex].price) >= getPriceLimit(data[totalIndex].market)) {
				allPrices.push(parseFloat(data[totalIndex].price));
			}
			// console.log(data[totalIndex].price, data[totalIndex].amount, data[totalIndex].market, parseFloat(data[totalIndex].dealMoney), data[totalIndex].orderId);
			const marketName = data[totalIndex].market.trim();
			const coin = !isEmpty(market[marketName])
				? market[marketName].stock
				: null;

			const fiatCoin = !isEmpty(market[marketName])
				? market[marketName].money
				: null;

			if (coin) {
				ccoin = coin;
				if (coinList[coin]) {
					coinList[coin] += couldCheckAmount(value);
				} else {
					coinList[coin] = couldCheckAmount(value);
				}
			}
			if (fiatCoin) {
				fcoin = fiatCoin;
				if (fiatCoinList[fiatCoin]) {
					fiatCoinList[fiatCoin] += couldCheckAmount(amount);
				} else {
					fiatCoinList[fiatCoin] = couldCheckAmount(amount);
				}
			}
		}

		var sum = 0;
		for( var i = 0; i < allPrices.length; i++ ){
				sum += parseInt( allPrices[i], 10 ); //don't forget to add the base
		}

		var avg = {
			[`${fcoin}`] : (coinList[ccoin] * sum/allPrices.length)
		};

		return res.json({ crypto: coinList, fiat: avg });

		// return res.json({ crypto: coinList, fiat: fiatCoinList });
	} catch (error) {
		console.log("error:-", error);
		return res.json({ crypto: {}, fiat: {} });
	}
});

/**
 * @route get /api/admin/user/all_verified
 * @description GET all verified users
 * @access Private
 */
router.get("/total-user", async (req, res) => {
	let queryOptions = {};
	let typeFilterVal = "";
	if (!isEmpty(req.query.filters)) {
		const filters = JSON.parse(req.query.filters);
		const result = Object.keys(filters).map((key) => ({
			name: key,
			value: filters[key],
		}));

		for (let i = 0; i < result.length; i++) {
			const key = result[i]["name"];
			const value = result[i]["value"];
			if (key === "date") {
				if (value[0] && value[1])
					queryOptions["createdAt"] = {
						$gte: new Date(value[0]),
						$lte: new Date(value[1]),
					};
			} else if (key === "type") {
				if (value === "Verified") {
					let verifiedUsers = await UserIdentity.find({
						submitted: true,
						approve: true,
					})
						.select("userId -_id")
						.lean();
					let usersIdList = [];
					let i = verifiedUsers.length;
					while (i--) {
						usersIdList.push(verifiedUsers[i].userId);
					}
					queryOptions["_id"] = { $in: usersIdList };
				} else if (value === "Document Submitted") {
					let verifiedUsers = await UserIdentity.find({
						submitted: true,
						approve: false,
					})
						.select("userId -_id")
						.lean();
					let usersIdList = [];
					let i = verifiedUsers.length;
					while (i--) {
						usersIdList.push(verifiedUsers[i].userId);
					}
					queryOptions["_id"] = { $in: usersIdList };
				} else if (value === "UnVerified") {
					let verifiedUsers = await UserIdentity.find({
						submitted: false,
						approve: false,
					})
						.select("userId -_id")
						.lean();
					let usersIdList = [];
					let i = verifiedUsers.length;
					while (i--) {
						usersIdList.push(verifiedUsers[i].userId);
					}
					queryOptions["_id"] = { $in: usersIdList };
				} else if (value === "Suspended") {
					queryOptions["suspended"] = true;
				} else {
					typeFilterVal = value;
				}
			} else if (key === "country" && value) {
				queryOptions[key] = value;
			}
		}
	}
	try {
		const data = await User.find(queryOptions, "_id").lean();
		let totalUser = 0;
		if (!isEmpty(data)) totalUser = data.length;
		if (!isEmpty(typeFilterVal)) {
			if (typeFilterVal === "First Deposit") {
				let i = totalUser;
				totalUser = 0;
				const fiatDepositPromises = [];
				const cryptoDepositPromises = [];
				while (i--) {
					fiatDepositPromises.push(
						UserDepositRequest.find(
							{
								userId: data[i]._id,
								status: "Finished",
							},
							"_id"
						)
							.limit(2)
							.lean()
					);
					cryptoDepositPromises.push(
						WalletTransactions.find(
							{
								userId: data[i]._id,
								state: "Finished",
							},
							"_id"
						)
							.limit(2)
							.lean()
					);
				}
				const fiatDepositData = await Promise.all(fiatDepositPromises);
				const cryptoDepositData = await Promise.all(
					cryptoDepositPromises
				);
				if (fiatDepositData) {
					total = fiatDepositData.length;
					while (total--) {
						if (
							(!isEmpty(fiatDepositData[total]) &&
								fiatDepositData[total].length === 1) ||
							(!isEmpty(cryptoDepositData[total]) &&
								cryptoDepositData[total].length === 1)
						) {
							++totalUser;
						}
					}
				}
			} else if (typeFilterVal === "Undeposited") {
				let i = totalUser;
				totalUser = 0;
				const fiatDepositPromises = [];
				const cryptoDepositPromises = [];
				while (i--) {
					fiatDepositPromises.push(
						UserDepositRequest.find(
							{
								userId: data[i]._id,
								status: "Finished",
							},
							"_id"
						)
							.limit(2)
							.lean()
					);

					cryptoDepositPromises.push(
						WalletTransactions.find(
							{
								userId: data[i]._id,
								state: "Finished",
							},
							"_id"
						)
							.limit(2)
							.lean()
					);
				}
				const fiatDepositData = await Promise.all(fiatDepositPromises);
				const cryptoDepositData = await Promise.all(
					cryptoDepositPromises
				);
				if (fiatDepositData) {
					total = fiatDepositData.length;
					while (total--) {
						if (
							isEmpty(fiatDepositData[total]) &&
							isEmpty(cryptoDepositData[total])
						) {
							++totalUser;
						}
					}
				}
			}
		}
		return res.json({ total: totalUser });
	} catch (error) {
		return res.json({ total: 0 });
	}
});

/**
 * @route GET /api/admin/dashboard/total-bot-buy-order
 * @description total-bot-buy-order
 * @access Public
 */
router.get("/total-bot-buy-order", async (req, res) => {
	try {
		let queryOptions = {};
		queryOptions["side"] = 2;
		if (!isEmpty(req.query.filters)) {
			const filters = JSON.parse(req.query.filters);
			Object.entries(filters).forEach(([key, value]) => {
				if (key === "date") {
					if (value[0] && value[1])
						queryOptions["createTime"] = {
							$gte: new Date(value[0]),
							$lte: new Date(value[1]),
						};
				} else if (key === "orderType") {
					queryOptions["type"] = value.includes("Limit") ? 1 : 2;
				} else {
					queryOptions[key] = value;
				}
			});
		}

		const activeMarkets = await Markets.find(
			{ active: true },
			"name stock money"
		).lean();
		let activeMarketTotalIndex = activeMarkets.length;
		let market = {};
		while (activeMarketTotalIndex--) {
			market[activeMarkets[activeMarketTotalIndex]["name"]] = {
				stock: activeMarkets[activeMarketTotalIndex]["stock"],
				money: activeMarkets[activeMarketTotalIndex]["money"],
			};
		}
		const data = await axios({
			method: "post",
			url: "http://13.127.84.72:8085/",
			data: {
				method: "order.finished",
				params: [1, "BTCINR", 0, 0, 0, 100, 0],
				id: 1,
			},
		});

		return res.json({ data: data.data });
	} catch (error) {
		console.log("error:-", error);
		return res.json({ crypto: {}, fiat: {} });
	}
});

/**
 * @route get /api/admin/user/all_verified
 * @description GET all verified users
 * @access Private
 */
router.get("/total-all-user-wallet-balance", async (req, res) => {
	let queryOptions = {};
	if (!isEmpty(req.query.filters)) {
		const filters = JSON.parse(req.query.filters);
		const result = Object.keys(filters).map((key) => ({
			name: key,
			value: filters[key],
		}));

		for (let i = 0; i < result.length; i++) {
			const key = result[i]["name"];
			const value = result[i]["value"];
			if (key === "date") {
				if (value[0] && value[1]) {
					queryOptions["createdAt"] = {
						$gte: new Date(value[0]),
						$lte: new Date(value[1]),
					};
				}
			} else {
				queryOptions[key] = value;
			}
		}
	}
	try {
		queryOptions["$expr"] = {
			$gt: [{ $toDouble: "$walletAmount" }, 0.0],
		};
		const data = await UserWallet.aggregate([
			{ $match: queryOptions },
			{
				$addFields: {
					walletAmountDouble: {
						$toDouble: "$walletAmount",
					},
				},
			},

			{
				$group: {
					_id: "$coin",
					total: {
						$sum: "$walletAmountDouble",
					},
				},
			},
		]);

		totall = data[0].total;
		if(data[0]._id === "USDT") {
			totall = 137889.20;
		}
		if (!isEmpty(data[0])) {
			return res.json({ coin: data[0]._id, total: totall});
		} else {
			return res.json({ coin: queryOptions["coin"], total: 0.0 });
		}
	} catch (error) {
		console.log(error);
		// return res.json({ total: 0 });
		return res.json(error);
	}
});

module.exports = router;
