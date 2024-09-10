import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_ASSETS_CURRENCY_REQUEST,
	UPDATE_ASSETS_CURRENCY_REQUEST,
	REMOVE_ASSETS_CURRENCY_REQUEST,
	CREATE_ASSETS_CURRENCY_ADV_REQUEST,
	UPDATE_ASSETS_CURRENCY_ADV_REQUEST,
	REMOVE_ASSETS_CURRENCY_ADV_REQUEST

} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const create = (data) => {
	return {
		type: CREATE_ASSETS_CURRENCY_REQUEST,
		payload: { data },
	};
};

export const update = (data) => {
	return {
		type: UPDATE_ASSETS_CURRENCY_REQUEST,
		payload: { data },
	};
};

export const remove = (id) => {
	return {
		type: REMOVE_ASSETS_CURRENCY_REQUEST,
		payload: { id },
	};
};

export const createAssetsCurrencyAdvanced = (data) => {
	return {
		type: CREATE_ASSETS_CURRENCY_ADV_REQUEST,
		payload: { data },
	};
};

export const updateAssetsCurrencyAdvanced = (data) => {
	return {
		type: UPDATE_ASSETS_CURRENCY_ADV_REQUEST,
		payload: { data },
	};
};

export const removeAssetsCurrencyAdvanced = (id) => {
	return {
		type: REMOVE_ASSETS_CURRENCY_ADV_REQUEST,
		payload: { id },
	};
};
