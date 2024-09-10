import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	NOTIFICATION_FAILURE,
	NOTIFICATION_SUCCESS,
	NOTIFICATION_REQUEST,
	UPDATE_NOTIFICATION_REQUEST,
	UPDATE_NOTIFICATION_FAILURE,
	UPDATE_NOTIFICATION_SUCCESS,
} from "./actionTypes";

import { getNotifications, updateNotification } from "./services";

function* getUserNotifications() {
	try {
		const response = yield call(getNotifications);
		if (response.status === 200) {
			yield put({
				type: NOTIFICATION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: NOTIFICATION_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: NOTIFICATION_FAILURE,
			payload: [],
		});
	}
}
function* updateUserNotification({ payload: { data } }) {
	try {
		const response = yield call(updateNotification, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_NOTIFICATION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_NOTIFICATION_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_NOTIFICATION_FAILURE,
			payload: {},
		});
	}
}

function* saga() {
	yield takeEvery(NOTIFICATION_REQUEST, getUserNotifications);
	yield takeEvery(UPDATE_NOTIFICATION_REQUEST, updateUserNotification);
}

export default saga;
