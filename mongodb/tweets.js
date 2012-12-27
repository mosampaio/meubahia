var mongo = require('mongoskin');
var conn = mongo.db('mongodb://meubahia:123456@linus.mongohq.com:10074/meubahia', {safe:true});
var http = require('http');

var options = {
  host: 'search.twitter.com',
  path: '/search.json?q=%23bbmp&page=1&rpp=8&include_entities=true&callback=?',
  accep: 'application/json'
};

var insertCallback = function(response) {
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
			text: data.results[i].text
		});
	}
	
	conn.collection('tweets').insert(tweets,  function(err, result) {
		if (err) console.dir(err);
	});
  });
}

var linkfy = function(result) {
    var text = result.text;
    for (var i in result.hashtags) {
        var hashtag = result.entities.hashtags[i];
        var sub = result.text.substring(hashtag.indices[0], hashtag.indices[1]); 
        var newsub = '<a href="http://twitter.com/#search?q=%23' + hashtag.text + '">' + sub + '</a>'; 
        text = result.text.substring(0, hashtag.indices[0]) + newsub + result.text.substring(hashtag.indices[1], result.text.lenght); 
    }
    return text;
}

exports.recache = function() { 
	conn.collection('tweets').find().toArray(function(err, items){
		if (err) { console.dir(err); }
		var tweets = [];
		for (var i in items) {
			var json = items[i].session;
			tweets.push(items[i]._id);
			conn.collection('tweets').remove({_id: items[i]._id}, function(err, result) { if (err) console.dir(err);} );
		}
		
		http.request(options, insertCallback).end();
	});
}
