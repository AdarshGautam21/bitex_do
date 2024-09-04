const express = require('express');
const router = express.Router();
const ArticleTags = require('../../../models/ArticleTags');

/**
 * @route GET /api/admin/article-tags/get_article_tags
 * @description Get all article-tags
 * @access Public
 */
router.get('/get_article_tags', async (req, res) => {
	const articleTags = await ArticleTags.find();

	if(articleTags.length > 0) {
		res.json(articleTags);
	} else {
		res.status(400).json({variant: 'error', message: 'No Tags found'});
	}
});

/**
 * @route GET /api/admin/article-tags/get_article_tags
 * @description Get all article-tags
 * @access Public
 */
router.get('/get_active_article_tags', async (req, res) => {
	const articleTags = await ArticleTags.find({active: true});

	if(articleTags.length > 0) {
		res.json(articleTags);
	} else {
		res.status(400).json({variant: 'error', message: 'No Tags found'});
	}
});

/**
 * @route Post /api/admin/article-tags/create_article_tags
 * @description Create articles tags
 * @access Public
 */
router.post('/create_article_tags', async (req, res) => {
	const articleTags = new ArticleTags({
		name: req.body.name,
		active: (req.body.active) ? req.body.active : false
	});
	articleTags.save()
	.then(walletBonu => {
		res.json({variant: 'success', message: 'articles tags created successfully.'});
	})
	.catch(err => {
		res.json({variant: 'error', message: 'Falied to create article tags.'});
	});
});
/**
 * @route Post /api/admin/article-tags/update_wallet_bonus/:articleTagId
 * @description Update Article tags
 * @access Public
 */
router.post('/update_article_tags/:articleTagId', async (req, res) => {
	
	const articleTags = await ArticleTags.findOne({_id: req.params.articleTagId});
	articleTags.name = req.body.name;
	articleTags.active = (req.body.active) ? req.body.active : false;
	articleTags.save()
		.then(articleTag => {
			res.json({variant: 'success', message: 'Article tags updated successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to update Article tags.'});
		});
});


/**
 * @route GET /api/admin/article-tags/remove_article_tags/:articleTagId
 * @description Remove Article tags
 * @access Public
 */
router.get('/remove_article_tags/:articleTagId', async (req, res) => {

	const articleTags = await ArticleTags.findOne({_id: req.params.articleTagId});

	articleTags.remove()
	.then(articleTag => {
		res.json({variant: 'success', message: ' Article tags removed successfully.'});
	})
	.catch(err => {
		res.json({variant: 'error', message: 'Falied to remove  Article tags.'});
	});
});


/**
 * @route Post /api/admin/article-tags/toggle_article_tags/:articleTagId
 * @description Update toggle_article_tags
 * @access Public
 */
router.post('/toggle_article_tags/:articleTagId', async (req, res) => {

	const articleTags = await ArticleTags.findOne({_id: req.params.articleTagId});
	articleTags.active = !articleTags.active;
	articleTags.save()
		.then(articleTag => {
			res.json({variant: 'success', message: ' Article tags updated successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to update Article tags.'});
		});
});

module.exports = router;