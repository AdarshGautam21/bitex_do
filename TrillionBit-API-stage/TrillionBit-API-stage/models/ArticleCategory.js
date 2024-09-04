const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ArticleCategorySchema = new Schema({
	name: {
		type: String,
		require: true
	},
	active: {
		type: Boolean,
		default: true,
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

module.exports = ArticleCategory = mongoose.model("article_categories", ArticleCategorySchema);