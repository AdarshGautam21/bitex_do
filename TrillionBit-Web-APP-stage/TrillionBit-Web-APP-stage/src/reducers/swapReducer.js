import { GET_SWAP_PRICE, GET_SWAP_QUOTE } from "../actions/types";

const initialState = {
  priceData: {},
  quoteData: {}
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SWAP_PRICE:
      return {
        ...state,
        priceData: action.payload,
      };
      case GET_SWAP_QUOTE:
        return {
          ...state,
          quoteData: action.payload,
        };
    default:
      return state;
  }
}
