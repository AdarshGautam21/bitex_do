import {
	TOGGLE_AGENT,
	TOGGLE_SUB_AGENT,
	TOGGLE_MARGING_TRADING,
	USER_BASIC_INFO_REQUEST,
	USER_IDENTITY_INFO_REQUEST,
	USER_PERSONAL_INFO_REQUEST,
	UPDATE_USER_PERSONAL_INFO_REQUEST,
	TOGGLE_VERIFICATION_USER_REQUEST,
	TOGGLE_BLOCK_USER_REQUEST,
	USER_BANK_INFO_REQUEST,
	UPDATE_USER_BANK_INFO_REQUEST,
	USER_WALLET_INFO_REQUEST,
	USER_TOTAL_FIAT_DEPOSIT_REQUEST,
	USER_TOTAL_FIAT_WITHDRAWAL_REQUEST,
	USER_TOTAL_CRYPTO_DEPOSIT_REQUEST,
	USER_TOTAL_CRYPTO_WITHDRAWAL_REQUEST,
	UPDATE_USER_CHANGE_PASSWORD_REQUEST,
	UPDATE_USER_PROFILE_REQUEST,
	USER_PROFILE_REQUEST,
	CLEAR_RESPONSE,
	// ERRORS,
} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const toggleAgent = (userId) => {
	return {
		type: TOGGLE_AGENT,
		payload: { userId },
	};
};

export const toggleSubAgent = (userId) => {
	return {
		type: TOGGLE_SUB_AGENT,
		payload: { userId },
	};
};

export const toggleMarginTrading = (userId) => {
	return {
		type: TOGGLE_MARGING_TRADING,
		payload: { userId },
	};
};

export const basicInfo = (id) => {
	return {
		type: USER_BASIC_INFO_REQUEST,
		payload: { id },
	};
};

export const identityInfo = (id) => {
	return {
		type: USER_IDENTITY_INFO_REQUEST,
		payload: { id },
	};
};

export const personalInfo = (id) => {
	return {
		type: USER_PERSONAL_INFO_REQUEST,
		payload: { id },
	};
};

export const updatePersonalInfo = (data) => {
	return {
		type: UPDATE_USER_PERSONAL_INFO_REQUEST,
		payload: { data },
	};
};

export const toggleVerification = (id) => {
	return {
		type: TOGGLE_VERIFICATION_USER_REQUEST,
		payload: { id },
	};
};

export const toggleBlock = (id) => {
	return {
		type: TOGGLE_BLOCK_USER_REQUEST,
		payload: { id },
	};
};

export const bankInfo = (id) => {
	return {
		type: USER_BANK_INFO_REQUEST,
		payload: { id },
	};
};
export const updateBankInfo = (data) => {
	return {
		type: UPDATE_USER_BANK_INFO_REQUEST,
		payload: { data },
	};
};

export const walletInfo = (id) => {
	return {
		type: USER_WALLET_INFO_REQUEST,
		payload: { id },
	};
};

export const totalFiatDeposit = (data) => {
	return {
		type: USER_TOTAL_FIAT_DEPOSIT_REQUEST,
		payload: { data },
	};
};
export const totalFiatWithdrawal = (data) => {
	return {
		type: USER_TOTAL_FIAT_WITHDRAWAL_REQUEST,
		payload: { data },
	};
};

export const totalCryptoDeposit = (data) => {
	return {
		type: USER_TOTAL_CRYPTO_DEPOSIT_REQUEST,
		payload: { data },
	};
};
export const totalCryptoWithdrawal = (data) => {
	return {
		type: USER_TOTAL_CRYPTO_WITHDRAWAL_REQUEST,
		payload: { data },
	};
};

export const updatePassword = (data) => {
	return {
		type: UPDATE_USER_CHANGE_PASSWORD_REQUEST,
		payload: { data },
	};
};

export const profileInfo = (id) => {
	return {
		type: USER_PROFILE_REQUEST,
		payload: { id },
	};
};

export const updateUserProfile = (data) => {
	return {
		type: UPDATE_USER_PROFILE_REQUEST,
		payload: { data },
	};
};
