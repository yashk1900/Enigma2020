var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";

// var MongoClient = require('mongodb').MongoClient;
// var url = "mongodb://localhost:27017/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("mydb");
  //Return the first 5 customers:
  dbo.collection("customers").find().limit(5).toArray(function(err, result) {
    if (err) throw err;
    console.log(result[0].name,result[1].name);
    db.close();
  });
});
// MongoClient.connect(url, function(err, db) {
//   if (err) throw err;
//   var dbo = db.db("enigma_database2");
//   //Insert 3 documents, with specified id values:
//   var myobj = [
//     { _id: 154, name: 'user1'},
//     { _id: 155, name: 'user2'},
//     { _id: 156, name: 'user3'}
//   ];
//   dbo.collection("products").insertMany(myobj, function(err, res) {
//     if (err) throw err;
//     //Return the result object:
//     console.log("first",res);
//     db.close();
//   });

//   dbo.collection("products").findOne({}, function(err, result) {
//     if (err) throw err;
//     console.log("second",result.name);
//    // db.close();
//   });

// });
// var myobj = { name: "Company Inc", address: "Highway 37" };
//   dbo.collection("customers").insertOne(myobj, function(err, res) {
//     if (err) throw err;
//     console.log("1 document inserted");
//     db.close();
//   });
//   var myquery = { address: "Valley 345" };
//   var newvalues = { $set: { name: "Michael", address: "Canyon 123" } };
//   dbo.collection("customers").updateOne(myquery, newvalues, function(err, res) {
//     if (err) throw err;
//     console.log("1 document updated");
//     db.close();
//   });
//   db.inventory.find( { status: "A" }, { item: 1, status: 1, _id: 0 } )
//   dbo.collection("customers").findOne({}, function(err, result) {
//     if (err) throw err;
//     console.log(result.name);
//     db.close();
//   });
//   db.members.createIndex( { "user_id": 1 }, { unique: true } )