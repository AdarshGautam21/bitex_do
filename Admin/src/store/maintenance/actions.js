import {
	ERRORS,
	CLEAR_RESPONSE,
	CREATE_TRADING_MAINTENANCE_REQUEST,
	UPDATE_TRADING_MAINTENANCE_REQUEST,
	TOGGLE_TRADING_MAINTENANCE_REQUEST,
	REMOVE_TRADING_MAINTENANCE_REQUEST,
	CREATE_WALLET_MAINTENANCE_REQUEST,
	UPDATE_WALLET_MAINTENANCE_REQUEST,
	REMOVE_WALLET_MAINTENANCE_REQUEST,
	TOGGLE_WALLET_MAINTENANCE_REQUEST,
	TOGGLE_MAINTENANCE_REQUEST
} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const createTradingMaintenance = (data) => {
	return {
		type: CREATE_TRADING_MAINTENANCE_REQUEST,
		payload: { data },
	};
};

export const updateTradingMaintenance = (data) => {
	return {
		type: UPDATE_TRADING_MAINTENANCE_REQUEST,
		payload: { data },
	};
};

export const removeTradingMaintenance = (id) => {
	return {
		type: REMOVE_TRADING_MAINTENANCE_REQUEST,
		payload: { id },
	};
};

export const toggleTradingMaintenance = (data) => {
	return {
		type: TOGGLE_TRADING_MAINTENANCE_REQUEST,
		payload: { data },
	};
};

export const createWalletMaintenance = (data) => {
	return {
		type: CREATE_WALLET_MAINTENANCE_REQUEST,
		payload: { data },
	};
};

export const updateWalletMaintenance = (data) => {
	return {
		type: UPDATE_WALLET_MAINTENANCE_REQUEST,
		payload: { data },
	};
};

export const toggleWalletMaintenance = (data) => {
	return {
		type: TOGGLE_WALLET_MAINTENANCE_REQUEST,
		payload: { data },
	};
};

export const removeWalletMaintenance = (id) => {
	return {
		type: REMOVE_WALLET_MAINTENANCE_REQUEST,
		payload: { id },
	};
};

export const toggleMaintenance = (id) => {
	return {
		type: TOGGLE_MAINTENANCE_REQUEST,
		payload: { id },
	};
};
