import {
  GET_AED_TRADING_LEVELS,
  GET_INR_TRADE_LEVELS,
  GET_AGENT_TRADE_LEVELS,
  GET_SUB_AGENT_TRADE_LEVELS,
  GET_USD_TRADE_LEVELS
} from '../actions/types';

const initialState = {
  aedTrading: {},
  inrTrading: {},
  usdTrading: {},
  agentTrading: {},
  agentSubTrading: {},
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_AED_TRADING_LEVELS:
      return {
        ...state,
        aedTrading: action.payload
      }
    case GET_INR_TRADE_LEVELS:
      return {
        ...state,
        inrTrading: action.payload,
      }
    case GET_USD_TRADE_LEVELS:
      return {
        ...state,
        usdTrading: action.payload,
      }
    case GET_AGENT_TRADE_LEVELS:
      return {
        ...state,
        agentTrading: action.payload,
      }
      case GET_SUB_AGENT_TRADE_LEVELS:
        return {
          ...state,
          agentSubTrading: action.payload,
        }
    default:
      return state;
  }
}