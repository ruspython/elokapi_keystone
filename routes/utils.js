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

exports = module.exports = {
	setTimeAgo: function(posts) {
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
		return posts;
	}
};
