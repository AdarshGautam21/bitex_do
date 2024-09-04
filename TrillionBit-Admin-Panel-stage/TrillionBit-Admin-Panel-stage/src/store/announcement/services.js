import axios from "axios";
import { apiUrl } from "../../config";

export const remove = (id) =>
	axios
		.delete(`${apiUrl}/api/admin/users/remove_announcements/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const update = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/market/update_announcements/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const create = (data) =>
	axios
		.post(`${apiUrl}/api/admin/users/create_announcements`, data)
		.then((response) => response)
		.catch((err) => err.response);
