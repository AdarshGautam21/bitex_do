import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_BITGO_SETTING_REQUEST,
	UPDATE_BITGO_SETTING_REQUEST,
	REMOVE_BITGO_SETTING_REQUEST,
	LIVE_BITGO_SETTING_REQUEST,
	BITGO_SETTING_REQUEST,
	CREATE_XRP_WITHDRAWAL_REQUEST,
	UPDATE_XRP_WITHDRAWAL_REQUEST,
	REMOVE_XRP_WITHDRAWAL_REQUEST,
	XRP_WITHDRAWAL_REQUEST,
	CREATE_XRP_DEPOSIT_REQUEST,
	UPDATE_XRP_DEPOSIT_REQUEST,
	REMOVE_XRP_DEPOSIT_REQUEST,
	XRP_DEPOSIT_REQUEST,
	XRP_WALLET_BALANCE_REQUEST,
	XRP_TRANSFER_AMOUNT_REQUEST,

	CREATE_ETH_WITHDRAWAL_REQUEST,
	UPDATE_ETH_WITHDRAWAL_REQUEST,
	REMOVE_ETH_WITHDRAWAL_REQUEST,
	ETH_WITHDRAWAL_REQUEST,
	CREATE_ETH_DEPOSIT_REQUEST,
	UPDATE_ETH_DEPOSIT_REQUEST,
	REMOVE_ETH_DEPOSIT_REQUEST,
	ETH_DEPOSIT_REQUEST,
	ETH_WALLET_BALANCE_REQUEST,
	ETH_TRANSFER_AMOUNT_REQUEST,

	REFERRAL_REQUEST,
	UPDATE_REFERRAL_REQUEST,
	CREATE_WALLET_BONUS_REQUEST,
	UPDATE_WALLET_BONUS_REQUEST,
	REMOVE_WALLET_BONUS_REQUEST,
	TOGGLE_WALLET_BONUS_REQUEST,
	AGENT_SETTING_REQUEST,
	UPDATE_AGENT_SETTING_REQUEST,
	CREATE_MARGIN_TRADING_REQUEST,
	UPDATE_MARGIN_TRADING_REQUEST,
	REMOVE_MARGIN_TRADING_REQUEST,
	TOGGLE_EXCHANGE_SETTING_REQUEST,
	TOGGLE_EXCHANGE_SETTING_SUCCESS,
	TOGGLE_EXCHANGE_SETTING_FAILURE,
} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const bitgoSetting = () => {
	return {
		type: BITGO_SETTING_REQUEST,
		payload: {},
	};
};

export const createBitgoSetting = (data) => {
	return {
		type: CREATE_BITGO_SETTING_REQUEST,
		payload: { data },
	};
};

export const updateBitgoSetting = (data) => {
	return {
		type: UPDATE_BITGO_SETTING_REQUEST,
		payload: { data },
	};
};

export const removeBitgoSetting = (id) => {
	return {
		type: REMOVE_BITGO_SETTING_REQUEST,
		payload: { id },
	};
};

export const liveBitgoSetting = (id) => {
	return {
		type: LIVE_BITGO_SETTING_REQUEST,
		payload: { id },
	};
};

export const xrpWithdrawalSetting = () => {
	return {
		type: XRP_WITHDRAWAL_REQUEST,
		payload: {},
	};
};

export const createXrpWithdrawalSetting = (data) => {
	return {
		type: CREATE_XRP_WITHDRAWAL_REQUEST,
		payload: { data },
	};
};

export const updateXrpWithdrawalSetting = (id) => {
	return {
		type: UPDATE_XRP_WITHDRAWAL_REQUEST,
		payload: { id },
	};
};

export const removeXrpWithdrawalSetting = (id) => {
	return {
		type: REMOVE_XRP_WITHDRAWAL_REQUEST,
		payload: { id },
	};
};

export const xrpDepositSetting = () => {
	return {
		type: XRP_DEPOSIT_REQUEST,
		payload: {},
	};
};

export const createXrpDepositSetting = (data) => {
	return {
		type: CREATE_XRP_DEPOSIT_REQUEST,
		payload: { data },
	};
};

export const updateXrpDepositSetting = (id) => {
	return {
		type: UPDATE_XRP_DEPOSIT_REQUEST,
		payload: { id },
	};
};

export const removeXrpDepositSetting = (id) => {
	return {
		type: REMOVE_XRP_DEPOSIT_REQUEST,
		payload: { id },
	};
};

export const xrpWalletBalance = (data) => {
	return {
		type: XRP_WALLET_BALANCE_REQUEST,
		payload: { data },
	};
};

export const xrpTransferAmount = (data) => {
	return {
		type: XRP_TRANSFER_AMOUNT_REQUEST,
		payload: { data },
	};
};


export const ethWithdrawalSetting = () => {
	return {
		type: ETH_WITHDRAWAL_REQUEST,
		payload: {},
	};
};

export const createEthWithdrawalSetting = (data) => {
	return {
		type: CREATE_ETH_WITHDRAWAL_REQUEST,
		payload: { data },
	};
};

export const updateEthWithdrawalSetting = (id) => {
	return {
		type: UPDATE_ETH_WITHDRAWAL_REQUEST,
		payload: { id },
	};
};

export const removeEthWithdrawalSetting = (id) => {
	return {
		type: REMOVE_ETH_WITHDRAWAL_REQUEST,
		payload: { id },
	};
};

export const ethDepositSetting = () => {
	return {
		type: ETH_DEPOSIT_REQUEST,
		payload: {},
	};
};

export const createEthDepositSetting = (data) => {
	return {
		type: CREATE_ETH_DEPOSIT_REQUEST,
		payload: { data },
	};
};

export const updateEthDepositSetting = (id) => {
	return {
		type: UPDATE_ETH_DEPOSIT_REQUEST,
		payload: { id },
	};
};

export const removeEthDepositSetting = (id) => {
	return {
		type: REMOVE_ETH_DEPOSIT_REQUEST,
		payload: { id },
	};
};

export const ethWalletBalance = (data) => {
	return {
		type: ETH_WALLET_BALANCE_REQUEST,
		payload: { data },
	};
};

export const ethTransferAmount = (data) => {
	return {
		type: ETH_TRANSFER_AMOUNT_REQUEST,
		payload: { data },
	};
};

export const referralSetting = () => {
	return {
		type: REFERRAL_REQUEST,
		payload: {},
	};
};

export const updateReferralSetting = (data) => {
	return {
		type: UPDATE_REFERRAL_REQUEST,
		payload: { data },
	};
};

export const createWalletBonusSetting = (data) => {
	return {
		type: CREATE_WALLET_BONUS_REQUEST,
		payload: { data },
	};
};

export const updateWalletBonusSetting = (data) => {
	return {
		type: UPDATE_WALLET_BONUS_REQUEST,
		payload: { data },
	};
};

export const removeWalletBonusSetting = (id) => {
	return {
		type: REMOVE_WALLET_BONUS_REQUEST,
		payload: { id },
	};
};

export const toggleWalletBonusSetting = (id) => {
	return {
		type: TOGGLE_WALLET_BONUS_REQUEST,
		payload: { id },
	};
};

export const agentSetting = () => {
	return {
		type: AGENT_SETTING_REQUEST,
		payload: {},
	};
};

export const updateAgentSetting = (data) => {
	return {
		type: UPDATE_AGENT_SETTING_REQUEST,
		payload: { data },
	};
};

export const createMarginTrading = (data) => {
	return {
		type: CREATE_MARGIN_TRADING_REQUEST,
		payload: { data },
	};
};

export const updateMarginTrading = (data) => {
	return {
		type: UPDATE_MARGIN_TRADING_REQUEST,
		payload: { data },
	};
};

export const removeMarginTrading = (id) => {
	return {
		type: REMOVE_MARGIN_TRADING_REQUEST,
		payload: { id },
	};
};

export const toggleExchangeSetting = (id) => {
	return {
		type: TOGGLE_EXCHANGE_SETTING_REQUEST,
		payload: { id },
	};
};
