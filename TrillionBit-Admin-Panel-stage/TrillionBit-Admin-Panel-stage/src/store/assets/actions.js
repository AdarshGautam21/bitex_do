import {
	TOGGLE_ASSETS,
	ASSETS_DELETE,
	ASSETS_UPDATE,
	ASSETS_CREATE,
	GET_ACTIVE_ASSETS,
	CLEAR_RESPONSE,
	GET_ASSETS,
	// ERRORS,
} from "./actionTypes";

export const get = () => {
	return {
		type: GET_ASSETS,
		payload: {},
	};
};
export const getActive = () => {
	return {
		type: GET_ACTIVE_ASSETS,
		payload: {},
	};
};

export const toggle = (id, name) => {
	return {
		type: TOGGLE_ASSETS,
		payload: { id, name },
	};
};

export const remove = (id) => {
	return {
		type: ASSETS_DELETE,
		payload: { id },
	};
};

export const update = (data) => {
	return {
		type: ASSETS_UPDATE,
		payload: { data },
	};
};

export const create = (data) => {
	return {
		type: ASSETS_CREATE,
		payload: { data },
	};
};

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};
