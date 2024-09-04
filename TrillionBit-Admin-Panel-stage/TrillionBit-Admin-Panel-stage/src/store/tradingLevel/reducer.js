import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_TRADING_LEVEL_SUCCESS,
	CREATE_TRADING_LEVEL_FAILURE,
	UPDATE_TRADING_LEVEL_SUCCESS,
	UPDATE_TRADING_LEVEL_FAILURE,
	REMOVE_TRADING_LEVEL_FAILURE,
	REMOVE_TRADING_LEVEL_SUCCESS,
} from "./actionTypes";

const initialState = {
	errors: {},
	response: {},
	loader: false,
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
		case CREATE_TRADING_LEVEL_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case CREATE_TRADING_LEVEL_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case UPDATE_TRADING_LEVEL_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case UPDATE_TRADING_LEVEL_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case REMOVE_TRADING_LEVEL_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case REMOVE_TRADING_LEVEL_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		default:
			return state;
	}
};

export default reducer;
