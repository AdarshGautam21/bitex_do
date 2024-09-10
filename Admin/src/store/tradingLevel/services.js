import axios from "axios";
import { apiUrl } from "../../config";

const types = (name) => {
	if (name === "aed")
		return {
			create: "create_trader_level",
			update: "update_trader_level",
			remove: "remove_trader_level",
		};
	else if (name === "inr")
		return {
			create: "create_inr_trader_level",
			update: "update_inr_trader_level",
			remove: "remove_inr_trader_level",
		};
	else if (name === "usd")
		return {
			create: "create_usd_trader_level",
			update: "update_usd_trader_level",
			remove: "remove_usd_trader_level",
		};
	else if (name === "agent")
		return {
			create: "create_agent_trader_level",
			update: "update_agent_trader_level",
			remove: "remove_agent_trader_level",
		};
	else if (name === "subAgent")
		return {
			create: "create_sub_agent_trader_level",
			update: "update_sub_agent_trader_level",
			remove: "remove_sub_agent_trader_level",
		};
	return null;
};

export const create = (data) =>
	axios
		.post(`${apiUrl}/api/admin/trading/${types(data.type).create}`, data)

		.then((response) => response)
		.catch((err) => err.response);

export const update = (data) =>
	axios
		.post(
			`${apiUrl}/api/admin/trading/${types(data.type).update}/${
				data._id
			}`,
			data
		)

		.then((response) => response)
		.catch((err) => err.response);

export const remove = ({ id, type }) =>
	axios
		.get(`${apiUrl}/api/admin/trading/${types(type).remove}/${id}`)
		.then((response) => response)
		.catch((err) => err.response);
