var express = require('express');
var app = express();
var mongo = require('mongoskin');
var conn = mongo.db('mongodb://meubahia:123456@linus.mongohq.com:10074/meubahia', {safe:true});
var tweets = require('./mongodb/tweets');

app.use(express.json());
app.get('/', function(req, res){
  res.sendfile('public/index.html');
});
app.get('/tweets/', function(req, res){
	conn.collection('tweets').find().toArray(function(err, items){
		res.send(items);
	});
});
function recache(req, res) {
	tweets.recache();
	res.send(200, 'OK');
}
app.get('/recache/tweets/', recache);
app.get('/recache/', recache);
app.use('/static', express.static(__dirname + '/public'));

var port = process.env.PORT || 5000;
var ip = process.env.IP || '0.0.0.0';
app.listen(port, ip, function() {
  console.log("Listening on " + port);
});