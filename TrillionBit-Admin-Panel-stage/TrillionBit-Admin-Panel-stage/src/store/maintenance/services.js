import axios from "axios";
import { apiUrl } from "../../config";

export const createWalletMaintenace = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/wallet-maintenance/create-wallet-maintenance`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const updateWalletMaintenace = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/wallet-maintenance/update-wallet-maintenance/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const toggleWalletMaintenace = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/wallet-maintenance/toggle-wallet-maintenance/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const removeWalletMaintenace = (id) =>
	axios
		.delete(
			`${apiUrl}/api/admin/wallet-maintenance/remove-wallet-maintenance/${id}`
		)
		.then((response) => response)
		.catch((err) => err.response);

export const createTradingMaintenace = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/trading-maintenance/create-trading-maintenance`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const updateTradingMaintenace = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/trading-maintenance/update-trading-maintenance/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const removeTradingMaintenace = (id) =>
	axios
		.delete(
			`${apiUrl}/api/admin/trading-maintenance/remove-trading-maintenance/${id}`
		)
		.then((response) => response)
		.catch((err) => err.response);

export const toggleTradingMaintenace = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/trading-maintenance/toggle-trading-maintenance/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const toggleMaintenace = (id) =>
	axios
		.post(
			`${apiUrl}/api/admin/maintenance/toggle-maintenance/${id}`
		)
		.then((response) => response)
		.catch((err) => err.response);
