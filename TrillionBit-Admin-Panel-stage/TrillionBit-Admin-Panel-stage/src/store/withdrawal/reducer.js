import {
	ERRORS,
	UPDATE_FIAT_WITHDRAWAL_SUCCESS,
	UPDATE_CRYPTO_WITHDRAWAL_SUCCESS,
	CLEAR_RESPONSE,
} from "./actionTypes";

const initialState = {
	isUpdateCryptoWithdrawal: false,
	isUpdateFiatWithdrawal: false,
	errors: {},
	response: {},
	loader: false,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_FIAT_WITHDRAWAL_SUCCESS:
			return {
				...state,
				isUpdateFiatWithdrawal: true,
				response: action.payload,
			};
		case UPDATE_CRYPTO_WITHDRAWAL_SUCCESS:
			return {
				...state,
				isUpdateCryptoWithdrawal: true,
				response: action.payload,
			};
		case ERRORS:
			return {
				...state,
				errors: action.payload,
				loading: false,
			};

		case CLEAR_RESPONSE:
			return {
				...state,
				isUpdateCryptoWithdrawal: false,
				isUpdateFiatWithdrawal: false,
				errors: {},
				response: {},
			};
		default:
			return state;
	}
};

export default reducer;
