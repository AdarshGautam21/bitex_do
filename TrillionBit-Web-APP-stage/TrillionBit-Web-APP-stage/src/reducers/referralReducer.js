import {
    GET_REFERRAL,
    GET_REFERRAL_TREE,
    GET_REFERRAL_EARNED
} from '../actions/types';

const initialState = {
    referralDetails: {
      totalReferralEarnings: 0,
      numberOfReferrals: 0,
    },
    referralTrees: [],
    referralEarned: [],

};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_REFERRAL:
      return {
          ...state,
          referralDetails: action.payload,
      };
    case GET_REFERRAL_TREE:
        return {
            ...state,
            referralTrees: action.payload,
        }
    case GET_REFERRAL_EARNED:
        return {
            ...state,
            referralEarned: action.payload,
        }
    default:
      return state;
  }
}