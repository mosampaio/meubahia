var conn = require('./../conf').conn;

exports.items = function(req, res) {
    conn.collection('news').find().toArray(function(err, items){
    	res.send(items);
	});
}