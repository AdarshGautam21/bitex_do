import {
	ERRORS,
	CLEAR_RESPONSE,
	TOTAL_FIAT_TRANSCATION_FAILURE,
	TOTAL_FIAT_TRANSCATION_SUCCESS,
	TOTAL_FIAT_TRANSCATION_REQUEST,
	TOTAL_CRYPTO_TRANSCATION_FAILURE,
	TOTAL_CRYPTO_TRANSCATION_SUCCESS,
	TOTAL_CRYPTO_TRANSCATION_REQUEST,
	TOTAL_SELL_ORDERS_FAILURE,
	TOTAL_SELL_ORDERS_SUCCESS,
	TOTAL_SELL_ORDERS_REQUEST,
	TOTAL_BUY_ORDERS_FAILURE,
	TOTAL_BUY_ORDERS_SUCCESS,
	TOTAL_BUY_ORDERS_REQUEST,
	TOTAL_USER_REQUEST,
	TOTAL_USER_FAILURE,
	TOTAL_USER_SUCCESS,
	TOTAL_USER_HOLDING_FAILURE,
	TOTAL_USER_HOLDING_SUCCESS,
	TOTAL_USER_HOLDING_REQUEST,
} from "./actionTypes";

const initialState = {
	errors: {},
	response: {},
	loader: false,
	notifications: [],
	transcations: {
		fiatLoader: false,
		totalFiatTranscation: {},
		cryptoLoader: false,
		totalCryptoTranscation: {},
	},
	orders: {
		sellLoader: false,
		totalSell: {},
		buyLoader: false,
		totalBuy: {},
	},
	users: {
		totalUser: {},
		userLoader: false,
	},
	userWalletHolding: {
		totalUserWalletHolding: {},
		userLoader: false,
	},
};

const reducer = (state = initialState, action) => {
	switch (action.type) {
		case ERRORS:
			return {
				...state,
				errors: action.payload,
				loading: false,
			};

		case CLEAR_RESPONSE:
			return {
				...state,
				errors: {},
				response: {},
			};

		// case NOTIFICATION_FAILURE:
		case TOTAL_FIAT_TRANSCATION_SUCCESS:
		case TOTAL_FIAT_TRANSCATION_FAILURE:
			return {
				...state,
				transcations: {
					...state.transcations,
					totalFiatTranscation: action.payload,
					fiatLoader: false,
				},
			};
		case TOTAL_CRYPTO_TRANSCATION_SUCCESS:
		case TOTAL_CRYPTO_TRANSCATION_FAILURE:
			return {
				...state,
				transcations: {
					...state.transcations,
					totalCryptoTranscation: action.payload,
					cryptoLoader: false,
				},
			};
		case TOTAL_FIAT_TRANSCATION_REQUEST:
			return {
				...state,
				transcations: {
					...state.transcations,
					fiatLoader: true,
				},
			};
		case TOTAL_CRYPTO_TRANSCATION_REQUEST:
			return {
				...state,
				transcations: {
					...state.transcations,
					cryptoLoader: true,
				},
			};
		case TOTAL_SELL_ORDERS_SUCCESS:
		case TOTAL_SELL_ORDERS_FAILURE:
			return {
				...state,
				orders: {
					...state.orders,
					totalSell: action.payload,
					sellLoader: false,
				},
			};
		case TOTAL_BUY_ORDERS_SUCCESS:
		case TOTAL_BUY_ORDERS_FAILURE:
			return {
				...state,
				orders: {
					...state.orders,
					totalBuy: action.payload,
					buyLoader: false,
				},
			};

		case TOTAL_BUY_ORDERS_REQUEST:
			return {
				...state,
				orders: {
					...state.orders,
					buyLoader: true,
				},
			};
		case TOTAL_SELL_ORDERS_REQUEST:
			return {
				...state,
				orders: {
					...state.orders,
					sellLoader: true,
				},
			};

		case TOTAL_USER_SUCCESS:
		case TOTAL_USER_FAILURE:
			return {
				...state,
				users: {
					...state.users,
					totalUser: action.payload,
					userLoader: false,
				},
			};

		case TOTAL_USER_REQUEST:
			return {
				...state,
				users: {
					...state.users,
					userLoader: true,
				},
			};

		case TOTAL_USER_HOLDING_SUCCESS:
		case TOTAL_USER_HOLDING_FAILURE:
			return {
				...state,
				userWalletHolding: {
					...state.userWalletHolding,
					totalUserWalletHolding: action.payload,
					userLoader: false,
				},
			};

		case TOTAL_USER_HOLDING_REQUEST:
			return {
				...state,
				userWalletHolding: {
					...state.userWalletHolding,
					userLoader: true,
				},
			};

		default:
			return state;
	}
};

export default reducer;
