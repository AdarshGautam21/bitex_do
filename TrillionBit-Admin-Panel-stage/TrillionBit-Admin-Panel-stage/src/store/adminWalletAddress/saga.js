import { call, put, takeEvery } from "redux-saga/effects";
import { update, remove, create } from "./services";
import {
	ADMIN_WALLET_ADDRESS_DELETE,
	ADMIN_WALLET_ADDRESS_DELETE_FAILURE,
	ADMIN_WALLET_ADDRESS_DELETE_SUCCESS,
	ADMIN_WALLET_ADDRESS_UPDATE,
	ADMIN_WALLET_ADDRESS_UPDATE_FAILURE,
	ADMIN_WALLET_ADDRESS_UPDATE_SUCCESS,
	ADMIN_WALLET_ADDRESS_CREATE,
	ADMIN_WALLET_ADDRESS_CREATE_FAILURE,
	ADMIN_WALLET_ADDRESS_CREATE_SUCCESS,
} from "./actionTypes";

function* deleteAdminWalletAddress({ payload: { id } }) {
	try {
		const response = yield call(remove, id);
		if (response.status === 200) {
			yield put({
				type: ADMIN_WALLET_ADDRESS_DELETE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ADMIN_WALLET_ADDRESS_DELETE_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: ADMIN_WALLET_ADDRESS_DELETE_FAILURE,
			payload: err,
		});
	}
}

function* updateAdminWalletAddress({ payload: { data } }) {
	try {
		const response = yield call(update, data);
		if (response.status === 200) {
			yield put({
				type: ADMIN_WALLET_ADDRESS_UPDATE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ADMIN_WALLET_ADDRESS_UPDATE_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: ADMIN_WALLET_ADDRESS_UPDATE_FAILURE,
			payload: err,
		});
	}
}

function* createAdminWalletAddress({ payload: { data } }) {
	try {
		const response = yield call(create, data);
		if (response.status === 200) {
			yield put({
				type: ADMIN_WALLET_ADDRESS_CREATE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ADMIN_WALLET_ADDRESS_CREATE_FAILURE,
				payload: response.data,
			});
		}
	} catch (err) {
		yield put({
			type: ADMIN_WALLET_ADDRESS_CREATE_FAILURE,
			payload: err,
		});
	}
}

function* assetSaga() {
	yield takeEvery(ADMIN_WALLET_ADDRESS_DELETE, deleteAdminWalletAddress);
	yield takeEvery(ADMIN_WALLET_ADDRESS_UPDATE, updateAdminWalletAddress);
	yield takeEvery(ADMIN_WALLET_ADDRESS_CREATE, createAdminWalletAddress);
}

export default assetSaga;
