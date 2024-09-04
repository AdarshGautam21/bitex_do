import React, { Component } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { Dropdown, DropdownToggle, DropdownMenu, Row, Col } from "reactstrap";
import SimpleBar from "simplebar-react";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
//Import Icons
import FeatherIcon from "feather-icons-react";
//Import images
import { getNotifications } from "../../../store/notification/actions";
import NotificationItem from "./NotificationItem";
import isEmpty from "../../../validation/isEmpty";

class NotificationDropdown extends Component {
	state = {
		menu: false,
		intervalId: null,
	};

	setMenu = () => {
		this.setState((prevState) => ({
			menu: !prevState.menu,
		}));
	};

	componentDidMount = () => {
		this.props.getNotifications();
		const intervalId = setInterval(() => {
			this.props.getNotifications();
		}, 10000);
		this.setState({ intervalId: intervalId });
	};

	UNSAFE_componentWillUnmount = () => {
		clearInterval(this.state.intervalId);
	};

	componentDidUpdate = (prevProps, prevState) => {};

	render() {
		return (
			<React.Fragment>
				<Dropdown
					isOpen={this.state.menu}
					toggle={this.setMenu}
					className="dropdown d-inline-block"
					tag="li"
				>
					<DropdownToggle
						className="btn header-item noti-icon position-relative"
						tag="button"
						id="page-header-notifications-dropdown"
					>
						<FeatherIcon icon="bell" className="icon-lg" />
						{!isEmpty(this.props.notifications.count) &&
						this.props.notifications.count > 0 ? (
							<span className="badge bg-danger rounded-pill">
								{this.props.notifications.count}
							</span>
						) : null}
					</DropdownToggle>

					<DropdownMenu className="dropdown-menu-lg dropdown-menu-end p-0">
						<div className="p-3">
							<Row className="align-items-center">
								<Col>
									<h6 className="m-0"> Notifications </h6>
								</Col>
								{/* <div className="col-auto">
                  <Link to="#" className="small">
                    {" "}
                    View All
                  </Link>
                </div> */}
							</Row>
						</div>

						<SimpleBar style={{ height: "230px" }}>
							{!isEmpty(this.props.notifications.data)
								? this.props.notifications.data?.map((item) => (
										<NotificationItem
											key={item._id}
											notification={item}
										/>
								  ))
								: ""}
						</SimpleBar>
					</DropdownMenu>
				</Dropdown>
			</React.Fragment>
		);
	}
}

NotificationDropdown.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
	notifications: state.notification.notifications,
});

export default connect(mapStateToProp, { getNotifications })(
	withRouter(NotificationDropdown)
);
