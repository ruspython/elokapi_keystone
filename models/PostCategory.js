var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * PostCategory Model
 * ==================
 */

var PostCategory = new keystone.List('PostCategory', {
	autokey: {
		from: 'name',
		path: 'key',
		unique: true
	}
});

PostCategory.add({
	name: {
		type: String,
		required: true
	},
	color: {
		type: Types.Color,
		initial: '#FC4568',
		required: true
	}
});

PostCategory.relationship({
	ref: 'Post',
	path: 'categories'
});

PostCategory.register();
