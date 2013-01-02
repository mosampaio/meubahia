var express = require('express');
var app = express();
var bridge = require('./server/controller/bridge');
var recache = require('./server/controller/recache');

//config
app.use(express.logger());
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.json());
app.use(express.static(__dirname + '/client'));

//routes
app.get('/bridge/:collection', bridge.items);
app.get('/recache/tweets/', recache.doRecache);

//start server
var port = process.env.PORT || 5000;
var ip = process.env.IP || '0.0.0.0';
app.listen(port, ip);
console.log('Http server listening on port ' + port);