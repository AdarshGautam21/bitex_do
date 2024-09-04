import axios from "axios";
import {
  GET_AED_TRADING_LEVELS,
  GET_INR_TRADE_LEVELS,
  GET_USD_TRADE_LEVELS,
  GET_AGENT_TRADE_LEVELS,
  GET_SUB_AGENT_TRADE_LEVELS,
} from "./types";

// import apiUrl from '../config';
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

/**
 * Get trading levels
 */
export const getTradingLevels = () => (dispatch) => {
  axios
    .get(`/api/admin/trading/get_trader_levels`)
    .then((res) => {
      dispatch({
        type: GET_AED_TRADING_LEVELS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_AED_TRADING_LEVELS,
        payload: [],
      })
    );
};

export const getInrTradingLevels = () => (dispatch) => {
  axios
    .get(`/api/admin/trading/get_inr_trader_levels`)
    .then((res) => {
      dispatch({
        type: GET_INR_TRADE_LEVELS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_INR_TRADE_LEVELS,
        payload: [],
      })
    );
};
export const getUsdTradingLevels = () => (dispatch) => {
  axios
    .get(`/api/admin/trading/get_usd_trader_levels`)
    .then((res) => {
      dispatch({
        type: GET_USD_TRADE_LEVELS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USD_TRADE_LEVELS,
        payload: [],
      })
    );
};

export const getAgentTradingLevels = () => (dispatch) => {
  axios
    .get(`/api/admin/trading/get_agent_trader_levels`)
    .then((res) => {
      dispatch({
        type: GET_AGENT_TRADE_LEVELS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_AGENT_TRADE_LEVELS,
        payload: [],
      })
    );
};

export const getSubAgentTradingLevels = () => (dispatch) => {
  axios
    .get(`/api/admin/trading/get_sub_agent_trader_levels`)
    .then((res) => {
      dispatch({
        type: GET_SUB_AGENT_TRADE_LEVELS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_SUB_AGENT_TRADE_LEVELS,
        payload: [],
      })
    );
};
