var mongo = require('mongoskin');
var conn = mongo.db('mongodb://meubahia:123456@linus.mongohq.com:10074/meubahia');
conn.collection('tweets').find().toArray(function(err, items){
    if (err) { console.dir(err); }
    var tweets = [];
    for (var i in items) {
        var json = items[i].session;
        tweets.push(items[i]._id);
        conn.collection('tweets').remove({_id: items[i]._id});
    }
    console.dir(tweets);
    
  });
  
console.log('Server running...');