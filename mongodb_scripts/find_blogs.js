var conn = require('./../server/conf').conn;
conn.collection('blogs').find().toArray(function(err, items){
	console.dir(items);
});
