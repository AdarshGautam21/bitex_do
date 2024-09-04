import axios from "axios";
import jwt_decode from "jwt-decode";

// import apiUrl from "../config";

import setAuthToken from "../utils/setAuthToken";
import {
  GET_ERRORS,
  SET_CURRENT_USER,
  GET_MESSAGES,
  GET_SNACK_MESSAGES,
  VERIFY_2FA_CODE,
  EXPAND_NAV_BAR,
  GET_MY_LOCATION,
  CLEAR_ERRORS,
  SEND_RESET_PASSWORD_LINK,
  SEND_RESET_PASSWORD_LINK_UNSET,
  SET_VERIFY_EMAIL,
  SET_LAST_LOGIN_REDIRECTED_LINK,
  SET_LOGIN_USER,
  GET_REFFERAL_SEETING,
  GET_MAINTENANCE,
} from "./types";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
/**
 * Send reset password link to user email.
 * @param {Object} userData
 */
export const sendResetPasswordLink = (userData) => (dispatch) => {
  axios
    .post(`/api/auth/forgot-password`, userData)
    .then((res) => {
      dispatch({
        type: SEND_RESET_PASSWORD_LINK,
        payload: true,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

/**
 * Reset user password.
 * @param {Object} userData
 */
export const resetUserPassword = (userData) => (dispatch) => {
  axios
    .post(`/api/auth/reset-password`, userData)
    .then((res) =>
      dispatch({
        type: GET_ERRORS,
        payload: {},
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

/**
 * Resend verification code.
 * @param {Object} userData
 */
export const resendVerificationCode = (userEmail) => (dispatch) => {
  axios
    .get(`/api/auth/resend-email-verification/${userEmail}`)
    .then((res) =>
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      })
    );
};

/**
 * Verify 2FA code
 */
export const verify2faCode = () => (dispatch) => {
  dispatch({
    type: VERIFY_2FA_CODE,
    payload: true,
  });
};

/**
 * Verify email.
 * @param {Object} userData
 */
export const verifyEmail = (userEmail, verificationCode) => (dispatch) => {
  axios
    .post(`/api/auth/verify-email`, {
      secureCode: userEmail,
      verificationCode: verificationCode,
    })
    .then((res) =>
      dispatch({
        type: GET_MESSAGES,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

/**
 * Register user and redirect to login if success
 * @param {Object} userData
 * @param {Object} history
 */
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post(`/api/auth/register`, userData)
    .then((res) =>
      dispatch({
        type: GET_MESSAGES,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

/**
 * Login user and store token
 * @param {Object} userData
 */
export const loginUser = (userData) => (dispatch) => {
  axios
    .post(`/api/auth/login`, userData)
    .then((res) => {
      // Get the token
      const { token } = res.data;

      // Save token to local storage
      localStorage.setItem("jwtToken", token);

      // Set Authorization header
      setAuthToken(token);

      // Get current user
      const decoded = jwt_decode(token);
      dispatch({
        type: SET_LOGIN_USER,
        payload: decoded,
      });
      // Set current user
      dispatch(setCurrentUser(decoded, token));
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

/**
 * Get current login user data decoded from JWT Token
 * and set into Redux state
 * @param {Object} decoded
 */
export const setCurrentUser = (decoded, token) => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded,
    token: token ? token.split(" ")[1] : "",
  };
};

/**
 * Get current login user data decoded from JWT Token
 * and set into Redux state
 * @param {Object} decoded
 */
export const getCurrentUser =
  ({ id }) =>
  (dispatch) => {
    return axios
      .get(`/api/user/get-user/${id}`)
      .then((res) => {
        dispatch({
          type: SET_LOGIN_USER,
          payload: res.data,
        });
      })
      .catch((err) =>
        dispatch({
          type: SET_LOGIN_USER,
          payload: {},
        })
      );
  };

export const toggleExpandNav = (value) => (dispatch) => {
  dispatch({
    type: EXPAND_NAV_BAR,
    payload: value,
  });
};

/**
 * Logout user
 */
export const logOut = () => (dispatch) => {
  // Remove local storage
  localStorage.removeItem("jwtToken");

  // Remove auth headers
  setAuthToken(false);

  // Set current user to {} and it will set authentication to false
  dispatch(setCurrentUser({}));
};

// GET Image
export const getImage = (imageId) => {
  return axios
    .get(`/api/guest/get_image/${imageId}`)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return {};
    });
};

export const getMyLocation = (countryCode) => (dispatch) => {
  return dispatch({
    type: GET_MY_LOCATION,
    payload: countryCode,
  });
};

export const clearErrors = () => (dispatch) => {
  return dispatch({
    type: CLEAR_ERRORS,
    payload: {},
  });
};

/**
 * Reset user password.
 * @param {Object} userData
 */
export const passwordLinkUnset = () => (dispatch) => {
  dispatch({
    type: SEND_RESET_PASSWORD_LINK_UNSET,
    payload: false,
  });
};

/**
 * setVerifiedEmail.
 * @param {Object} userData
 */
export const setVerifiedEmail = (email) => (dispatch) => {
  dispatch({
    type: SET_VERIFY_EMAIL,
    payload: email,
  });
};

export const setLastLoginRedirectedLink = (link) => (dispatch) => {
  localStorage.setItem("redirectedLink", link);
  dispatch({
    type: SET_LAST_LOGIN_REDIRECTED_LINK,
    payload: link,
  });
};

export const removeLastLoginRedirectedLink = () => (dispatch) => {
  localStorage.removeItem("redirectedLink");
  dispatch({
    type: SET_LAST_LOGIN_REDIRECTED_LINK,
    payload: "",
  });
};

export const sendBtxForEth = (userData) => (dispatch) => {
  return axios
    .post(`/api/guest/send_btx_for_eth`, userData)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      })
    );
};

export const refferalSetting = () => (dispatch) => {
  return axios
    .get(`/api/admin/users/get_referral_settings`)
    .then((res) => {
      dispatch({
        type: GET_REFFERAL_SEETING,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_REFFERAL_SEETING,
        payload: err.response.data,
      })
    );
};

export const getMaintenance = () => (dispatch) => {
  return axios
    .get(`/api/guest/get-web-app-maintenance`)
    .then((res) => {
      let data = res.data;
      dispatch({
        type: GET_MAINTENANCE,
        payload: data.maintenance,
      });
    })
    .catch((err) => {
      // sconsole.log("errors:", err);
    });
};
