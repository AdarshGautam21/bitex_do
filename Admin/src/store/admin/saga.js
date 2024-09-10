import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
import {
	CREATE_ADMIN_REQUEST,
	CREATE_ADMIN_SUCCESS,
	CREATE_ADMIN_FAILURE,
	UPDATE_ADMIN_REQUEST,
	UPDATE_ADMIN_SUCCESS,
	UPDATE_ADMIN_FAILURE,
	REMOVE_ADMIN_REQUEST,
	REMOVE_ADMIN_SUCCESS,
	REMOVE_ADMIN_FAILURE,
	CREATE_ROLE_REQUEST,
	CREATE_ROLE_SUCCESS,
	CREATE_ROLE_FAILURE,
	UPDATE_ROLE_REQUEST,
	UPDATE_ROLE_SUCCESS,
	UPDATE_ROLE_FAILURE,
	REMOVE_ROLE_REQUEST,
	REMOVE_ROLE_SUCCESS,
	REMOVE_ROLE_FAILURE,
	TOGGLE_ROLE_REQUEST,
	TOGGLE_ROLE_SUCCESS,
	TOGGLE_ROLE_FAILURE,
	CREATE_PERMISSION_REQUEST,
	CREATE_PERMISSION_SUCCESS,
	CREATE_PERMISSION_FAILURE,
	UPDATE_PERMISSION_REQUEST,
	UPDATE_PERMISSION_SUCCESS,
	UPDATE_PERMISSION_FAILURE,
	TOGGLE_PERMISSION_REQUEST,
	TOGGLE_PERMISSION_SUCCESS,
	TOGGLE_PERMISSION_FAILURE,
	REMOVE_PERMISSION_REQUEST,
	REMOVE_PERMISSION_SUCCESS,
	REMOVE_PERMISSION_FAILURE,
	PERMISSION_REQUEST,
	PERMISSION_FAILURE,
	PERMISSION_SUCCESS,
	ROLE_REQUEST,
	ROLE_FAILURE,
	ROLE_SUCCESS,
	CREATE_BANK_DETAIL_REQUEST,
	CREATE_BANK_DETAIL_SUCCESS,
	CREATE_BANK_DETAIL_FAILURE,
	UPDATE_BANK_DETAIL_REQUEST,
	UPDATE_BANK_DETAIL_SUCCESS,
	UPDATE_BANK_DETAIL_FAILURE,
	REMOVE_BANK_DETAIL_REQUEST,
	REMOVE_BANK_DETAIL_SUCCESS,
	REMOVE_BANK_DETAIL_FAILURE,
	BANK_DETAIL_REQUEST,
	BANK_DETAIL_FAILURE,
	BANK_DETAIL_SUCCESS,
} from "./actionTypes";

import {
	create,
	update,
	remove,
	createPermission as createPermissionService,
	togglePermission as togglePermissionService,
	createRole as createRoleService,
	toggleRole as toggleRoleService,
	removePermission as removePermissionService,
	removeRole as removeRoleService,
	updatePermission as updatePermissionService,
	updateRole as updateRoleService,
	getPermissions as getPermissionsService,
	getRoles as getRolesService,
	createBankDetail as createBankDetailService,
	removeBankDetail as removeBankDetailService,
	updateBankDetail as updateBankDetailService,
	getBankDetails as getBankDetailsService,
} from "./services";

function* createAdmin({ payload: { data } }) {
	try {
		const response = yield call(create, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_ADMIN_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_ADMIN_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_ADMIN_FAILURE,
			payload: [],
		});
	}
}

function* updateAdmin({ payload: { data } }) {
	try {
		const response = yield call(update, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_ADMIN_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_ADMIN_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_ADMIN_FAILURE,
			payload: [],
		});
	}
}

function* removeAdmin({ payload: { id } }) {
	try {
		const response = yield call(remove, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_ADMIN_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_ADMIN_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_ADMIN_FAILURE,
			payload: [],
		});
	}
}

function* createRole({ payload: { data } }) {
	try {
		const response = yield call(createRoleService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_ROLE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_ROLE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_ROLE_FAILURE,
			payload: [],
		});
	}
}

function* updateRole({ payload: { data } }) {
	try {
		const response = yield call(updateRoleService, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_ROLE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_ROLE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_ROLE_FAILURE,
			payload: [],
		});
	}
}

function* removeRole({ payload: { id } }) {
	try {
		const response = yield call(removeRoleService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_ROLE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_ROLE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_ROLE_FAILURE,
			payload: [],
		});
	}
}

function* toggleRole({ payload: { id } }) {
	try {
		const response = yield call(toggleRoleService, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_ROLE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_ROLE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_ROLE_FAILURE,
			payload: [],
		});
	}
}

function* createPermission({ payload: { data } }) {
	try {
		const response = yield call(createPermissionService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_PERMISSION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_PERMISSION_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_PERMISSION_FAILURE,
			payload: [],
		});
	}
}

function* updatePermission({ payload: { data } }) {
	try {
		const response = yield call(updatePermissionService, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_PERMISSION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_PERMISSION_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_PERMISSION_FAILURE,
			payload: [],
		});
	}
}

function* removePermission({ payload: { id } }) {
	try {
		const response = yield call(removePermissionService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_PERMISSION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_PERMISSION_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_PERMISSION_FAILURE,
			payload: [],
		});
	}
}

function* togglePermission({ payload: { id } }) {
	try {
		const response = yield call(togglePermissionService, id);
		if (response.status === 200) {
			yield put({
				type: TOGGLE_PERMISSION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: TOGGLE_PERMISSION_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: TOGGLE_PERMISSION_FAILURE,
			payload: [],
		});
	}
}

function* getPermissions() {
	try {
		const response = yield call(getPermissionsService);
		if (response.status === 200) {
			yield put({
				type: PERMISSION_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: PERMISSION_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: PERMISSION_FAILURE,
			payload: [],
		});
	}
}

function* getRoles() {
	try {
		const response = yield call(getRolesService);
		if (response.status === 200) {
			yield put({
				type: ROLE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: ROLE_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: ROLE_FAILURE,
			payload: [],
		});
	}
}

function* createBankDetail({ payload: { data } }) {
	try {
		const response = yield call(createBankDetailService, data);
		if (response.status === 200) {
			yield put({
				type: CREATE_BANK_DETAIL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: CREATE_BANK_DETAIL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: CREATE_BANK_DETAIL_FAILURE,
			payload: [],
		});
	}
}

function* updateBankDetail({ payload: { data } }) {
	try {
		const response = yield call(updateBankDetailService, data);
		if (response.status === 200) {
			yield put({
				type: UPDATE_BANK_DETAIL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: UPDATE_BANK_DETAIL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: UPDATE_BANK_DETAIL_FAILURE,
			payload: [],
		});
	}
}

function* removeBankDetail({ payload: { id } }) {
	try {
		const response = yield call(removeBankDetailService, id);
		if (response.status === 200) {
			yield put({
				type: REMOVE_BANK_DETAIL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: REMOVE_BANK_DETAIL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: REMOVE_BANK_DETAIL_FAILURE,
			payload: [],
		});
	}
}

function* getBankDetails() {
	try {
		const response = yield call(getBankDetailsService);
		if (response.status === 200) {
			yield put({
				type: BANK_DETAIL_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({
				type: BANK_DETAIL_FAILURE,
				payload: [],
			});
		}
	} catch (err) {
		yield put({
			type: BANK_DETAIL_FAILURE,
			payload: [],
		});
	}
}

function* saga() {
	yield takeEvery(CREATE_ADMIN_REQUEST, createAdmin);
	yield takeEvery(UPDATE_ADMIN_REQUEST, updateAdmin);
	yield takeEvery(REMOVE_ADMIN_REQUEST, removeAdmin);

	yield takeEvery(CREATE_ROLE_REQUEST, createRole);
	yield takeEvery(UPDATE_ROLE_REQUEST, updateRole);
	yield takeEvery(REMOVE_ROLE_REQUEST, removeRole);
	yield takeEvery(TOGGLE_ROLE_REQUEST, toggleRole);

	yield takeEvery(ROLE_REQUEST, getRoles);
	yield takeLatest(PERMISSION_REQUEST, getPermissions);

	yield takeEvery(CREATE_PERMISSION_REQUEST, createPermission);
	yield takeEvery(UPDATE_PERMISSION_REQUEST, updatePermission);
	yield takeEvery(REMOVE_PERMISSION_REQUEST, removePermission);
	yield takeEvery(TOGGLE_PERMISSION_REQUEST, togglePermission);

	yield takeLatest(BANK_DETAIL_REQUEST, getBankDetails);
	yield takeEvery(CREATE_BANK_DETAIL_REQUEST, createBankDetail);
	yield takeEvery(UPDATE_BANK_DETAIL_REQUEST, updateBankDetail);
	yield takeEvery(REMOVE_BANK_DETAIL_REQUEST, removeBankDetail);
}

export default saga;
