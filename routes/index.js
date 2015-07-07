var express = require('express');
var router = express.Router();
var rest_client = require('node-rest-client').Client;
var path    = require("path");
var transactions = require('../models/dbTransactions');


rest_client = new rest_client();

var pg = require('pg');

var client = new pg.Client({
    user: "imzyqdkhwhmmly",
    password: "N_vtZuYXu_HblK2M7nG0vflupd",
    database: "d8dje8d8vfe1dp",
    port: 5432,
    host: "ec2-54-83-36-90.compute-1.amazonaws.com",
    ssl: true
});

client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/dashboards', function(req, res, next) {
    res.sendfile('public/dashboards.html');
});

Date.prototype.yyyymmdd = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    var dd  = this.getDate().toString();
    return yyyy + (mm[1]?mm:"0"+mm[0]) + (dd[1]?dd:"0"+dd[0]); // padding
};
Date.prototype.yyyymm = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based
    return yyyy + (mm[1]?mm:"0"+mm[0]); // padding
};

Date.prototype.getPrevMonth = function() {
    var yyyy = this.getFullYear().toString();
    var mm = (this.getMonth()).toString(); // getMonth() is zero-based
    return yyyy + (mm[1]?mm:"0"+mm[0]); // padding
};

router.get('/api/v1/arduino/:userId', function(req, res, next){
    var date = new Date();
    var query = client.query('SELECT * FROM waterusage_by_month WHERE userId=($1) AND month=($2) ', [req.params.userId, date.getPrevMonth()]);

    var retValue = [];
    query.on('row', function(row) {
        retValue.push(row);
    });

    query.on('end', function() {
        var adt;
        if(retValue == null || retValue.length == 0) {
            adt = 659835;
        } else {
            adt = retValue[0].usage * (.98 / 30);
        }

        var dayUsageQuery = client.query('SELECT * FROM waterusage_by_day WHERE userId=($1) and date=($2)', [req.params.userId, date.yyyymmdd()]);

        var retValue2 = [];
        dayUsageQuery.on('row', function(row) {
            retValue2.push(row);
        });

        dayUsageQuery.on('end', function() {
            var adt_range = adt/7;
            var adt_low = 0;
            var adt_high = adt_range;
            var retColor = '';
            var cvNumber;
            var dayUsage;

            if(retValue2.length != 0) {
                dayUsage = retValue2[0].usage;
            } else {
                dayUsage = 0;
            }

            // Create an Array of data sets
            console.log(dayUsage);
            for(var i = 0; i < 7; i++) {
                if(adt_low < dayUsage && adt_high >= dayUsage) {
                    cvNumber = i;
                }
                adt_low = adt_low + adt_range;
                adt_high = adt_high + adt_range;
            }

            switch (cvNumber) {
                case 0:
                    retColor = 'GREEN';
                    break;
                case 1:
                    retColor = 'TEAL';
                    break;
                case 2:
                    retColor = 'BLUE';
                    break;
                case 3:
                    retColor = 'PURPLE';
                    break;
                case 4:
                    retColor = 'WHITE';
                    break;
                case 5:
                    retColor = 'ORANGE';
                    break;
                case 6:
                    retColor = 'RED';
                    break;
                default:
                    retColor = 'GREEN';
                    break;
            }
                return res.json(retColor);
        });


    });

});



// TODO: Refactor and make more readable
router.get('/api/test/getAllBySession/:userId', function(req, res) {
    // curl localhost:3000/api/test/getAllBySession/1
    var query = client.query('SELECT * from waterusage_by_session where userId=($1)', [req.params.userId]);
    var retValue = [];
    query.on('row', function(row) {
        retValue.push(row);
    });

    query.on('end', function() {
        return res.json(retValue);
    });
});

router.get('/api/test/getAllDays/:userId', function (req, res) {
    var query = client.query('SELECT * from waterusage_by_day where userId=($1)', [req.params.userId]);
    var retValue = [];
    query.on('row', function(row) {
        retValue.push(row);
    });

    query.on('end', function() {
        return res.json(retValue);
    });
});

router.get('/api/test/getAllMonth/:userId', function (req, res) {
    var query = client.query('SELECT * from waterusage_by_month where userId=($1)', [req.params.userId]);
    var retValue = [];
    query.on('row', function(row) {
        retValue.push(row);
    });

    query.on('end', function() {
        return res.json(retValue);
    });
});

router.post('/api/test/insertSession', function(req, res) {
    // curl --data "userId=1&faucetId=1&usage=210" localhost:3000/api/test/insertSession
    var date = new Date();
    console.log('inserting session');

    var insertQuery = client.query('INSERT INTO waterusage_by_session(userId, faucetId, usage, date) values($1, $2, $3, $4)',
        [req.body.userId, req.body.faucetId, req.body.usage, date]);

    insertQuery.on('end', function() {
        console.log('Completed INSERT to waterusage_by_session');
    });

    // Find or Update Water usage by date
    var selectWaterByDate = client.query('SELECT * FROM waterusage_by_day where userId=($1) AND date=($2)',
        [req.body.userId, date.yyyymmdd()]);

    selectWaterByDate.on('end', function(result) {

        if(result.rowCount == 0) {
            var insertDayQuery = client.query('INSERT INTO waterusage_by_day(userId, usage, date) values($1, $2, $3)',
                [req.body.userId, req.body.usage, date.yyyymmdd()]);

            insertDayQuery.on('end', function() {
                console.log('Completed INSERT to waterusage_by_day');
            });

            var insertMonthQuery = client.query('INSERT INTO waterusage_by_month(userId, usage, month, lastUpdate) values ($1, $2, $3, $4)',
                [req.body.userId, req.body.usage, date.yyyymm(), date]);

            insertMonthQuery.on('end', function() {
                console.log('Completed INSERT into waterusage_by_month');
            })


        } else {
            var updateDayQuery = client.query('UPDATE waterusage_by_day SET usage = usage + ($1) WHERE userId=($2) AND date=($3)',
                [req.body.usage, req.body.userId, date.yyyymmdd()]);

            updateDayQuery.on('end', function() {
                console.log('Completed UPDATE to waterusage_by_day');
            });

            var updateMonthQuery = client.query('UPDATE waterusage_by_month SET usage = usage + ($1), lastUpdate = ($2) WHERE userId=($3) AND month=($4)',
                [req.body.usage, date, req.body.userId, date.yyyymm()]);

            updateMonthQuery.on('end', function() {
                console.log('Completed UPDATE to waterusage_by_month');
            });
        }
    });



    // Insert or update water usage by month

    res.redirect('/api/test/getAllBySession/' + req.body.userId);

});

router.get('/api/v1/getxive', function(req, res) {
    console.log('get from endpoint /api/v1/getxive');
    var args = {
        headers:{
            "X-ApiKey":"7piMM7npQnuLUxBDsDGl3b3yjosgOdZaiWM53KeTivIPV5zj",
            "Content-Length":"30",
            "Host":"api.xively.com"
        }
    };

    var max_value = 0;
    var adjustment = .98;
    var adjusted_value = 0;
    var color;
    var color_range;
    rest_client.get('https://api.xively.com/v2/feeds/866813937.json?datastreams=meter_reading', args, function(data, response) {
        var jsonString = JSON.parse(data);
        for(var i = 0; i < jsonString.datastreams.length; i++) {
            max_value += jsonString.datastreams[i].max_value;
        }

        adjusted_value = max_value * adjustment;
        color_range = 100/7;
        var range = 0;

        if(0 < adjusted_value < range + color_range) {
            color = 'GREEN';
        } else if (range < adjusted_value < range + color_range) {
            color = 'TEAL';
        }
        else if (range < adjusted_value < range + color_range) {
            color = 'BLUE';
        }
        else if (range < adjusted_value < range + color_range) {
            color = 'PURPLE';
        }
        else if (range < adjusted_value < range + color_range) {
            color = 'WHITE';
        }
        else if (range < adjusted_value < range + color_range) {
            color = 'ORANGE';
        }
        else if (range < adjusted_value < range + color_range) {
            color = 'RED';
        }

        var jsonString = {
            'adjusted_value': '<' + adjusted_value + '>',
            //'color': color,
            'total_usage': max_value
            //'how_many_times_did_i_turn_on_the_faucet': jsonString.datastreams.length,
            //'timestamp': new Date()
        };
        return res.json(jsonString);
    });



});

router.post('/api/v1/postdata', function(req, res) {
    console.log('post at endpoint /api/v1/postdata');

    var results = [];

    // Grab data from http request
    var data = {userId: req.body.userId, usage: req.body.usage};

    // Get a Postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {

        var date = new Date();


        // SQL Query > Insert Data
        client.query("INSERT INTO waterusage_by_session(userId, milliliter, date) values($1, $2, $3)", [data.userId, data.usage, pgFormatDate(date)]);

        console.log('receivingPost');
        var query = client.query("SELECT * from waterusage_by_month where userId=($1)", [data.userId]);

        query.on('row', function(row) {
            results.push(row);
            if(row.length == 0) {
                console.log('Do Insert');
                client.query('INSERT INTO waterusage_by_month(userId, month, milliliter, lastUpdate) values($1, $2, $3, $4)', [data.userId, 'June', data.usage, pgFormatDate(date)]);
                console.log('done');
            } else {
                console.log('Do update');
                client.query('UPDATE waterusage_by_month SET milliliter = milliliter + ($1), lastUpdate = ($2) where userId=($3)', [data.usage, pgFormatDate(date), data.userId]);
            }
        });
        /*
        var query = client.query("SELECT * FROM waterusage_by_month ORDER BY userId ASC");

        console.log(query);
        // Stream results back one row at a time
        query.on('row', function(row) {
            console.log('Test');
            results.push(row);
            console.log('Test2');

        });
        */

        // SQL Query > Select Data
        /*var query = client.query("SELECT * FROM waterusage_by_session ORDER BY sessionId ASC");

        // Stream results back one row at a time
        query.on('row', function(row) {
            results.push(row);
        });
        */

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

router.get('/api/v1/sessionUsage', function(req, res) {

    var results = [];

    // Get a Postgres client from the connection pool
    pg.connect(conString, function(err, client, done) {

        // SQL Query > Select Data
        var query = client.query("SELECT * FROM waterusage_by_session ORDER BY userId ASC;");


        console.log(query);
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
