import { call, put, takeEvery } from "redux-saga/effects";
import { toggle, update, remove, create, getActive } from "./services";
import {
	TOGGLE_MARKET,
	TOGGLE_MARKET_FAILURE,
	TOGGLE_MARKET_SUCCESS,
	MARKET_DELETE,
	MARKET_DELETE_FAILURE,
	MARKET_DELETE_SUCCESS,
	MARKET_UPDATE,
	MARKET_UPDATE_FAILURE,
	MARKET_UPDATE_SUCCESS,
	MARKET_CREATE,
	MARKET_CREATE_FAILURE,
	MARKET_CREATE_SUCCESS,
	GET_ACTIVE_MARKET_REQUEST,
	GET_ACTIVE_MARKET_FAILURE,
	GET_ACTIVE_MARKET_SUCCESS,
} from "./actionTypes";

function* toggleMarket({ payload: { id } }) {
	try {
		const response = yield call(toggle, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_MARKET_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_MARKET_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_MARKET_FAILURE,
			payload: err,
		});
	}
}

function* deleteMarket({ payload: { id } }) {
	try {
		const response = yield call(remove, id);
		if (response.status === 200) {
			yield put({
				type: MARKET_DELETE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: MARKET_DELETE_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: MARKET_DELETE_FAILURE,
			payload: err,
		});
	}
}

function* updateMarket({ payload: { data } }) {
	try {
		const response = yield call(update, data);
		if (response.status === 200) {
			yield put({
				type: MARKET_UPDATE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: MARKET_UPDATE_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: MARKET_UPDATE_FAILURE,
			payload: err,
		});
	}
}

function* createMarket({ payload: { data } }) {
	try {
		const response = yield call(create, data);
		if (response.status === 200) {
			yield put({
				type: MARKET_CREATE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: MARKET_CREATE_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: MARKET_CREATE_FAILURE,
			payload: err,
		});
	}
}

function* getActiveMarket() {
	try {
		const response = yield call(getActive);
		if (response.status === 200) {
			yield put({
				type: GET_ACTIVE_MARKET_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: GET_ACTIVE_MARKET_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: GET_ACTIVE_MARKET_FAILURE,
			payload: err,
		});
	}
}

function* assetSaga() {
	yield takeEvery(TOGGLE_MARKET, toggleMarket);
	yield takeEvery(MARKET_DELETE, deleteMarket);
	yield takeEvery(MARKET_UPDATE, updateMarket);
	yield takeEvery(MARKET_CREATE, createMarket);
	yield takeEvery(GET_ACTIVE_MARKET_REQUEST, getActiveMarket);
}

export default assetSaga;
