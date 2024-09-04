import {
	SET_CURRENT_USER,
	VERIFY_2FA_CODE,
	EXPAND_NAV_BAR,
	GET_MY_LOCATION,
	SEND_RESET_PASSWORD_LINK,
	SEND_RESET_PASSWORD_LINK_UNSET,
	SET_VERIFY_EMAIL,
	USER_PHONE_UPDATE,
	SET_LAST_LOGIN_REDIRECTED_LINK,
	SET_LOGIN_USER,
	GET_REFFERAL_SEETING,
	GET_MAINTENANCE
} from "../actions/types";
import isEmpty from "../validation/isEmpty";

const initialState = {
	isAuthenticated: false,
	isMaintenance: false,
	token: "",
	user: {},
	currentLoginUser: {},
	expandNavBar: false,
	myCountryCode: "US",
	sendResetPasswordLink: false,
	verifyEmail: "",
	updateMobileNumber: false,
	lastLoginRedirectedLink: "",
	refferalSetting: {},
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
	switch (action.type) {
		case SET_CURRENT_USER:
			if (isEmpty(action.payload)) {
				return {
					...state,
					isAuthenticated: false,
					user: action.payload,
					token: action.token,
				};
			} else {
				if (!action.payload.twoFactorAuth) {
					return {
						...state,
						isAuthenticated: true,
						user: action.payload,
						token: action.token,
					};
				} else {
					return {
						...state,
						user: action.payload,
						token: action.token,
					};
				}
			}
		case VERIFY_2FA_CODE:
			return {
				...state,
				isAuthenticated: action.payload,
			};
		case EXPAND_NAV_BAR:
			return {
				...state,
				expandNavBar: action.payload,
			};
		case GET_MY_LOCATION:
			return {
				...state,
				myCountryCode: action.payload,
			};

		case SEND_RESET_PASSWORD_LINK:
			return {
				...state,
				sendResetPasswordLink: true,
			};
		case SEND_RESET_PASSWORD_LINK_UNSET:
			return {
				...state,
				sendResetPasswordLink: false,
			};

		case SET_VERIFY_EMAIL:
			return {
				...state,
				verifyEmail: action.payload,
			};
		case USER_PHONE_UPDATE:
			return {
				...state,
				updateMobileNumber: true,
				user: action.payload,
			};
		case SET_LAST_LOGIN_REDIRECTED_LINK:
			return {
				...state,
				lastLoginRedirectedLink: action.payload,
			};
		case SET_LOGIN_USER:
			return {
				...state,
				currentLoginUser: action.payload,
			};
		case GET_REFFERAL_SEETING:
			return {
				...state,
				refferalSetting: action.payload,
			};
		case GET_MAINTENANCE:
			return {
				...state,
				isAuthenticated: false,
				isMaintenance: true,
				token: "",
				user: {},
				currentLoginUser: {},
			};
		default:
			return state;
	}
}
