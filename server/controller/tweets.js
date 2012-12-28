var conn = require('./../conf').conn;

exports.items = function(req, res) {
	conn.collection('tweets').find().toArray(function(err, items){
		res.send(items);
	});
}