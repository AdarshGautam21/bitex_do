import {
	ERRORS,
	CLEAR_RESPONSE,
	NOTIFICATION_REQUEST,
	UPDATE_NOTIFICATION_REQUEST,
} from "./actionTypes";

export const clearResponse = () => {
	return {
		type: CLEAR_RESPONSE,
		payload: {},
	};
};

export const getNotifications = () => {
	return {
		type: NOTIFICATION_REQUEST,
		payload: {},
	};
};

export const updateNotification = (data) => {
	return {
		type: UPDATE_NOTIFICATION_REQUEST,
		payload: { data },
	};
};
