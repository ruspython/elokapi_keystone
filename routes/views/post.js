var keystone = require('keystone');
var async = require('async');
var utils = require('../utils');

exports = module.exports = function(req, res) {
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Set locals
	locals.section = 'blog';
	locals.filters = {
		post: req.params.post
	};
	locals.data = {
		posts: [],
		categories: [],
		currentUrl: fullUrl
	};
	
	// Load the current post
	view.on('init', function(next) {
		var q = keystone.list('Post').model.findOne({
			slug: locals.filters.post
		}).populate('categories');
		
		q.exec(function(err, post) {
			post.visits += 1;
			post.whatsappLink = 'whatsapp://send?text=' + post.title + ' : ' + fullUrl;
			post.save();
			utils.setTimeAgo(post);
			locals.data.post = post;
			next(err);
		});
		console.log(fullUrl)
	});
	
	// Load other posts
	view.on('init', function(next) {
		
		var q = keystone.list('Post').model
			.find({'_id': {'$ne': locals.data.post._id}})
			.where('state', 'published')
			.sort('-publishedDate')
			.limit('4');
		q.exec(function(err, posts) {
			utils.setTimeAgo(posts);
			locals.data.posts = posts;
			next(err);
		});
	});

	// Load all categories
	view.on('init', function(next) {

		keystone.list('PostCategory').model.find().sort('name').exec(function(err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = results;

			// Load the counts for each category
			async.each(locals.data.categories, function(category, next) {

				keystone.list('Post').model.count().where('categories').in([category.id]).exec(function(err, count) {
					category.postCount = count;
					next(err);
				});

			}, function(err) {
				next(err);
			});

		});

	});
	
	// Render the view
	view.render('post');

	function setTimeAgo(posts) {
		var postTime;
		if (!(posts instanceof  Array)) {
			postTime = new Date(posts.publishedDate);
			posts.timeAgo = getMessageByHoursDiff(postTime);
			return;
		}
		posts.forEach(function (post, index, arr) {
			postTime = new Date(post.publishedDate);
			post.timeAgo = getMessageByHoursDiff(postTime);
		});
	}

	function getMessageByHoursDiff(postTime) {
		var res,
			MILLS_IN_HOUR = 1000 * 60 * 60,
			now = new Date(),
			YESTERDAY = new Date(now.getYear(), now.getMonth(), now.getDate() - 1),
			diff = now.getTime() - postTime.getTime(),
			hoursDiff = diff / MILLS_IN_HOUR
			;
		if (hoursDiff < 0) {
			res = "In future";
		} else if (hoursDiff <= 2) {
			res = "Just now";
		} else if ((hoursDiff <= 48) && (postTime.getDate() == YESTERDAY.getDate())) {
			res = "Yesterday";
		} else if (hoursDiff <= now.getHours() + 24) {
			res = Math.floor(hoursDiff) + " hours ago";
		} else {
			res = Math.ceil(hoursDiff / 24) + " days ago";
		}
		return res;
	}
	
};
