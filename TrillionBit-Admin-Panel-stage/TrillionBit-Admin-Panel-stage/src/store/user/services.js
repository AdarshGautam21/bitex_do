import axios from "axios";
import { apiUrl } from "../../config";

export const toggleAgent = (userId) =>
	axios
		.post(`${apiUrl}/api/admin/users/toggle_agent/${userId}`)
		.then((response) => response)
		.catch((err) => err.response);

export const toggleSubAgent = (userId) =>
	axios
		.post(`${apiUrl}/api/admin/users/toggle_sub_agent/${userId}`)
		.then((response) => response)
		.catch((err) => err.response);

export const toggleMarginTrading = (userId) =>
	axios
		.post(`${apiUrl}/api/admin/users/toggle_margin_trading/${userId}`)
		.then((response) => response)
		.catch((err) => err.response);

export const basicInfo = (id) =>
	axios
		.get(`${apiUrl}/api/admin/users/get-user/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const identityInfo = (id) =>
	axios
		.get(`${apiUrl}/api/auth/user-identity/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const personalInfo = (id) =>
	axios
		.get(`${apiUrl}/api/user/user_personal_info/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const updatePersonalInfo = (data) =>
	axios
		.put(`${apiUrl}/api/admin/users/update-user/${data._id}`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const toggleVerification = (id) =>
	axios
		.get(`${apiUrl}/api/admin/users/toggle-verification-user/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const toggleBlock = (id) =>
	axios
		.get(`${apiUrl}/api/admin/users/toggle-block-user/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const bankInfo = (id) =>
	axios
		.get(`${apiUrl}/api/user/user_bank_info/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const updateBankInfo = (data) =>
	axios
		.post(`${apiUrl}/api/user/store_user_bank_info`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const walletInfo = (id) =>
	axios
		.get(`${apiUrl}/api/admin/users/get_wallets_info/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const totalFiatDeposit = (data) =>
	axios
		.get(
			`${apiUrl}/api/admin/dashboard/user/get-user-total-deposit/${data.id}/${data.status}`
		)
		.then((response) => response)
		.catch((err) => err.response);

export const totalFiatWithdrawal = (data) =>
	axios
		.get(
			`${apiUrl}/api/admin/dashboard/user/get-user-total-withdrawal/${data.id}/${data.status}`
		)
		.then((response) => response)
		.catch((err) => err.response);

export const totalCryptoDeposit = (data) =>
	axios
		.get(
			`${apiUrl}/api/admin/dashboard/user/get-user-crypto-total-deposit/${data.id}/${data.status}`
		)
		.then((response) => response)
		.catch((err) => err.response);

export const totalCryptoWithdrawal = (data) =>
	axios
		.get(
			`${apiUrl}/api/admin/dashboard/user/get-user-crypto-total-withdrawal/${data.id}/${data.status}`
		)
		.then((response) => response)
		.catch((err) => err.response);

export const updatePassword = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/dashboard/user/change-user-password/${data.id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const getProfile = (id) =>
	axios
		.get(`${apiUrl}/api/admin/users/get-user-profile/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const updateProfile = (data) =>
	axios
		.post(`${apiUrl}/api/admin/users/update-user-profile/${data.id}`, data)
		.then((response) => response)
		.catch((err) => err.response);
