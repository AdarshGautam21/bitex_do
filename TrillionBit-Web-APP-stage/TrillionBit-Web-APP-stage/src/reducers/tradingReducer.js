import {
	GET_USER_TRADE_ORDERS,
	GET_USER_MARKET_DEALS,
	GET_USER_SELL_ORDER_BOOK,
	GET_USER_BUY_ORDER_BOOK,
	GET_USER_ORDER_DEPTH,
	GET_AVAILABLE_MARKETS,
	ACTIVE_MARKET,
	ACTIVE_FUTURE_MARKET,
	GET_MARKET_LAST,
	GET_PENDING_ORDERS,
	GET_CLIENT_PENDING_ORDERS,
	GET_CLIENT_TRADE_ORDERS,
	GET_TRADING_CHART_DATA,
	GET_MARKET_STATUS_TODAY,
	GET_ACTIVE_ASSETS_LIST,
	GET_WALLET_MAINTENANCE,
	GET_TRADING_MAINTENANCE,
} from "../actions/types";

const initialState = {
	orders: [],
	clientOrders: [],
	liveTrades: [],
	orderSellBooks: [],
	orderBuyBooks: [],
	orderDepths: {
		asks: [],
		bids: [],
	},
	markets: [],
	activeMarket: {},
	activeFutureMarket: {},
	marketLast: {},
	pendingOrders: [],
	pendingClientOrders: [],
	tradingChartData: [],
	marketStatusToday: {},
	activeAssetsList: [],
	maintenance: {
		wallet: {},
		trading: [],
	},
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
	switch (action.type) {
		case GET_USER_TRADE_ORDERS:
			return {
				...state,
				orders: action.payload,
			};
		case GET_CLIENT_TRADE_ORDERS:
			return {
				...state,
				clientOrders: action.payload,
			};
		case GET_USER_MARKET_DEALS:
			return {
				...state,
				liveTrades: action.payload,
			};
		case GET_USER_SELL_ORDER_BOOK:
			return {
				...state,
				orderSellBooks: action.payload,
			};
		case GET_USER_BUY_ORDER_BOOK:
			return {
				...state,
				orderBuyBooks: action.payload,
			};
		case GET_USER_ORDER_DEPTH:
			return {
				...state,
				orderDepths: action.payload,
			};
		case GET_AVAILABLE_MARKETS:
			return {
				...state,
				markets: action.payload,
			};
		case ACTIVE_MARKET:
			return {
				...state,
				activeMarket: action.payload,
			};
		case ACTIVE_FUTURE_MARKET:
			return {
				...state,
				activeFutureMarket: action.payload,
			};
		case GET_MARKET_LAST:
			return {
				...state,
				marketLast: action.payload,
			};
		case GET_PENDING_ORDERS:
			return {
				...state,
				pendingOrders: action.payload,
			};
		case GET_TRADING_CHART_DATA:
			return {
				...state,
				tradingChartData: action.payload,
			};
		case GET_MARKET_STATUS_TODAY:
			return {
				...state,
				marketStatusToday: action.payload,
			};
		case GET_ACTIVE_ASSETS_LIST:
			return {
				...state,
				activeAssetsList: action.payload,
			};
		case GET_CLIENT_PENDING_ORDERS:
			return {
				...state,
				pendingClientOrders: action.payload,
			};
		case GET_WALLET_MAINTENANCE:
			return {
				...state,
				maintenance: {
					...state.maintenance,
					wallet: action.payload,
				},
			};
		case GET_TRADING_MAINTENANCE:
			return {
				...state,
				maintenance: {
					...state.maintenance,
					trading: action.payload,
				},
			};
		default:
			return state;
	}
}
