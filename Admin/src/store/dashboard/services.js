import axios from "axios";
import { apiUrl } from "../../config";

export const getNotifications = () =>
	axios
		.get(`${apiUrl}/api/admin/dashboard/notification/get-notifications`)
		.then((response) => response)
		.catch((err) => err.response);

export const updateNotification = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/dashboard/notification/update-notifications/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const getTotalFiatTranscation = (data) =>
	axios
		.get(`${apiUrl}/api/admin/dashboard/total-fiat-transcation`, {
			params: data,
		})
		.then((response) => response)
		.catch((err) => err.response);

export const getTotalCryptoTranscation = (data) =>
	axios
		.get(`${apiUrl}/api/admin/dashboard/total-crypto-transcation`, {
			params: data,
		})
		.then((response) => response)
		.catch((err) => err.response);

export const getTotalSellOrder = (data) =>
	axios
		.get(`${apiUrl}/api/admin/dashboard/total-sell-order`, {
			params: data,
		})
		.then((response) => response)
		.catch((err) => err.response);

export const getTotalBuyOrder = (data) =>
	axios
		.get(`${apiUrl}/api/admin/dashboard/total-buy-order`, {
			params: data,
		})
		.then((response) => response)
		.catch((err) => err.response);

export const getTotalUser = (data) =>
	axios
		.get(`${apiUrl}/api/admin/dashboard/total-user`, {
			params: data,
		})
		.then((response) => response)
		.catch((err) => err.response);

export const getTotalUserWalletHolding = (data) =>
	axios
		.get(`${apiUrl}/api/admin/dashboard/total-all-user-wallet-balance`, {
			params: data,
		})
		.then((response) => response)
		.catch((err) => err.response);
