import axios from "axios";
import { apiUrl } from "../../config";

export const remove = (id) =>
	axios
		.delete(`${apiUrl}/api/admin/assets/remove-admin-wallet-address/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const update = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/assets/update-admin-wallet-address/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const create = (data) =>
	axios
		.post(`${apiUrl}/api/admin/assets/create-admin-wallet-address`, data)
		.then((response) => response)
		.catch((err) => err.response);
