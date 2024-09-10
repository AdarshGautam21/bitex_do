import { ERRORS, UPDATE_FIAT_DEPOSIT, CLEAR_RESPONSE } from "./actionTypes";

export const updateFiatDeposit = (status, requestId) => {
	return {
		type: UPDATE_FIAT_DEPOSIT,
		payload: { status, requestId },
	};
};

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};
