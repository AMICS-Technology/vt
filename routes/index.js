var express = require('express');
var router = express.Router();

var pg = require('pg');
var conString = "postgres://root:vulpes123@vt.cvfd8nt5omdq.us-west-2.rds.amazonaws.com:5432/vt"


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/api/v1/postdata', function(req, res) {

    var results = [];

    // Grab data from http request
    var data = {userId: req.body.userId, usage: req.body.usage};

    // Get a Postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {

        // SQL Query > Insert Data
        client.query("INSERT INTO waterusage_by_session(userId, milliliter, date) values($1, $2, $3)", [data.userId, data.usage, new Date()]);

        console.log('receivingPost');
        var checkIfExists = client.query("SELECT COUNT(*) from waterusage_by_month where userId=($1)", [data.userId]);
        console.log(checkIfExists);
        //console.log('row=' + rowCount);

        if(checkIfExists.values.length == 0) {
            console.log('Do Insert');
            client.query('INSERT INTO waterusage_by_month(userId, month, milliliter, lastUpdate) values($1, $2, $3, $4)', [data.userId, new Date(), data.usage, new Date()]);

        } else {
            console.log('Do update');
            client.query('UPDATE waterusage_by_month SET milliliter = milliliter + ($1), lastUpdate = ($2) where userId=($3)', [data.usage, new Date(), data.userId]);
        }
        var query = client.query("SELECT * FROM waterusage_by_month ORDER BY userId ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);

        });

        // SQL Query > Select Data
        /*var query = client.query("SELECT * FROM waterusage_by_session ORDER BY sessionId ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        */

        // After all data is returned, close connection and return results
        checkIfExists.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }

    });
});

router.get('/api/v1/sessionUsage', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM waterusage_by_month ORDER BY userId ASC;");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });

        // After all data is returned, close connection and return results
        query.on('end', function() {
            client.end();
            return res.json(results);
        });

        // Handle Errors
        if(err) {
            console.log(err);
        }

    });

});

module.exports = router;
