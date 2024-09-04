const express = require('express');
const router = express.Router();

const BitgoSetting = require('../../models/BitgoSetting');

/**
 * @route POST /api/bitgo-setting/update/:bitgoId
 * @description Get assets update.
 * @access Public
 */
router.get('/update/:bitgoId', (req, res) => {

        BitgoSetting.findOne({ _id: req.params.bitgoId })
        .then( bitgoSetting => {
            if(bitgoSetting) {
                bitgoSetting.live = (bitgoSetting.live) ? false : true;
                bitgoSetting.save();

                res.json({variant: 'success', message: 'Bitgo setting is updated.'});
            } else {
            	const bitgoSetting = new BitgoSetting({
            		live: true,
            	});
            	bitgoSetting.save();
                res.json({variant: 'success', message: 'Bitgo setting is created.'});
            }
        })
        .catch(err => {
        	// console.log(err);
        	const bitgoSetting = new BitgoSetting({
        		live: true,
        	});
        	bitgoSetting.save();
        	res.status(400).json({variant: 'error', message: 'Update error try again later.'})
        });
});

/**
 * @route POST /api/bitgo-setting/get
 * @description Get assets update.
 * @access Public
 */
router.get('/get', (req, res) => {

        BitgoSetting.find()
        .then( bitgoSettings => {
            if(bitgoSettings.length > 0) {
                res.json(bitgoSettings[0]);
            } else {
                res.status(400).json({variant: 'error', message: 'Bitgo setting not found.'});
            }
        });
});

module.exports = router;