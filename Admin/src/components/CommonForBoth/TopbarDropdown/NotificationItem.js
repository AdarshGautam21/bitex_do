import React from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import { apiUrl } from "../../../config";
import moment from "moment";

const getNotificationType = (name) => {
	if (name === "WalletTransactions") {
		return "#CryptoTranscation";
	} else if (name === "UserDepositRequest") {
		return "#FiatDepositTranscation";
	} else if (name === "UserWithdrawRequest") {
		return "#FiatWithdrawalTranscation";
	}
	return "#PersonalInfo";
};

const NotificationItem = ({ notification }) => {
	return (
		<Link
			to={`/user-details/${notification?.user?._id}${getNotificationType(
				notification?.notificationType?.documentName
			)}#${notification?._id}
			`}
			className="text-reset notification-item"
		>
			<div className="d-flex">
				<img
					src={`${apiUrl}/api/guest/get_image/${notification?.user?.avatar}`}
					className="me-3 rounded-circle avatar-sm"
					alt="user-pic"
				/>
				<div className="flex-grow-1">
					<h6 className="mt-0 mb-1">
						{notification?.user?.firstname}{" "}
						{notification?.user?.lastname}
					</h6>
					<div className="font-size-12 text-muted">
						<p className="mb-1">{notification.title}</p>
						<p className="mb-0">
							<i className="mdi mdi-clock-outline" />{" "}
							{moment(notification.createdAt).fromNow()}
						</p>
					</div>
				</div>
			</div>
		</Link>
	);
};

NotificationItem.propTypes = {
	children: PropTypes.any,
	location: PropTypes.object,
};

export default withRouter(NotificationItem);
