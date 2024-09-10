import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	CREATE_ASSETS_CURRENCY_REQUEST,
	CREATE_ASSETS_CURRENCY_SUCCESS,
	CREATE_ASSETS_CURRENCY_FAILURE,
	UPDATE_ASSETS_CURRENCY_SUCCESS,
	UPDATE_ASSETS_CURRENCY_REQUEST,
	UPDATE_ASSETS_CURRENCY_FAILURE,
	REMOVE_ASSETS_CURRENCY_FAILURE,
	REMOVE_ASSETS_CURRENCY_SUCCESS,
	REMOVE_ASSETS_CURRENCY_REQUEST,
	UPDATE_ASSETS_CURRENCY_ADV_REQUEST,
	UPDATE_ASSETS_CURRENCY_ADV_SUCCESS,
	UPDATE_ASSETS_CURRENCY_ADV_FAILURE,
	CREATE_ASSETS_CURRENCY_ADV_REQUEST,
	CREATE_ASSETS_CURRENCY_ADV_SUCCESS,
	CREATE_ASSETS_CURRENCY_ADV_FAILURE,
	REMOVE_ASSETS_CURRENCY_ADV_REQUEST,
	REMOVE_ASSETS_CURRENCY_ADV_SUCCESS,
	REMOVE_ASSETS_CURRENCY_ADV_FAILURE,
} from "./actionTypes";

import {
	create,
	update,
	remove,
	createAdv,
	updateAdv,
	removeAdv,
} from "./services";

function* createAssetsCurrency({ payload: { data } }) {
	try {
		const response = yield call(create, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_ASSETS_CURRENCY_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_ASSETS_CURRENCY_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_ASSETS_CURRENCY_FAILURE,
			payload: [],
		});
	}
}

function* updateAssetsCurrency({ payload: { data } }) {
	try {
		const response = yield call(update, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_ASSETS_CURRENCY_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_ASSETS_CURRENCY_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_ASSETS_CURRENCY_FAILURE,
			payload: [],
		});
	}
}

function* removeAssetsCurrency({ payload: { id } }) {
	try {
		const response = yield call(remove, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_ASSETS_CURRENCY_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_ASSETS_CURRENCY_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_ASSETS_CURRENCY_FAILURE,
			payload: [],
		});
	}
}

function* createAssetsCurrencyAdv({ payload: { data } }) {
	try {
		const response = yield call(createAdv, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_ASSETS_CURRENCY_ADV_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_ASSETS_CURRENCY_ADV_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_ASSETS_CURRENCY_ADV_FAILURE,
			payload: [],
		});
	}
}

function* updateAssetsCurrencyAdv({ payload: { data } }) {
	try {
		const response = yield call(updateAdv, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_ASSETS_CURRENCY_ADV_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_ASSETS_CURRENCY_ADV_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_ASSETS_CURRENCY_ADV_FAILURE,
			payload: [],
		});
	}
}

function* removeAssetsCurrencyAdv({ payload: { id } }) {
	try {
		const response = yield call(removeAdv, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_ASSETS_CURRENCY_ADV_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_ASSETS_CURRENCY_ADV_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_ASSETS_CURRENCY_ADV_FAILURE,
			payload: [],
		});
	}
}

function* saga() {
	yield takeEvery(CREATE_ASSETS_CURRENCY_REQUEST, createAssetsCurrency);
	yield takeEvery(UPDATE_ASSETS_CURRENCY_REQUEST, updateAssetsCurrency);
	yield takeEvery(REMOVE_ASSETS_CURRENCY_REQUEST, removeAssetsCurrency);

	yield takeEvery(
		REMOVE_ASSETS_CURRENCY_ADV_REQUEST,
		removeAssetsCurrencyAdv
	);
	yield takeEvery(
		UPDATE_ASSETS_CURRENCY_ADV_REQUEST,
		updateAssetsCurrencyAdv
	);
	yield takeEvery(
		CREATE_ASSETS_CURRENCY_ADV_REQUEST,
		createAssetsCurrencyAdv
	);
}

export default saga;
