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
const viewUrl = '_design/all_test/_view/all';

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CouchDB', condition: true, anyArray: [1,2,3] }); //change title on index.html
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


module.exports = router;
