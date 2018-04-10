var express = require('express');
var router = express.Router();
var nano = require('nano')('http://localhost:5984');
var assert = require('assert');
var fs = require('fs');

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

	testdb.list(function(err, body) {
		assert.equal(null, err);
		body.rows.forEach(function(doc) {
			resultArray.push(doc);
		});
		res.render('index', { title: 'CouchDB', items: resultArray });
	});
	
});

router.get('/get', function(req, res, next) {
	var resultArray = [];
	testdb.list(function(err, body) {
		assert.equal(null, err);

		body.rows.forEach(function(doc) {
			assert.equal(null, err);
			resultArray.push(doc);
		});
	
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
				var name = txtBooks[i];
				var binData = fs.readFileSync(name, "utf8");
				var object = {};
					object.name = name;
					object.data = new Buffer(binData, 'binary').toString('base64');

   		 	 	testdb.multipart.insert(txtBooks[i], [{ data: object.data, content_type: 'text/plain'}], txtBooks[i], function(err, body) {
			       
			    });

   		 	 	var duration = clock(start);
				console.log("Took "+duration+"ms");

			fs.appendFileSync('./results/results-insert.txt', duration+" ms txt " + item.antal + "\r\n");

			}
			
			res.redirect('/');

		}
		
		else if(item.format == "htm"){
			console.log("html was chosen");
			for(var i = 0; i < item.antal; i++){
				var start = clock();
				var doc = fs.readFileSync(htmlBooks[i], "utf8");

				var name = htmlBooks[i];
				var binData = fs.readFileSync(name, "utf8");
				var object = {};
					object.name = name;
					object.data = new Buffer(binData, 'binary').toString('base64');

   		 	 	testdb.multipart.insert(htmlBooks[i], [{ data: doc, content_type: 'text/html'}], htmlBooks[i], function(err, body) {
			        
			    });

   		 	 	var duration = clock(start);
				console.log("Took "+duration+"ms");

				fs.appendFileSync('./results/results-insert.txt', duration+" ms html " + item.antal + "\r\n");
			}
			res.redirect('/');

		}
		
		else if(item.format == "epub"){
			console.log("epub was chosen");
			for(var i = 0; i < item.antal; i++){
				var start = clock();
				var doc = fs.readFileSync(epubBooks[i], "utf8");

				var name = epubBooks[i];
				var binData = fs.readFileSync(name, "utf8");
				var object = {};
					object.name = name;
					object.data = new Buffer(binData, 'binary').toString('base64');

   		 	 	testdb.multipart.insert(epubBooks[i], [{ data: doc, content_type: 'application/epub+zip'}], epubBooks[i], function(err, body) {
			        
			    });
   		 	 	var duration = clock(start);
				console.log("Took "+duration+"ms");

				fs.appendFileSync('./results/results-insert.txt', duration+" ms epub " + item.antal + "\r\n");
			}
			res.redirect('/');
		}

		else if(item.format == "mobi"){
			console.log("mobi was chosen");
			for(var i = 0; i < item.antal; i++){
				var start = clock();
				var doc = fs.readFileSync(mobiBooks[i], "utf8");

				var name = mobiBooks[i];
				var binData = fs.readFileSync(name, "utf8");
				var object = {};
					object.name = name;
					object.data = new Buffer(binData, 'binary').toString('base64');

   		 	 	testdb.multipart.insert(mobiBooks[i], [{ data: doc, content_type: 'application/x-mobipocket-ebook'}], mobiBooks[i], function(err, body) {
			        
			    });
   		 	 	var duration = clock(start);
				console.log("Took "+duration+"ms");

				fs.appendFileSync('./results/results-insert.txt', duration+" ms mobi " + item.antal + " \r\n");
			}
			res.redirect('/');
		}
	
	}

	else if(item.operation == "update"){
		console.log(item.antal + " update was chosen");
		var id = req.body.id;
		var rev = req.body.rev;
	 	var resultArray = [];
	 	testdb.list(function(err, body) {
			assert.equal(null, err);
			body.rows.forEach(function(doc) {
				resultArray.push(doc);
			});
			
			for(var i = 0; i < item.antal; i++){
				var start = clock();
				if(item.format == "txt"){
					var doc = fs.readFileSync(txtBooks[i], "utf8");

					var name = txtBooks[i];
					var binData = fs.readFileSync(name, "utf8");
					var object = {};
						object.name = name;
						object.data = new Buffer(binData, 'binary').toString('base64');

					testdb.multipart.insert({_id: resultArray[i].id, _rev : resultArray[i].value.rev , name: "changed"}, [{ data: object.data, content_type: 'text/plain'}], txtBooks[i], function(err, body) {

				    });

				}

				else if(item.format == "htm"){
					var doc = fs.readFileSync(htmlBooks[i], "utf8");

					var name = htmlBooks[i];
					var binData = fs.readFileSync(name, "utf8");
					var object = {};
						object.name = name;
						object.data = new Buffer(binData, 'binary').toString('base64');

					testdb.multipart.insert({_id: resultArray[i].id, _rev : resultArray[i].value.rev , name: "changed"}, [{ data: object.data, content_type: 'text/html'}], htmlBooks[i], function(err, body) {

				    });

				}

				else if(item.format == "epub"){
					var doc = fs.readFileSync(epubBooks[i], "utf8");

					var name = epubBooks[i];
					var binData = fs.readFileSync(name, "utf8");
					var object = {};
						object.name = name;
						object.data = new Buffer(binData, 'binary').toString('base64');

					testdb.multipart.insert({_id: resultArray[i].id, _rev : resultArray[i].value.rev , name: "changed"}, [{ data: object.data, content_type: 'text/html'}], epubBooks[i], function(err, body) {

				    });

				}

				else if(item.format == "mobi"){
					var doc = fs.readFileSync(mobiBooks[i], "utf8");

					var name = mobiBooks[i];
					var binData = fs.readFileSync(name, "utf8");
					var object = {};
						object.name = name;
						object.data = new Buffer(binData, 'binary').toString('base64');

					testdb.multipart.insert({_id: resultArray[i].id, _rev : resultArray[i].value.rev , name: "changed"}, [{ data: object.data, content_type: 'text/html'}], mobiBooks[i], function(err, body) {

				    });

				}

				var duration = clock(start);
				console.log("Took "+duration+"ms");

				fs.appendFileSync('./results/results-update.txt', duration+" ms update " + item.antal + " \r\n");
			}
			res.redirect('/');
		});
	}
	else if(item.operation == "select"){
		var resultArray = [];
		var start = clock();
		testdb.list({limit: item.antal}, function(err, body) {
			assert.equal(null, err);
			body.rows.forEach(function(doc) {
			  resultArray.push(doc);
			});
			for(var j = 0; j < item.antal; j++){
				console.log(resultArray[j].id);
				testdb.multipart.get(resultArray[j].id, function(err, buffer) {

				});

			}
			
			res.render('index', { title: 'CouchDB', items: resultArray });
			var duration = clock(start);
			console.log("Took "+duration+"ms");

			fs.appendFileSync('./results/results-select.txt', duration+" ms select " + item.antal + " \r\n");
		});
	}
	else if(item.operation == "delete"){
		var id = req.body.id;
		var rev = req.body.rev;
		var resultArray = [];
		testdb.list({limit: item.antal}, function(err, body) {
			assert.equal(null, err);
			for(var j = 0; j < item.antal; j++){
				body.rows.forEach(function(doc) {
					resultArray.push(doc);
				});
			} 

			for(var i = 0; i < item.antal; i++){
				var start = clock();
				testdb.destroy(resultArray[i].id, resultArray[i].value.rev, function(err, body) {

				});
				var duration = clock(start);
				console.log("Took "+duration+"ms");

				fs.appendFileSync('./results/results-delete.txt', duration+" ms delete " + item.antal + "\r\n");
			}
			res.redirect('/');
		});
		
	}
	else{
		console.log("something is broken!");
	}
	
	
});
module.exports = router;
