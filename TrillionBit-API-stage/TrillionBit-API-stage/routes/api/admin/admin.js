const express = require('express');
const { isEmpty } = require('lodash');
const router = express.Router();
const TwinBcrypt = require('twin-bcrypt');
const gravatar = require('gravatar');
const Admin = require('../../../models/Admin');
const BankDetail = require('../../../models/BankDetail');
/**
 * @route GET /api/admin/admin-user/get-admins
 * @description Get all get-admins
 * @access Public
 */
router.get('/get-admins', async (req, res) => {
	try {
        const admin = await Admin.find().populate({ path: 'roles', select: 'name' });
        if(admin.length > 0) {
            res.json(admin);
        } else {
            res.status(400).json({variant: 'error', message: 'No admins found'});
        }
    } catch (error) {
        res.status(400).json({variant: 'error', message: 'No admins found'});
    }
    
});
/**
 * @route Post /api/admin/admin-user/create-admin
 * @description Create Admin
 * @access Public
 */
router.post('/create-admin', async (req, res) => {
    const existAdmin =  await Admin.findOne({ email: req.body.email });
    if(!isEmpty(existAdmin)) return res.status(400).json({ email: 'Admin already exists.' });
    
    try {
        const avatar = gravatar.url(req.body.email, {
            s: '200', // Size
            r: 'pg', // Rating
            d: 'mm' // Default
        });
        const hashedPassword = await TwinBcrypt.hashSync(req.body.password);
        const newAdmin = new Admin({
            name: req.body.name,
            email: req.body.email,
            avatar,
            roles: req.body.roles,
            password: hashedPassword
        });
        await newAdmin.save();
        res.json({variant: 'success', message: 'Admin created successfully.'});
    } catch (error) {
        console.log("error:", error);
		res.json({variant: 'error', message: 'Falied to create admin.'});
    }
});
/**
 * @route Post /api/admin/admin-user/:id
 * @description Update admin-user
 * @access Public
 */
router.post('/update-admin/:id', async (req, res) => {
	const admin = await Admin.findOne({_id: req.params.id});
    if(!isEmpty(admin)) {
        const existAdmin =  await Admin.findOne({ email: req.body.email, _id: { $ne: req.params.id } });
        if(!isEmpty(existAdmin)) return res.status(400).json({ email: 'Admin already exists.' });
        try {
            if(!isEmpty(req.body.password)) admin.password = await TwinBcrypt.hashSync(req.body.password);
            admin.name = req.body.name;
            admin.email = req.body.email;
            admin.roles = req.body.roles,
            await admin.save();
		    res.json({variant: 'success', message: 'admin updated successfully.'});
        } catch (error) {
            res.json({variant: 'error', message: 'Falied to update admin.'});
        }
    } else {
        res.json({variant: 'error', message: 'Falied to update admin.'});
    }
	
});


/**
 * @route GET /api/admin/admin-user/remove-admin/:id
 * @description Remove admin 
 * @access Public
 */
router.get('/remove-admin/:id', async (req, res) => {
	try {
		const admin = await Admin.findOne({_id: req.params.id});
		await admin.remove();
		res.json({variant: 'success', message: 'admin removed successfully.'});
	} catch (error) {
		res.json({variant: 'error', message: 'Falied to remove admin.'});
	}
});



/**
 * @route GET /api/admin/get-bank-details/get-bank-details
 * @description Get all get-bank-details
 * @access Public
 */

 router.get("/get-bank-details", async (req, res) => {
	const bankDetail = await BankDetail.find(
		{},
		"_id type bankName accountName accountNumber accountType swiftCode ifscCode IBAN"
	);
	if (bankDetail.length > 0) {
		res.json(bankDetail);
	} else {
		res.status(400).json({
			variant: "error",
			message: "No bankDetail found",
		});
	}
});

router.get("/insert-bank-detail", async (req, res) => {
	try {
		await BankDetail.deleteMany({});
		await BankDetail.remove({});
		const data = [{
			type: "INR",
			bankName: 'Kotak Mahindra Bank',
			accountName: 'BITEX TECHNOLOGY INDIA PVT.LTD',
			accountNumber: '3014173135',
			accountType: 'Current',
			ifscCode: 'KKBK0000831',
		}, 
		{
			type: "AED",
			bankName: 'Emirates NBD',
			accountName: 'TRADE BIT COMMERCIAL BROKERS LLC',
			accountNumber: '1015488019101',
			IBAN: 'AE730260001015488019101',
			swiftCode: 'EBILAEAD',
		}];
		await BankDetail.insertMany(data);
		res.json({
			variant: "success",
			message: "BankDetail created successfully.",
		});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to create BankDetail.",
		});
	}
});


/**
 * @route Post /api/admin/create-bank-detail/create-bank-detail
 * @description Create create-bank-detail
 * @access Public
 */
router.post("/create-bank-detail", async (req, res) => {
	const exist = await BankDetail.findOne({ type: req.body.type });
	if (!isEmpty(exist))
		return res
			.status(400)
			.json({ type: "BankDetail already exists." });
	try {
		const data = {
			type: req.body.type,
			bankName: req.body.bankName,
			accountName: req.body.accountName,
			accountNumber: req.body.accountNumber,
			accountType: req.body.accountType,
			swiftCode: req.body.swiftCode,
			ifscCode: req.body.ifscCode,
			IBAN: req.body.IBAN,
		};
		await BankDetail.create(data);
		res.json({
			variant: "success",
			message: "BankDetail created successfully.",
		});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to create BankDetail.",
		});
	}
});
/**
 * @route Post /api/admin//update-bank-detail/:id
 * @description Update /update-bank-detail
 * @access Public
 */
router.post("/update-bank-detail/:id", async (req, res) => {
	const exist = await BankDetail.findOne({
		type: req.body.type,
		_id: { $ne: req.params.id },
	});
	if (!isEmpty(exist))
		return res
			.status(400)
			.json({ type: "Bank-detail already exists." });
	try {
		const data = {
			type: req.body.type,
			bankName: req.body.bankName,
			accountName: req.body.accountName,
			accountNumber: req.body.accountNumber,
			accountType: req.body.accountType,
			swiftCode: req.body.swiftCode,
			ifscCode: req.body.ifscCode,
			IBAN: req.body.IBAN,
		};
		const updatedData = await BankDetail.findOneAndUpdate(
			{ _id: req.params.id },
			data,
			{
				upsert: true,
				new: true,
			}
		);
		if (!isEmpty(updatedData))
			res.json({
				variant: "success",
				message: "BankDetail updated successfully.",
			});
		else
			res.json({
				variant: "error",
				message: "Falied to update BankDetail.",
			});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to update BankDetail.",
		});
	}
});

/**
 * @route GET /api/admin/bankDetail/remove-bank-detail/:id
 * @description Remove bankDetail
 * @access Public
 */
router.delete("/remove-bank-detail/:id", async (req, res) => {
	try {
		const bankDetail = await BankDetail.findOne({
			_id: req.params.id,
		});
		await bankDetail.remove();
		res.json({
			variant: "success",
			message: "bankDetail removed successfully.",
		});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to remove bankDetail.",
		});
	}
});


module.exports = router;