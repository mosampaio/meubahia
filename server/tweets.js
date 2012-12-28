var conn = require('./conf').conn;
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
			text: data.results[i].text,
			entities: data.results[i].entities
		});
	}
	
	conn.collection('tweets').insert(tweets,  function(err, result) {
		if (err) console.dir(err);
	});
  });
}

//====== EXPORTS ======
exports.recache = function(req, res) { 
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
	
	res.send(200, 'OK');
}

exports.items = function(req, res) {
	conn.collection('tweets').find().toArray(function(err, items){
		res.send(items);
	});
}