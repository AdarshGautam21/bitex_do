import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	UPDATE_NOTIFICATION_FAILURE,
	UPDATE_NOTIFICATION_SUCCESS,
	TOTAL_FIAT_TRANSCATION_REQUEST,
	TOTAL_FIAT_TRANSCATION_FAILURE,
	TOTAL_FIAT_TRANSCATION_SUCCESS,
	TOTAL_CRYPTO_TRANSCATION_REQUEST,
	TOTAL_CRYPTO_TRANSCATION_FAILURE,
	TOTAL_CRYPTO_TRANSCATION_SUCCESS,
	TOTAL_SELL_ORDERS_REQUEST,
	TOTAL_SELL_ORDERS_FAILURE,
	TOTAL_SELL_ORDERS_SUCCESS,
	TOTAL_BUY_ORDERS_REQUEST,
	TOTAL_BUY_ORDERS_FAILURE,
	TOTAL_BUY_ORDERS_SUCCESS,
	TOTAL_USER_REQUEST,
	TOTAL_USER_FAILURE,
	TOTAL_USER_SUCCESS,
	TOTAL_USER_HOLDING_REQUEST,
	TOTAL_USER_HOLDING_FAILURE,
	TOTAL_USER_HOLDING_SUCCESS,
} from "./actionTypes";

import {
	getNotifications,
	updateNotification,
	getTotalCryptoTranscation,
	getTotalFiatTranscation,
	getTotalSellOrder,
	getTotalBuyOrder,
	getTotalUser,
	getTotalUserWalletHolding,
} from "./services";

function* totalFiatTranscation({ payload: { data } }) {
	try {
		const response = yield call(getTotalFiatTranscation, data);
		if (response.status === 200) {
			yield put({
				type: TOTAL_FIAT_TRANSCATION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOTAL_FIAT_TRANSCATION_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: TOTAL_FIAT_TRANSCATION_FAILURE,
			payload: {},
		});
	}
}

function* totalCryptoTranscation({ payload: { data } }) {
	try {
		const response = yield call(getTotalCryptoTranscation, data);
		if (response.status === 200) {
			yield put({
				type: TOTAL_CRYPTO_TRANSCATION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOTAL_CRYPTO_TRANSCATION_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: TOTAL_CRYPTO_TRANSCATION_FAILURE,
			payload: {},
		});
	}
}

function* totalSellOrder({ payload: { data } }) {
	try {
		const response = yield call(getTotalSellOrder, data);
		if (response.status === 200) {
			yield put({
				type: TOTAL_SELL_ORDERS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOTAL_SELL_ORDERS_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: TOTAL_SELL_ORDERS_FAILURE,
			payload: {},
		});
	}
}

function* totalBuyOrder({ payload: { data } }) {
	try {
		const response = yield call(getTotalBuyOrder, data);
		if (response.status === 200) {
			yield put({
				type: TOTAL_BUY_ORDERS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOTAL_BUY_ORDERS_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: TOTAL_BUY_ORDERS_FAILURE,
			payload: {},
		});
	}
}

function* totalUser({ payload: { data } }) {
	try {
		const response = yield call(getTotalUser, data);
		if (response.status === 200) {
			yield put({
				type: TOTAL_USER_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOTAL_USER_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: TOTAL_USER_FAILURE,
			payload: {},
		});
	}
}

function* totalUserWalletHolding({ payload: { data } }) {
	try {
		const response = yield call(getTotalUserWalletHolding, data);
		if (response.status === 200) {
			yield put({
				type: TOTAL_USER_HOLDING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOTAL_USER_HOLDING_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: TOTAL_USER_HOLDING_FAILURE,
			payload: {},
		});
	}
}

function* saga() {
	yield takeEvery(TOTAL_FIAT_TRANSCATION_REQUEST, totalFiatTranscation);
	yield takeEvery(TOTAL_CRYPTO_TRANSCATION_REQUEST, totalCryptoTranscation);

	yield takeEvery(TOTAL_SELL_ORDERS_REQUEST, totalSellOrder);
	yield takeEvery(TOTAL_BUY_ORDERS_REQUEST, totalBuyOrder);
	yield takeEvery(TOTAL_USER_REQUEST, totalUser);
	yield takeEvery(TOTAL_USER_HOLDING_REQUEST, totalUserWalletHolding);
}

export default saga;
