const express = require('express');
const { isEmpty } = require('lodash');
const router = express.Router();
const Role = require('../../../models/Role');

/**
 * @route GET /api/admin/role/get-user-role-permissions
 * @description Get all get-user-role-permissions
 * @access Public
 */
 router.get('/get-user-role-permissions/:id', async (req, res) => {
	try {
        const role = await Role.findOne({_id: req.params.id}, 'name').populate('permissions.permissionId', 'name').lean();
        if(!isEmpty(role)) {
            res.json(role);
        } else {
            res.status(400).json({variant: 'error', message: 'No role found'});
        }
    } catch (error) {
        res.status(400).json({variant: 'error', message: 'No role found', errors: error});
    }
    
});

/**
 * @route GET /api/admin/role/get-admirolens
 * @description Get all get-roles
 * @access Public
 */
router.get('/get-roles', async (req, res) => {
	try {
        const role = await Role.find();
        if(role.length > 0) {
            res.json(role);
        } else {
            res.status(400).json({variant: 'error', message: 'No role found'});
        }
    } catch (error) {
        res.status(400).json({variant: 'error', message: 'No role found'});
    }
    
});

/**
 * @route GET /api/admin/role/get-active-roles
 * @description Get all get-roles
 * @access Public
 */
 router.get('/get-active-roles', async (req, res) => {
	try {
        const role = await Role.find({isActive: true});
        if(role.length > 0) {
            res.json(role);
        } else {
            res.status(400).json({variant: 'error', message: 'No role found'});
        }
    } catch (error) {
        res.status(400).json({variant: 'error', message: 'No role found'});
    }
    
});
/**
 * @route Post /api/admin/role/create-role
 * @description Create Role
 * @access Public
 */
router.post('/create-role', async (req, res) => {
    const existRole =  await Role.findOne({ name: req.body.name });
    if(!isEmpty(existRole)) return res.status(400).json({ name: 'Role already exists.' });
    try {
       const newRole = new Role({
            name: req.body.name,
            permissions: req.body.permissions,
            type: 'admin',
            isActive: req.body.active,
        });
        await newRole.save();
        res.json({variant: 'success', message: 'Role created successfully.'});
    } catch (error) {
		res.json({variant: 'error', message: 'Falied to create role.'});
    }
});
/**
 * @route Post /api/admin/role/:id
 * @description Update role
 * @access Public
 */
router.post('/update-role/:id', async (req, res) => {
	const role = await Role.findOne({_id: req.params.id});
    if(!isEmpty(role)) {
        const existRole =  await Role.findOne({ name: req.body.name, _id: { $ne: req.params.id } });
        if(!isEmpty(existRole)) return res.status(400).json({ name: 'Role already exists.' });
        try {
            role.name = req.body.name;
            role.permissions = req.body.permissions;
            role.type = 'admin';
            role.isActive = req.body.active;
            await role.save();
		    res.json({variant: 'success', message: 'role updated successfully.'});
        } catch (error) {
            res.json({variant: 'error', message: 'Falied to update role.'});
        }
    } else {
        res.json({variant: 'error', message: 'Falied to update role.'});
    }
	
});


/**
 * @route GET /api/admin/role/remove-role/:id
 * @description Remove role 
 * @access Public
 */
router.get('/remove-role/:id', async (req, res) => {
	try {
		const role = await Role.findOne({_id: req.params.id});
		await role.remove();
		res.json({variant: 'success', message: 'role removed successfully.'});
	} catch (error) {
		res.json({variant: 'error', message: 'Falied to remove role.'});
	}
});

/**
 * @route Post /api/admin/role/toggle-active-role/:id
 * @description Update toggle-active-role
 * @access Public
 */
 router.post('/toggle-active-role/:id', async (req, res) => {
    try {
		const role = await Role.findOne({_id: req.params.id});
		role.isActive = !role.isActive;
        await role.save();
		res.json({variant: 'success', message: 'role updated successfully.'});
	} catch (error) {
		res.json({variant: 'error', message: 'Falied to remove role.'});
	}
});

module.exports = router;