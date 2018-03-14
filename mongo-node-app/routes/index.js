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
const htmlFolder = './tests/html/';
const txtFolder = './tests/txt/';
const epubFolder = './tests/epub/';
const mobiFolder = './tests/mobi/';
var htmlBooks = [];
var txtBooks = [];
var epubBooks = [];
var mobiBooks = [];
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
	var ids = [];   

	fs.readdir(htmlFolder, (err, files) => {
		files.forEach(file => {
			//console.log(file + " html");
			htmlBooks.push(htmlFolder+file);
		});
	})

	fs.readdir(txtFolder, (err, files) => {
		files.forEach(file => {
			//console.log(file+ " txt");
			txtBooks.push(txtFolder+file);
		});
	})

	fs.readdir(epubFolder, (err, files) => {
		files.forEach(file => {
			//console.log(file+ " txt");
			epubBooks.push(epubFolder+file);
		});
	})

	fs.readdir(mobiFolder, (err, files) => {
		files.forEach(file => {
			//console.log(file+ " txt");
			mobiBooks.push(mobiFolder+file);
		});
	})


	MongoClient.connect(url, function(err, client){
		var db = client.db(dbName);
		assert.equal(null, err);
		var cursor = db.collection('user').find();
		cursor.forEach(function(doc, err){
			assert.equal(null, err);
			
			  console.log(doc._id);
			  ids.push(doc._id);
			
			resultArray.push(doc);
		}, function(){

	
			client.close();
			res.render('index', {title: "Home", items: resultArray});
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
				
					var archivobin = fs.readFileSync(txtBooks[i]); 
					// print it out so you can check that the file is loaded correctly
					console.log("Loading file");
					console.log(archivobin);

					var invoice = {};
					invoice.bin = Binary(archivobin);

					console.log("largo de invoice.bin= "+ invoice.bin.length());
					// set an ID for the document for easy retrieval

					var db = client.db(dbName);
					var name = txtBooks[i];
					var binData = fs.readFileSync(name);
					var object = {};
						object.name = name;
						object.data = new Binary(binData);

					  db.collection('user').insert({"_id": object.name, "comment": invoice}, function(err, doc){
					    // check the inserted document
					    console.log("Inserting file");
					    console.log(doc);
						db.collection("user").findOne({ _id: name },function(err,data) {
							
							fs.writeFile(txtBooks[i] ,data.comment.bin.buffer,function(err) {
								console.log("done");
							});
						});
					});
				}
			
			});
			res.redirect('/');
		}
		
		else if(item.format == "htm"){
			console.log("html was chosen");
				MongoClient.connect(url, function(err, client) {
					for(var i = 0; i < item.antal; i++){
					
						var archivobin = fs.readFileSync(htmlBooks[i]); 
						// print it out so you can check that the file is loaded correctly
						console.log("Loading file");
						console.log(archivobin);

						var invoice = {};
						invoice.bin = Binary(archivobin);

						console.log("largo de invoice.bin= "+ invoice.bin.length());
						// set an ID for the document for easy retrieval

						var db = client.db(dbName);
						var name = htmlBooks[i];
						var binData = fs.readFileSync(name);
						var object = {};
							object.name = name;
							object.data = new Binary(binData);

						  db.collection('user').insert({"_id": object.name, "comment": invoice}, function(err, doc){
						    // check the inserted document
						    console.log("Inserting file");
						    console.log(doc);
							db.collection("user").findOne({ _id: name },function(err,data) {
								
								fs.writeFile(htmlBooks[i] ,data.comment.bin.buffer,function(err) {
									console.log("done");
								});
							});
						});
					}
				
				});
			res.redirect('/');
		}
		
		else if(item.format == "epub"){
			console.log("epub was chosen");
			MongoClient.connect(url, function(err, client) {
				for(var i = 0; i < item.antal; i++){
				
					var archivobin = fs.readFileSync(epubBooks[i]); 
					// print it out so you can check that the file is loaded correctly
					console.log("Loading file");
					console.log(archivobin);

					var invoice = {};
					invoice.bin = Binary(archivobin);

					console.log("largo de invoice.bin= "+ invoice.bin.length());
					// set an ID for the document for easy retrieval

					var db = client.db(dbName);
					var name = epubBooks[i];
					var binData = fs.readFileSync(name);
					var object = {};
						object.name = name;
						object.data = new Binary(binData);

					  db.collection('user').insert({"_id": object.name, "comment": invoice}, function(err, doc){
					    // check the inserted document
					    console.log("Inserting file");
					    console.log(doc);
						db.collection("user").findOne({ _id: name },function(err,data) {
							
							fs.writeFile(epubBooks[i] ,data.comment.bin.buffer,function(err) {
								console.log("done");
							});
						});
					});
				}
				
			});
			res.redirect('/');
		}

		else if(item.format == "mobi"){
			console.log("mobi was chosen");
			MongoClient.connect(url, function(err, client) {
				for(var i = 0; i < item.antal; i++){
				
					var archivobin = fs.readFileSync(mobiBooks[i]); 
					// print it out so you can check that the file is loaded correctly
					console.log("Loading file");
					console.log(archivobin);

					var invoice = {};
					invoice.bin = Binary(archivobin);

					console.log("largo de invoice.bin= "+ invoice.bin.length());
					// set an ID for the document for easy retrieval

					var db = client.db(dbName);
					var name = mobiBooks[i];
					var binData = fs.readFileSync(name);
					var object = {};
						object.name = name;
						object.data = new Binary(binData);

					  db.collection('user').insert({"_id": object.name, "comment": invoice}, function(err, doc){
					    // check the inserted document
					    console.log("Inserting file");
					    console.log(doc);
						db.collection("user").findOne({ _id: name },function(err,data) {
							
							fs.writeFile(mobiBooks[i] ,data.comment.bin.buffer,function(err) {
								console.log("done");
							});
						});
					});
				}
				
			});
			res.redirect('/');
		}

	}
	else if(item.operation == "update"){
		console.log("update was chosen");

		var id = req.body.id;

		MongoClient.connect(url, function(err, client){
			var db = client.db(dbName);
			
			assert.equal(null, err);
			if(item.antal == "1"){
				db.collection('user').updateOne({"_id": id}, {$set: {"name": "changed"} }, function(error, result){
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
		var id = req.body.id;
		console.log(item.antal + " delete was chosen");

		MongoClient.connect(url, function(err, client){
			var db = client.db(dbName);
	    	for(var i = 0; i < item.antal; i++){
			    db.collection('user').deleteOne({"_id": id}, function(error, result){
					assert.equal(null, err);	
					console.log("item deleted");
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
