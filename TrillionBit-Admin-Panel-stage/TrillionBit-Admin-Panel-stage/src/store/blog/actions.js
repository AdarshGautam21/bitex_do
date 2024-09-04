import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_BLOG_REQUEST,
	UPDATE_BLOG_REQUEST,
	REMOVE_BLOG_REQUEST,
} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const create = (data) => {
	return {
		type: CREATE_BLOG_REQUEST,
		payload: { data },
	};
};

export const update = (data) => {
	return {
		type: UPDATE_BLOG_REQUEST,
		payload: { data },
	};
};

export const remove = (id) => {
	return {
		type: REMOVE_BLOG_REQUEST,
		payload: { id },
	};
};
