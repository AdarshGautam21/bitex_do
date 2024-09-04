import {
	ERRORS,
	CLEAR_RESPONSE,
	NOTIFICATION_REQUEST,
	UPDATE_NOTIFICATION_REQUEST,
	TOTAL_FIAT_TRANSCATION_REQUEST,
	TOTAL_CRYPTO_TRANSCATION_REQUEST,
	TOTAL_SELL_ORDERS_REQUEST,
	TOTAL_SELL_ORDERS_FAILURE,
	TOTAL_SELL_ORDERS_SUCCESS,
	TOTAL_BUY_ORDERS_REQUEST,
	TOTAL_BUY_ORDERS_FAILURE,
	TOTAL_BUY_ORDERS_SUCCESS,
	TOTAL_USER_REQUEST,
	TOTAL_USER_FAILURE,
	TOTAL_USER_SUCCESS,
	TOTAL_USER_HOLDING_REQUEST,
	TOTAL_USER_HOLDING_FAILURE,
	TOTAL_USER_HOLDING_SUCCESS,
} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const totalFiatTranscation = (data) => {
	return {
		type: TOTAL_FIAT_TRANSCATION_REQUEST,
		payload: { data },
	};
};

export const totalCryptoTranscation = (data) => {
	return {
		type: TOTAL_CRYPTO_TRANSCATION_REQUEST,
		payload: { data },
	};
};

export const totalSellOrder = (data) => {
	return {
		type: TOTAL_SELL_ORDERS_REQUEST,
		payload: { data },
	};
};

export const totalBuyOrder = (data) => {
	return {
		type: TOTAL_BUY_ORDERS_REQUEST,
		payload: { data },
	};
};
export const totalUser = (data) => {
	return {
		type: TOTAL_USER_REQUEST,
		payload: { data },
	};
};

export const totalUserWalletHolding = (data) => {
	return {
		type: TOTAL_USER_HOLDING_REQUEST,
		payload: { data },
	};
};
