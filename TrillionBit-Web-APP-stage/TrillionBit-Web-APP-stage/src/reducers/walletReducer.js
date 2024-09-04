import {
    GET_USER_WALLET,
    GENERATE_WALLET_ADDRESS,
    GET_WALLET_ADDRESSES,
    GET_ACTIVE_ASSETS,
    GET_ACTIVE_MARGIN_ASSETS,
    GET_DEPOSIT_REQUESTS,
    GET_WITHDRAWAL_REQUESTS,
    GET_TRANSACTIONS,
    GET_CLIENT_TRANSACTIONS,
    GET_MARKET_LAST,
    GET_FINAL_MARKET_LAST,
    GET_AED_PRICE,
    GET_USER_MARGIN_LEVEL,
    GET_FUTURE_TICKERS,
    GET_USDT_INR_PRICE,
    GET_BTX_MARKET_DATA,
    GET_BTX_AED_MARKET_DATA,
    GET_BANK_DETAIL
} from '../actions/types';

const initialState = {
    userWallet: {},
    userWalletAddresses: [],
    userAssets: [],
    userMarginAssets: [],
    userDepositRequests: [],
    userWithdrawalRequests: [],
    transactions: [],
    clientTransactions: [],
    marketLasts: {},
    finalMarketLasts: {},
    walletDetails: {},
    aedPrice: 3.7,
    userMarginLevel: {},
    bitexMarket: {},
    bitexAedMarket: {},
    futureTickers: [],
    usdtInrPrice: 0.00,
    bankDetails: {
        inrAccountDetail: {},
        aedAccountDetail: {},
    },
}

// eslint-disable-next-line import/no-anonymous-default-export
export default function(state = initialState, action) {
    switch (action.type) {
        case GET_USER_WALLET:
            return {
                ...state,
                userWallet: action.payload.userWallet,
                walletDetails: action.payload.asset,
            }
        case GENERATE_WALLET_ADDRESS:
            return {
                ...state,
                userWalletAddresses: action.payload
            }
        case GET_WALLET_ADDRESSES:
            return {
                ...state,
                userWalletAddresses: action.payload,
            }
        case GET_ACTIVE_ASSETS:
            return {
                ...state,
                userAssets: action.payload,
            }
        case GET_ACTIVE_MARGIN_ASSETS:
            return {
                ...state,
                userMarginAssets: action.payload,
            }
        case GET_DEPOSIT_REQUESTS:
            return {
                ...state,
                userDepositRequests: action.payload
            }
        case GET_WITHDRAWAL_REQUESTS:
            return {
                ...state,
                userWithdrawalRequests: action.payload
            }
        case GET_TRANSACTIONS:
            return {
                ...state,
                transactions: action.payload
            }
        case GET_CLIENT_TRANSACTIONS:
            return {
                ...state,
                clientTransactions: action.payload
            }
        case GET_MARKET_LAST:
            return {
                ...state,
                marketLasts: action.payload
            }
        case GET_FINAL_MARKET_LAST:
            return {
                ...state,
                finalMarketLasts: action.payload,
            }
        case GET_AED_PRICE:
            return {
                ...state,
                aedPrice: action.payload
            }
        case GET_USER_MARGIN_LEVEL:
            return {
                ...state,
                userMarginLevel: action.payload,
            }
        case GET_FUTURE_TICKERS:
            return {
                ...state,
                futureTickers: action.payload,
            }
        case GET_USDT_INR_PRICE:
            return {
                ...state,
                usdtInrPrice: action.payload,
            }
        case GET_BTX_MARKET_DATA:
            return {
                ...state,
                bitexMarket: action.payload,
            }
        case GET_BTX_AED_MARKET_DATA:
            return {
                ...state,
                bitexAedMarket: action.payload,
            }
        case GET_BANK_DETAIL:
            return {
                ...state,
                bankDetails: action.payload,
            }
        default:
            return state;
    }
}
