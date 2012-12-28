var express = require('express');
var app = express();
var tweets = require('./server/tweets');

//config
app.use(express.json());
app.use(express.static(__dirname + '/client'));

//routes
app.get('/tweets/', tweets.items);
app.get('/recache/tweets/', tweets.recache);

//start server
var port = process.env.PORT || 5000;
var ip = process.env.IP || '0.0.0.0';
app.listen(port, ip);
console.log('Http server listening on port ' + port);