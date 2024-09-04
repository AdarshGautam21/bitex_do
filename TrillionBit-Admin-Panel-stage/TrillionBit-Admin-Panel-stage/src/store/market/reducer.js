import {
	TOGGLE_MARKET,
	TOGGLE_MARKET_FAILURE,
	TOGGLE_MARKET_SUCCESS,
	MARKET_DELETE,
	MARKET_DELETE_FAILURE,
	MARKET_DELETE_SUCCESS,
	MARKET_UPDATE,
	MARKET_UPDATE_FAILURE,
	MARKET_UPDATE_SUCCESS,
	MARKET_CREATE,
	MARKET_CREATE_FAILURE,
	MARKET_CREATE_SUCCESS,
	GET_ACTIVE_MARKET_FAILURE,
	GET_ACTIVE_MARKET_SUCCESS,
	CLEAR_RESPONSE,
	ERRORS,
} from "./actionTypes";

const initialState = {
	isUpdate: false,
	isToggle: false,
	isDeleted: false,
	isCreated: false,
	markets: [],
	errors: {},
	response: {},
	loader: false,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_MARKET_FAILURE:
			return {
				...state,
				isToggle: true,
				errors: action.payload,
				response: action.payload,
			};
		case TOGGLE_MARKET_SUCCESS:
			return {
				...state,
				isToggle: true,
				response: action.payload,
				errors: {},
			};
		case MARKET_DELETE_FAILURE:
			return {
				...state,
				isDeleted: true,
				errors: action.payload,
				response: action.payload,
			};
		case MARKET_DELETE_SUCCESS:
			return {
				...state,
				isDeleted: true,
				response: action.payload,
				errors: {},
			};
		case MARKET_UPDATE_FAILURE:
			return {
				...state,
				isUpdate: true,
				errors: action.payload,
				response: action.payload,
			};
		case MARKET_UPDATE_SUCCESS:
			return {
				...state,
				isUpdate: true,
				response: action.payload,
				errors: {},
			};
		case MARKET_CREATE_FAILURE:
			return {
				...state,
				isCreated: true,
				errors: action.payload,
				response: action.payload,
			};
		case MARKET_CREATE_SUCCESS:
			return {
				...state,
				isCreated: true,
				response: action.payload,
				errors: {},
			};

		// case GET_ACTIVE_MARKET_FAILURE:
		case GET_ACTIVE_MARKET_SUCCESS:
			return {
				...state,
				markets: action.payload,
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
				errors: {},
				response: {},
				isDeleted: false,
				isCreated: false,
				isUpdate: false,
				isToggle: false,
				loading: false,
			};
		default:
			return state;
	}
};

export default reducer;
