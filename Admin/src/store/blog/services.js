import axios from "axios";
import { apiUrl } from "../../config";

export const create = (data) =>
	axios
		.post(`${apiUrl}/api/admin/users/save_blog`, data, {
			headers: {
				"Content-Type": "multipart/form-data", //application/x-www-form-urlencoded
			},
		})
		.then((response) => response)
		.catch((err) => err.response);

export const update = (data) =>
	axios
		.post(`${apiUrl}/api/admin/users/update_blog`, data, {
			headers: {
				"Content-Type": "multipart/form-data", //application/x-www-form-urlencoded
			},
		})
		.then((response) => response)
		.catch((err) => err.response);

export const remove = (id) =>
	axios
		.get(`${apiUrl}/api/admin/users/remove_blog/${id}`)
		.then((response) => response)
		.catch((err) => err.response);
