var keystone = require('keystone');
var async = require('async');
var utils = require('../utils');

exports = module.exports = function(req, res) {
	var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
	var view = new keystone.View(req, res);
	var locals = res.locals;
	
	// Init locals
	locals.section = 'blog';
	locals.isMainPage = true;
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		posts: [],
		categories: [],
		currentUrl: fullUrl
	};
	
	// Load all categories
	view.on('init', function(next) {
		
		keystone.list('PostCategory').model.find().sort('name').exec(function(err, results) {
			
			if (err || !results.length) {
				return next(err);
			}
			
			locals.data.categories = results;
			
			// Load the counts for each category
			//async.each(locals.data.categories, function(category, next) {
			//	
			//	keystone.list('Post').model.count().where('categories').in([category.id]).exec(function(err, count) {
			//		category.postCount = count;
			//		next(err);
			//	});
			//	
			//}, function(err) {
			//	next(err);
			//});
			next(err);
		});
		
	});
	
	// Load the current category filter
	view.on('init', function(next) {
		
		if (req.params.category) {
			keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function(err, result) {
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
		
	});
	
	// Load the posts
	view.on('init', function(next) {
		
		var q = keystone.list('Post')
			.paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 10
			})
			.where('state', 'published')
			.sort('-publishedDate')
			.populate('categories');
		
		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}
		
		q.exec(function(err, posts) {
			utils.setTimeAgo(posts.results);
			locals.data.posts = posts;
			next(err);
		});
		
	});
	
	// Render the view
	view.render('blog');
	
};
