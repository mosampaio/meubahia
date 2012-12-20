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
		/*$.getJSON('http://search.twitter.com/search.json?q=%23bbmp&page=1&rpp=8&include_entities=true&callback=?', 
			function(data) { 
				$.each(data.results, function(index, value) { 
					$('<p><a target="_blank" href="http://twitter.com/'+value.from_user+'" title="'+value.from_user_name+'"">@'+value.from_user+'</a> '+value.text+'</p><hr/>').appendTo('.twitter');
				});
			}
		);*/
		$.getJSON(document.location.protocol + '//' + document.location.hostname + ':' + document.location.port + '/tweets/', 
			function(data) { 
				$.each(data, function(index, value) { 
					$('<p><a target="_blank" href="http://twitter.com/'+value.from_user+'" title="'+value.from_user_name+'"">@'+value.from_user+'</a> '+value.text+'</p><hr/>').appendTo('.twitter');
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