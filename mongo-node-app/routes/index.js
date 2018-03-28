var express = require('express');
var router = express.Router();
var MongoClient = require('mongodb').MongoClient;
var Binary = require('mongodb').Binary;
var assert = require('assert');
var fs = require('fs');

const testFolder = './tests/';
var url = 'mongodb://localhost:27017/test'; //url till databas och sedan definieras vilken databas
var dbName = 'test';
const htmlFolder = './tests/html/';
const txtFolder = './tests/txt/';
const epubFolder = './tests/epub/';
const mobiFolder = './tests/mobi/';
var htmlBooks = [];
var txtBooks = [];
var epubBooks = [];
var mobiBooks = [];

function clock(start) {
    if ( !start ) return process.hrtime();
    var end = process.hrtime(start);
    return Math.round((end[0]*1000) + (end[1]/1000000));
}


router.get('/', function(req, res, next){
	var resultArray = [];

	fs.readdir(htmlFolder, (err, files) => {
		files.forEach(file => {
			htmlBooks.push(htmlFolder+file);
		});
	})

	fs.readdir(txtFolder, (err, files) => {
		files.forEach(file => {
			txtBooks.push(txtFolder+file);
		});
	})

	fs.readdir(epubFolder, (err, files) => {
		files.forEach(file => {
			epubBooks.push(epubFolder+file);
		});
	})

	fs.readdir(mobiFolder, (err, files) => {
		files.forEach(file => {
			mobiBooks.push(mobiFolder+file);
		});
	})

	MongoClient.connect(url, function(err, client){
		var db = client.db(dbName);
		assert.equal(null, err);
		var cursor = db.collection('user').find();
		cursor.forEach(function(doc, err){
			assert.equal(null, err);
			resultArray.push(doc);
		}, function(){
			client.close();
			res.render('index', {title: "MongoDB", items: resultArray});
		});

	});
});

router.get('/get', function(req, res, next) {
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
			res.render('get', {title: "Home", items: resultArray});
		});

	});
});

router.post('/dropdown', function(req, res, next){
	var item = {
		antal: req.body.antal,
		operation: req.body.operation,
		format: req.body.format
	};
	var bookcontent = [];
	
	if(item.operation == "insert"){
		console.log(item.antal + " insert was chosen");

		if(item.format == "txt"){
			console.log("txt was chosen");
			
			MongoClient.connect(url, function(err, client) {
				for(var i = 0; i < item.antal; i++){
					var start = clock();
					
					var db = client.db(dbName);
					var name = txtBooks[i];
					var binData = fs.readFileSync(name);
					var object = {};
						object.name = name;
						object.data = new Buffer(binData, 'binary').toString('base64');

				  	db.collection('user').insert({"_id": object.name, "comment": object}, function(err, doc){

					});
					var duration = clock(start);
					console.log("Took "+duration+"ms");

					fs.appendFileSync('./results/results-insert.txt', duration+" ms  txt " + item.antal + "\r\n");
				}
			
			});
			res.redirect('/');
		}
		
		else if(item.format == "htm"){
			console.log("html was chosen");
				MongoClient.connect(url, function(err, client) {
					for(var i = 0; i < item.antal; i++){
						var start = clock();

						var db = client.db(dbName);
						var name = htmlBooks[i];
						var binData = fs.readFileSync(name);
						var object = {};
							object.name = name;
							object.data = new Buffer(binData, 'binary').toString('base64');

						db.collection('user').insert({"_id": object.name, "comment": object}, function(err, doc){
	
						});
					  	var duration = clock(start);
						console.log("Took "+duration+"ms");

						fs.appendFileSync('./results/results-insert.txt', duration+" ms  html " + item.antal + "\r\n");
					}
				
				});
			res.redirect('/');
		}
		
		else if(item.format == "epub"){
			console.log("epub was chosen");
			MongoClient.connect(url, function(err, client) {
				for(var i = 0; i < item.antal; i++){
					var start = clock();

					var db = client.db(dbName);
					var name = epubBooks[i];
					var binData = fs.readFileSync(name);
					var object = {};
						object.name = name;
						object.data = new Buffer(binData, 'binary').toString('base64');

					db.collection('user').insert({"_id": object.name, "comment": object}, function(err, doc){

					});
				  	var duration = clock(start);
					console.log("Took "+duration+"ms");

					fs.appendFileSync('./results/results-insert.txt', duration+" ms  epub " + item.antal + "\r\n");
				}
				
			});
			res.redirect('/');
		}

		else if(item.format == "mobi"){
			console.log("mobi was chosen");
			MongoClient.connect(url, function(err, client) {
				for(var i = 0; i < item.antal; i++){
					var start = clock();

					var db = client.db(dbName);
					var name = mobiBooks[i];
					var binData = fs.readFileSync(name);
					var object = {};
						object.name = name;
						object.data = new Buffer(binData, 'binary').toString('base64');

					db.collection('user').insert({"_id": object.name, "comment": object}, function(err, doc){
	
					});
				  	var duration = clock(start);
					console.log("Took "+duration+"ms");

					fs.appendFileSync('./results/results-insert.txt', duration+" ms mobi " + item.antal + "\r\n");
				}
				
			});
			res.redirect('/');
		}

	}
	else if(item.operation == "update"){
		console.log("update was chosen");

		var id = req.body.id;

		if(item.format == "txt"){
			console.log("txt was chosen");
			
			MongoClient.connect(url, function(err, client){
				var db = client.db(dbName);
				for(var i = 0; i < item.antal; i++){
					var start = clock();
			    	db.collection('user').updateOne({"_id": txtBooks[i]}, {$set: {"name": "changed"} }, function(error, result){
						assert.equal(null, err);
						console.log('Item updated');
					});
					var duration = clock(start);
					console.log("Took "+duration+"ms");

					fs.appendFileSync('./results/results-update.txt', duration+" ms txt " + item.antal + "\r\n");
			    }
			 	client.close();
			}); 
			res.redirect('/');
		}
		
		else if(item.format == "htm"){
			console.log("html was chosen");
			MongoClient.connect(url, function(err, client){
				var db = client.db(dbName);
		    	for(var i = 0; i < item.antal; i++){
		    		var start = clock();
			    	db.collection('user').updateOne({"_id": htmlBooks[i]}, {$set: {"name": "changed"} }, function(error, result){
						assert.equal(null, err);
						console.log('Item updated');
					});
					var duration = clock(start);
					console.log("Took "+duration+"ms");

					fs.appendFileSync('./results/results-update.txt', duration+" ms html " + item.antal + "\r\n");
			    }
			 	client.close();
			}); 
			res.redirect('/');
		}
		
		else if(item.format == "epub"){
			console.log("epub was chosen");
			MongoClient.connect(url, function(err, client){
				var db = client.db(dbName);
		    	for(var i = 0; i < item.antal; i++){
		    		var start = clock();
			    	db.collection('user').updateOne({"_id": epubBooks[i]}, {$set: {"name": "changed"} }, function(error, result){
						assert.equal(null, err);
						console.log('Item updated');
					});
					var duration = clock(start);
					console.log("Took "+duration+"ms");

					fs.appendFileSync('./results/results-update.txt', duration+" ms epub " + item.antal + "\r\n");
			    }
			 	client.close();
			}); 
			res.redirect('/');
		}

		else if(item.format == "mobi"){
			console.log("mobi was chosen");
			MongoClient.connect(url, function(err, client){
				var db = client.db(dbName);
		    	for(var i = 0; i < item.antal; i++){
		    		var start = clock();
			    	db.collection('user').updateOne({"_id": mobiBooks[i]}, {$set: {"name": "changed"} }, function(error, result){
						assert.equal(null, err);
						console.log('Item updated');
					});
					var duration = clock(start);
					console.log("Took "+duration+"ms");

					fs.appendFileSync('./results/results-update.txt', duration+" ms mobi " + item.antal + "\r\n");
			    }
			 	client.close();
			}); 
			res.redirect('/');
		}
	}
	else if(item.operation == "select"){
		console.log("select was chosen");
		var start = clock();
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
				var duration = clock(start);
				console.log("Took "+duration+"ms");

				fs.appendFileSync('./results/results-select.txt', duration+" ms select " + item.antal + "\r\n");
			});

		});

	}
	else if(item.operation == "delete"){
		var id = req.body.id;
		console.log(item.antal + " delete was chosen");


		var resultArray = [];
		MongoClient.connect(url, function(err, client){
			var db = client.db(dbName);
			assert.equal(null, err);
			var cursor = db.collection('user').find();
			cursor.forEach(function(doc, err){
				assert.equal(null, err);
				resultArray.push(doc);
			}, function(){
				var db = client.db(dbName);
		    	for(var i = 0; i < item.antal; i++){
	    			var start = clock();
	    			console.log(resultArray[i]._id);
				    db.collection('user').deleteOne({"_id": resultArray[i]._id }, function(error, result){
						assert.equal(null, err);	
						console.log("item deleted");
					});
					var duration = clock(start);
					console.log("Took "+duration+"ms");

					fs.appendFileSync('./results/results-delete.txt', duration+" ms txt " + item.antal + "\r\n");

				}
				client.close();
				res.redirect('/');
			});
		});
	}
	else{
		console.log("something is broken!");
	}
	
});




module.exports = router;
