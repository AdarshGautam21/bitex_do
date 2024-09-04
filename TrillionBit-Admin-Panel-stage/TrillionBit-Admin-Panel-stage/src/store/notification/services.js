import axios from "axios";
import { apiUrl } from "../../config";

export const getNotifications = () =>
	axios
		.get(`${apiUrl}/api/admin/dashboard/notification/get-notifications`)
		.then((response) => response)
		.catch((err) => err.response);

export const updateNotification = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/dashboard/notification/update-notifications/${data._id}`,
			data
		)
		.then((response) => response)
		.catch((err) => err.response);
