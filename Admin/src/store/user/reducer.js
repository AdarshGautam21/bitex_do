import {
	TOGGLE_AGENT_FAILURE,
	TOGGLE_AGENT_SUCCESS,
	TOGGLE_SUB_AGENT_FAILURE,
	TOGGLE_SUB_AGENT_SUCCESS,
	TOGGLE_MARGING_TRADING_FAILURE,
	TOGGLE_MARGING_TRADING_SUCCESS,
	USER_BASIC_INFO_SUCCESS,
	USER_BASIC_INFO_FAILURE,
	USER_IDENTITY_INFO_SUCCESS,
	USER_IDENTITY_INFO_FAILURE,
	USER_PERSONAL_INFO_SUCCESS,
	USER_PERSONAL_INFO_FAILURE,
	UPDATE_USER_PERSONAL_INFO_SUCCESS,
	UPDATE_USER_PERSONAL_INFO_FAILURE,
	TOGGLE_VERIFICATION_USER_SUCCESS,
	TOGGLE_VERIFICATION_USER_FAILURE,
	TOGGLE_BLOCK_USER_SUCCESS,
	TOGGLE_BLOCK_USER_FAILURE,
	USER_BANK_INFO_SUCCESS,
	USER_BANK_INFO_FAILURE,
	UPDATE_USER_BANK_INFO_SUCCESS,
	UPDATE_USER_BANK_INFO_FAILURE,
	USER_WALLET_INFO_SUCCESS,
	USER_WALLET_INFO_FAILURE,
	USER_TOTAL_FIAT_DEPOSIT_SUCCESS,
	USER_TOTAL_FIAT_DEPOSIT_FAILURE,
	CLEAR_RESPONSE,
	ERRORS,
	USER_TOTAL_FIAT_WITHDRAWAL_SUCCESS,
	USER_TOTAL_FIAT_WITHDRAWAL_FAILURE,
	USER_TOTAL_CRYPTO_WITHDRAWAL_SUCCESS,
	USER_TOTAL_CRYPTO_WITHDRAWAL_FAILURE,
	USER_TOTAL_CRYPTO_DEPOSIT_SUCCESS,
	USER_TOTAL_CRYPTO_DEPOSIT_FAILURE,
	UPDATE_USER_CHANGE_PASSWORD_SUCCESS,
	UPDATE_USER_CHANGE_PASSWORD_FAILURE,
	UPDATE_USER_PROFILE_SUCCESS,
	UPDATE_USER_PROFILE_FAILURE,
	USER_PROFILE_SUCCESS,
	USER_PROFILE_FAILURE,
} from "./actionTypes";

const initialState = {
	user: {},
	toggleAgent: {},
	toggleSubAgent: {},
	toggleMarginTrading: {},
	loader: false,
	userDetails: {
		basicInfo: {},
		identityInfo: {},
		personalInfo: {},
		profileInfo: {},
		bankInfo: {},
		walletInfo: [],
		totalFiatDeposit: {},
		totalFiatWithdrawal: {},
		totalCryptoDeposit: {},
		totalCryptoWithdrawal: {},
	},
	response: {},
	errors: {},
};

const userReducer = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_AGENT_FAILURE:
			return {
				...state,
				toggleAgent: action.payload,
				errors: action.payload,
			};
		case TOGGLE_AGENT_SUCCESS:
			return {
				...state,
				toggleAgent: action.payload,
				errors: {},
			};
		case TOGGLE_SUB_AGENT_FAILURE:
			return {
				...state,
				toggleSubAgent: action.payload,
				errors: action.payload,
			};
		case TOGGLE_SUB_AGENT_SUCCESS:
			return {
				...state,
				toggleSubAgent: action.payload,
				errors: {},
			};
		case TOGGLE_MARGING_TRADING_FAILURE:
			return {
				...state,
				user: {},
				isAuthenticated: false,
				errors: {},
			};
		case TOGGLE_MARGING_TRADING_SUCCESS:
			return {
				...state,
				user: {},
				isAuthenticated: false,
				errors: {},
			};

		case USER_BASIC_INFO_SUCCESS:
		case USER_BASIC_INFO_FAILURE:
			return {
				...state,
				userDetails: {
					...state.userDetails,
					basicInfo: action.payload,
				},
			};

		case USER_IDENTITY_INFO_SUCCESS:
		case USER_IDENTITY_INFO_FAILURE:
			return {
				...state,
				userDetails: {
					...state.userDetails,
					identityInfo: action.payload,
				},
			};

		case USER_PERSONAL_INFO_SUCCESS:
		case USER_PERSONAL_INFO_FAILURE:
			return {
				...state,
				userDetails: {
					...state.userDetails,
					personalInfo: action.payload,
				},
			};
		case USER_BANK_INFO_SUCCESS:
		case USER_BANK_INFO_FAILURE:
			return {
				...state,
				userDetails: {
					...state.userDetails,
					bankInfo: action.payload,
				},
			};
		case USER_BANK_INFO_SUCCESS:
		case USER_BANK_INFO_FAILURE:
			return {
				...state,
				userDetails: {
					...state.userDetails,
					bankInfo: action.payload,
				},
			};
		case USER_WALLET_INFO_SUCCESS:
		case USER_WALLET_INFO_FAILURE:
			return {
				...state,
				userDetails: {
					...state.userDetails,
					walletInfo: action.payload,
				},
			};

		case USER_TOTAL_FIAT_DEPOSIT_SUCCESS:
		case USER_TOTAL_FIAT_DEPOSIT_FAILURE:
			return {
				...state,
				userDetails: {
					...state.userDetails,
					totalFiatDeposit: action.payload,
				},
			};

		case USER_TOTAL_FIAT_WITHDRAWAL_SUCCESS:
		case USER_TOTAL_FIAT_WITHDRAWAL_FAILURE:
			return {
				...state,
				userDetails: {
					...state.userDetails,
					totalFiatWithdrawal: action.payload,
				},
			};

		case USER_TOTAL_CRYPTO_WITHDRAWAL_SUCCESS:
		case USER_TOTAL_CRYPTO_WITHDRAWAL_FAILURE:
			return {
				...state,
				userDetails: {
					...state.userDetails,
					totalCryptoWithdrawal: action.payload,
				},
			};
		case USER_TOTAL_CRYPTO_DEPOSIT_SUCCESS:
		case USER_TOTAL_CRYPTO_DEPOSIT_FAILURE:
			return {
				...state,
				userDetails: {
					...state.userDetails,
					totalCryptoDeposit: action.payload,
				},
			};

		case USER_PROFILE_SUCCESS:
		case USER_PROFILE_FAILURE:
			return {
				...state,
				userDetails: {
					...state.userDetails,
					profileInfo: action.payload,
				},
			};

		case UPDATE_USER_PERSONAL_INFO_SUCCESS:
		case UPDATE_USER_PERSONAL_INFO_FAILURE:
		case TOGGLE_VERIFICATION_USER_SUCCESS:
		case TOGGLE_VERIFICATION_USER_FAILURE:
		case TOGGLE_BLOCK_USER_SUCCESS:
		case TOGGLE_BLOCK_USER_FAILURE:
		case UPDATE_USER_BANK_INFO_SUCCESS:
		case UPDATE_USER_BANK_INFO_FAILURE:
		case UPDATE_USER_CHANGE_PASSWORD_SUCCESS:
		case UPDATE_USER_CHANGE_PASSWORD_FAILURE:
		case UPDATE_USER_PROFILE_SUCCESS:
		case UPDATE_USER_PROFILE_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: {},
			};

		case CLEAR_RESPONSE:
			return {
				...state,
				errors: {},
				response: {},
			};
		case ERRORS:
			return {
				...state,
				errors: action.payload,
				loading: false,
			};
		default:
			return state;
	}
};

export default userReducer;
