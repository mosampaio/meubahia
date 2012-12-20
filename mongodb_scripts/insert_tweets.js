var mongo = require('mongoskin');
var conn = mongo.db('mongodb://meubahia:123456@linus.mongohq.com:10074/meubahia', {safe:true});
var http = require('http');

var options = {
  host: 'search.twitter.com',
  path: '/search.json?q=%23bbmp&page=1&rpp=8&include_entities=true&callback=?',
  accep: 'application/json'
};

var callback = function(response) {
  var str = '';

  //another chunk of data has been recieved, so append it to `str`
  response.on('data', function (chunk) {
    str += chunk;
  });

  //the whole response has been recieved, so we just print it out here
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
		console.dir(err);
	});
  });
}

http.request(options, callback).end();