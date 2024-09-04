import {
    CLEAR_SNACK_MESSAGES,
    CLEAR_MESSAGES,
    GET_ERRORS
 } from './types';

// GET Clear messages
export const clearSnackMessages = () => dispatch => {
    dispatch({
        type: CLEAR_SNACK_MESSAGES,
        payload: {}
    });
}

export const clearMessages = () => dispatch => {
    dispatch({
        type: CLEAR_MESSAGES,
        payload: {}
    })
}

export const clearErrors = () => dispatch => {
    dispatch({
        type: GET_ERRORS,
        payload: {}
    })
}