import {
	ADMIN_WALLET_ADDRESS_DELETE,
	ADMIN_WALLET_ADDRESS_UPDATE,
	ADMIN_WALLET_ADDRESS_CREATE,
	CLEAR_RESPONSE,
	// ERRORS,
} from "./actionTypes";

export const remove = (id) => {
	return {
		type: ADMIN_WALLET_ADDRESS_DELETE,
		payload: { id },
	};
};

export const update = (data) => {
	return {
		type: ADMIN_WALLET_ADDRESS_UPDATE,
		payload: { data },
	};
};

export const create = (data) => {
	return {
		type: ADMIN_WALLET_ADDRESS_CREATE,
		payload: { data },
	};
};

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};
