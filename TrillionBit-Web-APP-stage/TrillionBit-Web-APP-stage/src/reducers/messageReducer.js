import { GET_MESSAGES, CLEAR_MESSAGES } from '../actions/types';

const initialState = {};

// eslint-disable-next-line import/no-anonymous-default-export
export default function (state = initialState, action) {
  switch (action.type) {
    case GET_MESSAGES:
      return action.payload;
    case CLEAR_MESSAGES:
      return action.payload;
    default:
      return state;
  }
}