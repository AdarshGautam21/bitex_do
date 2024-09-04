import {
	LOGIN,
	LOGIN_SUCCESS,
	LOGIN_FAILURE,
	LOGOUT,
	ERRORS,
	LOGIN_USER_ROLE_REQUEST,
	LOGIN_USER_ROLE_SUCCESS,
} from "./actionTypes";

const initialState = {
	isAuthenticated: false,
	user: {},
	currentUserRole: {},
	currentUserRolePermissions: [],
	errors: {},
	loading: false,
};

const login = (state = initialState, action) => {
	switch (action.type) {
		case LOGIN:
			return {
				...state,
				loading: true,
			};
		case LOGIN_SUCCESS:
			return {
				...state,
				loading: false,
				user: action.payload,
				isAuthenticated: true,
				errors: {},
			};
		case LOGIN_FAILURE:
			return {
				...state,
				loading: false,
				errors: action.payload,
			};

		case LOGOUT:
			return {
				...state,
				user: {},
				isAuthenticated: false,
				errors: {},
			};
		case ERRORS:
			return {
				...state,
				errors: action.payload,
				loading: false,
			};

		case LOGIN_USER_ROLE_REQUEST:
			return {
				...state,
				loading: true,
			};

		case LOGIN_USER_ROLE_SUCCESS:
			let userPermissions = [];
			if (action.payload?.permissions) {
				userPermissions = action.payload?.permissions.map(
					(per) => per.permissionId.name
				);
			}
			return {
				...state,
				loading: false,
				currentUserRole: action.payload,
				currentUserRolePermissions: userPermissions,
			};
		default:
			return state;
	}
};

export default login;
