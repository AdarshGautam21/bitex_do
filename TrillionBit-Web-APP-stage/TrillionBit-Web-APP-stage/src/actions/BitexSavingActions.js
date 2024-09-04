import axios from "axios";

// import apiUrl from '../config';

import {
  GET_ACTIVE_BITEX_SAVING_PLAN,
  GET_ACTIVE_BITEX_SAVING_USER_WALLET,
  GET_BITEX_TRANSFER_HISTORY,
  GET_BITEX_LEND_AMOUNT,
} from "./types";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
/**
 * Get article category
 */
export const getBitexSavingPlans = () => (dispatch) => {
  axios
    .get(`/api/guest/get-active-bitex-saving-coins`)
    .then((res) => {
      dispatch({
        type: GET_ACTIVE_BITEX_SAVING_PLAN,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ACTIVE_BITEX_SAVING_PLAN,
        payload: [],
      })
    );
};

/**
 * Get bitex saving wallet
 */
export const getUserBitexSavingWallet = (userId) => (dispatch) => {
  axios
    .get(`/api/user/active-bitex-saving-wallets/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_ACTIVE_BITEX_SAVING_USER_WALLET,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ACTIVE_BITEX_SAVING_USER_WALLET,
        payload: [],
      })
    );
};

export const transferCoin = (data) => (dispatch) => {
  // return axios.post(`http://localhost:5000/api/user/payment-request`, {
  return axios
    .post(`/api/bitex-saving/create-saving-wallet-history`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

export const transferCoinMainWallet = (data) => (dispatch) => {
  // return axios.post(`http://localhost:5000/api/user/payment-request`, {
  return axios
    .post(`/api/bitex-saving/reedem-bitex-saving`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

export const daysChangeDemo = () => (dispatch) => {
  // return axios.post(`http://localhost:5000/api/user/payment-request`, {
  const data = { id: "60b22e72fa32f21b796dafb5", days: 7 };
  return axios
    .post(`/api/bitex-saving/change-created-at-date`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

export const getBitexSavingAmount = () => (dispatch) => {
  axios
    .post(`/api/guest/get-bitex-land-amount`)
    .then((res) => {
      dispatch({
        type: GET_BITEX_LEND_AMOUNT,
        payload: res.data.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_BITEX_LEND_AMOUNT,
        payload: [],
      })
    );
};

export const getTransferHistory = (userId) => (dispatch) => {
  axios
    .get(`/api/bitex-saving/bitex-saving-wallets-history/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_BITEX_TRANSFER_HISTORY,
        payload: res.data.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_BITEX_TRANSFER_HISTORY,
        payload: [],
      })
    );
};

export const validateTransferCoinMainWallet = (data) => (dispatch) => {
  // return axios.post(`http://localhost:5000/api/user/payment-request`, {
  return axios
    .post(`/api/bitex-saving/validate-reedem-bitex-saving`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
};
