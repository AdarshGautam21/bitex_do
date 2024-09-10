import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_ADMIN_REQUEST,
	UPDATE_ADMIN_REQUEST,
	REMOVE_ADMIN_REQUEST,
	CREATE_ROLE_REQUEST,
	UPDATE_ROLE_REQUEST,
	TOGGLE_ROLE_REQUEST,
	REMOVE_ROLE_REQUEST,
	CREATE_PERMISSION_REQUEST,
	UPDATE_PERMISSION_REQUEST,
	REMOVE_PERMISSION_REQUEST,
	TOGGLE_PERMISSION_REQUEST,
	CREATE_BANK_DETAIL_REQUEST,
	CREATE_BANK_DETAIL_SUCCESS,
	CREATE_BANK_DETAIL_FAILURE,
	UPDATE_BANK_DETAIL_REQUEST,
	UPDATE_BANK_DETAIL_SUCCESS,
	UPDATE_BANK_DETAIL_FAILURE,
	REMOVE_BANK_DETAIL_REQUEST,
	REMOVE_BANK_DETAIL_SUCCESS,
	REMOVE_BANK_DETAIL_FAILURE,
	BANK_DETAIL_REQUEST,
	BANK_DETAIL_FAILURE,
	BANK_DETAIL_SUCCESS,
	PERMISSION_REQUEST,
	ROLE_REQUEST,
} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const create = (data) => {
	return {
		type: CREATE_ADMIN_REQUEST,
		payload: { data },
	};
};

export const update = (data) => {
	return {
		type: UPDATE_ADMIN_REQUEST,
		payload: { data },
	};
};

export const remove = (id) => {
	return {
		type: REMOVE_ADMIN_REQUEST,
		payload: { id },
	};
};

export const getRoles = () => {
	return {
		type: ROLE_REQUEST,
		payload: {},
	};
};

export const createRole = (data) => {
	return {
		type: CREATE_ROLE_REQUEST,
		payload: { data },
	};
};

export const updateRole = (data) => {
	return {
		type: UPDATE_ROLE_REQUEST,
		payload: { data },
	};
};

export const removeRole = (id) => {
	return {
		type: REMOVE_ROLE_REQUEST,
		payload: { id },
	};
};

export const toggleRole = (id) => {
	return {
		type: TOGGLE_ROLE_REQUEST,
		payload: { id },
	};
};

export const getPermissions = () => {
	return {
		type: PERMISSION_REQUEST,
		payload: {},
	};
};

export const createPermission = (data) => {
	return {
		type: CREATE_PERMISSION_REQUEST,
		payload: { data },
	};
};

export const updatePermission = (data) => {
	return {
		type: UPDATE_PERMISSION_REQUEST,
		payload: { data },
	};
};

export const togglePermission = (id) => {
	return {
		type: TOGGLE_PERMISSION_REQUEST,
		payload: { id },
	};
};

export const removePermission = (id) => {
	return {
		type: REMOVE_PERMISSION_REQUEST,
		payload: { id },
	};
};

export const createBankDetail = (data) => {
	return {
		type: CREATE_BANK_DETAIL_REQUEST,
		payload: { data },
	};
};
export const getBankDetail = () => {
	return {
		type: BANK_DETAIL_REQUEST,
		payload: {},
	};
};

export const updateBankDetail = (data) => {
	return {
		type: UPDATE_BANK_DETAIL_REQUEST,
		payload: { data },
	};
};

export const removeBankDetail = (id) => {
	return {
		type: REMOVE_BANK_DETAIL_REQUEST,
		payload: { id },
	};
};
