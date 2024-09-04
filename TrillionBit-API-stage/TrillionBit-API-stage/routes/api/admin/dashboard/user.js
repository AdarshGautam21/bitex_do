const express = require("express");
const router = express.Router();

const User = require("../../../../models/User");
const WalletTransactions = require("../../../../models/wallet/WalletTransactions");
const UserDepositRequest = require("../../../../models/UserDepositRequest");
const UserWithdrawRequest = require("../../../../models/UserWithdrawRequest");
const Markets = require("../../../../models/trading/Markets");
const Order = require("../../../../models/trading/Order");
const TwinBcrypt = require("twin-bcrypt");

/**
 * @route GET /api/admin/dashboard/
 * @description Get user deposit requests.
 * @access Public
 */

const couldCheckAmount = (amount) => {
	let formatAmount = parseFloat(amount);
	return isNaN(formatAmount) ? 0.0 : formatAmount;
};

router.get("/get-user-total-deposit/:id/:status", async (req, res) => {
	try {
		const userDepositRequests = await UserDepositRequest.find(
			{ userId: req.params.id, status: req.params.status },
			"coin amount"
		).lean();
		let coinList = {};
		let totalUserDepositIndex = userDepositRequests.length;
		while (totalUserDepositIndex--) {
			const coin = userDepositRequests[totalUserDepositIndex].coin;
			if (coin) {
				if (coinList[coin]) {
					coinList[coin] += couldCheckAmount(
						userDepositRequests[totalUserDepositIndex].amount
					);
				} else {
					coinList[coin] = couldCheckAmount(
						userDepositRequests[totalUserDepositIndex].amount
					);
				}
			}
		}
		res.json(coinList);
	} catch (error) {
		res.json({});
	}
});

router.get("/get-user-total-withdrawal/:id/:status", async (req, res) => {
	try {
		const userWithdrawRequest = await UserWithdrawRequest.find(
			{ userId: req.params.id, status: req.params.status },
			"coin amount"
		).lean();
		let coinList = {};
		let userWithdrawRequestIndex = userWithdrawRequest.length;
		while (userWithdrawRequestIndex--) {
			const coin = userWithdrawRequest[userWithdrawRequestIndex].coin;
			if (coin) {
				if (coinList[coin]) {
					coinList[coin] += couldCheckAmount(
						userWithdrawRequest[userWithdrawRequestIndex].amount
					);
				} else {
					coinList[coin] = couldCheckAmount(
						userWithdrawRequest[userWithdrawRequestIndex].amount
					);
				}
			}
		}
		res.json(coinList);
	} catch (error) {
		res.json({});
	}
});

router.get(
	"/get-user-crypto-total-withdrawal/:id/:status",
	async (req, res) => {
		try {
			const walletTransactions = await WalletTransactions.find(
				{
					userId: req.params.id,
					type: "Withdrawal",
					state: req.params.status,
				},
				"coin value"
			).lean();
			let coinList = {};
			let walletTransactionsIndex = walletTransactions.length;
			while (walletTransactionsIndex--) {
				const coin = walletTransactions[walletTransactionsIndex].coin;
				if (coin) {
					if (coinList[coin]) {
						coinList[coin] += couldCheckAmount(
							walletTransactions[walletTransactionsIndex].value
						);
					} else {
						coinList[coin] = couldCheckAmount(
							walletTransactions[walletTransactionsIndex].value
						);
					}
				}
			}
			res.json(coinList);
		} catch (error) {
			res.json({});
		}
	}
);

router.get("/get-user-crypto-total-deposit/:id/:status", async (req, res) => {
	try {
		const walletTransactions = await WalletTransactions.find(
			{
				userId: req.params.id,
				type: "Deposit",
				state: req.params.status,
			},
			"coin value"
		).lean();
		let coinList = {};
		let walletTransactionsIndex = walletTransactions.length;
		while (walletTransactionsIndex--) {
			const coin = walletTransactions[walletTransactionsIndex].coin;
			if (coin) {
				if (coinList[coin]) {
					coinList[coin] += couldCheckAmount(
						walletTransactions[walletTransactionsIndex].value
					);
				} else {
					coinList[coin] = couldCheckAmount(
						walletTransactions[walletTransactionsIndex].value
					);
				}
			}
		}
		res.json(coinList);
	} catch (error) {
		res.json({});
	}
});

router.post("/change-user-password/:id/", async (req, res) => {
	try {
		User.findOne({ _id: req.params.id }).then((user) => {
			// Check for user
			if (!user) {
				return res.status(400).json({
					variant: "error",
					message: "User not found.",
				});
			}
			TwinBcrypt.hash(req.body.password, function (hash) {
				user.password = hash;
				user.save()
					.then((user) => {
						res.json({
							variant: "success",
							message: "Password successfully updated.",
						});
					})
					.catch((err) =>
						res.status(400).json({
							variant: "error",
							message: "User not found.",
						})
					);
			});
		});
	} catch (error) {
		res.status(400).json({
			variant: "error",
			message: "User not found.",
		});
	}
});

module.exports = router;
