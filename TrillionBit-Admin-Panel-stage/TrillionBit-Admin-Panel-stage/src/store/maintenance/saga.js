import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	CREATE_TRADING_MAINTENANCE_REQUEST,
	CREATE_TRADING_MAINTENANCE_SUCCESS,
	CREATE_TRADING_MAINTENANCE_FAILURE,
	UPDATE_TRADING_MAINTENANCE_REQUEST,
	UPDATE_TRADING_MAINTENANCE_SUCCESS,
	UPDATE_TRADING_MAINTENANCE_FAILURE,
	REMOVE_TRADING_MAINTENANCE_REQUEST,
	REMOVE_TRADING_MAINTENANCE_SUCCESS,
	REMOVE_TRADING_MAINTENANCE_FAILURE,
	TOGGLE_TRADING_MAINTENANCE_REQUEST,
	TOGGLE_TRADING_MAINTENANCE_SUCCESS,
	TOGGLE_TRADING_MAINTENANCE_FAILURE,
	CREATE_WALLET_MAINTENANCE_REQUEST,
	CREATE_WALLET_MAINTENANCE_SUCCESS,
	CREATE_WALLET_MAINTENANCE_FAILURE,
	UPDATE_WALLET_MAINTENANCE_REQUEST,
	UPDATE_WALLET_MAINTENANCE_SUCCESS,
	UPDATE_WALLET_MAINTENANCE_FAILURE,
	TOGGLE_WALLET_MAINTENANCE_REQUEST,
	TOGGLE_WALLET_MAINTENANCE_SUCCESS,
	TOGGLE_WALLET_MAINTENANCE_FAILURE,
	REMOVE_WALLET_MAINTENANCE_REQUEST,
	REMOVE_WALLET_MAINTENANCE_SUCCESS,
	REMOVE_WALLET_MAINTENANCE_FAILURE,

	TOGGLE_MAINTENANCE_REQUEST,
	TOGGLE_MAINTENANCE_SUCCESS,
	TOGGLE_MAINTENANCE_FAILURE
} from "./actionTypes";

import {
	createWalletMaintenace as createWalletMaintenaceService,
	toggleWalletMaintenace as toggleWalletMaintenaceService,
	createTradingMaintenace as createTradingMaintenaceService,
	toggleTradingMaintenace as toggleTradingMaintenaceService,
	removeWalletMaintenace as removeWalletMaintenaceService,
	removeTradingMaintenace as removeTradingMaintenaceService,
	updateWalletMaintenace as updateWalletMaintenaceService,
	updateTradingMaintenace as updateTradingMaintenaceService,
	toggleMaintenace as toggleMaintenaceService,
} from "./services";

function* createTradingMaintenace({ payload: { data } }) {
	try {
		const response = yield call(createTradingMaintenaceService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_TRADING_MAINTENANCE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_TRADING_MAINTENANCE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_TRADING_MAINTENANCE_FAILURE,
			payload: [],
		});
	}
}

function* updateTradingMaintenace({ payload: { data } }) {
	try {
		const response = yield call(updateTradingMaintenaceService, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_TRADING_MAINTENANCE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_TRADING_MAINTENANCE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_TRADING_MAINTENANCE_FAILURE,
			payload: [],
		});
	}
}

function* removeTradingMaintenace({ payload: { id } }) {
	try {
		const response = yield call(removeTradingMaintenaceService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_TRADING_MAINTENANCE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_TRADING_MAINTENANCE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_TRADING_MAINTENANCE_FAILURE,
			payload: [],
		});
	}
}

function* toggleTradingMaintenace({ payload: { data } }) {
	try {
		const response = yield call(toggleTradingMaintenaceService, data);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_TRADING_MAINTENANCE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_TRADING_MAINTENANCE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_TRADING_MAINTENANCE_FAILURE,
			payload: [],
		});
	}
}

function* createWalletMaintenace({ payload: { data } }) {
	try {
		const response = yield call(createWalletMaintenaceService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_WALLET_MAINTENANCE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_WALLET_MAINTENANCE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_WALLET_MAINTENANCE_FAILURE,
			payload: [],
		});
	}
}

function* updateWalletMaintenace({ payload: { data } }) {
	try {
		const response = yield call(updateWalletMaintenaceService, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_WALLET_MAINTENANCE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_WALLET_MAINTENANCE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_WALLET_MAINTENANCE_FAILURE,
			payload: [],
		});
	}
}

function* removeWalletMaintenace({ payload: { id } }) {
	try {
		const response = yield call(removeWalletMaintenaceService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_WALLET_MAINTENANCE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_WALLET_MAINTENANCE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_WALLET_MAINTENANCE_FAILURE,
			payload: [],
		});
	}
}

function* toggleWalletMaintenace({ payload: { data } }) {
	try {
		const response = yield call(toggleWalletMaintenaceService, data);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_WALLET_MAINTENANCE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_WALLET_MAINTENANCE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_WALLET_MAINTENANCE_FAILURE,
			payload: [],
		});
	}
}

function* toggleMaintenace({ payload: { id } }) {
	try {
		const response = yield call(toggleMaintenaceService, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_MAINTENANCE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_MAINTENANCE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_MAINTENANCE_FAILURE,
			payload: [],
		});
	}
}

function* saga() {
	yield takeEvery(
		CREATE_TRADING_MAINTENANCE_REQUEST,
		createTradingMaintenace
	);
	yield takeEvery(
		UPDATE_TRADING_MAINTENANCE_REQUEST,
		updateTradingMaintenace
	);
	yield takeEvery(
		REMOVE_TRADING_MAINTENANCE_REQUEST,
		removeTradingMaintenace
	);
	yield takeEvery(
		TOGGLE_TRADING_MAINTENANCE_REQUEST,
		toggleTradingMaintenace
	);
	yield takeEvery(CREATE_WALLET_MAINTENANCE_REQUEST, createWalletMaintenace);
	yield takeEvery(UPDATE_WALLET_MAINTENANCE_REQUEST, updateWalletMaintenace);
	yield takeEvery(REMOVE_WALLET_MAINTENANCE_REQUEST, removeWalletMaintenace);
	yield takeEvery(TOGGLE_WALLET_MAINTENANCE_REQUEST, toggleWalletMaintenace);
	yield takeEvery(TOGGLE_MAINTENANCE_REQUEST, toggleMaintenace);
}

export default saga;
