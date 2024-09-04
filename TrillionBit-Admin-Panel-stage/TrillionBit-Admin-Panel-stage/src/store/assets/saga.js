import { call, put, takeEvery } from "redux-saga/effects";
import { get, getActive, toggle, update, remove, create } from "./services";
import {
	TOGGLE_ASSETS,
	TOGGLE_ASSETS_FAILURE,
	TOGGLE_ASSETS_SUCCESS,
	ASSETS_DELETE,
	ASSETS_DELETE_FAILURE,
	ASSETS_DELETE_SUCCESS,
	ASSETS_UPDATE,
	ASSETS_UPDATE_FAILURE,
	ASSETS_UPDATE_SUCCESS,
	ASSETS_CREATE,
	ASSETS_CREATE_FAILURE,
	ASSETS_CREATE_SUCCESS,
	GET_ASSETS,
	GET_ASSETS_FAILURE,
	GET_ASSETS_SUCCESS,
	GET_ACTIVE_ASSETS,
	GET_ACTIVE_ASSETS_FAILURE,
	GET_ACTIVE_ASSETS_SUCCESS,
} from "./actionTypes";

function* getAssets() {
	try {
		const response = yield call(get);
		if (response.status === 200) {
			yield put({
				type: GET_ASSETS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: GET_ASSETS_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: GET_ASSETS_FAILURE,
			payload: err,
		});
	}
}

function* getActiveAssets() {
	try {
		const response = yield call(getActive);
		if (response.status === 200) {
			yield put({
				type: GET_ACTIVE_ASSETS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: GET_ACTIVE_ASSETS_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: GET_ACTIVE_ASSETS_FAILURE,
			payload: err,
		});
	}
}

function* toggleAssets({ payload: { id, name } }) {
	try {
		const response = yield call(toggle, { id, name });
		if (response.status === 200) {
			yield put({
				type: TOGGLE_ASSETS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_ASSETS_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_ASSETS_FAILURE,
			payload: err,
		});
	}
}

function* deleteAssets({ payload: { id } }) {
	try {
		const response = yield call(remove, id);
		if (response.status === 200) {
			yield put({
				type: ASSETS_DELETE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ASSETS_DELETE_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: ASSETS_DELETE_FAILURE,
			payload: err,
		});
	}
}

function* updateAssets({ payload: { data } }) {
	try {
		const response = yield call(update, data);
		if (response.status === 200) {
			yield put({
				type: ASSETS_UPDATE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ASSETS_UPDATE_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: ASSETS_UPDATE_FAILURE,
			payload: err,
		});
	}
}

function* createAssets({ payload: { data } }) {
	try {
		const response = yield call(create, data);
		if (response.status === 200) {
			yield put({
				type: ASSETS_CREATE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ASSETS_CREATE_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: ASSETS_CREATE_FAILURE,
			payload: err,
		});
	}
}

function* assetSaga() {
	yield takeEvery(TOGGLE_ASSETS, toggleAssets);
	yield takeEvery(ASSETS_DELETE, deleteAssets);
	yield takeEvery(ASSETS_UPDATE, updateAssets);
	yield takeEvery(ASSETS_CREATE, createAssets);
	yield takeEvery(GET_ASSETS, getAssets);
	yield takeEvery(GET_ACTIVE_ASSETS, getActiveAssets);
}

export default assetSaga;
