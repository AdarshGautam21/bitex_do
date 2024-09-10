import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	ERRORS,
	UPDATE_FIAT_WITHDRAWAL,
	UPDATE_FIAT_WITHDRAWAL_SUCCESS,
	UPDATE_CRYPTO_WITHDRAWAL,
	UPDATE_CRYPTO_WITHDRAWAL_SUCCESS
} from "./actionTypes";
import { updateFiatWithdrawalRequest,  updateCryptoWithdrawals} from "./services";

function* updateWithdrawalRequest({ payload }) {
	try {
		const response = yield call(updateFiatWithdrawalRequest, payload);
		if (response.status === 200) {
			yield put({
				type: UPDATE_FIAT_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_FIAT_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_FIAT_WITHDRAWAL_SUCCESS,
			payload: err,
		});
	}
}

function* updateCryptoWithdrawalRequest({ payload: {params} }) {
	try {
		const response = yield call(updateCryptoWithdrawals, params);
		if (response.status === 200) {
			yield put({
				type: UPDATE_CRYPTO_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_CRYPTO_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_CRYPTO_WITHDRAWAL_SUCCESS,
			payload: err,
		});
	}
}

function* saga() {
	yield takeEvery(UPDATE_FIAT_WITHDRAWAL, updateWithdrawalRequest);
	yield takeEvery(UPDATE_CRYPTO_WITHDRAWAL, updateCryptoWithdrawalRequest);
}

export default saga;
