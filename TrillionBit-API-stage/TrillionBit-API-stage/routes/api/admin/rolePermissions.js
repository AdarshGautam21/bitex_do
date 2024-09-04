const express = require('express');
const router = express.Router();
const RolePermission = require('../../../models/RolePermission');

/**
 * @route GET /api/admin/role-permission/get-role-permission
 * @description Get all get-role-permission
 * @access Public
 */
router.get('/get-role-permissions', async (req, res) => {
	const rolePermissions = await RolePermission.find();

	if(rolePermissions.length > 0) {
		res.json(rolePermissions);
	} else {
		res.status(400).json({variant: 'error', message: 'No rolePermission found'});
	}
});

/**
 * @route GET /api/admin/role-permission/get-active-role-permissions
 * @description Get all get-active-role-permissions
 * @access Public
 */
router.get('/get-active-role-permissions', async (req, res) => {
	const rolePermissions = await RolePermission.find({isActive: true});

	if(rolePermissions.length > 0) {
		res.json(rolePermissions);
	} else {
		res.status(400).json({variant: 'error', message: 'No rolePermissions found'});
	}
});

/**
 * @route Post /api/admin/role-permission/create-role-permissions
 * @description Create create-role-permissions
 * @access Public
 */
router.post('/create-role-permissions', async (req, res) => {
	const rolePermission = new RolePermission({
		name: req.body.name,
		// type: req.body.type,
		isActive: (req.body.active) ? req.body.active : false
	});
	rolePermission.save()
	.then(rolePermission => {
		res.json({variant: 'success', message: 'rolePermission created successfully.'});
	})
	.catch(err => {
		res.json({variant: 'error', message: 'Falied to create rolePermission.'});
	});
});
/**
 * @route Post /api/admin/role-permission/:id
 * @description Update Article categories
 * @access Public
 */
router.post('/update-role-permission/:id', async (req, res) => {
	
	const rolePermission = await RolePermission.findOne({_id: req.params.id});
	rolePermission.name = req.body.name;
	// rolePermission.type = req.body.type;
	rolePermission.isActive = (req.body.active) ? req.body.active : false;
	rolePermission.save()
	.then(articleTag => {
		res.json({variant: 'success', message: 'rolePermission updated successfully.'});
	})
	.catch(err => {
		res.json({variant: 'error', message: 'Falied to update rolePermission.'});
	});
});


/**
 * @route GET /api/admin/role-permission/remove-role-permission/:id
 * @description Remove Article rolePermission
 * @access Public
 */
router.get('/remove-role-permission/:id', async (req, res) => {
	try {
		const rolePermission = await RolePermission.findOne({_id: req.params.id});
		await rolePermission.remove();
		res.json({variant: 'success', message: 'rolePermission removed successfully.'});
	} catch (error) {
		res.json({variant: 'error', message: 'Falied to remove rolePermission.'});
	}
});


/**
 * @route Post /api/admin/role-permission/toggle-active-role-permission/:id
 * @description Update toggle-active-role-permission
 * @access Public
 */
router.post('/toggle-active-role-permission/:id', async (req, res) => {
	try {
		const rolePermission = await RolePermission.findOne({_id: req.params.id});
		rolePermission.isActive = !rolePermission.isActive;
        await rolePermission.save();
		res.json({variant: 'success', message: 'rolePermission updated successfully.'});
	} catch (error) {
		res.json({variant: 'error', message: 'Falied to update rolePermission.'});
	}
});

module.exports = router;