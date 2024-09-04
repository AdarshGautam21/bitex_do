const express = require("express");
const router = express.Router();

const User = require("../../../../models/User");
const WalletTransactions = require("../../../../models/wallet/WalletTransactions");
const UserDepositRequest = require("../../../../models/UserDepositRequest");
const UserWithdrawRequest = require("../../../../models/UserWithdrawRequest");
const Notification = require("../../../../models/Notifications");
const isEmpty = require("../../../../validation/isEmpty");
const UserIdentity = require('../../../../models/UserIdentity');

/**
 * @route GET /api/admin/dashboard/get-notifications
 * @description Get all get-notifications
 * @access Public
 */

const userDepositRequestNotifications = async (id) => {
	const userDepositRequest = await UserDepositRequest.findOne(
		{
			_id: id,
			status: "Pending",
		},
		"type transactionId paymentType coin amount status"
	).lean();

	if (!isEmpty(userDepositRequest))
		return {
			title: `Deposit Request of ${userDepositRequest.coin}: ${userDepositRequest.amount}`,
			details: userDepositRequest,
		};
	return null;
};

const userWithdrawRequestNotifications = async (id) => {
	const userWithdrawRequest = await UserWithdrawRequest.findOne(
		{
			_id: id,
			status: "Pending",
		},
		"coin amount noteNumber referenceNumber status"
	).lean();

	if (!isEmpty(userWithdrawRequest))
		return {
			title: `Withdrawal Request of ${userWithdrawRequest.coin}: ${userWithdrawRequest.amount}`,
			details: userWithdrawRequest,
		};
	return null;
};

const walletTransactionNotifications = async (id) => {
	const walletTransactions = await WalletTransactions.findOne(
		{
			_id: id,
			state: "Pending",
		},
		"txid fees rate state coin value type"
	).lean();

	if (!isEmpty(walletTransactions))
		return {
			title: `${walletTransactions.type} Request of ${walletTransactions.coin}: ${walletTransactions.value}`,
			details: walletTransactions,
		};
	return null;
};

const UserIdentityNotifications = async (id) => {
	const userIdentity = await UserIdentity.findOne(
		{
			_id: id,
			submitted: true,
			approve: false,
		},
		"submitted approve userId"
	).lean();

	if (!isEmpty(userIdentity))
		return {
			title: `Verification Pending.`,
			details: userIdentity,
		};
	return null;
};

const getModalNameAndDetails = {
	WalletTransactions: walletTransactionNotifications,
	UserDepositRequest: userDepositRequestNotifications,
	UserWithdrawRequest: userWithdrawRequestNotifications,
	UserIdentity: UserIdentityNotifications,
};

router.get("/get-notifications", async (req, res) => {
	// let perPage = req.query.rows ? parseInt(req.query.rows) : 10;
	// let page = req.query.page ? req.query.page : 1;
	let sort = { createdAt: -1 };
	let queryOptions = { active: true, isRead: false };
	try {
		let notifications = await Notification.find(queryOptions)
			.sort(sort)
			.populate({
				path: "user",
				select: "firstname lastname _id avatar",
				options: { lean: true },
			})
			.lean();
		let notificationData = [];
		let notificationCount = 0;
		if (!isEmpty(notifications)) {
			let notificationIndex = notifications.length;
			let notificationLists = notifications;
			while (notificationIndex--) {
				if (!isEmpty(notificationLists[notificationIndex])) {
					const documentName =
						notificationLists[notificationIndex][
							"notificationType"
						]["documentName"];
					const id =
						notificationLists[notificationIndex][
							"notificationType"
						]["id"];

					const details = await getModalNameAndDetails[documentName](
						id
					);
					if (!isEmpty(details)) {
						notificationCount++;
						notificationData.unshift({
							...notificationLists[notificationIndex],
							...details,
						});
					} else {
						await Notification.findOneAndUpdate(
							{ _id: notificationLists[notificationIndex]._id },
							{ active: false, isRead: true }
						);
					}
				}
			}
			notifications = notificationData;
		}
		return res.json({data: notifications, count: notificationCount});
	} catch (error) {
		console.log("ERR:::", error);
		return res.json([]);
	}
});

/**
 * @route POST /api/admin/dashboard/update-notifications
 * @description POST update update-notifications
 * @access Private
 */
 router.post("/update-notifications/:id", async (req, res) => {
	try {
		const updateData = {
			active: false, isRead: true
		};
		const updatedNotification = await Notification.findOneAndUpdate(
			{ _id: req.params.id },
			updateData,
			{
				upsert: true,
				new: true,
			}
		);
		if (!isEmpty(updatedNotification))
			res.json({
				variant: "success",
				message: "Notification updated successfully.",
			});
		else
			res.json({ variant: "error", message: "Falied to update Notification." });
	} catch (error) {
		res.json({ variant: "error", message: "Falied to update Notification." });
	}
});

module.exports = router;
