import axios from "axios";
import { apiUrl } from "../../config";

export const create = (data) =>
	axios
		.post(`${apiUrl}/api/admin/admin-user/create-admin`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const update = (data) =>
	axios
		.post(`${apiUrl}/api/admin/admin-user/update-admin/${data._id}`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const remove = (id) =>
	axios
		.get(`${apiUrl}/api/admin/admin-user/remove-admin/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const createPermission = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/role-permission/create-role-permissions`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const updatePermission = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/role-permission/update-role-permission/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const togglePermission = (id) =>
	axios
		.post(
			`${apiUrl}/api/admin/role-permission/toggle-active-role-permission/${id}`
		)
		.then((response) => response)
		.catch((err) => err.response);

export const removePermission = (id) =>
	axios
		.get(`${apiUrl}/api/admin/role-permission/remove-role-permission/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const createRole = (data) =>
	axios
		.post(`${apiUrl}/api/admin/role/create-role`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const updateRole = (data) =>
	axios
		.post(`${apiUrl}/api/admin/role/update-role/${data._id}`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const removeRole = (id) =>
	axios
		.get(`${apiUrl}/api/admin/role/remove-role/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const toggleRole = (id) =>
	axios
		.post(`${apiUrl}/api/admin/role/toggle-active-role/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const getPermissions = () =>
	axios
		.get(`${apiUrl}/api/admin/role-permission/get-active-role-permissions`)
		.then((response) => response)
		.catch((err) => err.response);

export const getRoles = () =>
	axios
		.get(`${apiUrl}/api/admin/role/get-active-roles`)
		.then((response) => response)
		.catch((err) => err.response);

export const createBankDetail = (data) =>
	axios
		.post(`${apiUrl}/api/admin/admin-user/create-bank-detail`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const updateBankDetail = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/admin-user/update-bank-detail/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const removeBankDetail = (id) =>
	axios
		.delete(`${apiUrl}/api/admin/admin-user/remove-bank-detail/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const getBankDetails = () =>
	axios
		.get(`${apiUrl}/api/admin/admin-user/get-bank-details`)
		.then((response) => response)
		.catch((err) => err.response);
