var conn = require('./../conf').conn;

exports.items = function(req, res) {
    conn.collection('blogs').find().toArray(function(err, items){
		res.send(items);
	});
}