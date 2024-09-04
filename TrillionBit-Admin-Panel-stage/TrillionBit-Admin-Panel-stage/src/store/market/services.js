import axios from "axios";
import { apiUrl } from "../../config";

export const toggle = (id) =>
	axios
		.post(`${apiUrl}/api/admin/market/toggle-active-market/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const remove = (id) =>
	axios
		.delete(`${apiUrl}/api/admin/market/remove-market/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const update = (data) =>
	axios
		.post(`${apiUrl}/api/admin/market/update-market/${data._id}`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const create = (data) =>
	axios
		.post(`${apiUrl}/api/admin/market/create-market`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const getActive = () =>
	axios
		.get(`${apiUrl}/api/admin/market/get-active-with-select-markets`)
		.then((response) => response)
		.catch((err) => err.response);
