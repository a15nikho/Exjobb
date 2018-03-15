var express = require('express');
var router = express.Router();
var nano = require('nano')('http://localhost:5984');
var assert = require('assert');
var fs = require('fs');
var present = require('present');

const htmlFolder = './tests/html/';
const txtFolder = './tests/txt/';
const epubFolder = './tests/epub/';
const mobiFolder = './tests/mobi/';
const dbname = 'testdb';
var testdb = nano.use(dbname);
var htmlBooks = [];
var txtBooks = [];
var epubBooks = [];
var mobiBooks = [];

function clock(start) {
    if ( !start ) return process.hrtime();
    var end = process.hrtime(start);
    return Math.round((end[0]*1000) + (end[1]/1000000));
}

router.get('/', function(req, res, next) {
	var resultArray = [];
	
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

	testdb.list(function(err, body) {
		if (!err) {
		body.rows.forEach(function(doc) {
			resultArray.push(doc);
		});
		}
		res.render('index', { title: 'CouchDB', items: resultArray });
	});
	
});

router.get('/get', function(req, res, next) {
	var resultArray = [];
	testdb.list(function(err, body) {
		//console.log(body);
		if (!err) {
		body.rows.forEach(function(doc) {
			resultArray.push(doc);
			//console.log(doc);
		});
	}
	console.log(resultArray);
	res.render('get', { title: 'CouchDB', items: resultArray });
	});
});

router.post('/dropdown', function(req, res, next){
	var item = {
		
		antal: req.body.antal,
		operation: req.body.operation,
		format: req.body.format
		
	};

	if(item.operation == "insert"){

		if(item.format == "txt"){
			console.log("txt was chosen");
			for(var i = 0; i < item.antal; i++){
				var start = clock();
				console.log(txtBooks[i]);
				var doc = fs.readFileSync(txtBooks[i], "utf8");

			  	testdb.attachment.insert(txtBooks[i], txtBooks[i], doc, 'text/plain', function(err, body) {

   		 	 	});
   		 	 	var duration = clock(start);
				console.log("Took "+duration+"ms");

			}
			res.redirect('/');

		}
		
		else if(item.format == "htm"){
			console.log("html was chosen");
			for(var i = 0; i < item.antal; i++){
				var start = clock();
				console.log(htmlBooks[i]);
				var doc = fs.readFileSync(htmlBooks[i], "utf8");

			  	testdb.attachment.insert(htmlBooks[i], htmlBooks[i], doc, 'text/html', function(err, body) {

   		 	 	});
   		 	 	var duration = clock(start);
				console.log("Took "+duration+"ms");
			}
			res.redirect('/');

		}
		
		else if(item.format == "epub"){
			console.log("epub was chosen");
			for(var i = 0; i < item.antal; i++){
				var start = clock();
				console.log(epubBooks[i]);
				var doc = fs.readFileSync(epubBooks[i], "utf8");

			  	testdb.attachment.insert(epubBooks[i], epubBooks[i], doc, 'application/epub+zip', function(err, body) {

   		 	 	});
   		 	 	var duration = clock(start);
				console.log("Took "+duration+"ms");
			}
			res.redirect('/');
		}

		else if(item.format == "mobi"){
			console.log("mobi was chosen");
			for(var i = 0; i < item.antal; i++){
				var start = clock();
				console.log(mobiBooks[i]);
				var doc = fs.readFileSync(mobiBooks[i], "utf8");

			  	testdb.attachment.insert(mobiBooks[i], mobiBooks[i], doc, 'application/x-mobipocket-ebook ', function(err, body) {

   		 	 	});
   		 	 	var duration = clock(start);
				console.log("Took "+duration+"ms");
			}
			res.redirect('/');
		}
	
	}

	else if(item.operation == "update"){
		console.log(item.antal + " update was chosen");
		var id = req.body.id;
		var rev = req.body.rev;
		console.log(rev);
	 	var start = clock();
		testdb.insert({ _id: id, _rev: rev, comment: item.antal }, function(err, body) {
		  //if (!err)
		    //console.log(body);
		});
		var duration = clock(start);
		console.log("Took "+duration+"ms");
		
		res.redirect('/');
	}
	else if(item.operation == "select"){
		console.log("select was chosen");

		var resultArray = [];
		var start = clock();
		testdb.list(function(err, body) {
		  if (!err) {
		    body.rows.forEach(function(doc) {
		      //console.log(doc);
		    });
		  }
		});
		var duration = clock(start);
		console.log("Took "+duration+"ms");

		res.redirect('/');
	}
	else if(item.operation == "delete"){
		var id = req.body.id;
		var rev = req.body.rev;
		//console.log(req);
		console.log(req.params);
		var resultArray = [];
			


		testdb.list(function(err, body) {
			if (!err) {
				body.rows.forEach(function(doc) {
					resultArray.push(doc);
				});
			}
			for(var i = 0; i < item.antal; i++){
				var start = clock();
				testdb.destroy(resultArray[i].id, resultArray[i].value.rev, function(err, body) {
				  //if (!err)
				    //console.log(body);
				});
				var duration = clock(start);
				console.log("Took "+duration+"ms");
			}
			res.redirect('/');
		});
	
		console.log(item.antal + " delete was chosen");
		
	}
	else{
		console.log("something is broken!");
	}
	
	
});
module.exports = router;
