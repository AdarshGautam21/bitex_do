const express = require('express');
const router = express.Router();
const curl = require('curl');
// const saveBuffer = require('save-buffer');
const User = require('../../models/User');
const UserWallet = require('../../models/UserWallet');
const BitexSavingUserWallet = require('../../models/bitexSaving/BitexSavingUserWallet');
const BitexSavingUserWalletHistory = require('../../models/bitexSaving/BitexSavingUserWalletHistory');
const BitexSaving = require('../../models/bitexSaving/BitexSaving');
const BitexSavingCoin = require('../../models/bitexSaving/BitexSavingCoin');

const isEmpty = require('../../validation/isEmpty');
const keys = require('../../config/key');
/**
 * @route GET /api/user/active-bitex-saving-wallets/:userId
 * @description Get user active wallets info object.
 * @access Public
 */

router.get('/active-bitex-saving-wallets/:userId', (req, res) => {
	let _id = req.params.userId;
	Assets.find({
			active: true,
			fiat: false
		})
		.sort({
			priority: 1
		})
		.then(async assets => {
			if (assets.length > 0) {
				let activeAssets = [];
				let activeCurrentAssets = [];
				for (let i = 0; i < assets.length; i++) {
					if (assets[i].active) {
						if (!activeCurrentAssets.includes(assets[i].name)) {
							activeAssets.push(assets[i]);
							activeCurrentAssets.push(assets[i].name);
						}
					}
				}

				const user = await User.findOne({
					_id: _id
				});

				for (var j = 0; j < activeAssets.length; j++) {
					let asset = activeAssets[j];
					let assetName = asset.name;
					let bitexSavingUserActiveWallet = [];
					const bitexSavingUserWallet = await BitexSavingUserWallet.findOne({
						userId: user._id,
						coin: assetName
					});
					bitexSavingUserActiveWallet[j] = bitexSavingUserWallet;
					if (isEmpty(bitexSavingUserWallet)) {
						const newBitexSavingUserWallet = new BitexSavingUserWallet;
						newBitexSavingUserWallet.userId = user._id;
						newBitexSavingUserWallet.user = user._id;
						newBitexSavingUserWallet.coin = assetName;
						newBitexSavingUserWallet.walletAmount = 0;
						newBitexSavingUserWallet.walletFreezAmount = 0;
						newBitexSavingUserWallet.fiat = false;
						newBitexSavingUserWallet.active = true;
						await newBitexSavingUserWallet.save();
						bitexSavingUserActiveWallet[j] = newBitexSavingUserWallet;
					}
				}
				res.json(bitexSavingUserActiveWallet);
			} else {
				res.status(400).json({
					variant: 'error',
					message: 'No assets found'
				});
			}
		})
		.catch(err => {
			// console.log(err);
		})
});

router.post('/create-saving-wallet-history', async (req, res) => {

	const userId = req.body.userId;
	const amount = req.body.amount;
	User.findOne({_id: userId})
  	.then(async user => {
  		if(user) {
			const userWallet = await UserWallet.findOne({userId: userId, coin: req.body.coin, active: true});

			if (userWallet) {
				if(parseFloat(amount) > parseFloat(userWallet.walletAmount)) {
					return res.json({variant: "error", message: `You do not have enough balance to transfer.`});
				} 
						
				let ms = new Date().getTime() + 86400000 * parseInt(req.body.durationDay);
				// const date  = dt.setDate( dt.getDate() + parseInt(req.body.durationDay));
				const date = new Date(ms);
				
				const newBitexSavingUserWalletHistory = BitexSavingUserWalletHistory({
					coin: req.body.coin,
					userId:  req.body.userId,
					user:  req.body.userId,
					annualizedInterestRate: req.body.annualizedInterestRate,
					lockDay: req.body.durationDay,
					durationDay: '0',
					redemptionDate: date,
					interestAmount: req.body.interestAmount,
					totalAmount: req.body.totalAmount,
					amount: amount,
					status: 'transfer'
							});
	
				newBitexSavingUserWalletHistory.save().then(async order => {
					const params = [
						user.viabtcUserId,
						userWallet.coin,
						'deposit',
						new Date().getTime(),
						'-'+amount,
						{}
					];
	
					const postParamas = {
							method: 'balance.update',
							params: params,
							id: 1516681174
					}
	
					curl.post(keys.tradingURI, JSON.stringify(postParamas), {}, async function(err, response, body) {
						if (JSON.parse(body).result) {
							if(JSON.parse(body).result.status === 'success') {
								userWallet.walletAmount = (parseFloat(userWallet.walletAmount) - parseFloat(amount)).toFixed(8);
								await userWallet.save();
								// console.log(userWallet);
								const bitexSavingUserWallet = await BitexSavingUserWallet.findOne({userId: userId, coin: req.body.coin, active: true});
								bitexSavingUserWallet.walletAmount = (parseFloat(bitexSavingUserWallet.walletAmount) + parseFloat(amount)).toFixed(8);
								await bitexSavingUserWallet.save();
				
								const bitexSaving = await BitexSaving.findOne({coin: 'USD'});
								if(!isEmpty(bitexSaving)) {
									bitexSaving.totalLendAmount = (parseFloat(bitexSaving.totalLendAmount) + parseFloat(req.body.usdPrice)).toFixed(8);
									await bitexSaving.save();
								}
				
								res.json({variant: 'success', bitexSavingUserWalletHistory: newBitexSavingUserWalletHistory,  message: `${ req.body.coin} successfully transfer.`});
							} else {
								res.json({variant: "error", message: "Transfer not complete. Please contact to the support immaditely."});
							}
						} else {
							res.json({variant: "error", message: "Transfer not complete. Please contact to the support immaditely."});
						}
					});
				}).catch(err => {
					// console.log("err",err);
					res.json({variant: "error", message: "Transfer not complete"});
	
				})
			} else {
				res.json({variant: "error", message: "Transfer not complete"});
			}
		}
	})
	.catch(err => {
		res.json({variant: "error", message: "Something went to wrong.!"})
	})

});

router.get('/bitex-saving-wallets-history/:userId',async (req, res) => {
	let _id = req.params.userId;
	const bitexSavingUserWalletHistory = await BitexSavingUserWalletHistory.find({userId: _id});
	res.json({variant: 'success', data: bitexSavingUserWalletHistory});
});


router.post('/reedem-bitex-saving/', async (req, res) => {
	const userId = req.body.userId;
	const bitexSavingUserWalletHistoryId = req.body.bitexSavingUserWalletHistoryId;
	let ms = new Date().getTime() - 86400000 * parseInt(7);
	const date = new Date(ms);
	const bitexSavingUserWalletHistory = await BitexSavingUserWalletHistory.findOne({_id: bitexSavingUserWalletHistoryId, createdAt: {$lte: date}});
	if(!isEmpty(bitexSavingUserWalletHistory)) {
		const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
		const firstDate = new Date(bitexSavingUserWalletHistory.createdAt);
		const secondDate = new Date();
		const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
		const bitexSavingCoin = await BitexSavingCoin.findOne({coin: bitexSavingUserWalletHistory.coin});
		if(!isEmpty(bitexSavingCoin)) {
			let annualizedInterestRate = 0;
			if(parseInt(bitexSavingUserWalletHistory.lockDay) > parseInt(diffDays)) {
				const lastShapeIndex = bitexSavingCoin.days.reduce((acc, day, index) => (
					parseInt(day.numberOfDays) <= parseInt(diffDays) ? index : acc
				), -1);
				if(!isEmpty(bitexSavingCoin.days[lastShapeIndex])) {
					annualizedInterestRate = bitexSavingCoin.days[lastShapeIndex].interestRate;
				} 
			} else {
				const lockDay = bitexSavingCoin.days.find(day => (parseInt(day.numberOfDays) === parseInt(bitexSavingUserWalletHistory.lockDay)));
				if(!isEmpty(lockDay)) annualizedInterestRate = lockDay.interestRate;
			}
			const interestInDays = ((parseFloat(annualizedInterestRate)/365) * parseFloat(diffDays)).toFixed(6);
			const interestAmount = (parseFloat(interestInDays)/100) * parseFloat(bitexSavingUserWalletHistory.amount).toFixed(6); 
			const totalAmount = parseFloat(bitexSavingUserWalletHistory.amount) + interestAmount;

			// console.log("interest:  ",interestInDays, interestAmount, totalAmount);
			bitexSavingUserWalletHistory.interestAmount = interestAmount;
			bitexSavingUserWalletHistory.totalAmount = totalAmount;
			bitexSavingUserWalletHistory.durationDay = diffDays;
			bitexSavingUserWalletHistory.status = 'finished';
			// bitexSavingUserWalletHistory.annualizedInterestRate = annualizedInterestRate;
			bitexSavingUserWalletHistory.redemptionDate = new Date();
			
			await bitexSavingUserWalletHistory.save();

			const userWallet = await UserWallet.findOne({userId: userId, coin: bitexSavingUserWalletHistory.coin, active: true});
			
			if (userWallet) {
				const user = await User.findOne({'_id': userId});
				const params = [
					user.viabtcUserId,
					userWallet.coin,
					'deposit',
					new Date().getTime(),
					''+totalAmount,
					{}
				];
	
				const postParamas = {
					method: 'balance.update',
					params: params,
					id: 1516681174
				}
	
				curl.post(keys.tradingURI, JSON.stringify(postParamas), {}, async function(err, response, body) {
					if (JSON.parse(body).result) {
						if(JSON.parse(body).result.status === 'success') {
							userWallet.walletAmount = (parseFloat(userWallet.walletAmount) + parseFloat(totalAmount)).toFixed(8);
							await userWallet.save();
							const bitexSavingUserWallet = await BitexSavingUserWallet.findOne({userId: userId, coin: bitexSavingUserWalletHistory.coin, active: true});
							bitexSavingUserWallet.walletAmount = (parseFloat(bitexSavingUserWallet.walletAmount) - parseFloat(bitexSavingUserWalletHistory.amount)).toFixed(8);
							await bitexSavingUserWallet.save();
				
							res.json({variant: 'success', message: `${ bitexSavingUserWalletHistory.coin} Amount withdrawal successfull.`});
						} else {
							return res.json({variant: 'error', message: "something went wrong! Please contact to the support immadiatly"});
						}
					} else {
						return res.json({variant: 'error', message: "something went wrong! Please contact to the support immadiatly"});
					}
				});
			} else {
				return res.json({variant: 'error', message: "something went wrong!"});
			}
			
		} else {
			return res.json({variant: 'error', message: "something went wrong!"});
		}
	} else {
		res.json({variant: 'error', message: "Amount withdrawn before minimum lock in period!"});
	}

});

router.post('/validate-reedem-bitex-saving/', async (req, res) => {
	const userId = req.body.userId;
	const bitexSavingUserWalletHistoryId = req.body.bitexSavingUserWalletHistoryId;
	let ms = new Date().getTime() - 86400000 * parseInt(7);
	const date = new Date(ms);
	const bitexSavingUserWalletHistory = await BitexSavingUserWalletHistory.findOne({_id: bitexSavingUserWalletHistoryId, createdAt: {$lte: date}});
	if(!isEmpty(bitexSavingUserWalletHistory)) {

		const oneDay = 24 * 60 * 60 * 1000;
		const firstDate = new Date(bitexSavingUserWalletHistory.createdAt);
		const secondDate = new Date();
		const diffDays = Math.round(Math.abs((firstDate - secondDate) / oneDay));
		
		const bitexSavingCoin = await BitexSavingCoin.findOne({coin: bitexSavingUserWalletHistory.coin});
		if(!isEmpty(bitexSavingCoin)) {
			let annualizedInterestRate = 0;
			if(parseInt(bitexSavingUserWalletHistory.lockDay) > parseInt(diffDays)) {
				const lastShapeIndex = bitexSavingCoin.days.reduce((acc, day, index) => (
					parseInt(day.numberOfDays) <= parseInt(diffDays) ? index : acc
				), -1);
				if(!isEmpty(bitexSavingCoin.days[lastShapeIndex])) {
					annualizedInterestRate = bitexSavingCoin.days[lastShapeIndex].interestRate;
				} 
			} else {
				const lockDay = bitexSavingCoin.days.find(day => (parseInt(day.numberOfDays) === parseInt(bitexSavingUserWalletHistory.lockDay)));
				if(!isEmpty(lockDay)) annualizedInterestRate = lockDay.interestRate;
			}
			const interestInDays = ((parseFloat(annualizedInterestRate)/365) * parseFloat(diffDays)).toFixed(8);
			const interestAmount = (parseFloat(interestInDays)/100) * parseFloat(bitexSavingUserWalletHistory.amount).toFixed(8); 
			const totalAmount = parseFloat(bitexSavingUserWalletHistory.amount) + interestAmount;
			const data = {
				annualizedInterestRate : annualizedInterestRate,
				bitexSavingUserWalletHistoryId: bitexSavingUserWalletHistory._id,
				coin: bitexSavingUserWalletHistory.coin,
				days: diffDays,
				amount: bitexSavingUserWalletHistory.amount,
				lockDay: (bitexSavingUserWalletHistory.lockDay),
				interestAmount: interestAmount,
				totalAmount: totalAmount,
			}
			res.json({variant: 'success', data: data });

		} else {
			return res.json({variant: 'error', message: "something went wrong!"});
		}
	} else {
		res.json({variant: 'error', message: "Amount withdrawn before minimum lock in period!"});
	}
	
});



router.post('/change-created-at-date', async (req, res) => {
	const _id = req.body.id;
	const days = req.body.days;
	const bitexSavingUserWalletHistory = await BitexSavingUserWalletHistory.findOne({_id: _id});
	let ms = new Date(bitexSavingUserWalletHistory.createdAt).getTime() - 86400000 * parseInt(days);
	const date = new Date(ms);
	bitexSavingUserWalletHistory.createdAt = date;
	await bitexSavingUserWalletHistory.save();
	res.json({variant: 'success', data: bitexSavingUserWalletHistory});
});

router.post('/dummy-bitex-saving-lend-amount', async (req, res) => {
	const bitexSaving = await BitexSaving.findOne({coin: 'USD'});
	if(isEmpty(bitexSaving)) { 
		const newBitexSaving = BitexSaving({
			coin: 'USD',
			totalLendAmount: '785600'
		});
		newBitexSaving.save().then(bitexSaving => {
			res.json({variant: 'success', data: bitexSaving});
		});
	}
	res.json({variant: 'success', data: bitexSaving});
});

router.post('/get-bitex-land-amount', async (req, res) => {
	const bitexSaving = await BitexSaving.findOne({coin: 'USD'});
	res.json({variant: 'success', data: bitexSaving});
});



module.exports = router;