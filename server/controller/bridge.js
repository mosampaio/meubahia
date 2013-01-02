var conn = require('./../conf').conn;

exports.items = function(req, res) {
    var collection = req.params.collection;
    conn.collection(collection).find().toArray(function(err, items){
		res.send(items);
	});
}