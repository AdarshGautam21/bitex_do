import axios from "axios";
import { apiUrl } from "../../config";

export const getBitexSaving = () =>
	axios
		.get(`${apiUrl}/api/admin/bitex-saving/get-bitex-saving-coins`)
		.then((response) => response)
		.catch((err) => err.response);

export const getActiveBitexSaving = () =>
	axios
		.get(`${apiUrl}/api/admin/bitex-saving/get-active-bitex-saving-coins`)

		.then((response) => response)
		.catch((err) => err.response);

export const create = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/bitex-saving/create-bitex-saving-coins`,
			data
		)

		.then((response) => response)
		.catch((err) => err.response);

export const update = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/bitex-saving/update-bitex-saving-coins/${data._id}`,
			data
		)

		.then((response) => response)
		.catch((err) => err.response);

export const toggle = (id) =>
	axios
		.post(
			`${apiUrl}/api/admin/bitex-saving/toggle-bitex-saving-coins/${id}`
		)
		.then((response) => response)
		.catch((err) => err.response);

export const remove = (id) =>
	axios
		.get(`${apiUrl}/api/admin/bitex-saving/remove-bitex-saving-coins/${id}`)
		.then((response) => response)
		.catch((err) => err.response);
