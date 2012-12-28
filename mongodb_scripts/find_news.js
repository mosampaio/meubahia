var conn = require('./../server/conf').conn;
conn.collection('news').find().toArray(function(err, items){
	console.dir(items);
});
