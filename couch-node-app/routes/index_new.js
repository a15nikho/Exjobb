var express = require('express');
var router = express.Router();
var NodeCouchDb = require('node-couchdb');
var nano = require('nano')('http://localhost:5984');
var assert = require('assert');

//const couch = new NodeCouchDb();



/*const couchAuth = new NodeCouchDb({
    auth: {
        user: 'admin',
        pass: 'admin'
    }
});*/

const dbname = nano.db.use('testdb');
const viewUrl = '_all_docs?include_docs=true';
const bulkUrl = '_bulk_docs';
//const viewUrl = '_design/all_test/_view/all';

/* GET home page. */
/*router.get('/', function(req, res, next) {
  res.render('index', { title: 'CouchDB', condition: true, anyArray: [1,2,3] }); //change title on index.html
}); */


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


router.get('/', function(req, res, next){
	dbname.list({include_docs: true}, function(err, body) {
	  if (!err) {
	   
	    //console.log(body.rows);
     	res.render('index',{
			 title: 'CouchDB', items: body.rows
		});
	  }
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
		id: req.id,
		antal: req.body.antal,
		operation: req.body.operation,
		format: req.body.format,
		rev: req.body.rev
	};
	
	if(item.operation == "insert"){
		console.log(item.antal + " insert was chosen");

		var element = {}, docs = [];
		for (var i=0; i<item.antal; i++) {
		    element.name = item.operation;
			element.year = item.format;
			docs.push(element);
		}

		dbname.bulk({docs:docs}, function(err, body) {
		  
		});
		res.redirect('/');
	}
	else if(item.operation == "update"){
		console.log("update was chosen");

	

		/*MongoClient.connect(url, function(err, client){
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
		});*/
		var docArray = [];
		dbname.list({include_docs: true}, function(err, body) {
		  if (!err) {
		   
		    //console.log(body.rows);
		    docArray.push(body.rows);
	     	
		  }
		});


		var element = {}, docs = [];
		for (var i=0; i<item.antal; i++) {
		    element.name = item.operation;
			element.year = item.format;
			docs.push(element);
		}

		console.log(docArray);
		/*alice.insert({ _id: 'myid', _rev: '1-23202479633c2b380f79507a776743d5', happy: false }, function(err, body) {
		  if (!err)
		    console.log(body)
		})

		for(var i = 0; i < item.antal; i++){
			dbname.update(dbname, {comment: item.format, _rev: item.rev, name: item.name, year: item.year, comment: item.comment}).then(
				function(data, header, status){
					
				},
				function(err){
					res.send(err);
			});
		}*/
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
		couch.listDatabases().then(function(dbs){
		couch.get(dbname, viewUrl).then(
			function(data, headers,status){
				//console.log(data.data.rows);
				/*res.render('index',{
					items:data.data.rows, title: 'CouchDB'

				});*/
				var obj = data.data.rows;
				obj.forEach(function(rows){
				    console.log(rows);

				    Object.keys(rows).forEach(function(key) {

					  console.log(rows[key]);

					});
				});
				
				//console.log(obj.find("rev"));
				//console.log(data.data.rows);
				//console.log(JSON.parse(JSON.stringify(data.data.rows)));
				//console.log(json.getJSONObject("value").getString("rev"));
				for(var i = 0; i < item.antal; i++){
					couch.del(dbname, data.data.rows.id, data.data.rows.value.rev).then(
						function(data, header, status){
							res.redirect('/');
						},
						function(err){
						res.send(err);
					});
				}
			},
			function(err){
				res.send(err);
			}
		);
	});

		/*MongoClient.connect(url, function(err, client){
			var db = client.db(dbName);
	    	for(var i = 0; i < item.antal; i++){
			    db.collection('user').deleteOne({"year": item.format}, function(error, result){
					assert.equal(null, err);	
				});
		 	}
		 	client.close();
		}); 

		for(var i = 0; i < item.antal; i++){
			couch.del(dbname, item.id, item.rev).then(
				function(data, header, status){
					res.redirect('/');
				},
				function(err){
					res.send(err);
			});
		}*/
		//console.log(req);
		console.log(item.antal + " delete was chosen");
		res.redirect('/');
	}
	else{
		console.log("something is broken!");
	}
	
});


module.exports = router;
