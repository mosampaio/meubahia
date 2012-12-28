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
	var url = 'http://globoesporte.globo.com/servico/semantica/editorias/plantao/futebol/times/bahia/feed.rss';
	parseRSS(url, function(data){
		addParagraphs(data.link, data.entries, '.news');
	});
}
function loadTwitter() {
	$.getJSON(document.location.protocol + '//' + document.location.hostname + ':' + document.location.port + '/tweets/', 
		function(data) { 
			$.each(data, function(index, value) { 
				$('<p><a target="_blank" href="http://twitter.com/'+value.from_user+'" title="'+value.from_user_name+'"">@'+value.from_user+'</a> '+linkify_text(value)+'</p><hr/>').appendTo('.twitter');
			});
		}
	);
}
function loadBlogs() {
	var urls = [
		'http://www.bbmp.com.br/?feed=rss2', 
		'http://globoesporte.globo.com/platb/ba-torcedor-bahia/feed/',
		'http://www.semprebahia.com/feed/atom/',
		'http://feeds.feedburner.com/bahiaco'
	];
	$.each(urls, function(index, url) { 
		parseRSS(url, function(data){
			addParagraphs(data.link, data.entries.slice(0,2), '.blogs');
		});
	});
}
function addParagraphs(source, entries, mainCssClass) {
	$.each(entries, function(index, entry) { 
		if (entry.contentSnippet.length > 0) {
			$('<p><a target="_blank" href="'+entry.link+'" title="'+source+' - '+entry.title+'">' + entry.contentSnippet + '</p><hr/>').appendTo(mainCssClass);
		}
	});
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