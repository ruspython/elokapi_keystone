var async = require('async'),
	keystone = require('keystone'),
	utils = require('../utils');


var Post = keystone.list('Post'),
	PostCategory = keystone.list('PostCategory')
	;

/**
 * List Posts
 */
exports.all = function (req, res) {
	var skip = req.query.skip || 0,
		limit = req.query.limit || 0,
		categoryKey = req.query.categoryKey || "",
		querySet = Post.model.find({state: 'published'}).populate('categories').sort({publishedDate: 'desc'})
		;

	if (categoryKey) {
		PostCategory.model.findOne().where('key', categoryKey).exec(function (err, category) {
			if (category) {
				querySet.where('categories').in([category.id]);
			}
			finishQuerySet();
		});
	} else {
		finishQuerySet();
	}

	function finishQuerySet() {
		querySet
			.skip(skip)
			.limit(limit)
			.exec(function (err, items) {
				if (err) return res.apiError('database error', err);
				res.json(items);
			});
	}

};
