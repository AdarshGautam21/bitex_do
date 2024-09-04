import axios from "axios";
import { apiUrl } from "../../config";

export const updateFiatWithdrawalRequest = ({ status, requestId }) =>
	axios
		.get(
			`${apiUrl}/api/admin/users/update_withdrwal_request/${status}/${requestId}`
		)
		.then((response) => response)
		.catch((err) => err.response);

export const updateCryptoWithdrawals = (params) =>
	axios
		.post(`${apiUrl}/api/admin/users/update_crypto_transaction`, params)
		.then((response) => response)
		.catch((err) => err.response);
