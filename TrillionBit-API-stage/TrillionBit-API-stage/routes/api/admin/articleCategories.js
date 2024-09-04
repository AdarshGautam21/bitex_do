const express = require('express');
const router = express.Router();
const ArticleCategory = require('../../../models/ArticleCategory');

/**
 * @route GET /api/admin/article-categories/get_article_tags
 * @description Get all article-categories
 * @access Public
 */
router.get('/get_article_categories', async (req, res) => {
	const articleCategory = await ArticleCategory.find();

	if(articleCategory.length > 0) {
		res.json(articleCategory);
	} else {
		res.status(400).json({variant: 'error', message: 'No Categories found'});
	}
});

/**
 * @route GET /api/admin/article-categories/get_article_tags
 * @description Get all article-categories
 * @access Public
 */
router.get('/get_active_article_categories', async (req, res) => {
	const articleCategory = await ArticleCategory.find({active: true});

	if(articleCategory.length > 0) {
		res.json(articleCategory);
	} else {
		res.status(400).json({variant: 'error', message: 'No Categories found'});
	}
});

/**
 * @route Post /api/admin/article-categories/create_article_categories
 * @description Create articles categories
 * @access Public
 */
router.post('/create_article_categories', async (req, res) => {
	const articleCategory = new ArticleCategory({
		name: req.body.name,
		active: (req.body.active) ? req.body.active : false
	});
	articleCategory.save()
	.then(walletBonu => {
		res.json({variant: 'success', message: 'articles categories created successfully.'});
	})
	.catch(err => {
		res.json({variant: 'error', message: 'Falied to create article categories.'});
	});
});
/**
 * @route Post /api/admin/article-categories/:articleCategoryId
 * @description Update Article categories
 * @access Public
 */
router.post('/update_article_categories/:articleCategoryId', async (req, res) => {
	
	const articleCategory = await ArticleCategory.findOne({_id: req.params.articleCategoryId});
	articleCategory.name = req.body.name;
	articleCategory.active = (req.body.active) ? req.body.active : false;
	articleCategory.save()
		.then(articleTag => {
			res.json({variant: 'success', message: 'Article categories updated successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to update Article categories.'});
		});
});


/**
 * @route GET /api/admin/article-categories/remove_article_categories/:articleTagId
 * @description Remove Article categories
 * @access Public
 */
router.get('/remove_article_categories/:articleCategoryId', async (req, res) => {

	const articleCategory = await ArticleCategory.findOne({_id: req.params.articleCategoryId});

	articleCategory.remove()
	.then(articleTag => {
		res.json({variant: 'success', message: ' Article categories removed successfully.'});
	})
	.catch(err => {
		res.json({variant: 'error', message: 'Falied to remove  Article categories.'});
	});
});


/**
 * @route Post /api/admin/article-categories/toggle_article_categories/:articleCategoryId
 * @description Update toggle_article_categories
 * @access Public
 */
router.post('/toggle_article_categories/:articleCategoryId', async (req, res) => {

	const articleCategory = await ArticleCategory.findOne({_id: req.params.articleCategoryId});
	articleCategory.active = !articleCategory.active;
	articleCategory.save()
		.then(articleTag => {
			res.json({variant: 'success', message: ' Article Category updated successfully.'});
		})
		.catch(err => {
			res.json({variant: 'error', message: 'Falied to update Article Category.'});
		});
});

module.exports = router;