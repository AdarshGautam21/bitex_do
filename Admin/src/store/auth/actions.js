import {
    LOGIN,
    LOGIN_SUCCESS,
    LOGIN_FAILURE,
    LOGOUT,
    LOGIN_USER_ROLE_REQUEST,
    // ERRORS,
} from "./actionTypes";

export const login = (credentials, history) => {
  return {
    type: LOGIN,
    payload: { credentials, history },
  }
}

export const loginSuccess = (user) => {
  return {
    type: LOGIN_SUCCESS,
    payload: user,
  }
}

export const loginFailure = (errors) => {
  return {
    type: LOGIN_FAILURE,
    payload: errors,
  }
}

export const setCurrentUser = (data) => {
  return {
    type: LOGIN_SUCCESS,
    payload: data,
  }
}

export const logout = (history) => {
  return {
    type: LOGOUT,
    payload: {history},
  }
}

export const getLoginUserRole = (id) => {
  return {
    type: LOGIN_USER_ROLE_REQUEST,
    payload:{ id },
  }
}



