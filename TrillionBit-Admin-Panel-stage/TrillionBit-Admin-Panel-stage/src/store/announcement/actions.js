import {
	ANNOUNCEMENT_DELETE,
	ANNOUNCEMENT_UPDATE,
	ANNOUNCEMENT_CREATE,
	CLEAR_RESPONSE,
	// ERRORS,
} from "./actionTypes";

export const remove = (id) => {
	return {
		type: ANNOUNCEMENT_DELETE,
		payload: { id },
	};
};

export const update = (data) => {
	return {
		type: ANNOUNCEMENT_UPDATE,
		payload: { data },
	};
};

export const create = (data) => {
	return {
		type: ANNOUNCEMENT_CREATE,
		payload: { data },
	};
};

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};
