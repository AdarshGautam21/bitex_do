const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Schema = mongoose.Schema;

// Create Schema
const ArticleSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	slug: {
		type: String,
		require: true
	},
	type: {
		type: String,
		default: 'article'
	},
	caption: {
		type: String,
		require: true
	},
	details: {
		type: String,
		require: false,
		default: null

    },
	readingTime: {
		type: Number,
		require: false,
		default: null

    },
	difficultyLevel: {
		type: String,
		require: false,
		default: null

	},
	category: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "article_categories",
		default: null
	},
	articleTags: [
		{
		  type: mongoose.Schema.Types.ObjectId,
		  ref: "article_tags",
		  default: null
		}
	],
	featureArticle: {
		type: Boolean,
		default: false,
	},
    thubmnail: {
		type: String,
		require: false,
		default: null

    },
    image: {
		type: String,
		require: false,
		default: null

    },
    keywords: {
		type: String,
		require: false,
		default: null

    },
    description: {
		type: String,
		require: false,
		default: null
	},
    videoUrl: {
		type: String,
		require: false,
		default: null
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

ArticleSchema.set('timestamps', true); 
ArticleSchema.plugin(mongoosePaginate);
module.exports = Article = mongoose.model("article", ArticleSchema);