import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	ERRORS,
	UPDATE_FIAT_DEPOSIT,
	UPDATE_FIAT_DEPOSIT_SUCCESS,
	CLEAR_RESPONSE,
} from "./actionTypes";
import { updateFiatDepositRequest } from "./services";

function* updateDepositRequest({ payload }) {
	yield put({
		type: CLEAR_RESPONSE,
		payload: {},
	});
	try {
		const response = yield call(updateFiatDepositRequest, payload);
		if (response.status === 200) {
			yield put({
				type: UPDATE_FIAT_DEPOSIT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_FIAT_DEPOSIT_SUCCESS,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_FIAT_DEPOSIT_SUCCESS,
			payload: err,
		});
	}
}

function* saga() {
	yield takeEvery(UPDATE_FIAT_DEPOSIT, updateDepositRequest);
}

export default saga;
