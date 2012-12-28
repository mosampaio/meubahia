function parseRSS(url, callback) {
	$.ajax({
		url: 'http://ajax.googleapis.com/ajax/services/feed/load?v=1.0&num=10&callback=?&q=' + encodeURIComponent(url),
		dataType: 'json',
		success: function(data) {
		  callback(data.responseData.feed);
		}
    });
}
function loadNews() {
    $.getJSON(document.location.protocol + '//' + document.location.hostname + ':' + document.location.port + '/news/', 
        function(data) { 
			$.each(data, function(index, value) { 
				$('<p><a href="'+value.link+'" title="'+value.title+'">' + value.contentSnippet + '</p><hr/>').appendTo('.news');
			});
		}
	);
}
function loadTwitter() {
	$.getJSON(document.location.protocol + '//' + document.location.hostname + ':' + document.location.port + '/tweets/', 
		function(data) { 
			$.each(data, function(index, value) { 
				$('<p><a href="http://twitter.com/'+value.from_user+'" title="'+value.from_user_name+'"">@'+value.from_user+'</a> '+linkify_text(value)+'</p><hr/>').appendTo('.twitter');
			});
		}
	);
}
function loadBlogs() {
    $.getJSON(document.location.protocol + '//' + document.location.hostname + ':' + document.location.port + '/blogs/', 
    	function(data) { 
			$.each(data, function(index, value) { 
				$('<p><a href="'+value.link+'" title="'+value.title+'">' + value.contentSnippet + '</p><hr/>').appendTo('.blogs');
			});
		}
	);
}

function escapeHTML(text) {
    return $('<div/>').text(text).html()
}
 
function linkify_text(tweet) {
    if (!(tweet.entities)) {
        return escapeHTML(tweet.text)
    }
    
    var index_map = {}
    
    $.each(tweet.entities.urls, function(i,entry) {
        index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a href='"+escapeHTML(entry.url)+"'>"+escapeHTML(text)+"</a>"}]
    })
    
    $.each(tweet.entities.hashtags, function(i,entry) {
        index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a href='http://twitter.com/search?q="+escape("#"+entry.text)+"'>"+escapeHTML(text)+"</a>"}]
    })
    
    $.each(tweet.entities.user_mentions, function(i,entry) {
        index_map[entry.indices[0]] = [entry.indices[1], function(text) {return "<a title='"+escapeHTML(entry.name)+"' href='http://twitter.com/"+escapeHTML(entry.screen_name)+"'>"+escapeHTML(text)+"</a>"}]
    })
    
    var result = ""
    var last_i = 0
    var i = 0
    
    for (i=0; i < tweet.text.length; ++i) {
        var ind = index_map[i]
        if (ind) {
            var end = ind[0]
            var func = ind[1]
            if (i > last_i) {
                result += escapeHTML(tweet.text.substring(last_i, i))
            }
            result += func(tweet.text.substring(i, end))
            i = end - 1
            last_i = end
        }
    }
    
    if (i > last_i) {
        result += escapeHTML(tweet.text.substring(last_i, i))
    }
    
    return result
}