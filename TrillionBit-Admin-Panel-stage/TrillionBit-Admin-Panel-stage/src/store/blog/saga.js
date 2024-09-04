import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	CREATE_BLOG_REQUEST,
	CREATE_BLOG_SUCCESS,
	CREATE_BLOG_FAILURE,
	UPDATE_BLOG_SUCCESS,
	UPDATE_BLOG_REQUEST,
	UPDATE_BLOG_FAILURE,
	REMOVE_BLOG_FAILURE,
	REMOVE_BLOG_SUCCESS,
	REMOVE_BLOG_REQUEST,
} from "./actionTypes";

import { create, update, remove } from "./services";

function* createBlog({ payload: { data } }) {
	try {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) =>
			formData.append(key, value)
		);
		const response = yield call(create, formData);
		if (response.status === 200) {
			yield put({
				type: CREATE_BLOG_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_BLOG_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_BLOG_FAILURE,
			payload: [],
		});
	}
}

function* updateBlog({ payload: { data } }) {
	try {
		const formData = new FormData();
		Object.entries(data).forEach(([key, value]) =>
			key === "image"
				? formData.append("file", value)
				: formData.append(key, value)
		);
		const response = yield call(update, formData);
		if (response.status === 200) {
			yield put({
				type: UPDATE_BLOG_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_BLOG_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_BLOG_FAILURE,
			payload: [],
		});
	}
}

function* removeBlog({ payload: { id } }) {
	try {
		const response = yield call(remove, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_BLOG_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_BLOG_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_BLOG_FAILURE,
			payload: [],
		});
	}
}

function* saga() {
	yield takeEvery(CREATE_BLOG_REQUEST, createBlog);
	yield takeEvery(UPDATE_BLOG_REQUEST, updateBlog);
	yield takeEvery(REMOVE_BLOG_REQUEST, removeBlog);
}

export default saga;
