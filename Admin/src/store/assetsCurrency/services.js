import axios from "axios";
import { apiUrl } from "../../config";

export const create = (data) =>
	axios
		.post(`${apiUrl}/api/admin/trading/create_assets_currency`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const update = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/trading/update_assets_currency/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const remove = (id) =>
	axios
		.get(`${apiUrl}/api/admin/trading/delete_assets_currency/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const createAdv = (data) =>
	axios
		.post(`${apiUrl}/api/admin/trading/add_currency_advance_setting`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const updateAdv = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/trading/update_currency_advance_setting/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const removeAdv = (id) =>
	axios
		.get(
			`${apiUrl}/api/admin/trading/remove_currency_advance_setting/${id}`
		)
		.then((response) => response)
		.catch((err) => err.response);
