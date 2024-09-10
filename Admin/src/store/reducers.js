import { combineReducers } from "redux";

import Layout from "./layout/reducer";
import Login from "./auth/login/reducer";
import Account from "./auth/register/reducer";
import ForgetPassword from "./auth/forgetpwd/reducer";
import Profile from "./auth/profile/reducer";

import auth from "./auth/reducer";
import user from "./user/reducer";
import order from "./order/reducer";
import deposit from "./deposit/reducer";
import withdrawal from "./withdrawal/reducer";
import bitexLend from "./bitexLend/reducer";
import assets from "./assets/reducer";
import market from "./market/reducer";
import tradingLevel from "./tradingLevel/reducer";
import announcement from "./announcement/reducer";
import assetsCurrency from "./assetsCurrency/reducer";
import blog from "./blog/reducer";
import article from "./article/reducer";
import admin from "./admin/reducer";
import setting from "./setting/reducer";
import dashboard from "./dashboard/reducer";
import notification from "./notification/reducer";
import maintenance from "./maintenance/reducer";
import adminWalletAddress from "./adminWalletAddress/reducer";

import calendar from "./calendar/reducer";
import chat from "./chat/reducer";
import invoices from "./invoices/reducer";
import contacts from "./contacts/reducer";

const rootReducer = combineReducers({
	auth,
	user,
	order,
	deposit,
	withdrawal,
	bitexLend,
	assets,
	market,
	tradingLevel,
	announcement,
	assetsCurrency,
	blog,
	article,
	admin,
	setting,
	dashboard,
	notification,
	maintenance,
	adminWalletAddress,

	Layout,
	Login,
	Account,
	ForgetPassword,
	Profile,
	calendar,
	chat,
	invoices,
	contacts,
});

export default rootReducer;
