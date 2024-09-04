import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_BITGO_SETTING_SUCCESS,
	CREATE_BITGO_SETTING_FAILURE,
	UPDATE_BITGO_SETTING_SUCCESS,
	UPDATE_BITGO_SETTING_FAILURE,
	REMOVE_BITGO_SETTING_SUCCESS,
	REMOVE_BITGO_SETTING_FAILURE,
	LIVE_BITGO_SETTING_SUCCESS,
	LIVE_BITGO_SETTING_FAILURE,
	BITGO_SETTING_SUCCESS,
	BITGO_SETTING_FAILURE,
	CREATE_XRP_WITHDRAWAL_SUCCESS,
	CREATE_XRP_WITHDRAWAL_FAILURE,
	UPDATE_XRP_WITHDRAWAL_SUCCESS,
	UPDATE_XRP_WITHDRAWAL_FAILURE,
	REMOVE_XRP_WITHDRAWAL_SUCCESS,
	REMOVE_XRP_WITHDRAWAL_FAILURE,
	XRP_WITHDRAWAL_SUCCESS,
	XRP_WITHDRAWAL_FAILURE,
	CREATE_XRP_DEPOSIT_SUCCESS,
	CREATE_XRP_DEPOSIT_FAILURE,
	UPDATE_XRP_DEPOSIT_SUCCESS,
	UPDATE_XRP_DEPOSIT_FAILURE,
	REMOVE_XRP_DEPOSIT_SUCCESS,
	REMOVE_XRP_DEPOSIT_FAILURE,
	XRP_DEPOSIT_SUCCESS,
	XRP_DEPOSIT_FAILURE,
	XRP_WALLET_BALANCE_SUCCESS,
	XRP_WALLET_BALANCE_FAILURE,
	XRP_TRANSFER_AMOUNT_SUCCESS,
	XRP_TRANSFER_AMOUNT_FAILURE,
	CREATE_ETH_WITHDRAWAL_SUCCESS,
	CREATE_ETH_WITHDRAWAL_FAILURE,
	UPDATE_ETH_WITHDRAWAL_SUCCESS,
	UPDATE_ETH_WITHDRAWAL_FAILURE,
	REMOVE_ETH_WITHDRAWAL_SUCCESS,
	REMOVE_ETH_WITHDRAWAL_FAILURE,
	ETH_WITHDRAWAL_SUCCESS,
	ETH_WITHDRAWAL_FAILURE,
	CREATE_ETH_DEPOSIT_SUCCESS,
	CREATE_ETH_DEPOSIT_FAILURE,
	UPDATE_ETH_DEPOSIT_SUCCESS,
	UPDATE_ETH_DEPOSIT_FAILURE,
	REMOVE_ETH_DEPOSIT_SUCCESS,
	REMOVE_ETH_DEPOSIT_FAILURE,
	ETH_DEPOSIT_SUCCESS,
	ETH_DEPOSIT_FAILURE,
	ETH_WALLET_BALANCE_SUCCESS,
	ETH_WALLET_BALANCE_FAILURE,
	ETH_TRANSFER_AMOUNT_SUCCESS,
	ETH_TRANSFER_AMOUNT_FAILURE,
	REFERRAL_SUCCESS,
	REFERRAL_FAILURE,
	UPDATE_REFERRAL_SUCCESS,
	UPDATE_REFERRAL_FAILURE,
	CREATE_WALLET_BONUS_SUCCESS,
	CREATE_WALLET_BONUS_FAILURE,
	UPDATE_WALLET_BONUS_SUCCESS,
	UPDATE_WALLET_BONUS_FAILURE,
	REMOVE_WALLET_BONUS_SUCCESS,
	REMOVE_WALLET_BONUS_FAILURE,
	TOGGLE_WALLET_BONUS_SUCCESS,
	TOGGLE_WALLET_BONUS_FAILURE,
	AGENT_SETTING_SUCCESS,
	AGENT_SETTING_FAILURE,
	UPDATE_AGENT_SETTING_SUCCESS,
	UPDATE_AGENT_SETTING_FAILURE,
	TOGGLE_EXCHANGE_SETTING_SUCCESS,
	TOGGLE_EXCHANGE_SETTING_FAILURE,
} from "./actionTypes";

const initialState = {
	errors: {},
	response: {},
	loader: false,
	bitgoSetting: {},
	xrpDepositSetting: {},
	xrpWithdrawalSetting: {},
	xrpWithdrawalWallatBalance: {},
	xrpDepositWallatBalance: {},
	xrpTransferAmount: {},

	ethDepositSetting: {},
	ethWithdrawalSetting: {},
	ethDepositWallatBalance: {},
	ethWithdrawalWallatBalance: {},
	ethTransferAmount: {},

	referralSetting: {},
	agentSetting: {},
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ERRORS:
			return {
				...state,
				errors: action.payload,
				loading: false,
			};
		case CLEAR_RESPONSE:
			return {
				...state,
				errors: {},
				response: {},
			};
		case CREATE_BITGO_SETTING_SUCCESS:
		case CREATE_BITGO_SETTING_FAILURE:
		case UPDATE_BITGO_SETTING_SUCCESS:
		case UPDATE_BITGO_SETTING_FAILURE:
		case REMOVE_BITGO_SETTING_SUCCESS:
		case REMOVE_BITGO_SETTING_FAILURE:
		case LIVE_BITGO_SETTING_SUCCESS:
		case LIVE_BITGO_SETTING_FAILURE:

		case CREATE_XRP_WITHDRAWAL_SUCCESS:
		case CREATE_XRP_WITHDRAWAL_FAILURE:
		case UPDATE_XRP_WITHDRAWAL_SUCCESS:
		case UPDATE_XRP_WITHDRAWAL_FAILURE:
		case REMOVE_XRP_WITHDRAWAL_SUCCESS:
		case REMOVE_XRP_WITHDRAWAL_FAILURE:

		case CREATE_XRP_DEPOSIT_SUCCESS:
		case CREATE_XRP_DEPOSIT_FAILURE:
		case UPDATE_XRP_DEPOSIT_SUCCESS:
		case UPDATE_XRP_DEPOSIT_FAILURE:
		case REMOVE_XRP_DEPOSIT_SUCCESS:
		case REMOVE_XRP_DEPOSIT_FAILURE:

		case CREATE_ETH_WITHDRAWAL_SUCCESS:
		case CREATE_ETH_WITHDRAWAL_FAILURE:
		case UPDATE_ETH_WITHDRAWAL_SUCCESS:
		case UPDATE_ETH_WITHDRAWAL_FAILURE:
		case REMOVE_ETH_WITHDRAWAL_SUCCESS:
		case REMOVE_ETH_WITHDRAWAL_FAILURE:

		case CREATE_ETH_DEPOSIT_SUCCESS:
		case CREATE_ETH_DEPOSIT_FAILURE:
		case UPDATE_ETH_DEPOSIT_SUCCESS:
		case UPDATE_ETH_DEPOSIT_FAILURE:
		case REMOVE_ETH_DEPOSIT_SUCCESS:
		case REMOVE_ETH_DEPOSIT_FAILURE:
		case UPDATE_REFERRAL_SUCCESS:
		case UPDATE_REFERRAL_FAILURE:

		case CREATE_WALLET_BONUS_SUCCESS:
		case CREATE_WALLET_BONUS_FAILURE:
		case UPDATE_WALLET_BONUS_SUCCESS:
		case UPDATE_WALLET_BONUS_FAILURE:
		case REMOVE_WALLET_BONUS_SUCCESS:
		case REMOVE_WALLET_BONUS_FAILURE:
		case TOGGLE_WALLET_BONUS_SUCCESS:
		case TOGGLE_WALLET_BONUS_FAILURE:
		case UPDATE_AGENT_SETTING_SUCCESS:
		case UPDATE_AGENT_SETTING_FAILURE:
		case TOGGLE_EXCHANGE_SETTING_SUCCESS:
		case TOGGLE_EXCHANGE_SETTING_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: {},
			};

		case BITGO_SETTING_SUCCESS:
		case BITGO_SETTING_FAILURE:
			return {
				...state,
				bitgoSetting: action.payload,
			};

		case XRP_DEPOSIT_SUCCESS:
		case XRP_DEPOSIT_FAILURE:
			return {
				...state,
				xrpDepositSetting: action.payload,
			};
		case XRP_WITHDRAWAL_SUCCESS:
		case XRP_WITHDRAWAL_FAILURE:
			return {
				...state,
				xrpWithdrawalSetting: action.payload,
			};
		case XRP_WALLET_BALANCE_SUCCESS:
			if (action.payload?.type === "deposit") {
				return {
					...state,
					xrpDepositWallatBalance: action.payload?.data,
				};
			} else {
				return {
					...state,
					xrpWithdrawalWallatBalance: action.payload?.data,
				};
			}
		case XRP_WALLET_BALANCE_FAILURE:
			if (action.payload?.type === "deposit") {
				return {
					...state,
					xrpDepositWallatBalance: {},
				};
			} else {
				return {
					...state,
					xrpWithdrawalWallatBalance: {},
				};
			}

		case XRP_TRANSFER_AMOUNT_SUCCESS:
		case XRP_TRANSFER_AMOUNT_FAILURE:
			return {
				...state,
				xrpTransferAmount: action.payload,
			};

		case ETH_DEPOSIT_SUCCESS:
		case ETH_DEPOSIT_FAILURE:
			return {
				...state,
				ethDepositSetting: action.payload?.[0],
			};
		case ETH_WITHDRAWAL_SUCCESS:
		case ETH_WITHDRAWAL_FAILURE:
			return {
				...state,
				ethWithdrawalSetting: action.payload,
			};
		case ETH_WALLET_BALANCE_SUCCESS:
			if (action.payload?.type === "deposit") {
				return {
					...state,
					ethDepositWallatBalance: action.payload?.data,
				};
			} else {
				return {
					...state,
					ethWithdrawalWallatBalance: action.payload?.data,
				};
			}
		case ETH_WALLET_BALANCE_FAILURE:
			if (action.payload?.type === "deposit") {
				return {
					...state,
					ethDepositWallatBalance: {},
				};
			} else {
				return {
					...state,
					ethWithdrawalWallatBalance: {},
				};
			}

		case ETH_TRANSFER_AMOUNT_SUCCESS:
		case ETH_TRANSFER_AMOUNT_FAILURE:
			return {
				...state,
				ethTransferAmount: action.payload,
			};
		case REFERRAL_SUCCESS:
		case REFERRAL_FAILURE:
			return {
				...state,
				referralSetting: action.payload,
			};
		case AGENT_SETTING_SUCCESS:
		case AGENT_SETTING_FAILURE:
			return {
				...state,
				agentSetting: action.payload,
			};
		default:
			return state;
	}
};

export default reducer;
