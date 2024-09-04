import axios from "axios";

// import apiUrl from '../config';
import setAuthToken from "../utils/setAuthToken";

import {
  GET_USER_WALLET,
  GENERATE_WALLET_ADDRESS,
  GET_SNACK_MESSAGES,
  GET_WALLET_ADDRESSES,
  GET_ACTIVE_ASSETS,
  GET_ERRORS,
  GET_DEPOSIT_REQUESTS,
  GET_WITHDRAWAL_REQUESTS,
  GET_TRANSACTIONS,
  GET_AVAILABLE_MARKETS,
  ACTIVE_MARKET,
  ACTIVE_FUTURE_MARKET,
  GET_ACTIVE_ASSETS_LIST,
  GET_MARKET_LAST,
  GET_AED_PRICE,
  SET_CURRENT_USER,
  GET_CLIENT_TRANSACTIONS,
  GET_ACTIVE_MARGIN_ASSETS,
  GET_USER_MARGIN_LEVEL,
  GET_FINAL_MARKET_LAST,
  GET_FUTURE_TICKERS,
  GET_USDT_INR_PRICE,
  GET_BTX_MARKET_DATA,
  GET_BTX_AED_MARKET_DATA,
  GET_BANK_DETAIL,
} from "./types";

axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Get user assets
export const getActiveAssetsList = () => (dispatch) => {
  return axios
    .get(`/api/trading/get_active_wallets`)
    .then((res) => {
      dispatch({
        type: GET_ACTIVE_ASSETS_LIST,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ACTIVE_ASSETS_LIST,
        payload: [],
      });
    });
};

/**
 * Get all future tickers
 */
export const getFutureTikers = () => (dispatch) => {
  return axios
    .get(`/api/guest/get_future_tikers`)
    .then((res) => {
      dispatch({
        type: GET_FUTURE_TICKERS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_FUTURE_TICKERS,
        payload: [],
      });
    });
};

// Get user margin assets
export const getActiveMarginAssets = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/user_active_margin_wallets/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_ACTIVE_MARGIN_ASSETS,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 401) {
          // Remove local storage
          localStorage.removeItem("jwtToken");

          // Remove auth headers
          setAuthToken(false);

          dispatch({
            type: SET_CURRENT_USER,
            payload: {},
          });
        }
      } else {
        dispatch({
          type: GET_ACTIVE_MARGIN_ASSETS,
          payload: [],
        });
      }
    });
};

// Get user assets
export const getActiveAssets = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/user_active_wallets/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_ACTIVE_ASSETS,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response) {
        if (err.response.status === 401) {
          // Remove local storage
          localStorage.removeItem("jwtToken");

          // Remove auth headers
          setAuthToken(false);

          dispatch({
            type: SET_CURRENT_USER,
            payload: {},
          });
        }
      } else {
        dispatch({
          type: GET_ACTIVE_ASSETS,
          payload: [],
        });
      }
    });
};

// Clear user assets
export const clearActiveAssets = () => (dispatch) => {
  return dispatch({
    type: GET_ACTIVE_ASSETS,
    payload: [],
  });
};

// Get user wallet
export const getUserWallet = (walletId) => (dispatch) => {
  return axios
    .get(`/api/user/user_wallet/${walletId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_WALLET,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_USER_WALLET,
        payload: {},
      });
    });
};

// Generate new address
export const generateNewAddress = (userId, coin) => (dispatch) => {
  return axios
    .get(`/api/wallet/generate_address/${coin}/${userId}`)
    .then((res) => {
      dispatch({
        type: GENERATE_WALLET_ADDRESS,
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

// Generate new address
export const getUserWalletAddresses = (userId, coin) => (dispatch) => {
  return axios
    .get(`/api/wallet/get_addresess/${userId}/${coin}`)
    .then((res) => {
      dispatch({
        type: GET_WALLET_ADDRESSES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_WALLET_ADDRESSES,
        payload: [],
      });
    });
};

export const transferDepositAmount = (userParams) => (dispatch) => {
  return axios
    .post(`/api/wallet/transfer_deposit_amount`, userParams)
    .then((res) => {
      if (res.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: res.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: res.data,
        });
      }
    })
    .catch((err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

// Create Deposit Request
export const createDepositRequest = (userParams) => (dispatch) => {
  return axios
    .post(`/api/wallet/create_deposit_request`, userParams)
    .then((res) => {
      if (res.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: res.data,
        });
        return res;
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: res.data,
        });
      }
    })
    .catch((err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

// update Deposit Request
export const updateDepositRequest = (userParams) => (dispatch) => {
  return axios
    .post(`/api/wallet/update_deposit_request`, userParams)
    .then((res) => {
      if (res.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: res.data,
        });
        // return res;
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: res.data,
        });
      }
    })
    .catch((err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

// Create Withdraw Request
export const createWithdrawRequest = (userParams) => (dispatch) => {
  return axios
    .post(`/api/wallet/create_withdraw_request`, userParams)
    .then((res) => {
      if (res.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: res.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: res.data,
        });
      }
    })
    .catch((err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

// Get Deposit Requests
export const getDepositRequests = (userId) => (dispatch) => {
  return axios
    .get(`/api/wallet/get_deposit_requests/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_DEPOSIT_REQUESTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_DEPOSIT_REQUESTS,
        payload: [],
      });
    });
};

// Get Withdrawal Requests
export const getWithdrawalRequests = (userId) => (dispatch) => {
  return axios
    .get(`/api/wallet/get_withdrawal_requests/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_WITHDRAWAL_REQUESTS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_WITHDRAWAL_REQUESTS,
        payload: [],
      });
    });
};

// Send crypto
export const sendCrypto = (userParams) => (dispatch) => {
  return axios
    .post(`/api/wallet/send_crypto`, userParams)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// GET available markets
export const getAvailaleMarkets = () => (dispatch) => {
  return axios
    .get(`/api/guest/market/lists`)
    .then((res) => {
      dispatch({
        type: GET_AVAILABLE_MARKETS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_AVAILABLE_MARKETS,
        payload: [],
      });
    });
};

// GET active market
export const activeFutureMarket = (market) => (dispatch) => {
  return dispatch({
    type: ACTIVE_FUTURE_MARKET,
    payload: market,
  });
};

// GET active market
export const activeMarket = (market) => (dispatch) => {
  return dispatch({
    type: ACTIVE_MARKET,
    payload: market,
  });
};

// GET active market
export const getAllTransactions =
  (userId, params = {}) =>
  (dispatch) => {
    return axios
      .post(`/api/wallet/all_transactions/${userId}`, params)
      .then((res) => {
        dispatch({
          type: GET_TRANSACTIONS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_TRANSACTIONS,
          payload: [],
        });
      });
  };

// GET active market
export const getAllClientTransactions =
  (userId, params = {}) =>
  (dispatch) => {
    return axios
      .post(`/api/wallet/all_transactions/${userId}`, params)
      .then((res) => {
        dispatch({
          type: GET_CLIENT_TRANSACTIONS,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_CLIENT_TRANSACTIONS,
          payload: [],
        });
      });
  };

// Cancel Deposit

export const cancelDeposit = (transId) => (dispatch) => {
  return axios
    .get(`/api/wallet/cancel_deposit/${transId}`)
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

// Cancel Withdraw
export const cancelWithdraw = (transId) => (dispatch) => {
  return axios
    .get(`/api/wallet/cancel_withdraw/${transId}`)
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

// Get market last
export const getMarketLast = () => async (dispatch) => {
  return axios
    .get(`/api/guest/get_market_last`)
    .then((res) => {
      dispatch({
        type: GET_MARKET_LAST,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_MARKET_LAST,
        payload: {},
      });
    });
};

// Get market last
export const getFinalMarketLast = () => async (dispatch) => {
  return axios
    .get(`/api/guest/get_final_market_last`)
    .then((res) => {
      dispatch({
        type: GET_FINAL_MARKET_LAST,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_FINAL_MARKET_LAST,
        payload: {},
      });
    });
};

// GET AED price
export const getAedPrice = () => (dispatch) => {
  return axios
    .get(`/api/wallet/get_aed_price`)
    .then((res) => {
      dispatch({
        type: GET_AED_PRICE,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_AED_PRICE,
        payload: 3.7,
      });
    });
};

// GET Check XRP address
export const checkXrpAddress = (address) => {
  return axios.get(`/api/wallet/check_xrp_address/${address}`).then((res) => {
    return res.data;
  });
};

// POST transfer to client wallet
export const transferToClientWallet = (transferParams) => (dispatch) => {
  return axios
    .post(`/api/user/transfer_to_client_wallet`, transferParams)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

// POST Transfer wallet amount to margin wallet
export const transferAmountToMarginWallet = (transferParams) => (dispatch) => {
  return axios
    .post(`/api/user/transfer_to_margin_wallet`, transferParams)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

// POST Transfer margin wallet amount to spot wallet
export const transferAmountFromMarginWallet =
  (transferParams) => (dispatch) => {
    return axios
      .post(`/api/user/transfer_from_margin_wallet`, transferParams)
      .then((res) => {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: res.data,
        });
      })
      .catch((err) => {
        if (err.response.data.variant) {
          dispatch({
            type: GET_SNACK_MESSAGES,
            payload: err.response.data,
          });
        } else {
          dispatch({
            type: GET_ERRORS,
            payload: err.response.data,
          });
        }
      });
  };

// POST Borrow wallet amount to margin wallet
export const borrowAmountToMarginWallet = (borrowParams) => (dispatch) => {
  return axios
    .post(`/api/user/borrow_to_margin_wallet`, borrowParams)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

// POST Replay margin wallet
export const repayAmountToMarginWallet = (replayParams) => (dispatch) => {
  return axios
    .post(`/api/user/repay_to_margin_wallet`, replayParams)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

// GET user margin level
export const getUserMarginLevel = (userId) => (dispatch) => {
  return axios
    .get(`/api/trading/get_margin_level/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_MARGIN_LEVEL,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_USER_MARGIN_LEVEL,
        payload: {},
      });
    });
};

export const getOrderId = (userId, amount, coin) => (dispatch) => {
  return axios
    .post(`/api/trading/get_order_key`, {
      userId: userId,
      amount: amount,
      coin: coin,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const dasshpePaymentRequest = (data) => (dispatch) => {
  // return axios.post(`http://localhost:5000/api/user/payment-request`, {
  return axios
    .post(`/api/auth/payment-request`, data)
    .then((res) => {
      return res;
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};
export const checkPaymentStatus = (userId, orderId) => (dispatch) => {
  // return axios.post(`http://localhost:5000/api/user/payment-request`, {
  return axios
    .post(`/api/auth/check-payment-status`, {
      userId: userId,
      orderId: orderId,
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const editDepositRequest = (data) => (dispatch) => {
  // return axios.post(`http://localhost:5000/api/user/payment-request`, {
  return axios
    .post(`/api/wallet/edit_deposit_request`, data)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const buyBtxCoin = (data) => (dispatch) => {
  // return axios.post(`http://localhost:5000/api/user/payment-request`, {
  return axios
    .post(`/api/wallet/buy-btx-coin`, data)
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      return err.response.data;
    });
};

export const getUsdtInrPrice = () => (dispatch) => {
  // return axios.post(`http://localhost:5000/api/user/payment-request`, {
  return axios
    .get(`/api/auth/currency-usdt-inr`)
    .then((res) => {
      dispatch({
        type: GET_USDT_INR_PRICE,
        payload: res.data?.data.usdtInr,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_USDT_INR_PRICE,
        payload: err?.response?.data ? 0.0 : 0.0,
      });
    });
};

// Generate new address
export const getBtxMarketData = () => (dispatch) => {
  return axios
    .post(`/api/guest/get_market_data`, {
      market: "BTXINR",
    })
    .then((res) => {
      dispatch({
        type: GET_BTX_MARKET_DATA,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_BTX_MARKET_DATA,
        payload: {},
      });
    });
};

// Generate new address
export const getBtxAedMarketData = () => (dispatch) => {
  return axios
    .post(`/api/guest/get_market_data`, {
      market: "BTXAED",
    })
    .then((res) => {
      dispatch({
        type: GET_BTX_AED_MARKET_DATA,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_BTX_AED_MARKET_DATA,
        payload: {},
      });
    });
};

export const getbankDetails = () => (dispatch) => {
  // return axios.post(`http://localhost:5000/api/user/payment-request`, {
  return axios
    .get(`/api/guest/get-bank-details`)
    .then((res) => {
      let inr = res.data.find((item) => item.type === "INR");
      let aed = res.data.find((item) => item.type === "AED");
      dispatch({
        type: GET_BANK_DETAIL,
        payload: {
          inrAccountDetail: inr ? inr : {},
          aedAccountDetail: aed ? aed : {},
        },
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_BANK_DETAIL,
        payload: {
          inrAccountDetail: {},
          aedAccountDetail: {},
        },
      });
    });
};
