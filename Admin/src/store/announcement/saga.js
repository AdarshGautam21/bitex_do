import { call, put, takeEvery } from "redux-saga/effects";
import { update, remove, create } from "./services";
import {
	ANNOUNCEMENT_DELETE,
	ANNOUNCEMENT_DELETE_FAILURE,
	ANNOUNCEMENT_DELETE_SUCCESS,
	ANNOUNCEMENT_UPDATE,
	ANNOUNCEMENT_UPDATE_FAILURE,
	ANNOUNCEMENT_UPDATE_SUCCESS,
	ANNOUNCEMENT_CREATE,
	ANNOUNCEMENT_CREATE_FAILURE,
	ANNOUNCEMENT_CREATE_SUCCESS,
} from "./actionTypes";

function* deleteAnnouncement({ payload: { id } }) {
	try {
		const response = yield call(remove, id);
		if (response.status === 200) {
			yield put({
				type: ANNOUNCEMENT_DELETE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ANNOUNCEMENT_DELETE_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: ANNOUNCEMENT_DELETE_FAILURE,
			payload: err,
		});
	}
}

function* updateAnnouncement({ payload: { data } }) {
	try {
		const response = yield call(update, data);
		if (response.status === 200) {
			yield put({
				type: ANNOUNCEMENT_UPDATE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ANNOUNCEMENT_UPDATE_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: ANNOUNCEMENT_UPDATE_FAILURE,
			payload: err,
		});
	}
}

function* createAnnouncement({ payload: { data } }) {
	try {
		const response = yield call(create, data);
		if (response.status === 200) {
			yield put({
				type: ANNOUNCEMENT_CREATE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ANNOUNCEMENT_CREATE_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: ANNOUNCEMENT_CREATE_FAILURE,
			payload: err,
		});
	}
}

function* assetSaga() {
	yield takeEvery(ANNOUNCEMENT_DELETE, deleteAnnouncement);
	yield takeEvery(ANNOUNCEMENT_UPDATE, updateAnnouncement);
	yield takeEvery(ANNOUNCEMENT_CREATE, createAnnouncement);
}

export default assetSaga;
