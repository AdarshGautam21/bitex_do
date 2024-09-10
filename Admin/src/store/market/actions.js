import {
	TOGGLE_MARKET,
	MARKET_DELETE,
	MARKET_UPDATE,
	MARKET_CREATE,
	CLEAR_RESPONSE,
	GET_ACTIVE_MARKET_REQUEST,

	// ERRORS,
} from "./actionTypes";

export const toggle = (id) => {
	return {
		type: TOGGLE_MARKET,
		payload: { id },
	};
};

export const getActive = () => {
	return {
		type: GET_ACTIVE_MARKET_REQUEST,
		payload: {},
	};
};

export const remove = (id) => {
	return {
		type: MARKET_DELETE,
		payload: { id },
	};
};

export const update = (data) => {
	return {
		type: MARKET_UPDATE,
		payload: { data },
	};
};

export const create = (data) => {
	return {
		type: MARKET_CREATE,
		payload: { data },
	};
};

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};
