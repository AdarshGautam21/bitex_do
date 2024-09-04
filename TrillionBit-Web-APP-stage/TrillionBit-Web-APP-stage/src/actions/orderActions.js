import axios from "axios";

// import apiUrl from "../config";

import {
  GET_SNACK_MESSAGES,
  GET_USER_TRADE_ORDERS,
  GET_USER_MARKET_DEALS,
  GET_USER_SELL_ORDER_BOOK,
  GET_USER_BUY_ORDER_BOOK,
  GET_USER_ORDER_DEPTH,
  GET_MARKET_LAST,
  GET_MARKET_STATUS_TODAY,
  GET_PENDING_ORDERS,
  GET_TRADING_CHART_DATA,
  GET_CLIENT_PENDING_ORDERS,
  GET_CLIENT_TRADE_ORDERS,
  GET_WALLET_MAINTENANCE,
  GET_TRADING_MAINTENANCE,
} from "./types";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
// Create market margin order
export const placeMarginMarketOrder = (userParams) => (dispatch) => {
  return axios
    .post(`/api/trading/order/margin_market`, userParams)
    .then((res) => {
      if (res.data.error) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: {
            variant: "error",
            message: res.data.error.message,
          },
        });
      } else {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: {
            variant: "success",
            message:
              "Market " +
              (userParams.side === 2 ? "buy" : "sell") +
              " order placed amount: " +
              res.data.order.amount,
          },
        });
      }
    })
    .catch((err) => {
      // if(err.error) {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: {
          variant: "error",
          message: err.response.data.amount,
        },
      });
      // }
    });
};

// Create market order
export const placeMarketOrder = (userParams) => (dispatch) => {
  return axios
    .post(`/api/trading/order/market`, userParams)
    .then((res) => {
      if (res.data.error) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: {
            variant: "error",
            message: res.data.error.message,
          },
        });
      } else {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: {
            variant: "success",
            message:
              "Market " +
              (userParams.side === 2 ? "buy" : "sell") +
              " order placed amount: " +
              res.data.order.amount,
          },
        });
      }
    })
    .catch((err) => {
      // if(err.error) {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: {
          variant: "error",
          message: err.response.data.amount,
        },
      });
      // }
    });
};

// Create limit order
export const placeMarginLimitOrder = (userParams) => (dispatch) => {
  return axios
    .post(`/api/trading/order/margin_limit`, userParams)
    .then((res) => {
      console.log(res);
      if (res.data.error) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: {
            variant: "error",
            message: res.data.error.message,
          },
        });
      } else {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: {
            variant: "success",
            message:
              "Limit " +
              (userParams.side === 2 ? "buy" : "sell") +
              " order placed amount: " +
              res.result.amount +
              " @ " +
              res.result.price,
          },
        });
      }
    })
    .catch((err) => {
      console.log(err);
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: {
          variant: "error",
          message: err.response.data.amount,
        },
      });
    });
};

// Create limit order
export const placeLimitOrder = (userParams) => (dispatch) => {
  return axios
    .post(`/api/trading/order/limit`, userParams)
    .then((res) => {
      if (res.data.error) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: {
            variant: "error",
            message: res.data.error.message,
          },
        });
      } else {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: {
            variant: "success",
            message:
              "Limit " +
              (userParams.side === 2 ? "buy" : "sell") +
              " order placed amount: " +
              res.data.order.amount +
              " @ " +
              res.data.order.price,
          },
        });
      }
    })
    .catch((err) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: {
          variant: "error",
          message: err.response.data.amount,
        },
      });
    });
};

// Get all orders
export const getUserOrders =
  (
    userId,
    market,
    coin,
    fiat,
    startTime = 0,
    endTime = 0,
    offset = 0,
    limit = 20,
    side = 0
  ) =>
  (dispatch) => {
    return axios
      .post(`/api/trading/order/all`, {
        userId: userId,
        market: market,
        coin: coin,
        fiat: fiat,
        startTime: startTime,
        endTime: endTime,
        offset: offset,
        limit: limit,
        side: side,
      })
      .then((res) => {
        dispatch({
          type: GET_USER_TRADE_ORDERS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_USER_TRADE_ORDERS,
          payload: [],
        });
      });
  };

// Get all orders
export const getClientOrders =
  (
    userId,
    market,
    coin,
    fiat,
    startTime = 0,
    endTime = 0,
    offset = 0,
    limit = 20,
    side = 0
  ) =>
  (dispatch) => {
    return axios
      .post(`/api/trading/order/all`, {
        userId: userId,
        market: market,
        coin: coin,
        fiat: fiat,
        startTime: startTime,
        endTime: endTime,
        offset: offset,
        limit: limit,
        side: side,
      })
      .then((res) => {
        dispatch({
          type: GET_CLIENT_TRADE_ORDERS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_CLIENT_TRADE_ORDERS,
          payload: [],
        });
      });
  };

// Get new address
export const getUserLastFiveOrders = (userId) => (dispatch) => {
  return axios
    .get(`/api/trading/order/last_five/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_TRADE_ORDERS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_USER_TRADE_ORDERS,
        payload: [],
      });
    });
};

// Get market deals
export const getMarketDeals = (userParams) => (dispatch) => {
  return axios
    .post(`/api/trading/order/market_deals`, userParams)
    .then((res) => {
      dispatch({
        type: GET_USER_MARKET_DEALS,
        payload: res.data.result,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_USER_MARKET_DEALS,
        payload: [],
      });
    });
};

// Get market deals
export const getOrderDepth = (userParams) => (dispatch) => {
  return axios
    .post(`/api/trading/order/depth`, userParams)
    .then((res) => {
      dispatch({
        type: GET_USER_ORDER_DEPTH,
        payload: res.data.result,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_USER_ORDER_DEPTH,
        payload: [],
      });
    });
};

// Get order book
export const getOrderBook = (userParams) => (dispatch) => {
  if (userParams.side === 1) {
    return axios
      .post(`/api/trading/order/book`, userParams)
      .then((res) => {
        dispatch({
          type: GET_USER_SELL_ORDER_BOOK,
          payload: res.data.result.orders,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_USER_SELL_ORDER_BOOK,
          payload: [],
        });
      });
  } else {
    return axios
      .post(`/api/trading/order/book`, userParams)
      .then((res) => {
        dispatch({
          type: GET_USER_BUY_ORDER_BOOK,
          payload: res.data.result.orders,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_USER_BUY_ORDER_BOOK,
          payload: [],
        });
      });
  }
};

// Get market last
export const getMarketLast = (markets) => async (dispatch) => {
  let market_lasts = {};
  for (let key in markets) {
    let market_current_status = await axios
      .post(`/api/trading/market_last`, {
        market: markets[key].name,
      })
      .then((res) => {
        return res.data.result;
      })
      .catch((err) => {
        return {};
      });
    market_lasts[markets[key].name] = market_current_status;
  }
  dispatch({
    type: GET_MARKET_LAST,
    payload: market_lasts,
  });
};

// Get market status today
export const getMarketStatusToday = (markets) => async (dispatch) => {
  let market_status = {};
  for (let key in markets) {
    let market_current_status = await axios
      .post(`/api/trading/market_status_today`, {
        market: markets[key].name,
      })
      .then((res) => {
        return res.data.result;
      })
      .catch((err) => {
        return {};
      });
    market_status[markets[key].name] = market_current_status;
  }
  dispatch({
    type: GET_MARKET_STATUS_TODAY,
    payload: market_status,
  });
};

export const getPendingOrders =
  (userId, user_id, market, offset = 0, limit = 100) =>
  (disptach) => {
    return axios
      .post(`/api/trading/order/pending`, {
        market: market,
        userId: userId,
        user_id: user_id,
        limit: limit,
        offset: offset,
      })
      .then((res) => {
        disptach({
          type: GET_PENDING_ORDERS,
          payload: res.data,
        });
      })
      .catch((err) => {
        disptach({
          type: GET_PENDING_ORDERS,
          payload: [],
        });
      });
  };

export const getFinishedOrders =
  (userId, market, startTime, endTime, offset, limit, side) => (disptach) => {
    return axios
      .post(`/api/trading/order/finished`, {
        market: market,
        user_id: userId,
        sart_time: startTime,
        end_time: endTime,
        offset: offset,
        limit: limit,
        side: side,
      })
      .then((res) => {
        disptach({
          type: GET_PENDING_ORDERS,
          payload: res.data.result.records,
        });
      })
      .catch((err) => {
        disptach({
          type: GET_PENDING_ORDERS,
          payload: [],
        });
      });
  };

export const cancelUserOrder =
  (userOrderId, userId, market, orderId, coin, fiat, maker_fee_rate) =>
  (dispatch) => {
    return axios
      .post(`/api/trading/order/cancel`, {
        user_id: userOrderId,
        userId: userId,
        market: market,
        order_id: orderId,
        coin: coin,
        fiat: fiat,
        maker_fee_rate: maker_fee_rate,
      })
      .then((res) => {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      });
  };

export const getClientPendingOrders =
  (userId, user_id, market, offset = 0, limit = 100) =>
  (disptach) => {
    return axios
      .post(`/api/trading/order/pending`, {
        market: market,
        userId: userId,
        user_id: user_id,
        limit: limit,
        offset: offset,
      })
      .then((res) => {
        disptach({
          type: GET_CLIENT_PENDING_ORDERS,
          payload: res.data,
        });
      })
      .catch((err) => {
        disptach({
          type: GET_CLIENT_PENDING_ORDERS,
          payload: [],
        });
      });
  };

export const cancelClientUserOrder =
  (userOrderId, userId, market, orderId, coin, fiat, maker_fee_rate) =>
  (dispatch) => {
    return axios
      .post(`/api/trading/order/cancel`, {
        user_id: userOrderId,
        userId: userId,
        market: market,
        order_id: orderId,
        coin: coin,
        fiat: fiat,
        maker_fee_rate: maker_fee_rate,
      })
      .then((res) => {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      });
  };

export const getChartData = () => async (dispatch) => {
  return axios
    .get(`/api/guest/crypto_history`)
    .then((res) => {
      dispatch({
        type: GET_TRADING_CHART_DATA,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_TRADING_CHART_DATA,
        payload: {},
      });
    });
};

export const getWalletMaintenance = () => async (dispatch) => {
  return axios

    .get(`/api/guest/get-active-wallet-maintenance`)
    .then((res) => {
      let data = {};
      if (res.data) {
        res.data.map((item) => {
          data[item.name] = {
            deposit: item.maintenance.deposit,
            withdrawal: item.maintenance.withdrawal,
          };
        });
      }
      dispatch({
        type: GET_WALLET_MAINTENANCE,
        payload: data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_WALLET_MAINTENANCE,
        payload: {},
      });
    });
};

export const getTradingMaintenance = () => async (dispatch) => {
  return axios
    .get(`/api/guest/get-active-trading-maintenance`)
    .then((res) => {
      let data = [];
      if (res.data) {
        data = res.data.map((item) => item.name);
      }
      dispatch({
        type: GET_TRADING_MAINTENANCE,
        payload: data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_TRADING_MAINTENANCE,
        payload: [],
      });
    });
};
