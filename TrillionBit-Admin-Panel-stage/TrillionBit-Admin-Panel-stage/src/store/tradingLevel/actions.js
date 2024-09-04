import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_TRADING_LEVEL_REQUEST,
	UPDATE_TRADING_LEVEL_REQUEST,
	REMOVE_TRADING_LEVEL_REQUEST,
} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const create = (data) => {
	return {
		type: CREATE_TRADING_LEVEL_REQUEST,
		payload: { data },
	};
};

export const update = (data) => {
	return {
		type: UPDATE_TRADING_LEVEL_REQUEST,
		payload: { data },
	};
};

export const remove = (id, type) => {
	return {
		type: REMOVE_TRADING_LEVEL_REQUEST,
		payload: { id, type },
	};
};
