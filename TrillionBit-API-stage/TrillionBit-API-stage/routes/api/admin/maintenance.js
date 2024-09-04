const express = require("express");
const router = express.Router();
const Maintenance = require("../../../models/maintenance/Maintenance");
const BankDetail = require('../../../models/BankDetail');

const isEmpty = require("../../../validation/isEmpty");

/**
 * @route GET /api/admin/maintenance/maintenance
 * @description Get all maintenance
 * @access Public
 */

router.get("/get-maintenance", async (req, res) => {
	const maintenance = await Maintenance.find();
	if (maintenance.length > 0) {
		res.json(maintenance);
	} else {
		res.status(400).json({
			variant: "error",
			message: "No maintenance found",
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

router.get("/insert-maintenance", async (req, res) => {
	await Maintenance.deleteMany({});
	await Maintenance.remove({});
	let insertData = [{
        type: "WEB APP",
        maintenance: false,
    },
    {
        type: "ANDROID APP",
        maintenance: false,
    },
    {
        type: "IOS APP",
        maintenance: false,
    }];

	const maintenance = await Maintenance.insertMany(insertData);
	if (maintenance.length > 0) {
		res.json(maintenance);
	} else {
		res.status(400).json({
			variant: "error",
			message: "No maintenance found",
		});
	}
});

/**
 * @route Post /api/admin/maintenance/toggle-active-trading-maintenance/:id
 * @description Update toggle-active-trading-maintenance
 * @access Public
 */
router.post("/toggle-maintenance/:id", async (req, res) => {
	try {
		const maintenance = await Maintenance.findOne({
			_id: req.params.id,
		});
		maintenance["maintenance"] = !maintenance["maintenance"];
		await maintenance.save();
		res.json({
			variant: "success",
			message: "maintenance updated successfully.",
		});
	} catch (error) {
		res.json({
			variant: "error",
			message: "Falied to remove maintenance.",
		});
	}
});

module.exports = router;
