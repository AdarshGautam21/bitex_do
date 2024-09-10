import axios from "axios";
import { apiUrl } from "../../config";

export const createBitgoSettingService = (data) =>
	axios
		.post(`${apiUrl}/api/admin/users/create_bitgo_wallet_identifier`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const updateBitgoSettingService = (data) =>
	axios
		.post(`${apiUrl}/api/admin/bitgo-setting/${data._id}`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const removeBitgoSettingService = (id) =>
	axios
		.post(`${apiUrl}/api/admin/users/remove_wallet_identifier/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const liveBitgoSettingService = (id) =>
	axios
		.get(`${apiUrl}/api/bitgo-setting/update/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const bitgoSettingService = () =>
	axios
		.get(`${apiUrl}/api/bitgo-setting/get`)
		.then((response) => response)
		.catch((err) => err.response);

export const xrpWithdrawalSettingService = () =>
	axios
		.get(`${apiUrl}/api/admin/xrp-setting/get-withdraw`)
		.then((response) => response)
		.catch((err) => err.response);

export const createXrpWithdrawalSettingService = (data) =>
	axios
		.post(`${apiUrl}/api/admin/users/create_bitgo_wallet_identifier`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const updateXrpWithdrawalSettingService = (id) =>
	axios
		.get(`${apiUrl}/api/admin/xrp-setting/update-withdraw-wallet/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const removeXrpWithdrawalSettingService = (id) =>
	axios
		.post(`${apiUrl}/api/admin/users/remove_wallet_identifier/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const xrpDepositSettingService = () =>
	axios
		.get(`${apiUrl}/api/admin/xrp-setting/get`)
		.then((response) => response)
		.catch((err) => err.response);

export const createXrpDepositSettingService = (data) =>
	axios
		.get(`${apiUrl}/api/admin/xrp-setting/create`)
		.then((response) => response)
		.catch((err) => err.response);

export const updateXrpDepositSettingService = (id) =>
	axios
		.get(`${apiUrl}/api/admin/xrp-setting/update/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const removeXrpDepositSettingService = (id) =>
	axios
		.post(`${apiUrl}/api/admin/users/remove_wallet_identifier/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const xrpTransferAmountService = (data) =>
	axios
		.post(`${apiUrl}/api/admin/xrp-setting/transfer_amount`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const xrpWalletBalanceService = ({ type, id }) =>
	axios
		.get(`${apiUrl}/api/admin/xrp-setting/get_balance/${type}/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

		
export const ethWithdrawalSettingService = () =>
axios
    .get(`${apiUrl}/api/admin/eth-setting/get-withdraw`)
    .then((response) => response)
    .catch((err) => err.response);

export const createEthWithdrawalSettingService = (data) =>
axios
    .post(`${apiUrl}/api/admin/users/create_bitgo_wallet_identifier`, data)
    .then((response) => response)
    .catch((err) => err.response);

export const updateEthWithdrawalSettingService = (id) =>
axios
    .get(`${apiUrl}/api/admin/eth-setting/update-withdraw-wallet/${id}`)
    .then((response) => response)
    .catch((err) => err.response);

export const removeEthWithdrawalSettingService = (id) =>
axios
    .post(`${apiUrl}/api/admin/users/remove_wallet_identifier/${id}`)
    .then((response) => response)
    .catch((err) => err.response);

export const ethDepositSettingService = () =>
axios
    .get(`${apiUrl}/api/admin/eth-setting/get`)
    .then((response) => response)
    .catch((err) => err.response);

export const createEthDepositSettingService = (data) =>
axios
    .get(`${apiUrl}/api/admin/eth-setting/create`)
    .then((response) => response)
    .catch((err) => err.response);

export const updateEthDepositSettingService = (id) =>
axios
    .get(`${apiUrl}/api/admin/eth-setting/update/${id}`)
    .then((response) => response)
    .catch((err) => err.response);

export const removeEthDepositSettingService = (id) =>
axios
    .post(`${apiUrl}/api/admin/users/remove_wallet_identifier/${id}`)
    .then((response) => response)
    .catch((err) => err.response);

export const ethTransferAmountService = (data) =>
axios
    .post(`${apiUrl}/api/admin/eth-setting/transfer_amount`, data)
    .then((response) => response)
    .catch((err) => err.response);

export const ethWalletBalanceService = ({ type, id }) =>
axios
    .get(`${apiUrl}/api/admin/eth-setting/balance`)
    .then((response) => response)
    .catch((err) => err.response);

export const referralSettingService = () =>
	axios
		.get(`${apiUrl}/api/admin/users/get_referral_settings`)
		.then((response) => response)
		.catch((err) => err.response);

export const updateReferralSettingService = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/users/update_referral_settings/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const createWalletBonusSettingService = (data) =>
	axios
		.post(`${apiUrl}/api/admin/wallet-bonus/create_wallet_bonus`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const updateWalletBonusSettingService = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/wallet-bonus/update_wallet_bonus/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);

export const removeWalletBonusSettingService = (id) =>
	axios
		.get(`${apiUrl}/api/admin/wallet-bonus/remove_wallet_bonus/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const toggleWalletBonusSettingService = (id) =>
	axios
		.post(`${apiUrl}/api/admin/wallet-bonus/toggle_wallet_balance/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const agentSettingService = () =>
	axios
		.get(`${apiUrl}/api/admin/users/get_agent_default_settings`)
		.then((response) => response)
		.catch((err) => err.response);

export const updateAgentSettingService = (data) =>
	axios
		.post(`${apiUrl}/api/admin/users/update_agent_default_setting`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const createMarginTradingService = (data) =>
	axios
		.post(`${apiUrl}/api/admin/users/add_assets_leverage`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const updateMarginTradingService = (data) =>
	axios
		.post(`${apiUrl}/api/admin/users/add_assets_leverage`, data)
		.then((response) => response)
		.catch((err) => err.response);

export const removeMarginTradingService = (id) =>
	axios
		.get(`${apiUrl}/api/admin/users/remove_assets_leverage/${id}`)
		.then((response) => response)
		.catch((err) => err.response);

export const toggleExchangeSettingService = (id) =>
	axios
		.post(
			`${apiUrl}/api/admin/dashboard/user/toggle-exchange-setting/${id}`
		)
		.then((response) => response)
		.catch((err) => err.response);
