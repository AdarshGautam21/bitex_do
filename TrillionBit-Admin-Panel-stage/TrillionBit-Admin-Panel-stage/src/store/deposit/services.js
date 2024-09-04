import axios from "axios";
import { apiUrl } from "../../config";

export const updateFiatDepositRequest = ({ status, requestId }) =>
	axios
		.get(
			`${apiUrl}/api/admin/users/update_deposit_request/${status}/${requestId}`
		)
		.then((response) => response)
		.catch((err) => err.response);
