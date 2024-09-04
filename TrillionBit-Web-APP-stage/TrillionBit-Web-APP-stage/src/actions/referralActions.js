import axios from "axios";

// import apiUrl from '../config';

import {
  GET_REFERRAL,
  GET_REFERRAL_TREE,
  GET_SNACK_MESSAGES,
  GET_REFERRAL_EARNED,
} from "./types";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// Get all orders
export const getReferral = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/get_referral/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_REFERRAL,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_REFERRAL,
        payload: {},
      });
    });
};

// Get all orders
export const getReferralTree = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/get_referral_tree/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_REFERRAL_TREE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_REFERRAL_TREE,
        payload: {},
      });
    });
};

// GET all redeem
export const getReferralRedeem = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/get_referral_redeem/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      });
    });
};

// GET all redeem
export const getReferralEarned = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/get-referral-details/${userId}`)
    .then((res) => {
      console.log("get-referral-details", res);
      dispatch({
        type: GET_REFERRAL_EARNED,
        payload: res.data.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_REFERRAL_EARNED,
        payload: err.response.data,
      });
    });
};
