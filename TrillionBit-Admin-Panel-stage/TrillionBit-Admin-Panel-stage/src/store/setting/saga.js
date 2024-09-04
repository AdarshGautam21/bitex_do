import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	CREATE_BITGO_SETTING_REQUEST,
	CREATE_BITGO_SETTING_SUCCESS,
	CREATE_BITGO_SETTING_FAILURE,
	UPDATE_BITGO_SETTING_REQUEST,
	UPDATE_BITGO_SETTING_SUCCESS,
	UPDATE_BITGO_SETTING_FAILURE,
	REMOVE_BITGO_SETTING_REQUEST,
	REMOVE_BITGO_SETTING_SUCCESS,
	REMOVE_BITGO_SETTING_FAILURE,
	LIVE_BITGO_SETTING_REQUEST,
	LIVE_BITGO_SETTING_SUCCESS,
	LIVE_BITGO_SETTING_FAILURE,
	BITGO_SETTING_REQUEST,
	BITGO_SETTING_SUCCESS,
	BITGO_SETTING_FAILURE,
	CREATE_XRP_WITHDRAWAL_REQUEST,
	CREATE_XRP_WITHDRAWAL_SUCCESS,
	CREATE_XRP_WITHDRAWAL_FAILURE,
	UPDATE_XRP_WITHDRAWAL_REQUEST,
	UPDATE_XRP_WITHDRAWAL_SUCCESS,
	UPDATE_XRP_WITHDRAWAL_FAILURE,
	REMOVE_XRP_WITHDRAWAL_REQUEST,
	REMOVE_XRP_WITHDRAWAL_SUCCESS,
	REMOVE_XRP_WITHDRAWAL_FAILURE,
	XRP_WITHDRAWAL_REQUEST,
	XRP_WITHDRAWAL_SUCCESS,
	XRP_WITHDRAWAL_FAILURE,
	CREATE_XRP_DEPOSIT_REQUEST,
	CREATE_XRP_DEPOSIT_SUCCESS,
	CREATE_XRP_DEPOSIT_FAILURE,
	UPDATE_XRP_DEPOSIT_REQUEST,
	UPDATE_XRP_DEPOSIT_SUCCESS,
	UPDATE_XRP_DEPOSIT_FAILURE,
	REMOVE_XRP_DEPOSIT_REQUEST,
	REMOVE_XRP_DEPOSIT_SUCCESS,
	REMOVE_XRP_DEPOSIT_FAILURE,
	XRP_DEPOSIT_REQUEST,
	XRP_DEPOSIT_SUCCESS,
	XRP_DEPOSIT_FAILURE,
	XRP_WALLET_BALANCE_REQUEST,
	XRP_WALLET_BALANCE_SUCCESS,
	XRP_WALLET_BALANCE_FAILURE,
	XRP_TRANSFER_AMOUNT_REQUEST,
	XRP_TRANSFER_AMOUNT_SUCCESS,
	XRP_TRANSFER_AMOUNT_FAILURE,

	CREATE_ETH_WITHDRAWAL_REQUEST,
	CREATE_ETH_WITHDRAWAL_SUCCESS,
	CREATE_ETH_WITHDRAWAL_FAILURE,
	UPDATE_ETH_WITHDRAWAL_REQUEST,
	UPDATE_ETH_WITHDRAWAL_SUCCESS,
	UPDATE_ETH_WITHDRAWAL_FAILURE,
	REMOVE_ETH_WITHDRAWAL_REQUEST,
	REMOVE_ETH_WITHDRAWAL_SUCCESS,
	REMOVE_ETH_WITHDRAWAL_FAILURE,
	ETH_WITHDRAWAL_REQUEST,
	ETH_WITHDRAWAL_SUCCESS,
	ETH_WITHDRAWAL_FAILURE,
	CREATE_ETH_DEPOSIT_REQUEST,
	CREATE_ETH_DEPOSIT_SUCCESS,
	CREATE_ETH_DEPOSIT_FAILURE,
	UPDATE_ETH_DEPOSIT_REQUEST,
	UPDATE_ETH_DEPOSIT_SUCCESS,
	UPDATE_ETH_DEPOSIT_FAILURE,
	REMOVE_ETH_DEPOSIT_REQUEST,
	REMOVE_ETH_DEPOSIT_SUCCESS,
	REMOVE_ETH_DEPOSIT_FAILURE,
	ETH_DEPOSIT_REQUEST,
	ETH_DEPOSIT_SUCCESS,
	ETH_DEPOSIT_FAILURE,
	ETH_WALLET_BALANCE_REQUEST,
	ETH_WALLET_BALANCE_SUCCESS,
	ETH_WALLET_BALANCE_FAILURE,
	ETH_TRANSFER_AMOUNT_REQUEST,
	ETH_TRANSFER_AMOUNT_SUCCESS,
	ETH_TRANSFER_AMOUNT_FAILURE,
	REFERRAL_REQUEST,
	REFERRAL_SUCCESS,
	REFERRAL_FAILURE,
	UPDATE_REFERRAL_REQUEST,
	UPDATE_REFERRAL_SUCCESS,
	UPDATE_REFERRAL_FAILURE,
	CREATE_WALLET_BONUS_REQUEST,
	CREATE_WALLET_BONUS_SUCCESS,
	CREATE_WALLET_BONUS_FAILURE,
	UPDATE_WALLET_BONUS_REQUEST,
	UPDATE_WALLET_BONUS_SUCCESS,
	UPDATE_WALLET_BONUS_FAILURE,
	REMOVE_WALLET_BONUS_REQUEST,
	REMOVE_WALLET_BONUS_SUCCESS,
	REMOVE_WALLET_BONUS_FAILURE,
	TOGGLE_WALLET_BONUS_REQUEST,
	TOGGLE_WALLET_BONUS_SUCCESS,
	TOGGLE_WALLET_BONUS_FAILURE,
	AGENT_SETTING_REQUEST,
	AGENT_SETTING_SUCCESS,
	AGENT_SETTING_FAILURE,
	UPDATE_AGENT_SETTING_REQUEST,
	UPDATE_AGENT_SETTING_SUCCESS,
	UPDATE_AGENT_SETTING_FAILURE,
	CREATE_MARGIN_TRADING_REQUEST,
	CREATE_MARGIN_TRADING_SUCCESS,
	CREATE_MARGIN_TRADING_FAILURE,
	UPDATE_MARGIN_TRADING_REQUEST,
	UPDATE_MARGIN_TRADING_SUCCESS,
	UPDATE_MARGIN_TRADING_FAILURE,
	REMOVE_MARGIN_TRADING_REQUEST,
	REMOVE_MARGIN_TRADING_SUCCESS,
	REMOVE_MARGIN_TRADING_FAILURE,
	TOGGLE_EXCHANGE_SETTING_REQUEST,
	TOGGLE_EXCHANGE_SETTING_SUCCESS,
	TOGGLE_EXCHANGE_SETTING_FAILURE,
} from "./actionTypes";

import {
	createBitgoSettingService,
	updateBitgoSettingService,
	removeBitgoSettingService,
	liveBitgoSettingService,
	bitgoSettingService,
	xrpWithdrawalSettingService,
	createXrpWithdrawalSettingService,
	updateXrpWithdrawalSettingService,
	removeXrpWithdrawalSettingService,
	xrpDepositSettingService,
	createXrpDepositSettingService,
	updateXrpDepositSettingService,
	removeXrpDepositSettingService,
	xrpWalletBalanceService,
	xrpTransferAmountService,

	ethWithdrawalSettingService,
	createEthWithdrawalSettingService,
	updateEthWithdrawalSettingService,
	removeEthWithdrawalSettingService,
	ethDepositSettingService,
	createEthDepositSettingService,
	updateEthDepositSettingService,
	removeEthDepositSettingService,
	ethWalletBalanceService,
	ethTransferAmountService,
	
	referralSettingService,
	updateReferralSettingService,
	toggleWalletBonusSettingService,
	createWalletBonusSettingService,
	updateWalletBonusSettingService,
	removeWalletBonusSettingService,
	agentSettingService,
	updateAgentSettingService,
	createMarginTradingService,
	updateMarginTradingService,
	removeMarginTradingService,
	toggleExchangeSettingService,
} from "./services";

function* bitgoSetting() {
	try {
		const response = yield call(bitgoSettingService);
		if (response.status === 200) {
			yield put({
				type: BITGO_SETTING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: BITGO_SETTING_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: BITGO_SETTING_FAILURE,
			payload: [],
		});
	}
}

function* createBitgoSetting({ payload: { data } }) {
	try {
		const response = yield call(createBitgoSettingService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_BITGO_SETTING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_BITGO_SETTING_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_BITGO_SETTING_FAILURE,
			payload: [],
		});
	}
}

function* updateBitgoSetting({ payload: { data } }) {
	try {
		const response = yield call(updateBitgoSettingService, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_BITGO_SETTING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_BITGO_SETTING_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_BITGO_SETTING_FAILURE,
			payload: [],
		});
	}
}

function* removeBitgoSetting({ payload: { id } }) {
	try {
		const response = yield call(removeBitgoSettingService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_BITGO_SETTING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_BITGO_SETTING_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_BITGO_SETTING_FAILURE,
			payload: [],
		});
	}
}

function* liveBitgoSetting({ payload: { id } }) {
	try {
		const response = yield call(liveBitgoSettingService, id);
		if (response.status === 200) {
			yield put({
				type: LIVE_BITGO_SETTING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: LIVE_BITGO_SETTING_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: LIVE_BITGO_SETTING_FAILURE,
			payload: [],
		});
	}
}

function* xrpWithdrawalSetting() {
	try {
		const response = yield call(xrpWithdrawalSettingService);
		if (response.status === 200) {
			yield put({
				type: XRP_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
			yield put({
				type: XRP_WALLET_BALANCE_REQUEST,
				payload: { data: { id: response.data._id, type: "withdraw" } },
			});
		} else {
			yield put({
				type: XRP_WITHDRAWAL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: XRP_WITHDRAWAL_FAILURE,
			payload: [],
		});
	}
}

function* createXrpWithdrawalSetting({ payload: { data } }) {
	try {
		const response = yield call(createXrpWithdrawalSettingService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_XRP_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_XRP_WITHDRAWAL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_XRP_WITHDRAWAL_FAILURE,
			payload: [],
		});
	}
}

function* updateXrpWithdrawalSetting({ payload: { id } }) {
	try {
		const response = yield call(updateXrpWithdrawalSettingService, id);
		if (response.status === 200) {
			yield put({
				type: UPDATE_XRP_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_XRP_WITHDRAWAL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_XRP_WITHDRAWAL_FAILURE,
			payload: [],
		});
	}
}

function* removeXrpWithdrawalSetting({ payload: { id } }) {
	try {
		const response = yield call(removeXrpWithdrawalSettingService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_XRP_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_XRP_WITHDRAWAL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_XRP_WITHDRAWAL_FAILURE,
			payload: [],
		});
	}
}

function* xrpDepositSetting() {
	try {
		const response = yield call(xrpDepositSettingService);
		if (response.status === 200) {
			yield put({
				type: XRP_DEPOSIT_SUCCESS,
				payload: response.data,
			});
			yield put({
				type: XRP_WALLET_BALANCE_REQUEST,
				payload: { data: { id: response.data._id, type: "deposit" } },
			});
		} else {
			yield put({
				type: XRP_DEPOSIT_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: XRP_DEPOSIT_FAILURE,
			payload: [],
		});
	}
}

function* createXrpDepositSetting({ payload: { data } }) {
	try {
		const response = yield call(createXrpDepositSettingService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_XRP_DEPOSIT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_XRP_DEPOSIT_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_XRP_DEPOSIT_FAILURE,
			payload: [],
		});
	}
}

function* updateXrpDepositSetting({ payload: { id } }) {
	try {
		const response = yield call(updateXrpDepositSettingService, id);
		if (response.status === 200) {
			yield put({
				type: UPDATE_XRP_DEPOSIT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_XRP_DEPOSIT_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_XRP_DEPOSIT_FAILURE,
			payload: [],
		});
	}
}

function* removeXrpDepositSetting({ payload: { id } }) {
	try {
		const response = yield call(removeXrpDepositSettingService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_XRP_DEPOSIT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_XRP_DEPOSIT_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_XRP_DEPOSIT_FAILURE,
			payload: [],
		});
	}
}

function* xrpTransferAmount({ payload: { data } }) {
	try {
		const response = yield call(xrpTransferAmountService, data);
		if (response.status === 200) {
			yield put({
				type: XRP_TRANSFER_AMOUNT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: XRP_TRANSFER_AMOUNT_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: XRP_TRANSFER_AMOUNT_FAILURE,
			payload: {},
		});
	}
}

function* xrpWalletBalance({ payload: { data } }) {
	try {
		const response = yield call(xrpWalletBalanceService, data);
		if (response.status === 200) {
			yield put({
				type: XRP_WALLET_BALANCE_SUCCESS,
				payload: { data: response.data, type: data.type },
			});
		} else {
			yield put({
				type: XRP_WALLET_BALANCE_FAILURE,
				payload: { type: data.type },
			});
		}
	} catch (err) {
		yield put({
			type: XRP_WALLET_BALANCE_FAILURE,
			payload: { type: data.type },
		});
	}
}

function* ethWithdrawalSetting() {
	try {
		const response = yield call(ethWithdrawalSettingService);
		if (response.status === 200) {
			yield put({
				type: ETH_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
			yield put({
				type: ETH_WALLET_BALANCE_REQUEST,
				payload: { data: { id: response.data._id, type: "withdraw" } },
			});
		} else {
			yield put({
				type: ETH_WITHDRAWAL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: ETH_WITHDRAWAL_FAILURE,
			payload: [],
		});
	}
}

function* createEthWithdrawalSetting({ payload: { data } }) {
	try {
		const response = yield call(createEthWithdrawalSettingService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_ETH_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_ETH_WITHDRAWAL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_ETH_WITHDRAWAL_FAILURE,
			payload: [],
		});
	}
}

function* updateEthWithdrawalSetting({ payload: { id } }) {
	try {
		const response = yield call(updateEthWithdrawalSettingService, id);
		if (response.status === 200) {
			yield put({
				type: UPDATE_ETH_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_ETH_WITHDRAWAL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_ETH_WITHDRAWAL_FAILURE,
			payload: [],
		});
	}
}

function* removeEthWithdrawalSetting({ payload: { id } }) {
	try {
		const response = yield call(removeEthWithdrawalSettingService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_ETH_WITHDRAWAL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_ETH_WITHDRAWAL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_ETH_WITHDRAWAL_FAILURE,
			payload: [],
		});
	}
}

function* ethDepositSetting() {
	try {
		const response = yield call(ethDepositSettingService);
		if (response.status === 200) {
			yield put({
				type: ETH_DEPOSIT_SUCCESS,
				payload: response.data,
			});
			yield put({
				type: ETH_WALLET_BALANCE_REQUEST,
				payload: { data: { id: response.data._id, type: "deposit" } },
			});
		} else {
			yield put({
				type: ETH_DEPOSIT_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: ETH_DEPOSIT_FAILURE,
			payload: [],
		});
	}
}

function* createEthDepositSetting({ payload: { data } }) {
	try {
		const response = yield call(createEthDepositSettingService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_ETH_DEPOSIT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_ETH_DEPOSIT_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_ETH_DEPOSIT_FAILURE,
			payload: [],
		});
	}
}

function* updateEthDepositSetting({ payload: { id } }) {
	try {
		const response = yield call(updateEthDepositSettingService, id);
		if (response.status === 200) {
			yield put({
				type: UPDATE_ETH_DEPOSIT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_ETH_DEPOSIT_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_ETH_DEPOSIT_FAILURE,
			payload: [],
		});
	}
}

function* removeEthDepositSetting({ payload: { id } }) {
	try {
		const response = yield call(removeEthDepositSettingService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_ETH_DEPOSIT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_ETH_DEPOSIT_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_ETH_DEPOSIT_FAILURE,
			payload: [],
		});
	}
}

function* ethTransferAmount({ payload: { data } }) {
	try {
		const response = yield call(ethTransferAmountService, data);
		if (response.status === 200) {
			yield put({
				type: ETH_TRANSFER_AMOUNT_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ETH_TRANSFER_AMOUNT_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: ETH_TRANSFER_AMOUNT_FAILURE,
			payload: {},
		});
	}
}

function* ethWalletBalance({ payload: { data } }) {
	try {
		const response = yield call(ethWalletBalanceService, data);
		if (response.status === 200) {
			yield put({
				type: ETH_WALLET_BALANCE_SUCCESS,
				payload: { data: response.data, type: data.type },
			});
		} else {
			yield put({
				type: ETH_WALLET_BALANCE_FAILURE,
				payload: { type: data.type },
			});
		}
	} catch (err) {
		yield put({
			type: ETH_WALLET_BALANCE_FAILURE,
			payload: { type: data.type },
		});
	}
}


function* referralSetting() {
	try {
		const response = yield call(referralSettingService);
		if (response.status === 200) {
			yield put({
				type: REFERRAL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REFERRAL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REFERRAL_FAILURE,
			payload: [],
		});
	}
}

function* updateReferralSetting({ payload: { data } }) {
	try {
		const response = yield call(updateReferralSettingService, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_REFERRAL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_REFERRAL_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_REFERRAL_FAILURE,
			payload: [],
		});
	}
}

function* createWalletBonusSetting({ payload: { data } }) {
	try {
		const response = yield call(createWalletBonusSettingService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_WALLET_BONUS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_WALLET_BONUS_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_WALLET_BONUS_FAILURE,
			payload: [],
		});
	}
}

function* updateWalletBonusSetting({ payload: { data } }) {
	try {
		const response = yield call(updateWalletBonusSettingService, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_WALLET_BONUS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_WALLET_BONUS_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_WALLET_BONUS_FAILURE,
			payload: [],
		});
	}
}

function* removeWalletBonusSetting({ payload: { id } }) {
	try {
		const response = yield call(removeWalletBonusSettingService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_WALLET_BONUS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_WALLET_BONUS_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_WALLET_BONUS_FAILURE,
			payload: [],
		});
	}
}

function* toggleWalletBonusSetting({ payload: { id } }) {
	try {
		const response = yield call(toggleWalletBonusSettingService, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_WALLET_BONUS_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_WALLET_BONUS_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_WALLET_BONUS_FAILURE,
			payload: [],
		});
	}
}

function* agentSetting() {
	try {
		const response = yield call(agentSettingService);
		if (response.status === 200) {
			yield put({
				type: AGENT_SETTING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: AGENT_SETTING_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: AGENT_SETTING_FAILURE,
			payload: {},
		});
	}
}

function* updateAgentSetting({ payload: { data } }) {
	try {
		const response = yield call(updateAgentSettingService, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_AGENT_SETTING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_AGENT_SETTING_FAILURE,
				payload: {},
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_AGENT_SETTING_FAILURE,
			payload: {},
		});
	}
}

function* createMarginTrading({ payload: { data } }) {
	try {
		const response = yield call(createMarginTradingService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_MARGIN_TRADING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_MARGIN_TRADING_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_MARGIN_TRADING_FAILURE,
			payload: [],
		});
	}
}

function* updateMarginTrading({ payload: { data } }) {
	try {
		const response = yield call(updateMarginTradingService, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_MARGIN_TRADING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_MARGIN_TRADING_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_MARGIN_TRADING_FAILURE,
			payload: [],
		});
	}
}

function* removeMarginTrading({ payload: { id } }) {
	try {
		const response = yield call(removeMarginTradingService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_MARGIN_TRADING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_MARGIN_TRADING_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_MARGIN_TRADING_FAILURE,
			payload: [],
		});
	}
}

function* toggleExchangeSetting({ payload: { id } }) {
	try {
		console.log("toggleExchangeSetting", id);
		const response = yield call(toggleExchangeSettingService, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_EXCHANGE_SETTING_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_EXCHANGE_SETTING_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_EXCHANGE_SETTING_FAILURE,
			payload: [],
		});
	}
}

function* saga() {
	yield takeEvery(LIVE_BITGO_SETTING_REQUEST, liveBitgoSetting);
	yield takeEvery(CREATE_BITGO_SETTING_REQUEST, createBitgoSetting);
	yield takeEvery(UPDATE_BITGO_SETTING_REQUEST, updateBitgoSetting);
	yield takeEvery(REMOVE_BITGO_SETTING_REQUEST, removeBitgoSetting);
	yield takeEvery(BITGO_SETTING_REQUEST, bitgoSetting);

	yield takeEvery(CREATE_XRP_DEPOSIT_REQUEST, createXrpDepositSetting);
	yield takeEvery(UPDATE_XRP_DEPOSIT_REQUEST, updateXrpDepositSetting);
	yield takeEvery(REMOVE_XRP_DEPOSIT_REQUEST, removeXrpDepositSetting);
	yield takeEvery(XRP_DEPOSIT_REQUEST, xrpDepositSetting);

	yield takeEvery(CREATE_XRP_WITHDRAWAL_REQUEST, createXrpWithdrawalSetting);
	yield takeEvery(UPDATE_XRP_WITHDRAWAL_REQUEST, updateXrpWithdrawalSetting);
	yield takeEvery(REMOVE_XRP_WITHDRAWAL_REQUEST, removeXrpWithdrawalSetting);
	yield takeEvery(XRP_WITHDRAWAL_REQUEST, xrpWithdrawalSetting);

	yield takeEvery(XRP_TRANSFER_AMOUNT_REQUEST, xrpTransferAmount);
	yield takeEvery(XRP_WALLET_BALANCE_REQUEST, xrpWalletBalance);

	yield takeEvery(CREATE_ETH_DEPOSIT_REQUEST, createEthDepositSetting);
	yield takeEvery(UPDATE_ETH_DEPOSIT_REQUEST, updateEthDepositSetting);
	yield takeEvery(REMOVE_ETH_DEPOSIT_REQUEST, removeEthDepositSetting);
	yield takeEvery(ETH_DEPOSIT_REQUEST, ethDepositSetting);

	yield takeEvery(CREATE_ETH_WITHDRAWAL_REQUEST, createEthWithdrawalSetting);
	yield takeEvery(UPDATE_ETH_WITHDRAWAL_REQUEST, updateEthWithdrawalSetting);
	yield takeEvery(REMOVE_ETH_WITHDRAWAL_REQUEST, removeEthWithdrawalSetting);
	yield takeEvery(ETH_WITHDRAWAL_REQUEST, ethWithdrawalSetting);

	yield takeEvery(ETH_TRANSFER_AMOUNT_REQUEST, ethTransferAmount);
	yield takeEvery(ETH_WALLET_BALANCE_REQUEST, ethWalletBalance);

	yield takeEvery(UPDATE_REFERRAL_REQUEST, updateReferralSetting);
	yield takeEvery(REFERRAL_REQUEST, referralSetting);

	yield takeEvery(TOGGLE_WALLET_BONUS_REQUEST, toggleWalletBonusSetting);
	yield takeEvery(CREATE_WALLET_BONUS_REQUEST, createWalletBonusSetting);
	yield takeEvery(UPDATE_WALLET_BONUS_REQUEST, updateWalletBonusSetting);
	yield takeEvery(REMOVE_WALLET_BONUS_REQUEST, removeWalletBonusSetting);

	yield takeEvery(UPDATE_AGENT_SETTING_REQUEST, updateAgentSetting);
	yield takeEvery(AGENT_SETTING_REQUEST, agentSetting);

	yield takeEvery(CREATE_MARGIN_TRADING_REQUEST, createMarginTrading);
	yield takeEvery(UPDATE_MARGIN_TRADING_REQUEST, updateMarginTrading);
	yield takeEvery(REMOVE_MARGIN_TRADING_REQUEST, removeMarginTrading);

	yield takeEvery(TOGGLE_EXCHANGE_SETTING_REQUEST, toggleExchangeSetting);
}

export default saga;
