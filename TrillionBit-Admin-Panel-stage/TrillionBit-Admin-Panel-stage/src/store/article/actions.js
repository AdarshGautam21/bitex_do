import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_ARTICLE_REQUEST,
	UPDATE_ARTICLE_REQUEST,
	REMOVE_ARTICLE_REQUEST,
	TOGGLE_ARTICLE_REQUEST,
	FEATURE_ARTICLE_REQUEST,
	CREATE_ARTICLE_TAG_REQUEST,
	UPDATE_ARTICLE_TAG_REQUEST,
	REMOVE_ARTICLE_TAG_REQUEST,
	TOGGLE_ARTICLE_TAG_REQUEST,
	CREATE_ARTICLE_CATEGORY_REQUEST,
	UPDATE_ARTICLE_CATEGORY_REQUEST,
	REMOVE_ARTICLE_CATEGORY_REQUEST,
	TOGGLE_ARTICLE_CATEGORY_REQUEST,
	ARTICLE_CATEGORY_REQUEST,
	ARTICLE_TAG_REQUEST,
} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const create = (data) => {
	return {
		type: CREATE_ARTICLE_REQUEST,
		payload: { data },
	};
};

export const update = (data) => {
	return {
		type: UPDATE_ARTICLE_REQUEST,
		payload: { data },
	};
};

export const feature = (id) => {
	return {
		type: FEATURE_ARTICLE_REQUEST,
		payload: { id },
	};
};

export const toggle = (id) => {
	return {
		type: TOGGLE_ARTICLE_REQUEST,
		payload: { id },
	};
};

export const remove = (id) => {
	return {
		type: REMOVE_ARTICLE_REQUEST,
		payload: { id },
	};
};

export const getTags = () => {
	return {
		type: ARTICLE_TAG_REQUEST,
		payload: {},
	};
};

export const createTag = (data) => {
	return {
		type: CREATE_ARTICLE_TAG_REQUEST,
		payload: { data },
	};
};

export const updateTag = (data) => {
	return {
		type: UPDATE_ARTICLE_TAG_REQUEST,
		payload: { data },
	};
};

export const removeTag = (id) => {
	return {
		type: REMOVE_ARTICLE_TAG_REQUEST,
		payload: { id },
	};
};

export const toggleTag = (id) => {
	return {
		type: TOGGLE_ARTICLE_TAG_REQUEST,
		payload: { id },
	};
};

export const getCategories = () => {
	return {
		type: ARTICLE_CATEGORY_REQUEST,
		payload: {},
	};
};

export const createCategory = (data) => {
	return {
		type: CREATE_ARTICLE_CATEGORY_REQUEST,
		payload: { data },
	};
};

export const updateCategory = (data) => {
	return {
		type: UPDATE_ARTICLE_CATEGORY_REQUEST,
		payload: { data },
	};
};

export const toggleCategory = (id) => {
	return {
		type: TOGGLE_ARTICLE_CATEGORY_REQUEST,
		payload: { id },
	};
};

export const removeCategory = (id) => {
	return {
		type: REMOVE_ARTICLE_CATEGORY_REQUEST,
		payload: { id },
	};
};
