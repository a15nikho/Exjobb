var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var Binary = require('mongodb').Binary;
var assert = require('assert');
var fs = require('fs');
var dir = require('node-dir');

const testFolder = './tests/';
var url = 'mongodb://localhost:27017/test'; //url till databas och sedan definieras vilken databas
var dbName = 'test';
/* GET home page. */
/*crouter.get('/', function(req, res, next) {
  res.render('index', { title: 'Home', condition: true, anyArray: [1,2,3] }); //change title on index.html
});*/


router.get('/insert', function(req, res, next) {
  res.render('insert', { title: 'Insert ', condition: true, anyArray: [1,2,3] }); //change title on index.html
});

router.get('/update', function(req, res, next) {
  res.render('update', { title: 'Update ', condition: true, anyArray: [1,2,3] }); //change title on index.html
});

router.get('/delete', function(req, res, next) {
  res.render('delete', { title: 'Delete ', condition: true, anyArray: [1,2,3] }); //change title on index.html
});
/*
router.get('/get', function(req, res, next) {
  res.render('get', { title: 'Get ', condition: true, anyArray: [1,2,3] }); //change title on index.html
});*/


router.get('/', function(req, res, next){
	var resultArray = [];
	MongoClient.connect(url, function(err, client){
		var db = client.db(dbName);
		assert.equal(null, err);
		var cursor = db.collection('user').find();
		cursor.forEach(function(doc, err){
			assert.equal(null, err);
			resultArray.push(doc);
		}, function(){

		dir.readFiles(testFolder,
		    function(err, content, next) {
		        if (err) throw err;
		        console.log('content:', content);  // get content of files
		        next();
		    },
		    function(err, files){
		        if (err) throw err;
		        console.log('finished reading files:', files); // get filepath 
		   }); 
			client.close();
			res.render('index', {title: "Home", items: resultArray});
		});

	});
});

router.get('/get', function(req, res, next){
	var resultArray = [];
	MongoClient.connect(url, function(err, client){
		var db = client.db(dbName);
		assert.equal(null, err);
		var cursor = db.collection('user').find();
		cursor.forEach(function(doc, err){
			assert.equal(null, err);
			resultArray.push(doc);
		}, function(){
			client.close();
			res.render('get', {title: "get site", items: resultArray});
		});

	});
});

router.get('/book', function(req, res, next){
	fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
	var item = {
		name: data
	};

	MongoClient.connect(url, function(err, client){
		var db = client.db(dbName);
		
		assert.equal(null, err);
		db.collection('user').insertOne(item, function(error, result){
			assert.equal(null, err);
			client.close();
		});
		res.redirect('/');
	});
	});
});




router.post('/insert', function(req, res, next){
	var item = {
		name: req.body.name,
		year: req.body.year,
		comment: req.body.comment
	};

	MongoClient.connect(url, function(err, client){
		var db = client.db(dbName);
		
		assert.equal(null, err);
		db.collection('user').insertOne(item, function(error, result){
			assert.equal(null, err);
			console.log('Item inserted');
			client.close();
		});
		
	});
	res.redirect('/');
});

router.post('/update', function(req, res, next){
	var item = {
		name: req.body.name,
		year: req.body.year,
		comment: req.body.comment
	};
	var id = req.body.id;

	MongoClient.connect(url, function(err, client){
		var db = client.db(dbName);
		
		assert.equal(null, err);
		db.collection('user').updateOne({"_id": objectId(id)}, {$set: item}, function(error, result){
			assert.equal(null, err);
			console.log('Item updated');
			client.close();
		});
		res.redirect('/');
	});
});

router.post('/delete', function(req, res, next){
	var id = req.body.id;
	MongoClient.connect(url, function(err, client){
		var db = client.db(dbName);
		
		assert.equal(null, err);
		db.collection('user').deleteOne({"_id": objectId(id)}, function(error, result){
			assert.equal(null, err);
			console.log('Item deleted');
			client.close();
			});
		res.redirect('/');
	});
});

router.post('/dropdown', function(req, res, next){
	var item = {
		antal: req.body.antal,
		operation: req.body.operation,
		format: req.body.format
	};
	
	if(item.operation == "insert"){
		console.log(item.antal + " insert was chosen");

		MongoClient.connect(url, function(err, client) {
		  // Get the collection
		  var db = client.db(dbName);
		  for(var i = 0; i < item.antal; i++){
		  	db.collection('user').insertOne({name : item.operation, year: item.format}, function(err, r) {
			    assert.equal(null, err);
			    // Finish up test
			   
			});
		  }
		   client.close();
		});
		res.redirect('/');
	}
	else if(item.operation == "update"){
		console.log("update was chosen");

		var id = req.body.id;

		MongoClient.connect(url, function(err, client){
			var db = client.db(dbName);
			
			assert.equal(null, err);
			if(item.antal == "1"){
				db.collection('user').updateOne({"year": item.format}, {$set: {"name": "changed"} }, function(error, result){
					assert.equal(null, err);
					console.log('Item updated');
				});
		 	}
		 	else{
		 		db.collection('user').updateMany({"year": item.format}, {$set: {"name": "changed"} }, function(error, result){
					assert.equal(null, err);
					console.log('Item updated');
				});
		 	}
			client.close();
		});
		res.redirect('/');
	}
	else if(item.operation == "select"){
		console.log("select was chosen");

		var resultArray = [];
		MongoClient.connect(url, function(err, client){
			var db = client.db(dbName);
			assert.equal(null, err);

			var cursor = db.collection('user').find().limit(parseInt(item.antal));

			cursor.forEach(function(doc, err){
				assert.equal(null, err);
				resultArray.push(doc);
			}, function(){
				client.close();
				res.render('index', {title: "Home", items: resultArray});
			});

		});

	}
	else if(item.operation == "delete"){
		console.log(item.antal + " delete was chosen");

		MongoClient.connect(url, function(err, client){
			var db = client.db(dbName);
	    	for(var i = 0; i < item.antal; i++){
			    db.collection('user').deleteOne({"year": item.format}, function(error, result){
					assert.equal(null, err);	
				});
		 	}
		 	client.close();
		}); 
		res.redirect('/');
	}
	else{
		console.log("something is broken!");
	}
	
});




module.exports = router;
