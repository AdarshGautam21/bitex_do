const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const BlogSchema = new Schema({
	name: {
		type: String,
		require: true
	},
	caption: {
		type: String,
		require: true
	},
	details: {
		type: String,
		require: false
    },
    thubmnail: {
		type: String,
		require: false
    },
    image: {
		type: String,
		require: false
    },
    keywords: {
		type: String,
		require: false
    },
    description: {
		type: String,
		require: false
	},
	date: {
		type: Date,
		default: Date.now
	}
});

module.exports = Blog = mongoose.model("blogs", BlogSchema);