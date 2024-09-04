const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ArticleTagsSchema = new Schema({
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

module.exports =  ArticleTags = mongoose.model("article_tags", ArticleTagsSchema);