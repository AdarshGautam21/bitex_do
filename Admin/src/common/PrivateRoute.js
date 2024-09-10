import React from "react";
import { Route, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import PermissionModal from "./PermissionModal";

const hasAnyPermission = (currentUserRolePermissions, permission, props) => {
	return currentUserRolePermissions?.some((item) =>
		permission?.includes(item)
	);
};

const PrivateRoute = ({
	component: Component,
	auth,
	permission,
	layout: Layout,
	...rest
}) => {
	return (
		<Route
			{...rest}
			render={(props) =>
				auth.isAuthenticated === true ? (
					permission && auth.loading === false ? (
						hasAnyPermission(
							auth?.currentUserRolePermissions,
							permission,
							props
						) ? (
							<Layout>
								<Component {...props} />{" "}
							</Layout>
						) : (
							<Layout>
								<PermissionModal />
							</Layout>
						)
					) : (
						<Layout>
							<Component {...props} />{" "}
						</Layout>
					)
				) : (
					<Redirect to="/login" />
				)
			}
		/>
	);
};

PrivateRoute.propTypes = {
	auth: PropTypes.object.isRequired,
};

const mapStateToProp = (state) => ({
	auth: state.auth,
});

export default connect(mapStateToProp, {})(PrivateRoute);
