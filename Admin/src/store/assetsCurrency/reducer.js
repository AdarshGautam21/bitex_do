import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_ASSETS_CURRENCY_SUCCESS,
	CREATE_ASSETS_CURRENCY_FAILURE,
	UPDATE_ASSETS_CURRENCY_SUCCESS,
	UPDATE_ASSETS_CURRENCY_FAILURE,
	REMOVE_ASSETS_CURRENCY_FAILURE,
	REMOVE_ASSETS_CURRENCY_SUCCESS,
	UPDATE_ASSETS_CURRENCY_ADV_SUCCESS,
	UPDATE_ASSETS_CURRENCY_ADV_FAILURE,
	CREATE_ASSETS_CURRENCY_ADV_SUCCESS,
	CREATE_ASSETS_CURRENCY_ADV_FAILURE,
	REMOVE_ASSETS_CURRENCY_ADV_SUCCESS,
	REMOVE_ASSETS_CURRENCY_ADV_FAILURE,
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
		case CREATE_ASSETS_CURRENCY_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case CREATE_ASSETS_CURRENCY_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case UPDATE_ASSETS_CURRENCY_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case UPDATE_ASSETS_CURRENCY_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case REMOVE_ASSETS_CURRENCY_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case REMOVE_ASSETS_CURRENCY_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case CREATE_ASSETS_CURRENCY_ADV_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case CREATE_ASSETS_CURRENCY_ADV_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case UPDATE_ASSETS_CURRENCY_ADV_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case UPDATE_ASSETS_CURRENCY_ADV_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case REMOVE_ASSETS_CURRENCY_ADV_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case REMOVE_ASSETS_CURRENCY_ADV_SUCCESS:
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
