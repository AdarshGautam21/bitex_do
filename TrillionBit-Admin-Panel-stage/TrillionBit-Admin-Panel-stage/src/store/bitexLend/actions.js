import {
	ERRORS,
	CLEAR_RESPONSE,
	BITEX_SAVING_PLANS,
	ACTIVE_BITEX_SAVING_PLANS,
	CREATE_BITEX_SAVING_PLAN_REQUEST,
	UPDATE_BITEX_SAVING_PLAN_REQUEST,
	TOGGLE_BITEX_SAVING_PLAN_REQUEST,
	REMOVE_BITEX_SAVING_PLAN_REQUEST,
} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const getActiveBitexSaving = () => {
	return {
		type: ACTIVE_BITEX_SAVING_PLANS,
		payload: {},
	};
};

export const getBitexSaving = () => {
	return {
		type: BITEX_SAVING_PLANS,
		payload: {},
	};
};

export const create = (data) => {
	return {
		type: CREATE_BITEX_SAVING_PLAN_REQUEST,
		payload: { data },
	};
};

export const update = (data) => {
	return {
		type: UPDATE_BITEX_SAVING_PLAN_REQUEST,
		payload: { data },
	};
};

export const remove = (id) => {
	return {
		type: REMOVE_BITEX_SAVING_PLAN_REQUEST,
		payload: { id },
	};
};

export const toggle = (id) => {
	return {
		type: TOGGLE_BITEX_SAVING_PLAN_REQUEST,
		payload: { id },
	};
};
