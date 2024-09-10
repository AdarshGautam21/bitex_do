import {
	ERRORS,
	CLEAR_RESPONSE,
	NOTIFICATION_FAILURE,
	NOTIFICATION_SUCCESS,
} from "./actionTypes";

const initialState = {
	errors: {},
	response: {},
	loader: false,
	notifications: [],
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

		// case NOTIFICATION_FAILURE:
		case NOTIFICATION_SUCCESS:
			return {
				...state,
				notifications: action.payload,
			};
		default:
			return state;
	}
};

export default reducer;
