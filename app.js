var express = require('express');
var app = express();
var mongo = require('mongoskin');
var conn = mongo.db('mongodb://meubahia:123456@linus.mongohq.com:10074/meubahia', {safe:true});

app.use(express.json());
app.get('/', function(req, res){
  res.sendfile('public/index.html');
});
app.get('/tweets/', function(req, res){
	conn.collection('tweets').find().toArray(function(err, items){
		res.send(items);
	});
});

app.use('/static', express.static(__dirname + '/public'));

//app.listen(3000);
var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});