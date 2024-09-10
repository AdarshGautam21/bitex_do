import { call, put, takeEvery } from "redux-saga/effects";
import {
	toggleAgent as toggleAgentService,
	toggleSubAgent as toggleSubAgentService,
	toggleMarginTrading as toggleMarginTradingService,
	basicInfo,
	identityInfo,
	personalInfo,
	bankInfo,
	updatePersonalInfo,
	toggleBlock,
	toggleVerification,
	updateBankInfo,
	walletInfo,
	totalFiatDeposit,
	totalFiatWithdrawal,
	totalCryptoWithdrawal,
	totalCryptoDeposit,
	updatePassword,
	getProfile,
	updateProfile,
} from "./services";
import {
	TOGGLE_AGENT_FAILURE,
	TOGGLE_AGENT_SUCCESS,
	TOGGLE_SUB_AGENT_FAILURE,
	TOGGLE_SUB_AGENT_SUCCESS,
	TOGGLE_MARGING_TRADING_FAILURE,
	TOGGLE_MARGING_TRADING_SUCCESS,
	TOGGLE_AGENT,
	TOGGLE_SUB_AGENT,
	TOGGLE_MARGING_TRADING,
	USER_BASIC_INFO_REQUEST,
	USER_BASIC_INFO_SUCCESS,
	USER_BASIC_INFO_FAILURE,
	USER_IDENTITY_INFO_REQUEST,
	USER_IDENTITY_INFO_SUCCESS,
	USER_IDENTITY_INFO_FAILURE,
	USER_PERSONAL_INFO_REQUEST,
	USER_PERSONAL_INFO_SUCCESS,
	USER_PERSONAL_INFO_FAILURE,
	UPDATE_USER_PERSONAL_INFO_REQUEST,
	UPDATE_USER_PERSONAL_INFO_SUCCESS,
	UPDATE_USER_PERSONAL_INFO_FAILURE,
	TOGGLE_VERIFICATION_USER_REQUEST,
	TOGGLE_VERIFICATION_USER_SUCCESS,
	TOGGLE_VERIFICATION_USER_FAILURE,
	TOGGLE_BLOCK_USER_REQUEST,
	TOGGLE_BLOCK_USER_SUCCESS,
	TOGGLE_BLOCK_USER_FAILURE,
	USER_BANK_INFO_REQUEST,
	USER_BANK_INFO_SUCCESS,
	USER_BANK_INFO_FAILURE,
	UPDATE_USER_BANK_INFO_REQUEST,
	UPDATE_USER_BANK_INFO_SUCCESS,
	UPDATE_USER_BANK_INFO_FAILURE,
	USER_WALLET_INFO_REQUEST,
	USER_WALLET_INFO_SUCCESS,
	USER_WALLET_INFO_FAILURE,
	USER_TOTAL_FIAT_DEPOSIT_REQUEST,
	USER_TOTAL_FIAT_DEPOSIT_SUCCESS,
	USER_TOTAL_FIAT_DEPOSIT_FAILURE,
	USER_TOTAL_FIAT_WITHDRAWAL_REQUEST,
	USER_TOTAL_FIAT_WITHDRAWAL_SUCCESS,
	USER_TOTAL_FIAT_WITHDRAWAL_FAILURE,
	USER_TOTAL_CRYPTO_DEPOSIT_REQUEST,
	USER_TOTAL_CRYPTO_DEPOSIT_SUCCESS,
	USER_TOTAL_CRYPTO_DEPOSIT_FAILURE,
	USER_TOTAL_CRYPTO_WITHDRAWAL_REQUEST,
	USER_TOTAL_CRYPTO_WITHDRAWAL_SUCCESS,
	USER_TOTAL_CRYPTO_WITHDRAWAL_FAILURE,
	UPDATE_USER_CHANGE_PASSWORD_REQUEST,
	UPDATE_USER_CHANGE_PASSWORD_SUCCESS,
	UPDATE_USER_CHANGE_PASSWORD_FAILURE,
	UPDATE_USER_PROFILE_REQUEST,
	UPDATE_USER_PROFILE_SUCCESS,
	UPDATE_USER_PROFILE_FAILURE,
	USER_PROFILE_REQUEST,
	USER_PROFILE_SUCCESS,
	USER_PROFILE_FAILURE,
} from "./actionTypes";

function* toggleAgent({ payload: { userId } }) {
	try {
		const response = yield call(toggleAgentService, userId);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_AGENT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_AGENT_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_AGENT_FAILURE,
			payload: err,
		});
	}
}

function* toggleSubAgent({ payload: { userId } }) {
	try {
		const response = yield call(toggleSubAgentService, userId);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_SUB_AGENT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_SUB_AGENT_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_SUB_AGENT_FAILURE,
			payload: err,
		});
	}
}

function* toggleMarginTrading({ payload: { userId } }) {
	try {
		const response = yield call(toggleMarginTradingService, userId);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_MARGING_TRADING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_MARGING_TRADING_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_MARGING_TRADING_FAILURE,
			payload: err,
		});
	}
}

function* userBasicInfo({ payload: { id } }) {
	try {
		const response = yield call(basicInfo, id);
		if (response.status === 200) {
			yield put({
				type: USER_BASIC_INFO_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: USER_BASIC_INFO_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: USER_BASIC_INFO_FAILURE,
			payload: {},
		});
	}
}
function* userIdentityInfo({ payload: { id } }) {
	try {
		const response = yield call(identityInfo, id);
		if (response.status === 200) {
			yield put({
				type: USER_IDENTITY_INFO_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: USER_IDENTITY_INFO_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: USER_IDENTITY_INFO_FAILURE,
			payload: {},
		});
	}
}

function* userPersonalInfo({ payload: { id } }) {
	try {
		const response = yield call(personalInfo, id);
		if (response.status === 200) {
			yield put({
				type: USER_PERSONAL_INFO_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: USER_PERSONAL_INFO_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: USER_PERSONAL_INFO_FAILURE,
			payload: {},
		});
	}
}

function* updateUserPersonalInfo({ payload: { data } }) {
	try {
		const response = yield call(updatePersonalInfo, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_USER_PERSONAL_INFO_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_USER_PERSONAL_INFO_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_USER_PERSONAL_INFO_FAILURE,
			payload: {},
		});
	}
}

function* toggleVerificationUser({ payload: { id } }) {
	try {
		const response = yield call(toggleVerification, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_VERIFICATION_USER_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_VERIFICATION_USER_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_VERIFICATION_USER_FAILURE,
			payload: err,
		});
	}
}

function* toggleBlockUser({ payload: { id } }) {
	try {
		const response = yield call(toggleBlock, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_BLOCK_USER_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_BLOCK_USER_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_BLOCK_USER_FAILURE,
			payload: err,
		});
	}
}

function* userBankInfo({ payload: { id } }) {
	try {
		const response = yield call(bankInfo, id);
		if (response.status === 200) {
			yield put({
				type: USER_BANK_INFO_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: USER_BANK_INFO_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: USER_BANK_INFO_FAILURE,
			payload: {},
		});
	}
}

function* updateUserBankInfo({ payload: { data } }) {
	try {
		const response = yield call(updateBankInfo, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_USER_BANK_INFO_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_USER_BANK_INFO_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_USER_BANK_INFO_FAILURE,
			payload: {},
		});
	}
}

function* userWalletInfo({ payload: { id } }) {
	try {
		const response = yield call(walletInfo, id);
		if (response.status === 200) {
			yield put({
				type: USER_WALLET_INFO_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: USER_WALLET_INFO_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: USER_WALLET_INFO_FAILURE,
			payload: {},
		});
	}
}

function* userTotalFiatDeposit({ payload: { data } }) {
	try {
		const response = yield call(totalFiatDeposit, data);
		if (response.status === 200) {
			yield put({
				type: USER_TOTAL_FIAT_DEPOSIT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: USER_TOTAL_FIAT_DEPOSIT_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: USER_TOTAL_FIAT_DEPOSIT_FAILURE,
			payload: {},
		});
	}
}

function* userTotalFiatWithdrawal({ payload: { data } }) {
	try {
		const response = yield call(totalFiatWithdrawal, data);
		if (response.status === 200) {
			yield put({
				type: USER_TOTAL_FIAT_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: USER_TOTAL_FIAT_WITHDRAWAL_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: USER_TOTAL_FIAT_WITHDRAWAL_FAILURE,
			payload: {},
		});
	}
}

function* userTotalCryptoDeposit({ payload: { data } }) {
	try {
		const response = yield call(totalCryptoDeposit, data);
		if (response.status === 200) {
			yield put({
				type: USER_TOTAL_CRYPTO_DEPOSIT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: USER_TOTAL_CRYPTO_DEPOSIT_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: USER_TOTAL_CRYPTO_DEPOSIT_FAILURE,
			payload: {},
		});
	}
}

function* userTotalCryptoWithdrawal({ payload: { data } }) {
	try {
		const response = yield call(totalCryptoWithdrawal, data);
		if (response.status === 200) {
			yield put({
				type: USER_TOTAL_CRYPTO_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: USER_TOTAL_CRYPTO_WITHDRAWAL_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: USER_TOTAL_CRYPTO_WITHDRAWAL_FAILURE,
			payload: {},
		});
	}
}

function* updateUserPassword({ payload: { data } }) {
	try {
		const response = yield call(updatePassword, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_USER_CHANGE_PASSWORD_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_USER_CHANGE_PASSWORD_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_USER_CHANGE_PASSWORD_FAILURE,
			payload: {},
		});
	}
}

function* getUserProfile({ payload: { id } }) {
	try {
		const response = yield call(getProfile, id);
		if (response.status === 200) {
			yield put({
				type: USER_PROFILE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: USER_PROFILE_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: USER_PROFILE_FAILURE,
			payload: {},
		});
	}
}

function* updateUserProfile({ payload: { data } }) {
	try {
		const response = yield call(updateProfile, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_USER_PROFILE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_USER_PROFILE_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_USER_PROFILE_FAILURE,
			payload: {},
		});
	}
}

function* userSaga() {
	yield takeEvery(TOGGLE_AGENT, toggleAgent);
	yield takeEvery(TOGGLE_SUB_AGENT, toggleSubAgent);
	yield takeEvery(TOGGLE_MARGING_TRADING, toggleMarginTrading);
	yield takeEvery(USER_BASIC_INFO_REQUEST, userBasicInfo);
	yield takeEvery(USER_IDENTITY_INFO_REQUEST, userIdentityInfo);
	yield takeEvery(USER_PERSONAL_INFO_REQUEST, userPersonalInfo);
	yield takeEvery(UPDATE_USER_PERSONAL_INFO_REQUEST, updateUserPersonalInfo);
	yield takeEvery(TOGGLE_VERIFICATION_USER_REQUEST, toggleVerificationUser);
	yield takeEvery(TOGGLE_BLOCK_USER_REQUEST, toggleBlockUser);
	yield takeEvery(USER_BANK_INFO_REQUEST, userBankInfo);
	yield takeEvery(UPDATE_USER_BANK_INFO_REQUEST, updateUserBankInfo);
	yield takeEvery(USER_WALLET_INFO_REQUEST, userWalletInfo);
	yield takeEvery(USER_TOTAL_FIAT_DEPOSIT_REQUEST, userTotalFiatDeposit);
	yield takeEvery(
		USER_TOTAL_FIAT_WITHDRAWAL_REQUEST,
		userTotalFiatWithdrawal
	);
	yield takeEvery(USER_TOTAL_CRYPTO_DEPOSIT_REQUEST, userTotalCryptoDeposit);
	yield takeEvery(
		USER_TOTAL_CRYPTO_WITHDRAWAL_REQUEST,
		userTotalCryptoWithdrawal
	);
	yield takeEvery(UPDATE_USER_CHANGE_PASSWORD_REQUEST, updateUserPassword);

	yield takeEvery(USER_PROFILE_REQUEST, getUserProfile);
	yield takeEvery(UPDATE_USER_PROFILE_REQUEST, updateUserProfile);
}

export default userSaga;
