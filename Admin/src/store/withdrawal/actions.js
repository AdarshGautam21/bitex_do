import {
	ERRORS,
	UPDATE_FIAT_WITHDRAWAL,
	UPDATE_CRYPTO_WITHDRAWAL,
	CLEAR_RESPONSE,
} from "./actionTypes";

export const updateWithdrawalRequest = (status, requestId) => {
	return {
		type: UPDATE_FIAT_WITHDRAWAL,
		payload: { status, requestId },
	};
};

export const updateCryptoWithdrawalRequest = (params) => {
	return {
		type: UPDATE_CRYPTO_WITHDRAWAL,
		payload: { params },
	};
};

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};
