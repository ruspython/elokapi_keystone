var keystone = require('keystone'),
	Types = keystone.Field.Types;

/**
 * Post Model
 * ==========
 */

var Post = new keystone.List('Post', {
	map: {name: 'title'},
	autokey: {path: 'slug', from: 'title', unique: true},
	defaultSort: '-publishedDate'
});

Post.add({
	title: {type: String, required: true},
	state: {type: Types.Select, options: 'draft, published, archived', default: 'draft', index: true},
	author: {type: Types.Relationship, ref: 'User', index: true},
	publishedDate: {type: Types.Datetime, default: Date.now, index: true, dependsOn: {state: 'published'}},
	image: {type: Types.CloudinaryImage},
	content: {
		brief: {type: Types.Html, wysiwyg: true, height: 150},
		extended: {type: Types.Html, wysiwyg: true, height: 400}
	},
	categories: {type: Types.Relationship, ref: 'PostCategory', many: true, required: true, initial: true},
	visits: {type: Types.Number, noedit: true, default: 0},
	url: {type: Types.Url, noedit: true}
});

Post.schema.pre('save', function (next) {
	this.url = process.env.HOST_NAME + 'post/' + this.slug;
	//if (this.content.extended) {
	//	this.content.extended = updateImageSrc(this.content.extended);
	//}
	next();
});

function updateImageSrc(content) {
	var regex = /src="http:\/\/res.cloudinary.com\/[-.\w\/]*"/gi,
		urls = content.match(regex);

	content = content.split(regex).join("[[IMAGE_URL]]");
	if (urls) {
		urls.forEach(function (url, index) {
			content = content.replace('[[IMAGE_URL]]', url.replace('src', 'data-source'));
		});
	}
	return content;
}

Post.schema.virtual('content.full').get(function () {
	return this.content.extended || this.content.brief;
});

Post.defaultColumns = 'title, state|20%, author|20%, publishedDate|20%';
Post.register();
