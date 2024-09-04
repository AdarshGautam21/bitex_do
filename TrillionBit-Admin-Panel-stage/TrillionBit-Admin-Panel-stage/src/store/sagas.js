import { all, fork } from "redux-saga/effects";

//public
import AccountSaga from "./auth/register/saga";
import Auth from "./auth/saga";
import User from "./user/saga";
import Order from "./order/saga";
import Deposit from "./deposit/saga";
import Withdrawal from "./withdrawal/saga";
import bitexLend from "./bitexLend/saga";
import assets from "./assets/saga";
import market from "./market/saga";
import tradingLevel from "./tradingLevel/saga";
import announcement from "./announcement/saga";
import assetsCurrency from "./assetsCurrency/saga";
import blog from "./blog/saga";
import article from "./article/saga";
import admin from "./admin/saga";
import setting from "./setting/saga";
import dashboard from "./dashboard/saga";
import notification from "./notification/saga";
import maintenance from "./maintenance/saga";
import adminWalletAddress from "./adminWalletAddress/saga";
// import AuthSaga from "./auth/login/saga"
import ForgetSaga from "./auth/forgetpwd/saga";
import ProfileSaga from "./auth/profile/saga";
import LayoutSaga from "./layout/saga";
import calendarSaga from "./calendar/saga";
import chatSaga from "./chat/saga";
import invoiceSaga from "./invoices/saga";
import contactsSaga from "./contacts/saga";

export default function* rootSaga() {
	yield all([
		fork(AccountSaga),
		fork(Auth),
		fork(Deposit),
		fork(Order),
		fork(User),
		fork(Withdrawal),
		fork(bitexLend),
		fork(assets),
		fork(market),
		fork(tradingLevel),
		fork(announcement),
		fork(assetsCurrency),
		fork(blog),
		fork(article),
		fork(admin),
		fork(setting),
		fork(dashboard),
		fork(notification),
		fork(maintenance),
		fork(adminWalletAddress),

		fork(ForgetSaga),
		fork(ProfileSaga),
		fork(LayoutSaga),
		fork(calendarSaga),
		fork(chatSaga),
		fork(invoiceSaga),
		fork(contactsSaga),
	]);
}
