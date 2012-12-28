var mongo = require('mongoskin');
var urldb = 'mongodb://meubahia:123456@linus.mongohq.com:10074/meubahia';
var conn = mongo.db(urldb, {safe:true});

exports.conn = conn;