var conn = require('./../conf').conn;
var http = require('http');

var tweetsCallback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    var data = JSON.parse(str);
    var tweets = [];
	for (var i in data.results) {
		tweets.push({
			from_user: data.results[i].from_user,
			from_user_name: data.results[i].from_user_name,
			text: data.results[i].text,
			entities: data.results[i].entities
		});
	}
	
	conn.collection('tweets').insert(tweets,  function(err, result) {
		if (err) console.dir(err);
	});
  });
}

var blogsCallback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    var data = JSON.parse(str);
    var blogs = [];
    for (var i in data.responseData.feed.entries) {
        blogs.push({
    		title: data.responseData.feed.link + ' - ' + data.responseData.feed.entries[i].title,
			link: data.responseData.feed.entries[i].link,
			contentSnippet: data.responseData.feed.entries[i].contentSnippet
		});
	}
    conn.collection('blogs').insert(blogs,  function(err, result) {
        if (err) console.dir(err);
	});
  });
}

var newsCallback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  response.on('end', function () {
    var data = JSON.parse(str);
    var blogs = [];
    for (var i in data.responseData.feed.entries) {
        blogs.push({
        	title: data.responseData.feed.link + ' - ' + data.responseData.feed.entries[i].title,
			link: data.responseData.feed.entries[i].link,
			contentSnippet: data.responseData.feed.entries[i].contentSnippet
		});
	}
    conn.collection('news').insert(blogs,  function(err, result) {
        if (err) console.dir(err);
	});
  });
}

//====== EXPORTS ======
exports.doRecache = function(req, res) { 
    //tweets
	conn.collection('tweets').find().toArray(function(err, items){
		if (err) { console.dir(err); }
		var tweets = [];
		for (var i in items) {
			var json = items[i].session;
			tweets.push(items[i]._id);
			conn.collection('tweets').remove({_id: items[i]._id}, function(err, result) { if (err) console.dir(err);} );
		}
		
		http.request({
          host: 'search.twitter.com',
          path: '/search.json?q=%23bbmp&page=1&rpp=8&include_entities=true&callback=?',
          accep: 'application/json'
        }, tweetsCallback).end();
	});
    
    
    //blogs
    conn.collection('blogs').find().toArray(function(err, items){
    	if (err) { console.dir(err); }
		var blogs = [];
		for (var i in items) {
			var json = items[i].session;
			blogs.push(items[i]._id);
			conn.collection('blogs').remove({_id: items[i]._id}, function(err, result) { if (err) console.dir(err);} );
		}
        
        var urls = [
        	'http://www.bbmp.com.br/?feed=rss2', 
    		'http://globoesporte.globo.com/platb/ba-torcedor-bahia/feed/',
    		'http://www.semprebahia.com/feed/atom/',
    		'http://feeds.feedburner.com/bahiaco'
    	];
        
        for (var i in urls) {
    		http.request({
              host: 'ajax.googleapis.com',
              path: '/ajax/services/feed/load?v=1.0&num=2&q=' + encodeURIComponent(urls[i]),
              accep: 'application/json'
            }, blogsCallback).end();
        }
	});
    
    //blogs
    conn.collection('news').find().toArray(function(err, items){
        if (err) { console.dir(err); }
		var blogs = [];
		for (var i in items) {
			var json = items[i].session;
			blogs.push(items[i]._id);
			conn.collection('news').remove({_id: items[i]._id}, function(err, result) { if (err) console.dir(err);} );
		}
        
        var urls = [
        	{q: 'http://globoesporte.globo.com/servico/semantica/editorias/plantao/futebol/times/bahia/feed.rss', num: 10}
    	];
        
        for (var i in urls) {
    		http.request({
              host: 'ajax.googleapis.com',
              path: '/ajax/services/feed/load?v=1.0&num='+urls[i].num+'&q=' + encodeURIComponent(urls[i].q),
              accep: 'application/json'
            }, newsCallback).end();
        }
	});
	
	res.send(200, 'OK');
}