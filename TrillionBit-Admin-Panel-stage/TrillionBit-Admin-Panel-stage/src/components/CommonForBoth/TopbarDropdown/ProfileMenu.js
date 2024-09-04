import React, { useState } from "react";
import PropTypes from "prop-types";
import {
	Dropdown,
	DropdownToggle,
	DropdownMenu,
	DropdownItem,
} from "reactstrap";
//i18n
import { withTranslation } from "react-i18next";
// Redux
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";

const ProfileMenu = (props) => {
	// Declare a new state variable, which we'll call "menu"
	const [menu, setMenu] = useState(false);

	return (
		<React.Fragment>
			<Dropdown
				isOpen={menu}
				toggle={() => setMenu(!menu)}
				className="d-inline-block"
			>
				<DropdownToggle
					className="btn header-item bg-soft-light border-start border-end"
					id="page-header-user-dropdown"
					tag="button"
				>
					<img
						className="rounded-circle header-profile-user"
						src={props.auth.user?.avatar}
						alt="Header Avatar"
					/>
					<span className="d-none d-xl-inline-block ms-2 me-1">
						{props.auth.user?.name}
					</span>
					<i className="mdi mdi-chevron-down d-none d-xl-inline-block" />
				</DropdownToggle>
				<DropdownMenu className="dropdown-menu-end">
					<DropdownItem tag="a" href="/logout">
						<i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
						{props.t("Logout")}{" "}
					</DropdownItem>
					{/* <div className="dropdown-divider" />
            <Link to="/logout" className="dropdown-item">
              <i className="bx bx-power-off font-size-16 align-middle me-1 text-danger" />
              <span>{props.t("Logout")}</span>
            </Link> */}
				</DropdownMenu>
			</Dropdown>
		</React.Fragment>
	);
};

ProfileMenu.propTypes = {
	auth: PropTypes.any,
	t: PropTypes.any,
};

const mapStatetoProps = (state) => ({
	auth: state.auth,
});

export default withRouter(
	connect(mapStatetoProps, {})(withTranslation()(ProfileMenu))
);
