const curl = require("curl");
const path = require("path");
const fs = require("fs");
const express = require("express");
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const keys = require("../../../config/key");

const { isEmpty } = require("lodash");
const Article = require("../../../models/Article");
const User = require("../../../models/User");
const UserIdentity = require("../../../models/UserIdentity");
const UserDepositRequest = require("../../../models/UserDepositRequest");
const ArticleTags = require("../../../models/ArticleTags");
const ArticleCategory = require("../../../models/ArticleCategory");

const slugify = require("slugify");

/**
 * @route GET /api/admin/article/all_article
 * @description Approve user identity
 * @access Public
 */
router.get("/all_article", (req, res) => {
	Article.find({ type: "article" })
		.populate({ path: "articleTags", select: "name" })
		.populate({ path: "category", select: "name" })
		.then(async (article) => {
			return res.json(article);
		})
		.catch((err) => {
			return res.status(400).json({
				variant: "error",
				message: "Something went wrong please try again.",
			});
		});
});

/**
 * @route GET /api/admin/article/all_faq
 * @description Approve user identity
 * @access Public
 */
router.get("/all_faq", (req, res) => {
	Article.find({ type: "faq" })
		.then(async (article) => {
			return res.json(article);
		})
		.catch((err) => {
			return res.status(400).json({
				variant: "error",
				message: "Something went wrong please try again.",
			});
		});
});

/**
 * @route POST /api/admin/article/save_article
 * @description Store Blog
 * @access Public
 */
router.post("/save_article", async (req, res) => {
	let currentFilePath;
	let currentThumbPath;
	let myfile;
	let mythumbnail;
	for (file of req.files) {
		let uniqueImageId = uuidv4();
		let currentFile = file;

		if (currentFile.fieldname === "file") {
			currentFilePath =
				"./storage/images/" +
				uniqueImageId +
				"." +
				/[^.]+$/.exec(currentFile.originalname)[0];
			myfile =
				uniqueImageId +
				"." +
				/[^.]+$/.exec(currentFile.originalname)[0];
			// await saveBuffer(currentFile.buffer, currentFilePath);
			await fs.open(currentFilePath, "w", function (err, fd) {
				if (err) {
					// throw 'could not open file: ' + err;
					// console.log(err);
				}

				// write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
				fs.write(
					fd,
					currentFile.buffer,
					0,
					currentFile.buffer.length,
					null,
					function (err) {
						if (err) {
							// console.log(err)
						}
						fs.close(fd, function () {
							// console.log('wrote the file successfully');
						});
					}
				);
			});
		}

		if (currentFile.fieldname === "thumbnail") {
			currentThumbPath =
				"./storage/images/" +
				uniqueImageId +
				"." +
				/[^.]+$/.exec(currentFile.originalname)[0];
			mythumbnail =
				uniqueImageId +
				"." +
				/[^.]+$/.exec(currentFile.originalname)[0];
			// await saveBuffer(currentFile.buffer, currentThumbPath);
			await fs.open(currentThumbPath, "w", function (err, fd) {
				if (err) {
					// throw 'could not open file: ' + err;
					// console.log(err);
				}

				// write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
				fs.write(
					fd,
					currentFile.buffer,
					0,
					currentFile.buffer.length,
					null,
					function (err) {
						if (err) {
							// console.log(err)
						}
						fs.close(fd, function () {
							// console.log('wrote the file successfully');
						});
					}
				);
			});
		}
	}
	// let currentPath = './storage/images/'+ uniqueImageId +'.'+/[^.]+$/.exec(currentFile.originalname)[0];
	// await saveBuffer(currentFile.buffer, currentPath);
	let name = req.body.name ? req.body.name : "";
	let slug = slugify(name, {
		replacement: "-",
		remove: /[*+~.()'"!:@?]/g,
		lower: true,
		strict: true,
	});

	const articleData = {
		image: myfile,
		thubmnail: mythumbnail,
		name: req.body.name,
		slug: slug,
		caption: req.body.caption ? req.body.caption : "",
		details: req.body.details ? req.body.details : "",
		keywords: req.body.keywords ? req.body.keywords : "",
		description: req.body.description ? req.body.description : "",
		readingTime: req.body.readingTime ? req.body.readingTime : null,
		type: req.body.type ? req.body.type : "article",
		difficultyLevel: req.body.difficultyLevel
			? req.body.difficultyLevel
			: "",
	};
	if (!isEmpty(req.body.category)) {
		articleData["category"] = req.body.category;
	}
	if (!isEmpty(req.body.articleTags)) {
		articleData["articleTags"] = JSON.parse(req.body.articleTags);
	}
	if (!isEmpty(req.body.videoUrl)) {
		articleData["videoUrl"] = req.body.videoUrl;
	}

	const article = new Article(articleData);

	article
		.save()
		.then((articles) => {
			return res.json({
				variant: "success",
				message: `${articles.name} Article created!.`,
			});
		})
		.catch((err) => {
			// console.log(err);
			res.status(400).json({
				variant: "error",
				message: "Something went wrong please try again.",
			});
		});
});

/**
 * @route POST /api/admin/article/update_article
 * @description Store article
 * @access Public
 */
router.post("/update_article", async (req, res) => {
	let currentFilePath;
	let currentThumbPath;
	let myfile;
	let mythumbnail;
	let fileChange = false;
	let thumbnailChange = false;
	// let currentPath = './storage/images/'+ uniqueImageId +'.'+/[^.]+$/.exec(currentFile.originalname)[0];
	// await saveBuffer(currentFile.buffer, currentPath);

	const article = await Article.findOne({ _id: req.body.id });

	if (article) {
		let currentRemovePath = "./storage/images/" + article.image;
		let currentRemoveThumbPath = "./storage/images/" + article.thubmnail;

		if (req.files) {
			for (file of req.files) {
				let uniqueImageId = uuidv4();
				let currentFile = file;

				if (currentFile.fieldname === "file") {
					fileChange = true;
					try {
						fs.unlinkSync(currentRemovePath);
					} catch (err) {
						//
					}
					currentFilePath =
						"./storage/images/" +
						uniqueImageId +
						"." +
						/[^.]+$/.exec(currentFile.originalname)[0];
					myfile =
						uniqueImageId +
						"." +
						/[^.]+$/.exec(currentFile.originalname)[0];
					// await saveBuffer(currentFile.buffer, currentFilePath);
					await fs.open(currentFilePath, "w", function (err, fd) {
						if (err) {
							// throw 'could not open file: ' + err;
							// console.log(err);
						}

						// write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
						fs.write(
							fd,
							currentFile.buffer,
							0,
							currentFile.buffer.length,
							null,
							function (err) {
								if (err) {
									// console.log(err)
								}
								fs.close(fd, function () {
									// console.log('wrote the file successfully');
								});
							}
						);
					});
				}

				if (currentFile.fieldname === "thumbnail") {
					thumbnailChange = true;
					try {
						fs.unlinkSync(currentRemoveThumbPath);
					} catch (err) {
						//
					}
					currentThumbPath =
						"./storage/images/" +
						uniqueImageId +
						"." +
						/[^.]+$/.exec(currentFile.originalname)[0];
					mythumbnail =
						uniqueImageId +
						"." +
						/[^.]+$/.exec(currentFile.originalname)[0];
					// await saveBuffer(currentFile.buffer, currentThumbPath);
					await fs.open(currentThumbPath, "w", function (err, fd) {
						if (err) {
							// throw 'could not open file: ' + err;
							// console.log(err);
						}

						// write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
						fs.write(
							fd,
							currentFile.buffer,
							0,
							currentFile.buffer.length,
							null,
							function (err) {
								if (err) {
									// console.log(err)
								}
								fs.close(fd, function () {
									// console.log('wrote the file successfully');
								});
							}
						);
					});
				}
			}
		}

		let name = req.body.name ? req.body.name : "";
		let slug = slugify(name, {
			replacement: "-",
			remove: /[*+~.()'"!:@?]/g,
			lower: true,
			strict: true,
		});

		if (fileChange) {
			article.image = myfile;
		}
		if (thumbnailChange) {
			article.thubmnail = mythumbnail;
		}

		article.name = req.body.name;
		article.slug = slug;
		article.caption = req.body.caption ? req.body.caption : "";
		article.details = req.body.details ? req.body.details : "";
		article.keywords = req.body.keywords ? req.body.keywords : "";
		article.description = req.body.description ? req.body.description : "";
		article.readingTime = req.body.readingTime ? req.body.readingTime : "";
		article.type = req.body.type ? req.body.type : "article";
		article.difficultyLevel = req.body.difficultyLevel
			? req.body.difficultyLevel
			: "";
		if (!isEmpty(req.body.category)) {
			article.category = req.body.category;
		}
		if (!isEmpty(req.body.articleTags)) {
			articleData.articleTags = JSON.parse(req.body.articleTags);
		}
		if (!isEmpty(req.body.videoUrl)) {
			article.videoUrl = req.body.videoUrl;
		}
		article.save();
		return res.json({
			variant: "success",
			message: `${article.name} Article Updated!.`,
		});
	} else {
		return res.status(400).json({
			variant: "error",
			message: "Something went wrong please try again.",
		});
	}
});

/**
 * @route GET /api/admin/article/remove_article/:articleId
 * @description Remove article.
 * @access Public
 */
router.get("/remove_article/:articleId", async (req, res) => {
	let article = await Article.findOne({ _id: req.params.articleId });
	if (article) {
		let currentPath = "./storage/images/" + article.image;
		let currentThumbPath = "./storage/images/" + article.thubmnail;
		try {
			fs.unlinkSync(currentPath);
			fs.unlinkSync(currentThumbPath);
			article.remove();
		} catch (err) {
			article.remove();
		}
		res.json({ variant: "success", message: "Article removed." });
	} else {
		res.status(400).json({
			variant: "error",
			message: "Failed to remove. Try again.",
		});
	}
});

/**
 * @route POST /api/admin/article/save_image
 * @description Store image
 * @access Public
 */
router.post("/save_image", async (req, res) => {
	let currentFilePath;
	let myfile;

	// console.log("req", req);
	for (file of req.files) {
		let uniqueImageId = uuidv4();
		let currentFile = file;
		// if (currentFile.fieldname === 'file') {
		currentFilePath =
			"./storage/images/" +
			uniqueImageId +
			"." +
			/[^.]+$/.exec(currentFile.originalname)[0];
		myfile =
			uniqueImageId + "." + /[^.]+$/.exec(currentFile.originalname)[0];
		// await saveBuffer(currentFile.buffer, currentFilePath);
		await fs.open(currentFilePath, "w", function (err, fd) {
			if (err) {
				// throw 'could not open file: ' + err;
				// console.log(err);
				res.json({
					variant: "error",
					fileName: myfile,
					message: "something went to wrong.",
				});
			}

			// write the contents of the buffer, from position 0 to the end, to the file descriptor returned in opening our file
			fs.write(
				fd,
				currentFile.buffer,
				0,
				currentFile.buffer.length,
				null,
				function (err) {
					if (err) {
						// console.log(err)
						res.json({
							variant: "error",
							message: "something went to wrong.",
						});
					}
					fs.close(fd, function () {
						res.json({
							variant: "success",
							fileName: myfile,
							message: "file successfully uploaded.",
						});
					});
				}
			);
		});
		// }
	}
});

/**
 * @route GET /api/auth/get-articles
 * @description GET all articles
 * @access Public
 */
router.get("/get-articles", (req, res) => {
	let queryOptions = {};
	if (req.query.search) {
		let searchText = req.query.search;
		queryOptions = {
			$or: [
				{
					name: {
						$regex: searchText,
						$options: "i",
					},
				},
			],
		};
	}
	let sort = {};
	if (req.query.sortColumn) {
		sort[req.query.sortColumn] = req.query.sort === "asc" ? 1 : -1;
	}
	let populateMatch = {};
	if (req.query.filters) {
		req.query.filters.forEach((filter, index) => {
			let fil = JSON.parse(filter);
			if (fil.name === "articleTags") populateMatch["name"] = fil.value;
			else {
				queryOptions[fil.name] = fil.value;
			}
		});
	}
	Article.find(queryOptions)
		.where("articleTags")
		.ne([])
		.sort(sort)
		.populate({
			path: "articleTags",
			match: populateMatch,
		})
		.then((article) => {
			return res.json(article);
		})
		.catch((err) => {
			return res.status(400).json({
				variant: "error",
				message: "Something went wrong please try again.",
			});
		});
});

/**
 * @route GET /api/admin/article/make_feature_article/:articleId
 * @description Remove article.
 * @access Public
 */
router.get("/make_feature_article/:articleId", async (req, res) => {
	let article = await Article.findOne({ _id: req.params.articleId });
	if (article) {
		let featureArticleActive = await Article.findOne({
			featureArticle: true,
		});
		if (featureArticleActive) {
			featureArticleActive.featureArticle = false;
			featureArticleActive.save();
		}
		article.featureArticle = true;
		article.save();
		res.json({
			variant: "success",
			message: "This article make featured!.",
		});
	} else {
		res.status(400).json({
			variant: "error",
			message: "Failed to make featured. Try again.",
		});
	}
});

router.get("/fill-type-existing-article/", async (req, res) => {
	Article.updateMany(
		{ type: null },
		{ type: "article" },
		function (err, docs) {
			if (err) {
				res.status(400).json({
					variant: "error",
					message: "Failed to make featured. Try again.",
				});
			} else {
				res.json({
					variant: "success",
					data: docs,
					message: "articles updated!.",
				});
			}
		}
	);
});

router.get("/get-all-verify-users", async (req, res) => {
	const perPage = req.query.rows ? parseInt(req.query.rows) : 10;
	const page = req.query.page ? parseInt(req.query.page) : 1;
	const skip = page === 1 ? 0 : parseInt(page * perPage);

	const verifiedUsers = await UserIdentity.find({
		submitted: true,
		approve: true,
	}).select("userId");
	let usersIdList = [];
	if (verifiedUsers.length > 0) {
		for (verifiedUser of verifiedUsers) {
			usersIdList.push(verifiedUser.userId);
		}
	}
	const userDepositRequest = await UserDepositRequest.find({
		userId: { $in: usersIdList },
	}).select("userId");
	let userDepositList = [];
	if (userDepositRequest.length > 0) {
		for (userDeposit of userDepositRequest) {
			userDepositList.push(userDeposit.userId);
		}
	}

	usersIdList = usersIdList.filter((val) => !userDepositList.includes(val));
	let allCount = await User.count({ _id: { $in: usersIdList } })
		.where("email")
		.regex(new RegExp(req.query.search, "i"));
	let allVerifiedUsers = await User.find({ _id: { $in: usersIdList } })
		.select("firstname lastname email country")
		.sort({ createdAt: -1 })
		.where("email")
		.regex(new RegExp(req.query.search, "i"))
		.skip(skip)
		.limit(perPage);
	let response = {};
	response["data"] = allVerifiedUsers;
	response["totalCount"] = allCount;
	response["page"] = page;
	return res.json(response);
});
module.exports = router;
