import {
	TOGGLE_ASSETS,
	TOGGLE_ASSETS_FAILURE,
	TOGGLE_ASSETS_SUCCESS,
	ASSETS_DELETE,
	ASSETS_DELETE_FAILURE,
	ASSETS_DELETE_SUCCESS,
	ASSETS_UPDATE,
	ASSETS_UPDATE_FAILURE,
	ASSETS_UPDATE_SUCCESS,
	ASSETS_CREATE,
	ASSETS_CREATE_FAILURE,
	ASSETS_CREATE_SUCCESS,
	GET_ASSETS_FAILURE,
	GET_ASSETS_SUCCESS,
	CLEAR_RESPONSE,
	ERRORS,
	GET_ACTIVE_ASSETS_FAILURE,
	GET_ACTIVE_ASSETS_SUCCESS,
} from "./actionTypes";

const initialState = {
	isUpdate: false,
	isToggle: false,
	isDeleted: false,
	isCreated: false,
	assets: [],
	activeAssets: [],
	activeAssetCoins: [],
	errors: {},
	response: {},
	loader: false,
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case TOGGLE_ASSETS_FAILURE:
			return {
				...state,
				isToggle: true,
				errors: action.payload,
				response: action.payload,
			};
		case TOGGLE_ASSETS_SUCCESS:
			return {
				...state,
				isToggle: true,
				response: action.payload,
				errors: {},
			};
		case ASSETS_DELETE_FAILURE:
			return {
				...state,
				isDeleted: true,
				errors: action.payload,
				response: action.payload,
			};
		case ASSETS_DELETE_SUCCESS:
			return {
				...state,
				isDeleted: true,
				response: action.payload,
				errors: {},
			};
		case ASSETS_UPDATE_FAILURE:
			return {
				...state,
				isUpdate: true,
				errors: action.payload,
				response: action.payload,
			};
		case ASSETS_UPDATE_SUCCESS:
			return {
				...state,
				isUpdate: true,
				response: action.payload,
				errors: {},
			};
		case ASSETS_CREATE_FAILURE:
			return {
				...state,
				isCreated: true,
				errors: action.payload,
				response: action.payload,
			};
		case ASSETS_CREATE_SUCCESS:
			return {
				...state,
				isCreated: true,
				response: action.payload,
				errors: {},
			};
		case GET_ASSETS_FAILURE:
			return {
				...state,
				errors: action.payload,
				assets: [],
			};
		case GET_ASSETS_SUCCESS:
			return {
				...state,
				assets: action.payload,
				errors: {},
			};

		case GET_ACTIVE_ASSETS_FAILURE:
		case GET_ACTIVE_ASSETS_SUCCESS:
			return {
				...state,
				activeAssets: action.payload,
				activeAssetCoins: action.payload?.map((item) => item.name),
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
				isToggle: false,
				loading: false,
			};
		default:
			return state;
	}
};

export default reducer;
