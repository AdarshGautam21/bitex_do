import PropTypes from "prop-types";
import { connect } from "react-redux";

const Permission = (props) => {
	const couldShow = props.userPermissions.some((item) =>
		props.permission.includes(item)
	);
	return couldShow ? props.children : null;
};

Permission.propTypes = {
	permission: PropTypes.array.isRequired,
	userPermissions: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
	userPermissions: state.auth.currentUserRolePermissions,
});

export default connect(mapStateToProps)(Permission);
