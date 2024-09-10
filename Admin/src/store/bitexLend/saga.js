import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	ACTIVE_BITEX_SAVING_PLANS_SUCCESS,
	BITEX_SAVING_PLANS_SUCCESS,
	BITEX_SAVING_PLANS,
	ACTIVE_BITEX_SAVING_PLANS,
	CREATE_BITEX_SAVING_PLAN_REQUEST,
	CREATE_BITEX_SAVING_PLAN_SUCCESS,
	CREATE_BITEX_SAVING_PLAN_FAILURE,
	UPDATE_BITEX_SAVING_PLAN_SUCCESS,
	UPDATE_BITEX_SAVING_PLAN_REQUEST,
	UPDATE_BITEX_SAVING_PLAN_FAILURE,
	REMOVE_BITEX_SAVING_PLAN_FAILURE,
	REMOVE_BITEX_SAVING_PLAN_SUCCESS,
	REMOVE_BITEX_SAVING_PLAN_REQUEST,
	TOGGLE_BITEX_SAVING_PLAN_FAILURE,
	TOGGLE_BITEX_SAVING_PLAN_SUCCESS,
	TOGGLE_BITEX_SAVING_PLAN_REQUEST,
} from "./actionTypes";

import {
	getBitexSaving,
	getActiveBitexSaving,
	create,
	update,
	toggle,
	remove,
} from "./services";

function* getBitexSavingPlans() {
	try {
		const response = yield call(getBitexSaving);
		if (response.status === 200) {
			yield put({
				type: BITEX_SAVING_PLANS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: BITEX_SAVING_PLANS_SUCCESS,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: BITEX_SAVING_PLANS_SUCCESS,
			payload: [],
		});
	}
}

function* getActiveBitexSavingPlans() {
	try {
		const response = yield call(getActiveBitexSaving);
		if (response.status === 200) {
			yield put({
				type: ACTIVE_BITEX_SAVING_PLANS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ACTIVE_BITEX_SAVING_PLANS_SUCCESS,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: ACTIVE_BITEX_SAVING_PLANS_SUCCESS,
			payload: [],
		});
	}
}

function* createBitexSavingPlan({ payload: { data } }) {
	try {
		const response = yield call(create, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_BITEX_SAVING_PLAN_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_BITEX_SAVING_PLAN_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_BITEX_SAVING_PLAN_FAILURE,
			payload: [],
		});
	}
}

function* updateBitexSavingPlan({ payload: { data } }) {
	try {
		const response = yield call(update, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_BITEX_SAVING_PLAN_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_BITEX_SAVING_PLAN_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_BITEX_SAVING_PLAN_FAILURE,
			payload: [],
		});
	}
}

function* toggleBitexSavingPlan({ payload: { id } }) {
	try {
		const response = yield call(toggle, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_BITEX_SAVING_PLAN_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_BITEX_SAVING_PLAN_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_BITEX_SAVING_PLAN_FAILURE,
			payload: [],
		});
	}
}

function* removeBitexSavingPlan({ payload: { id } }) {
	try {
		const response = yield call(remove, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_BITEX_SAVING_PLAN_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_BITEX_SAVING_PLAN_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_BITEX_SAVING_PLAN_FAILURE,
			payload: [],
		});
	}
}

function* saga() {
	yield takeEvery(BITEX_SAVING_PLANS, getBitexSavingPlans);
	yield takeEvery(ACTIVE_BITEX_SAVING_PLANS, getActiveBitexSavingPlans);
	yield takeEvery(CREATE_BITEX_SAVING_PLAN_REQUEST, createBitexSavingPlan);
	yield takeEvery(UPDATE_BITEX_SAVING_PLAN_REQUEST, updateBitexSavingPlan);
	yield takeEvery(TOGGLE_BITEX_SAVING_PLAN_REQUEST, toggleBitexSavingPlan);
	yield takeEvery(REMOVE_BITEX_SAVING_PLAN_REQUEST, removeBitexSavingPlan);
}

export default saga;
