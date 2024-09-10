import {
  LOGIN_USER,
  LOGIN_SUCCESS,
  LOGOUT_USER,
  LOGOUT_USER_SUCCESS,
  API_ERROR,
  ERRORS
} from "./actionTypes"

const initialState = {
  error: "",
  loading: false,
}

const login = (state = initialState, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return  {
        ...state,
        loading: true,
      }
    case LOGIN_SUCCESS:
      return  {
        ...state,
        loading: false,
      }
    case LOGOUT_USER:
      return state
    case LOGOUT_USER_SUCCESS:
      return  state
    case API_ERROR:
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      }
    case ERRORS:
      return { 
        ...state, 
        error: action.payload, 
        loading: false 
      }
    default:
      return state
  }
}

export default login
