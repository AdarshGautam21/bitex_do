import { call, put, takeEvery, takeLatest } from "redux-saga/effects";
// Login Redux States
import { LOGIN_USER, LOGOUT_USER, SOCIAL_LOGIN } from "./actionTypes";
import { apiError, loginSuccess, logoutUserSuccess } from "./actions";
import jwt_decode from "jwt-decode";
import setAuthToken from "../../../utils/setAuthToken";
import { login } from "./services";

function* loginUser({ payload: { credentials, history } }) {
	try {
		const response = yield call(login, credentials);
		if (response.status === 200) {
			const { token } = response.data;
			localStorage.setItem("jwtToken", token);
			setAuthToken(token);
			const user = jwt_decode(token);
			localStorage.setItem("authUser", JSON.stringify(user));
			yield put(loginSuccess(user));
			history.push("/dashboard");
		} else {
			yield put(apiError("errorrrrrrr"));
		}
	} catch (err) {
		yield put(apiError(err));
	}
}

function* logoutUser({ payload: { history } }) {
	try {
		localStorage.removeItem("authUser");
		localStorage.removeItem("token");
		history.push("/login");
	} catch (error) {
		yield put(apiError(error));
	}
}

function* socialLogin({ payload: { data, history, type } }) {}

function* authSaga() {
	yield takeEvery(LOGIN_USER, loginUser);
	yield takeLatest(SOCIAL_LOGIN, socialLogin);
	yield takeEvery(LOGOUT_USER, logoutUser);
}

export default authSaga;
