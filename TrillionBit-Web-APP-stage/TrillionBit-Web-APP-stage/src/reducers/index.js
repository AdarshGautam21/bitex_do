import { combineReducers } from "redux";
import authReducer from "./authReducer";
import errorReducer from "./errorReducer";
import userReducer from "./userReducer";
import messageReducer from "./messageReducer";
import snackMessageReducer from "./snackMessageReducer";
import walletReducer from "./walletReducer";
import tradingReducer from "./tradingReducer";
import tradingLevelReducer from "./tradingLevelReducer";
import referralReducer from "./referralReducer";
import bitexSavingReducer from "./bitexSavingReducer";
import swapReducer from "./swapReducer";

export default combineReducers({
  auth: authReducer,
  errors: errorReducer,
  messages: messageReducer,
  snackMessages: snackMessageReducer,
  user: userReducer,
  wallet: walletReducer,
  trading: tradingReducer,
  referral: referralReducer,
  tradingLevel: tradingLevelReducer,
  bitexSaving: bitexSavingReducer,
  swap: swapReducer,
});
