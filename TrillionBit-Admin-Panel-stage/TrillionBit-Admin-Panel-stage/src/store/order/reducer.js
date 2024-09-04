import {
    ERRORS,
} from "./actionTypes";

const initialState = {
	order: {},
	errors: {},
	loader: false,
}

const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case ERRORS:
		return { 
			...state, 
			errors: action.payload, 
			loading: false 
		}
    default:
      return state
  }
}

export default orderReducer
