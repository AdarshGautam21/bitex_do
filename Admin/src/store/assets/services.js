import axios from "axios";
import { apiUrl } from "../../config";

export const get = () =>
	axios
		.get(`${apiUrl}/api/trading/assets/lists`)
		.then((response) => response)
		.catch((err) => err.response);

export const getActive = () =>
	axios
		.get(`${apiUrl}/api/trading/get_active_wallets`)
		.then((response) => response)
		.catch((err) => err.response);

export const toggle = ({ id, name }) =>
	axios
		.post(`${apiUrl}/api/admin/assets/toggle-assets/${id}`, { name })
		.then((response) => response)
		.catch((err) => err.response);

export const remove = (id) =>
	axios
		.delete(`${apiUrl}/api/admin/assets/remove-assets/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const update = (data) =>
	axios
		.post(`${apiUrl}/api/admin/assets/update-assets/${data._id}`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const create = (data) =>
	axios
		.post(`${apiUrl}/api/admin/assets/create-assets`, data)
		.then((response) => response)
		.catch((err) => err.response);
