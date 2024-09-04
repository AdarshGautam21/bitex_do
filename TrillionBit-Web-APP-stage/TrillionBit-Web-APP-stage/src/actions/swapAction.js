import axios from "axios";
import { GET_ERRORS, GET_SWAP_PRICE, GET_SWAP_QUOTE } from "./types";

const ZeroxAPI = "702e42e4-a1e1-466a-9d57-16aaea9ae2cf";

const SWAP_BASE_URL = "https://sepolia.api.0x.org/swap/v1/";

export const getSwapPrice = (params) => (dispatch) => {
  // init loading
  dispatch({
    type: GET_SWAP_PRICE,
    payload: { loading: true, data: {} },
  });

  axios
    .get(`${SWAP_BASE_URL}price`, {
      headers: {
        "0x-api-key": "702e42e4-a1e1-466a-9d57-16aaea9ae2cf",
      },
      params,
    })
    .then(({ data }) => {
      dispatch({
        type: GET_SWAP_PRICE,
        payload: { loading: false, success: true, data },
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: { loading: false, success: false, data: err.response.data },
      })
    );
};

export const getSwapQuote = (params) => (dispatch) => {
  // init loading
  dispatch({
    type: GET_SWAP_PRICE,
    payload: { loading: true, data: {} },
  });

  axios
    .get(`${SWAP_BASE_URL}quote`, {
      headers: {
        "0x-api-key": "702e42e4-a1e1-466a-9d57-16aaea9ae2cf",
      },
      params,
    })
    .then(({ data }) => {
      dispatch({
        type: GET_SWAP_QUOTE,
        payload: { loading: false, success: true, data },
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: { loading: false, success: false, data: err.response.data },
      })
    );
};
