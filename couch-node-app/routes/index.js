var express = require('express');
var router = express.Router();
var NodeCouchDb = require('node-couchdb');
var assert = require('assert');

const couch = new NodeCouchDb();



const couchAuth = new NodeCouchDb({
    auth: {
        user: 'admin',
        pass: 'admin'
    }
});

const dbname = 'testdb';
const viewUrl = '_design/all_docs/_view/all';

/* GET home page. */
router.get('/', function(req, res, next) {

	var ids = [];    
	var revs = [];
	var resultArray = [];

	couch.listDatabases().then(function(dbs){
		couch.get(dbname, viewUrl).then(
			function(data, headers,status){

				for (var i in data.data.rows) {
				  revs.push(data.data.rows[i].value.rev);
				  ids.push(data.data.rows[i].id);
				}
				resultArray.push(data);
			  	res.render('index', { title: 'CouchDB', condition: true, anyArray: [1,2,3], itemids: ids, itemrevs: revs, items:data.data.rows }); //change title on index.html
			},
			function(err){
				res.send(err);
			}
		);
	});


	
});


router.get('/insert', function(req, res, next) {
  res.render('insert', { title: 'Insert ', condition: true, anyArray: [1,2,3] }); //change title on index.html
});

router.get('/update', function(req, res, next) {
  res.render('update', { title: 'Update ', condition: true, anyArray: [1,2,3] }); //change title on index.html
});

router.get('/delete', function(req, res, next) {
  res.render('delete', { title: 'Delete ', condition: true, anyArray: [1,2,3] }); //change title on index.html
});

router.get('/get', function(req, res, next) {
  res.render('get', { title: 'Get ', condition: true, anyArray: [1,2,3] }); //change title on index.html
});


router.get('/get-data', function(req, res, next){
	couch.listDatabases().then(function(dbs){
		couch.get(dbname, viewUrl).then(
			function(data, headers,status){
				console.log(data.data.rows);
				res.render('get',{
					items:data.data.rows

				});
			},
			function(err){
				res.send(err);
			}
		);
	});
});

router.post('/insert', function(req, res, next){
	var item = {
		name: req.body.name,
		year: req.body.year,
		comment: req.body.comment
	};

	couch.insert('testdb', {name: item.name, year: item.year, comment: item.comment}).then(
		function(data, header, status){
			res.redirect('/get-data');
		},
		function(err){
			res.send(err);
		});
});



router.post('/update', function(req, res, next){
	var item = {
		name: req.body.name,
		year: req.body.year,
		rev : req.body.rev,
		comment: req.body.comment
	};
	id = req.body.id;
	
	couch.update(dbname, {_id: id, _rev: item.rev, name: item.name, year: item.year, comment: item.comment}).then(
		function(data, header, status){
			res.redirect('/get-data');
		},
		function(err){
			res.send(err);
		});



	/*MongoClient.connect(url, function(err, client){
		var db = client.db(dbName);
		
		assert.equal(null, err);
		db.collection('user').updateOne({"_id": objectId(id)}, {$set: item}, function(error, result){
			assert.equal(null, err);
			console.log('Item updated');
			client.close();
		});
		res.redirect('/get-data');
	});*/

});

router.post('/delete/:id', function(req, res, next){
	var id = req.params.id;
	var rev = req.body.rev;

	couch.del(dbname, id, rev).then(
		function(data, header, status){
			res.redirect('/get-data');
		},
		function(err){
			res.send(err);
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
		for(var i = 0; i < item.antal; i++){
			couch.insert('testdb', {name: item.operation, year: item.format, comment: item.antal}).then(
			function(data, header, status){
				
			},
			function(err){
				res.send(err);
			});
		}
		res.redirect('/');
	}
	else if(item.operation == "update"){
		console.log(item.antal + " update was chosen");
		var id = req.body.id;
		var rev = req.body.rev;
		console.log(req.body);
	 	
	
			couch.update(dbname, {_id: id, _rev: rev, name: item.operation, year: item.format, comment: item.antal}).then(
				function(data, header, status){
					
				},
				function(err){
					res.send(err);
			});
		
		res.redirect('/');
	}
	else if(item.operation == "select"){
		console.log("select was chosen");

		var resultArray = [];
		/*MongoClient.connect(url, function(err, client){
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

		});*/

		couch.listDatabases().then(function(dbs){
		couch.get(dbname, viewUrl).then(
			function(data, headers,status){
				//console.log(data.data.rows);
				res.render('index',{
					items:data.data.rows, title: 'CouchDB'

				});
			},
			function(err){
				res.send(err);
			}
		);
	});


		res.redirect('/');
	}
	else if(item.operation == "delete"){
		var id = req.body.id;
		var rev = req.body.rev;

		/*MongoClient.connect(url, function(err, client){
			var db = client.db(dbName);
	    	for(var i = 0; i < item.antal; i++){
			    db.collection('user').deleteOne({"year": item.format}, function(error, result){
					assert.equal(null, err);	
				});
		 	}
		 	client.close();
		}); 
		*/
		
			couch.del(dbname, id, rev).then(
				function(data, header, status){
					
				},
				function(err){
					res.send(err);
			});
	
		//console.log(req);
		console.log(item.antal + " delete was chosen");
		res.redirect('/');
	}
	else{
		console.log("something is broken!");
	}
	
});
module.exports = router;
