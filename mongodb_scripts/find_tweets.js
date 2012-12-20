var mongo = require('mongoskin');
var conn = mongo.db('mongodb://meubahia:123456@linus.mongohq.com:10074/meubahia', {safe:true});
conn.collection('tweets').find().toArray(function(err, items){
	console.dir(items);
});
