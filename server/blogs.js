var conn = require('./conf').conn;
var http = require('http');

var insertCallback = function(response) {
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

//====== EXPORTS ======
exports.recache = function(req, res) { 
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
            }, insertCallback).end();
        }
	});
	
	res.send(200, 'OK');
}

exports.items = function(req, res) {
    conn.collection('blogs').find().toArray(function(err, items){
		res.send(items);
	});
}