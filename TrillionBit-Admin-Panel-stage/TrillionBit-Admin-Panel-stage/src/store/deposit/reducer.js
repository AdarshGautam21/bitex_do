import {
	ERRORS,
	CLEAR_RESPONSE,
	UPDATE_FIAT_DEPOSIT_SUCCESS,
} from "./actionTypes";

const initialState = {
	isUpdateFiatDeposit: false,
	response: {},
	errors: {},
	loader: false,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case UPDATE_FIAT_DEPOSIT_SUCCESS:
			return {
				...state,
				response: action.payload,
				isUpdateFiatDeposit: true,
				loading: false,
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
				isUpdateFiatDeposit: false,
				errors: {},
				response: {},
			};
		default:
			return state;
	}
};

export default reducer;
