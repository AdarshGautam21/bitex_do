import {
	ADMIN_WALLET_ADDRESS_DELETE_FAILURE,
	ADMIN_WALLET_ADDRESS_DELETE_SUCCESS,
	ADMIN_WALLET_ADDRESS_UPDATE_FAILURE,
	ADMIN_WALLET_ADDRESS_UPDATE_SUCCESS,
	ADMIN_WALLET_ADDRESS_CREATE_FAILURE,
	ADMIN_WALLET_ADDRESS_CREATE_SUCCESS,
	CLEAR_RESPONSE,
	ERRORS,
} from "./actionTypes";

const initialState = {
	isUpdate: false,
	isDeleted: false,
	isCreated: false,
	errors: {},
	response: {},
	loader: false,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ADMIN_WALLET_ADDRESS_DELETE_FAILURE:
			return {
				...state,
				isDeleted: true,
				errors: action.payload,
				response: action.payload,
			};
		case ADMIN_WALLET_ADDRESS_DELETE_SUCCESS:
			return {
				...state,
				isDeleted: true,
				response: action.payload,
				errors: {},
			};
		case ADMIN_WALLET_ADDRESS_UPDATE_FAILURE:
			return {
				...state,
				isUpdate: true,
				errors: action.payload,
				response: action.payload,
			};
		case ADMIN_WALLET_ADDRESS_UPDATE_SUCCESS:
			return {
				...state,
				isUpdate: true,
				response: action.payload,
				errors: {},
			};
		case ADMIN_WALLET_ADDRESS_CREATE_FAILURE:
			return {
				...state,
				isCreated: true,
				errors: action.payload,
				response: action.payload,
			};
		case ADMIN_WALLET_ADDRESS_CREATE_SUCCESS:
			return {
				...state,
				isCreated: true,
				response: action.payload,
				errors: {},
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
				loading: false,
			};
		default:
			return state;
	}
};

export default reducer;
