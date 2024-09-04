import {
  GET_USER_PROFILE,
  USER_2FA_UPDATE,
  UPLOAD_DOCUMENT,
  GET_USER_DOCUMENTS,
  GET_USER_IDENTITY,
  GET_USER_RESIDENSE,
  GET_USER_PERSONAL_INFO,
  SAVE_USER_PERSONAL_INFO,
  GET_USER_BANK_INFO,
  SAVE_USER_BANK_INFO,
  GET_USER_LOGS,
  GET_USER_ANNOUNCEMENT,
  GET_USER_DETAILS,
  GET_USER_API_KEYS,
  GET_AGENT_CLIENTS,
  GET_USER_CLIENT_PROFILE,
  GET_USER_CLIENT_DOCUMENTS,
  GET_USER_CLIENT_IDENTITY,
  UPLOAD_CLIENT_DOCUMENT,
  GET_USER_CLIENT_RESIDENSE,
  GET_USER_CLIENT_PERSONAL_INFO,
  SAVE_USER_CLIENT_PERSONAL_INFO,
  GET_USER_CLIENT_BANK_INFO,
  SAVE_USER_CLIENT_BANK_INFO,
  GET_USER_CLIENT_LOGS,
  GET_CLIENT_USER_PROFILE,
  GET_USER_CLIENT_WALLETS,
  GET_AGENT_DEFAULT_SETTINGS,
  GET_AGENT_COMMISSIONS,
  GET_CLIENT_COMMISSIONS,
  GET_SUMSUB_VERIFICATION_TOKEN,
  SUMSUB_VERIFICATION_COMPLETED,
} from "../actions/types";

const initialState = {
  userProfile: {},
  userDocuments: [],
  userIdentity: {},
  userPassportDoc: {},
  userIdDoc: {},
  userDriverLicenceDoc: {},
  userResidence: {},
  userPersonalInfo: {},
  userBankInfo: {},
  userLogs: [],
  userAnnoucements: [],
  userDetails: {},
  userApiKeys: [],
  agentClients: [],
  sumsubToken: null,
  verificationResult: null,
  userClientProfile: {},
  userClientDocuments: [],
  userClientIdentity: {},
  userClientPassportDoc: {},
  userClientResidence: {},
  userClientPersonalInfo: {},
  userClientBankInfo: {},
  userClientLogs: [],
  userClientWallets: [],
  agentDefaultSettings: {},
  agentCommissions: {},
  clientTradeLevels: [],
};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_USER_PROFILE:
      return {
        ...state,
        userProfile: action.payload,
      };
    case GET_USER_CLIENT_PROFILE:
      return {
        ...state,
        userClientProfile: action.payload,
      };
    case USER_2FA_UPDATE:
      return {
        ...state,
        userProfile: action.payload,
      };
    case UPLOAD_DOCUMENT:
      return {
        ...state,
        userPassportDoc: action.payload,
      };
    case UPLOAD_CLIENT_DOCUMENT:
      return {
        ...state,
        userClientPassportDoc: action.payload,
      };
    case GET_USER_DOCUMENTS:
      return {
        ...state,
        userDocuments: action.payload,
      };
    case GET_USER_CLIENT_DOCUMENTS:
      return {
        ...state,
        userClientDocuments: action.payload,
      };
    case GET_USER_IDENTITY:
      return {
        ...state,
        userIdentity: action.payload,
      };
    case GET_SUMSUB_VERIFICATION_TOKEN:
      return {
        ...state,
        sumsubToken: action.payload,
      };
    case SUMSUB_VERIFICATION_COMPLETED:
      return {
        ...state,
        verificationResult: action.payload,
      };
    case GET_USER_CLIENT_IDENTITY:
      return {
        ...state,
        userClientIdentity: action.payload,
      };
    case GET_USER_RESIDENSE:
      return {
        ...state,
        userResidence: action.payload,
      };
    case GET_USER_CLIENT_RESIDENSE:
      return {
        ...state,
        userClientResidence: action.payload,
      };
    case GET_USER_PERSONAL_INFO:
      return {
        ...state,
        userPersonalInfo: action.payload,
      };
    case SAVE_USER_PERSONAL_INFO:
      return {
        ...state,
        userPersonalInfo: action.payload,
      };
    case GET_USER_CLIENT_PERSONAL_INFO:
      return {
        ...state,
        userClientPersonalInfo: action.payload,
      };
    case SAVE_USER_CLIENT_PERSONAL_INFO:
      return {
        ...state,
        userClientPersonalInfo: action.payload,
      };
    case GET_USER_BANK_INFO:
      return {
        ...state,
        userBankInfo: action.payload,
      };
    case SAVE_USER_BANK_INFO:
      return {
        ...state,
        userBankInfo: action.payload,
      };
    case GET_USER_CLIENT_BANK_INFO:
      return {
        ...state,
        userClientBankInfo: action.payload,
      };
    case SAVE_USER_CLIENT_BANK_INFO:
      return {
        ...state,
        userClientBankInfo: action.payload,
      };
    case GET_USER_LOGS:
      return {
        ...state,
        userLogs: action.payload,
      };
    case GET_USER_CLIENT_LOGS:
      return {
        ...state,
        userClientLogs: action.payload,
      };
    case GET_USER_ANNOUNCEMENT:
      return {
        ...state,
        userAnnoucements: action.payload,
      };
    case GET_USER_DETAILS:
      return {
        ...state,
        userDetails: action.payload,
      };
    case GET_USER_API_KEYS:
      return {
        ...state,
        userApiKeys: action.payload,
      };
    case GET_AGENT_CLIENTS:
      return {
        ...state,
        agentClients: action.payload,
      };
    case GET_CLIENT_USER_PROFILE:
      return {
        ...state,
        userClientProfile: action.payload,
      };
    case GET_USER_CLIENT_WALLETS:
      return {
        ...state,
        userClientWallets: action.payload,
      };
    case GET_AGENT_DEFAULT_SETTINGS:
      return {
        ...state,
        agentDefaultSettings: action.payload,
      };
    case GET_AGENT_COMMISSIONS:
      return {
        ...state,
        agentCommissions: action.payload,
      };
    case GET_CLIENT_COMMISSIONS:
      return {
        ...state,
        clientTradeLevels: action.payload,
      };
    default:
      return state;
  }
}
