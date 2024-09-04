import {
	ACTIVE_BITEX_SAVING_PLANS_SUCCESS,
	BITEX_SAVING_PLANS_SUCCESS,
	BITEX_SAVING_PLANS,
	ACTIVE_BITEX_SAVING_PLANS,
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_BITEX_SAVING_PLAN_SUCCESS,
	CREATE_BITEX_SAVING_PLAN_FAILURE,
	UPDATE_BITEX_SAVING_PLAN_SUCCESS,
	UPDATE_BITEX_SAVING_PLAN_FAILURE,
	REMOVE_BITEX_SAVING_PLAN_FAILURE,
	REMOVE_BITEX_SAVING_PLAN_SUCCESS,
	TOGGLE_BITEX_SAVING_PLAN_FAILURE,
	TOGGLE_BITEX_SAVING_PLAN_SUCCESS,
} from "./actionTypes";

const initialState = {
	errors: {},
	response: {},
	loader: false,
	bitexSavingPlans: [],
	activeBitexSavingPlans: [],
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
		case BITEX_SAVING_PLANS_SUCCESS:
			return {
				...state,
				bitexSavingPlans: action.payload,
			};
		case ACTIVE_BITEX_SAVING_PLANS_SUCCESS:
			return {
				...state,
				activeBitexSavingPlans: action.payload,
			};
		case CREATE_BITEX_SAVING_PLAN_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case CREATE_BITEX_SAVING_PLAN_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case UPDATE_BITEX_SAVING_PLAN_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case UPDATE_BITEX_SAVING_PLAN_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case TOGGLE_BITEX_SAVING_PLAN_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};

		case TOGGLE_BITEX_SAVING_PLAN_SUCCESS:
			return {
				...state,
				response: action.payload,
				errors: {},
			};
		case REMOVE_BITEX_SAVING_PLAN_FAILURE:
			return {
				...state,
				response: action.payload,
				errors: action.payload,
			};
		case REMOVE_BITEX_SAVING_PLAN_SUCCESS:
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
