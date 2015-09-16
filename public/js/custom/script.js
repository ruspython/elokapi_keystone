(function () {
    var skip, limit, inc, busyLoading = false, finished = false;
    $(document).ready(function () {
        var article = $('article.article-content');
        onPageLoad();
        changeUi();

        if (article.length) {
            addAdsense(article);
        }

    });

    initInc();
    // Infinite scroll
    $(window).scroll(function () {
        var isMainPage = !!$('#main-content').length;
        if (($(window).scrollTop() == $(document).height() - $(window).height()) && isMainPage && !busyLoading && !finished) {
            busyLoading = true;
            $('#preloader').show();
            $.ajax({
                url: "/api/posts",
                data: {
                    limit: limit,
                    skip: skip
                },
                success: function (posts) {
                    console.log(posts);

                    $('#preloader').hide();
                    skip += inc;
                    busyLoading = false;
                    if (posts.length < inc) {
                        finished = true;
                    }
                    appendPosts(posts, $('#main-content').find('.main-article-content > .columns'));
                }
            });
        }
    });

    function initInc() {
        skip = 10;
        limit = 3;
        inc = 3;
    }

    function appendPosts(posts, $parent) {
	    setTimeAgo(posts);
        posts.forEach(function (post) {
            $('#preloader').before(
                '<article class="card card-split color-omg" style="border-color: ' + post.categories[0].color + ' ">' +
                '<a href="post/' + post.slug + '">' +
                '<div class="split-image"' +
                'style="background-image:url();">' +
                '</div>' +
                '<div class="header-info">' +
                '<h1>' + post.title + '</h1>' +
                '</div>' +
                '<div class="card-meta-data clearfix">' +
                '<span class="visitas">' + post.visits + '</span>' +
                '<time class="time-ago">' + post.timeAgo + '</time>' +
                '</div>' +
                '</a>' +
                '</article>'
            )
        });
    }

    // END Infinite scroll

    function addAdsense($elem) {
        var $headers = $elem.find('h2, h3, h4, h5, h6'),
            BreakException = {},
            adSlots = ['2348713285', '3825446483', '5302179685'];

        try {
            $headers.each(function (index) {
                if (index === 3) throw BreakException;
                $(this).after("<div class='adsense_ad'><ins class='adsbygoogle' style='display:inline-block;width:336px;height:280px' data-ad-client='ca-pub-3833845702235676' data-ad-slot='" + adSlots[index] + "'></ins></div>");
                refreshAdsense();
            });
        } catch (e) {
            if (e !== BreakException) throw e;
        }
        function refreshAdsense() {
            (adsbygoogle = window.adsbygoogle || []).push({});
        }

    }

    function changeUi() {
        var MIN_WIDTH = 768,
            width = (window.innerWidth < MIN_WIDTH) ? 'w_' + Math.round(window.innerWidth / 2) : null,
            src,
            tmpArr
            ;

        $('iframe[src^="https://www.youtube.com"]').wrap('<div class="video-container"/>');
        $('a[title="resource"]').parent('p').addClass('wp-caption-text');
        $('p:has(a[title="resource"])').prev().css('margin', '0px');
    }

    function onPageLoad() {
        var
            scripts = [
                //'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js'
            ];

        loadExtraContent('script', scripts);
        loadFacebookModules();

        function loadExtraContent(elemTag, content) {
            var elem = document.createElement(elemTag);
            content.forEach(function (link) {
                if (elemTag == 'script') {
                    elem.src = link;
                } else if (elemTag == 'link') {
                    elem.href = link;
                }
                document.getElementsByTagName('head')[0].appendChild(elem);
            });

        }

        function loadFacebookModules() {
            (function (d, s, id) {
                var js, fjs = d.getElementsByTagName(s)[0];
                if (d.getElementById(id)) return;
                js = d.createElement(s);
                js.id = id;
                js.src = "//connect.facebook.net/es_ES/sdk.js#xfbml=1&version=v2.4&appId=1702813169949091";
                fjs.parentNode.insertBefore(js, fjs);
            }(document, 'script', 'facebook-jssdk'));
        }
    }

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
	
	function isMobile() {
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
	}

	jQuery(window).scroll(function (event) {
		if (jQuery(this).scrollTop() > 200) {
			jQuery('.static-share-header').css({
				transform: 'translateX(0px) translateY(0px)',
				transition: 'transform 500ms'
			});
		} else {
			jQuery('.static-share-header').css({
				transform: 'translateX(0px) translateY(-71px)',
				transition: 'transform 500ms'
			});
		}
	});
})();
