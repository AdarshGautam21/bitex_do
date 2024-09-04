import axios from "axios";

// import apiUrl from '../config';

import {
  GET_USERS,
  SEARCH_USERS_BY_NAME,
  GET_ERRORS,
  UPDATE_DATE_RANGES,
  USER_FILTER,
  UPDATE_USER_IDS,
  GET_USERS_OPTIONS,
  GET_USER_PROFILE,
  USER_2FA_UPDATE,
  UPLOAD_DOCUMENT,
  GET_USER_DOCUMENTS,
  GET_USER_IDENTITY,
  STORE_USER_DOCUMENT,
  STORE_USER_RESIDENSE,
  GET_USER_RESIDENSE,
  GET_USER_PERSONAL_INFO,
  GET_USER_BANK_INFO,
  GET_SNACK_MESSAGES,
  GET_USER_LOGS,
  GET_USER_ANNOUNCEMENT,
  SUBMIT_IDENTITY_FORM,
  GET_USER_DETAILS,
  GET_USER_API_KEYS,
  STORE_CORPORATE_INFO,
  GET_AGENT_CLIENTS,
  GET_USER_CLIENT_PROFILE,
  GET_USER_CLIENT_DOCUMENTS,
  GET_USER_CLIENT_IDENTITY,
  UPLOAD_CLIENT_DOCUMENT,
  GET_USER_CLIENT_RESIDENSE,
  GET_USER_CLIENT_PERSONAL_INFO,
  GET_USER_CLIENT_BANK_INFO,
  GET_USER_CLIENT_LOGS,
  GET_CLIENT_USER_PROFILE,
  GET_USER_CLIENT_WALLETS,
  GET_AGENT_DEFAULT_SETTINGS,
  GET_AGENT_COMMISSIONS,
  GET_CLIENT_COMMISSIONS,
  USER_PHONE_UPDATE,
  SET_LOGIN_USER,
  SUMSUB_VERIFICATION_COMPLETED,
  GET_SUMSUB_VERIFICATION_TOKEN,
} from "./types";

const ipLocation = require("iplocation");
const FormData = require("form-data");

// Default totalUsers
let defaultTotalUsers = 10;
axios.defaults.baseURL = process.env.REACT_APP_API_URL;

// Upload doc
export const uploadDocuments = (userParams) => async (dispatch) => {
  await dispatch({
    type: UPLOAD_DOCUMENT,
    payload: userParams,
  });
};

// Upload doc
export const uploadClientDocuments = (userParams) => async (dispatch) => {
  await dispatch({
    type: UPLOAD_CLIENT_DOCUMENT,
    payload: userParams,
  });
};

export const resendClientVerification = (userId, client) => (dispatch) => {
  return axios
    .post(`/api/user/resend_client_verification/${userId}`, client)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      });
    });
};

// Get User logs
export const getUserLogs = (count, userId) => (dispatch) => {
  axios
    .post(`/api/user/logs/${count}`, { userId: userId })
    .then((res) => {
      dispatch({
        type: GET_USER_LOGS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_USER_LOGS,
        payload: [],
      });
    });
};

// Get User logs
export const getUserClientLogs = (count, userId) => (dispatch) => {
  axios
    .post(`/api/user/logs/${count}`, { userId: userId })
    .then((res) => {
      dispatch({
        type: GET_USER_CLIENT_LOGS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_USER_CLIENT_LOGS,
        payload: [],
      });
    });
};

//GET User announcements
export const getUserAnnouncements = () => (dispatch) => {
  axios
    .get(`/api/admin/users/get_announcements`)
    .then((res) => {
      dispatch({
        type: GET_USER_ANNOUNCEMENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_USER_ANNOUNCEMENT,
        payload: [],
      });
    });
};

// Save residence Doc
export const saveResidenceDoc = (userParams) => async (dispatch) => {
  let formData = new FormData();
  formData.append("userIdentityId", userParams.userIdentityId);
  formData.append("address", userParams.address);
  formData.append("city", userParams.city);
  formData.append("zipcode", userParams.zipcode);
  formData.append("country", userParams.country);
  formData.append("file", userParams.file);

  axios
    .post(`/api/user/store_user_residense_info`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch({
        type: STORE_USER_RESIDENSE,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Save Corporate Documents
export const saveCoroprateDocs = (userParams) => async (dispatch) => {
  let formData = new FormData();
  formData.append("docType", userParams.docType);
  if (userParams.file) {
    formData.append("file", userParams.file);
  } else {
    userParams.files.forEach(function (image, i) {
      formData.append("file_" + i, image);
    });
  }
  formData.append("docName", userParams.docName);
  formData.append("userIdentityId", userParams.userIdentityId);

  return axios
    .post(`/api/user/store_user_corporate_documents`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch({
        type: STORE_USER_DOCUMENT,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      });
    });
};

// Save Documents
export const saveDocument = (userParams) => async (dispatch) => {
  let formData = new FormData();
  formData.append("docType", userParams.docType);
  formData.append("file", userParams.file);
  formData.append("docName", userParams.docName);
  formData.append("userIdentityId", userParams.userIdentityId);

  axios
    .post(`/api/user/store_user_document`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      dispatch({
        type: STORE_USER_DOCUMENT,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// GET Users
export const getUsers = (totalUsers, userParams) => (dispatch) => {
  // Total users to get
  if (!totalUsers) {
    totalUsers = defaultTotalUsers;
  }

  // User filter data
  let userFilter = {};
  if (userParams) {
    userFilter = userParams;
  }
  axios
    .post(`/api/user/all/${totalUsers}`, userFilter)
    .then((res) => {
      dispatch({
        type: GET_USERS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Update Users list
export const searchUserByName = (string) => {
  let result = null;

  return axios
    .get(`/api/user/search_by_name/${string}`)
    .then((res) => {
      result = {
        type: SEARCH_USERS_BY_NAME,
        users: res.data,
      };
      return result;
    })
    .catch((err) => {
      return {
        type: SEARCH_USERS_BY_NAME,
        payload: [],
      };
    });
};

// Update date ranges
export const updateDateRanges = (startDate, endDate) => (dispatch) => {
  dispatch({
    type: UPDATE_DATE_RANGES,
    payload: {
      startDate: startDate,
      endDate: endDate,
      userFilter: true,
    },
  });
};

// User userIds toggle
export const updateUserIds = (userIds) => (dispatch) => {
  dispatch({
    type: UPDATE_USER_IDS,
    payload: {
      userIds: userIds,
    },
  });
};

// User filter toggle
export const userFilterToggle = (userFilter) => (dispatch) => {
  dispatch({
    type: USER_FILTER,
    payload: {
      userFilter: userFilter,
    },
  });
};

// GET Users for options
export const getUsersOptions = (totalUsers) => (dispatch) => {
  // Total users to get
  if (!totalUsers) {
    totalUsers = defaultTotalUsers;
  }

  axios
    .post(`/api/user/all/${totalUsers}`, {})
    .then((res) => {
      dispatch({
        type: GET_USERS_OPTIONS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USERS_OPTIONS,
        payload: [],
      })
    );
};

// Get UserProfile
export const getUserProfile = (userId) => (dispatch) => {
  return axios
    .get(`/api/auth/user-profile/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_PROFILE,
        payload: [],
      })
    );
};

// Get UserProfile
export const getClientUserProfile = (userId) => (dispatch) => {
  return axios
    .get(`/api/auth/user-profile/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_CLIENT_USER_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_CLIENT_USER_PROFILE,
        payload: [],
      })
    );
};

// Get UserProfile
export const getUserClientProfile = (userId) => (dispatch) => {
  return axios
    .get(`/api/auth/user-profile/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_CLIENT_PROFILE,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_CLIENT_PROFILE,
        payload: {},
      })
    );
};

// Subscribe to news letter
export const subscribeToNewsletter = (data) => (dispatch) => {
  return axios
    .post(`/api/guest/news_letter_subscription`, data)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      });
    });
};

// Get UserIdentity
export const getUserIdentity = (userId) => (dispatch) => {
  return axios
    .get(`/api/auth/user-identity/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_IDENTITY,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_IDENTITY,
        payload: {},
      })
    );
};

// Get UserIdentity
export const getUserClientIdentity = (userId) => (dispatch) => {
  return axios
    .get(`/api/auth/user-identity/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_CLIENT_IDENTITY,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_CLIENT_IDENTITY,
        payload: {},
      })
    );
};

// Create UserIdentity
export const createUserIdentity = (userParams) => (dispatch) => {
  return axios
    .post(`/api/auth/user-identity/`, userParams)
    .then((res) => {
      dispatch({
        type: GET_USER_IDENTITY,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Get UserProfile
export const getUserDocuments = (userIdentityId) => (dispatch) => {
  return axios
    .get(`/api/auth/user-documents/${userIdentityId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_DOCUMENTS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_DOCUMENTS,
        payload: [],
      })
    );
};

// Get UserProfile
export const getUserClientDocuments = (userIdentityId) => (dispatch) => {
  return axios
    .get(`/api/auth/user-documents/${userIdentityId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_CLIENT_DOCUMENTS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_CLIENT_DOCUMENTS,
        payload: [],
      })
    );
};

// Get UserResidense
export const getUserResidence = (userIdentityId) => (dispatch) => {
  return axios
    .get(`/api/user/user_residense/${userIdentityId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_RESIDENSE,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_RESIDENSE,
        payload: [],
      })
    );
};

// Get UserResidense
export const getUserClientResidence = (userIdentityId) => (dispatch) => {
  return axios
    .get(`/api/user/user_residense/${userIdentityId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_CLIENT_RESIDENSE,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_CLIENT_RESIDENSE,
        payload: [],
      })
    );
};

// Get UserPersonalInfo
export const getUserPersonalInfo = (userIdentityId) => (dispatch) => {
  return axios
    .get(`/api/user/user_personal_info/${userIdentityId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_PERSONAL_INFO,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_PERSONAL_INFO,
        payload: [],
      })
    );
};

// Get UserPersonalInfo
export const getUserClientPersonalInfo = (userIdentityId) => (dispatch) => {
  return axios
    .get(`/api/user/user_personal_info/${userIdentityId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_CLIENT_PERSONAL_INFO,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_CLIENT_PERSONAL_INFO,
        payload: [],
      })
    );
};

// Get UserPersonalInfo
export const saveUserPersonalInfo = (userParams) => async (dispatch) => {
  return axios
    .post(`/api/user/store_user_personal_info`, userParams)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
      dispatch({
        type: GET_ERRORS,
        payload: {},
      });
    })
    .catch(async (err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

// Get UserPersonalInfo
export const saveUserClientPersonalInfo = (userParams) => async (dispatch) => {
  return axios
    .post(`/api/user/store_user_personal_info`, userParams)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
      dispatch({
        type: GET_ERRORS,
        payload: {},
      });
    })
    .catch(async (err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

// Get UserBankInfo
export const getUserBankInfo = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/user_bank_info/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_BANK_INFO,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_BANK_INFO,
        payload: [],
      })
    );
};

// Get UserBankInfo
export const getUserClientBankInfo = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/user_bank_info/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_CLIENT_BANK_INFO,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_CLIENT_BANK_INFO,
        payload: [],
      })
    );
};

// Get UserBankInfo
export const saveUserBankInfo = (userParams) => (dispatch) => {
  return axios
    .post(`/api/user/store_user_bank_info`, userParams)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
      dispatch({
        type: GET_ERRORS,
        payload: {},
      });
    })
    .catch((err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

// Get UserBankInfo
export const saveUserClientBankInfo = (userParams) => (dispatch) => {
  return axios
    .post(`/api/user/store_user_bank_info`, userParams)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

// Update User 2FA
export const updateUser2FA = (userData) => (dispatch) => {
  return axios
    .post(`/api/auth/enable-2fa`, userData)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: USER_2FA_UPDATE,
        payload: [],
      })
    );
};

// Finish Identity Verification
export const finishIdentityForm = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/finish-identity-verification/${userId}`)
    .then((res) => {
      dispatch({
        type: SUBMIT_IDENTITY_FORM,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

// Update profile picture
export const updateProfilePicture =
  (userId, userProfile) => (dispatch, getState) => {
    let formData = new FormData();
    formData.append("file", userProfile.file);
    let currentLoginUser = getState().auth.currentLoginUser;
    return axios
      .post(`/api/user/update_profile_picture/${userId}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: res.data,
        });
        if (res.data?.data) {
          dispatch({
            type: SET_LOGIN_USER,
            payload: { ...currentLoginUser, avatar: res.data.data.avatar },
          });
        }
      })
      .catch((err) =>
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        })
      );
  };

// Get image
export const getUserDetails = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/user-details/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_DETAILS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_DETAILS,
        payload: {},
      })
    );
};

// Get user api keys
export const getUserApiKeys = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/get_user_api/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_API_KEYS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_USER_API_KEYS,
        payload: [],
      })
    );
};

// Create user api keys
export const createUserApiKeys = (userId, apiData) => (dispatch) => {
  return axios
    .post(`/api/user/create_user_api/${userId}`, apiData)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      })
    );
};

// Remove user api keys
export const removeUserApiKeys = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/remove_user_api/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      })
    );
};

// Update user password
export const updateUserPassword = (userId, userParams) => (dispatch) => {
  return axios
    .post(`/api/user/update_password/${userId}`, userParams)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

export const saveCorporateInfo =
  (userId, corporateInfoParams) => (dispatch) => {
    return axios
      .post(`/api/user/store_corporate_info_one/${userId}`, corporateInfoParams)
      .then((res) => {
        dispatch({
          type: STORE_CORPORATE_INFO,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      });
  };

export const saveCorporateInfoTwo =
  (userId, corporateInfoParams) => (dispatch) => {
    return axios
      .post(`/api/user/store_corporate_info_two/${userId}`, corporateInfoParams)
      .then((res) => {
        dispatch({
          type: STORE_CORPORATE_INFO,
          payload: res.data,
        });
      })
      .catch((err) => {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      });
  };

export const addNewClient = (userId, userParams) => (dispatch) => {
  return axios
    .post(`/api/user/add_new_client/${userId}`, userParams)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      if (err.response.data.variant) {
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: err.response.data,
        });
      } else {
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        });
      }
    });
};

export const getAgentClients = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/get_agent_clients/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_AGENT_CLIENTS,
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: GET_AGENT_CLIENTS,
        payload: [],
      });
    });
};

export const getUserClientWallets = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/user_active_wallets/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_USER_CLIENT_WALLETS,
        payload: res.data,
      });
    })
    .catch(() => {
      dispatch({
        type: GET_USER_CLIENT_WALLETS,
        payload: [],
      });
    });
};

// GET Agetn default settings
export const getAgetDefaultSettings = () => (dispatch) => {
  return axios
    .get(`/api/admin/users/get_agent_default_settings`)
    .then((res) => {
      dispatch({
        type: GET_AGENT_DEFAULT_SETTINGS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_AGENT_DEFAULT_SETTINGS,
        payload: {},
      });
    });
};

// GET Client commissions
export const getAgentCommissions = (agentId) => (dispatch) => {
  return axios
    .get(`/api/user/get_agent_commission/${agentId}`)
    .then((res) => {
      dispatch({
        type: GET_AGENT_COMMISSIONS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_AGENT_COMMISSIONS,
        payload: {},
      });
    });
};

// POST update agent settings
export const updateAgentCommissions = (agentId, data) => (dispatch) => {
  return axios
    .post(`/api/user/update_agent_commission/${agentId}`, data)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      });
    });
};

/**
 * Get trading levels
 */
export const getClientTradingLevels = (clientId) => (dispatch) => {
  return axios
    .get(`/api/user/get_agent_client_trader_levels/${clientId}`)
    .then((res) => {
      dispatch({
        type: GET_CLIENT_COMMISSIONS,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_CLIENT_COMMISSIONS,
        payload: [],
      })
    );
};

/**
 * Create trading level
 */
export const createClientTradingLevel = (data) => (dispatch) => {
  return axios
    .post(`/api/user/create_agent_client_trader_level`, data)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      })
    );
};

/**
 * Create trading level
 */
export const updateClientTradingLevel = (treaderId, data) => (dispatch) => {
  return axios
    .post(`/api/user/update_agent_client_trader_level/${treaderId}`, data)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      })
    );
};

/**
 * Remove trading level
 */
export const removeClientTradingLevel = (treaderId) => (dispatch) => {
  return axios
    .get(`/api/user/remove_agent_client_trader_level/${treaderId}`)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) =>
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      })
    );
};

// GET update sub agent settings
export const toggleSubAgent = (userId) => (dispatch) => {
  return axios
    .post(`/api/admin/users/toggle_sub_agent/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      });
    });
};

export const sendMobileVerificationCode = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/send_verification_sms/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: err.response.data,
      });
    });
};

/**
 * Verify phone.
 * @param {Object} userData
 */
export const verifyPhone = (userId, verificationCode) => (dispatch) => {
  return axios
    .post(`/api/user/verify-phone/${userId}`, {
      verificationCode: verificationCode,
    })
    .then((res) =>
      dispatch({
        type: GET_SNACK_MESSAGES,
        payload: res.data,
      })
    )
    .catch((err) =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data,
      })
    );
};

/**
 * edit MobileNumber.
 * @param {Object} userData
 */
export const editMobileNumber =
  (userId, mobileNumber, countryCode) => (dispatch, getState) => {
    let { user } = getState().auth;
    if (user) {
      user = { ...user, phone: countryCode + " " + mobileNumber };
    }
    return axios
      .post(`/api/user/edit-phone/${userId}`, {
        mobileNumber: mobileNumber,
        countryCode: countryCode,
      })
      .then((res) => {
        dispatch({
          type: USER_PHONE_UPDATE,
          payload: user,
        });
        dispatch({
          type: GET_SNACK_MESSAGES,
          payload: res.data,
        });
      })
      .catch((err) =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data,
        })
      );
  };
// Get Sumsub verification token
export const getSumsubVerificationToken = (userId) => (dispatch) => {
  return axios
    .get(`/api/user/get-verification-token-sumsub/${userId}`)
    .then((res) => {
      dispatch({
        type: GET_SUMSUB_VERIFICATION_TOKEN,
        payload: res.data.token,
      });
      return res.data.token;
    })
    .catch((err) => {
      console.error("Error fetching Sumsub verification token:", err);
      throw err;
    });
};

// Handle Sumsub verification completion
export const completeSumsubVerification = (userId, faceId) => (dispatch) => {
  return axios
    .post(`/api/user/start-verification-check-sumsub/${userId}`, { faceId })
    .then((res) => {
      dispatch({
        type: SUMSUB_VERIFICATION_COMPLETED,
        payload: res.data,
      });
      return res.data;
    })
    .catch((err) => {
      console.error("Error completing Sumsub verification:", err);
      throw err;
    });
};
export const getVerificationToken = (userId) => {
  return axios.get(`/api/user/get-verification-token/${userId}`).then((res) => {
    return res.data;
  });
};

export const startVerification = (userId, faceId) => {
  return axios
    .post(`/api/user/start-verification-check/${userId}`, { faceId: faceId })
    .then((res) => {
      return res.data;
    });
};

export const updateUserIdentityTag = (userIdentity) => (dispatch) => {
  userIdentity.submitted = true;
  return dispatch({
    type: GET_USER_IDENTITY,
    payload: userIdentity,
  });
};

export const getIpLocation = async (userIp) => {
  let currentIpLocation = {
    country: {
      callingCode: "+1",
      capital: "New York",
      code: "US",
      name: "United States Of America",
    },
  };

  try {
    currentIpLocation = await ipLocation(userIp);
  } catch (e) {
    console.log("Ip location failed to fetch");
  }

  return currentIpLocation;
};
