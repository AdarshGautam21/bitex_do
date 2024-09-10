const hasPermission = (permission, userPermissions) => {
	const couldShow = userPermissions.some((item) => permission.includes(item));
	return couldShow ? true : false;
};
export default hasPermission;
