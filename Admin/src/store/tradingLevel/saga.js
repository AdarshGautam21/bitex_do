import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	CREATE_TRADING_LEVEL_REQUEST,
	CREATE_TRADING_LEVEL_SUCCESS,
	CREATE_TRADING_LEVEL_FAILURE,
	UPDATE_TRADING_LEVEL_SUCCESS,
	UPDATE_TRADING_LEVEL_REQUEST,
	UPDATE_TRADING_LEVEL_FAILURE,
	REMOVE_TRADING_LEVEL_FAILURE,
	REMOVE_TRADING_LEVEL_SUCCESS,
	REMOVE_TRADING_LEVEL_REQUEST,
} from "./actionTypes";

import { create, update, remove } from "./services";

function* createTradingLevel({ payload: { data } }) {
	try {
		const response = yield call(create, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_TRADING_LEVEL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_TRADING_LEVEL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_TRADING_LEVEL_FAILURE,
			payload: [],
		});
	}
}

function* updateTradingLevel({ payload: { data } }) {
	try {
		const response = yield call(update, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_TRADING_LEVEL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_TRADING_LEVEL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_TRADING_LEVEL_FAILURE,
			payload: [],
		});
	}
}

function* removeTradingLevel({ payload: { id, type } }) {
	try {
		const response = yield call(remove, { id, type });
		if (response.status === 200) {
			yield put({
				type: REMOVE_TRADING_LEVEL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_TRADING_LEVEL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_TRADING_LEVEL_FAILURE,
			payload: [],
		});
	}
}

function* saga() {
	yield takeEvery(CREATE_TRADING_LEVEL_REQUEST, createTradingLevel);
	yield takeEvery(UPDATE_TRADING_LEVEL_REQUEST, updateTradingLevel);
	yield takeEvery(REMOVE_TRADING_LEVEL_REQUEST, removeTradingLevel);
}

export default saga;
