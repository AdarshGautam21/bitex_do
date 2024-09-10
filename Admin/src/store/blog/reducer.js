import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_BLOG_SUCCESS,
	CREATE_BLOG_FAILURE,
	UPDATE_BLOG_SUCCESS,
	UPDATE_BLOG_FAILURE,
	REMOVE_BLOG_FAILURE,
	REMOVE_BLOG_SUCCESS,
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
		case CREATE_BLOG_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case CREATE_BLOG_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case UPDATE_BLOG_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case UPDATE_BLOG_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case REMOVE_BLOG_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case REMOVE_BLOG_SUCCESS:
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
