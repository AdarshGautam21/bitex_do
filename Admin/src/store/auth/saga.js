import { call, put, takeEvery } from "redux-saga/effects";
import { loginSuccess, loginFailure } from "./actions";
import jwt_decode from "jwt-decode";
import setAuthToken from "../../utils/setAuthToken";
import { loginUser, getLoginUserRole as getUserRole } from "./services";
import {
	LOGIN,
	LOGOUT,
	LOGIN_USER_ROLE_REQUEST,
	LOGIN_USER_ROLE_SUCCESS,
} from "./actionTypes";

function* login({ payload: { credentials, history } }) {
	try {
		const response = yield call(loginUser, credentials);
		if (response.status === 200) {
			const { token } = response.data;
			localStorage.setItem("jwtToken", token);
			const user = jwt_decode(token);
			localStorage.setItem("authUser", JSON.stringify(user));
			setAuthToken(token);
			yield put(loginSuccess(user));
			const id = user.roles[0]._id;
			yield put({ type: LOGIN_USER_ROLE_REQUEST, payload: { id } });
			history.push("/dashboard");
		} else {
			yield put(loginFailure(response));
		}
	} catch (err) {
		yield put(loginFailure(err));
	}
}

function* logout({ payload: { history } }) {
	try {
		localStorage.removeItem("authUser");
		localStorage.removeItem("token");
		history.push("/login");
	} catch (error) {
		yield put(loginFailure(error));
	}
}

function* getLoginUserRole({ payload: { id } }) {
	try {
		const response = yield call(getUserRole, id);
		if (response.status === 200) {
			yield put({
				type: LOGIN_USER_ROLE_SUCCESS,
				payload: response.data,
			});
		} else {
			yield put({ type: LOGIN_USER_ROLE_SUCCESS, payload: {} });
		}
	} catch (err) {
		yield put({ type: LOGIN_USER_ROLE_SUCCESS, payload: {} });
	}
}

function* authSaga() {
	yield takeEvery(LOGIN, login);
	yield takeEvery(LOGOUT, logout);
	yield takeEvery(LOGIN_USER_ROLE_REQUEST, getLoginUserRole);
}

export default authSaga;
