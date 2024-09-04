import {
  GET_ACTIVE_BITEX_SAVING_PLAN,
  GET_BITEX_TRANSFER_HISTORY,
  GET_ACTIVE_BITEX_SAVING_USER_WALLET,
  GET_BITEX_LEND_AMOUNT

} from '../actions/types';

const initialState = {
  bitexSavingPlans: [],
  bitexTransferHistory: [],
  activeBitexSavingWallet: [],
  bitexLendAmount: {}
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ACTIVE_BITEX_SAVING_PLAN:
      return {
          ...state,
          bitexSavingPlans: action.payload,
      };
    case GET_BITEX_TRANSFER_HISTORY:
      return {
          ...state,
          bitexTransferHistory: action.payload,
      };
    case GET_ACTIVE_BITEX_SAVING_USER_WALLET:
      return {
          ...state,
          activeBitexSavingWallet: action.payload,
      };
    case GET_BITEX_LEND_AMOUNT:
      return {
          ...state,
          bitexLendAmount: action.payload,
      };
    default:
      return state;
  }
}