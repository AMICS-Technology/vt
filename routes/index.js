var express = require('express');
var router = express.Router();
var path    = require("path");


var pg = require('pg');

var client = new pg.Client(process.env.DATABASE_URL);

client.connect();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendfile('public/index.html');
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

router.get('/api/v1/dashboards/month/:userId', function(req, res, next) {
    var date = new Date();
    var query = client.query('SELECT * FROM waterusage_by_month WHERE userId=($1) AND month=($2) ', [req.params.userId, date.getPrevMonth()]);

    var retValue = [];
    query.on('row', function(row) {
        retValue.push(row);
    });

    query.on('end', function() {
        var amt;
        if(retValue == null || retValue.length == 0) {
            amt = 659835 * 30;
        } else {
            amt = retValue[0].usage * (.98 / 30);
        }
        var monthUsageQuery = client.query('SELECT * FROM waterusage_by_month WHERE userId=($1) and month=($2)', [req.params.userId, date.yyyymm()]);

        var retValue2 = [];
        monthUsageQuery.on('row', function(row) {
            console.log(row);
            retValue2.push(row);
        });

        monthUsageQuery.on('end', function() {
            var amt_range = amt/7;
            var amt_low = 0;
            var amt_high = amt_range;
            var retColor = '';
            var cvNumber;
            var monthUsage;

            if(retValue2.length != 0) {
                monthUsage = retValue2[0].usage;
            } else {
                monthUsage = 0;
            }

            // Create an Array of data sets
            console.log(monthUsage);
            for(var i = 0; i < 7; i++) {
                if(amt_low < monthUsage && amt_high >= monthUsage) {
                    cvNumber = i;
                }
                amt_low = amt_low + amt_range;
                amt_high = amt_high + amt_range;
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

            var retObject = {
                amt: amt,
                mt: monthUsage,
                color: retColor
            };
            return res.json(retObject);
        });


    });
});


router.get('/api/v1/dashboards/day/:userId', function(req, res, next) {
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
            console.log(row);
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

            var retObject = {
                adt: adt,
                dt: dayUsage,
                color: retColor
            };
            return res.json(retObject);
        });


    });
});

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

        console.log(date.yyyymmdd());

        var dayUsageQuery = client.query('SELECT * FROM waterusage_by_day WHERE userId=($1) and date=($2)', [req.params.userId, date.yyyymmdd()]);

        var retValue2 = [];
        dayUsageQuery.on('row', function(row) {
            console.log(row);
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
                    retColor = 'RED';
                    break;
            }
                return res.json("<" + retColor + ">");
        });


    });

});


// This should be similar to the arduino endpoint.
// GET request in
// Query database for previous month usage
// Return ADT (Max Value) - DayTotal (Guage Value)
router.get('/api/v1/dashboard/:userId', function(req, res) {
    var query = client.query('SELECT * from waterusage_by_day where userId=($1)', [req.params.userId]);
    var retValue = [];
    query.on('row', function(row) {
        retValue.push(row);
    });

    query.on('end', function() {
        return res.json(retValue);
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
    console.log('inserting session - ' + JSON.stringify(req.body));
    req.body.usage = Math.floor(req.body.usage);

    var insertQuery = client.query('INSERT INTO waterusage_by_session(userId, faucetId, usage, date) values($1, $2, $3, $4)',
        [1, req.body.faucetId, req.body.usage, date]);

    insertQuery.on('end', function() {
        console.log('Completed INSERT to waterusage_by_session');
    });

    // Find or Update Water usage by date
    var selectWaterByDate = client.query('SELECT * FROM waterusage_by_day where userId=($1) AND date=($2)',
        [1, date.yyyymmdd()]);

    selectWaterByDate.on('end', function(result) {

        if(result.rowCount == 0) {
            var insertDayQuery = client.query('INSERT INTO waterusage_by_day(userId, usage, date) values($1, $2, $3)',
                [1, req.body.usage, date.yyyymmdd()]);

            insertDayQuery.on('end', function() {
                console.log('Completed INSERT to waterusage_by_day');
            });

        } else {
            var updateDayQuery = client.query('UPDATE waterusage_by_day SET usage = usage + ($1) WHERE userId=($2) AND date=($3)',
                [req.body.usage, 1, date.yyyymmdd()]);

            updateDayQuery.on('end', function() {
                console.log('Completed UPDATE to waterusage_by_day');
            });


        }
    });

    var selectMonthByDate = client.query('SELECT * FROM waterusage_by_month where userId=($1) AND month=($2)',
        [1, date.yyyymm()]);

    selectMonthByDate.on('end', function(result) {

        if(result.rowCount == 0) {
            var insertMonthQuery = client.query('INSERT INTO waterusage_by_month(userId, usage, month, lastUpdate) values ($1, $2, $3, $4)',
                [1, req.body.usage, date.yyyymm(), date]);

            insertMonthQuery.on('end', function () {
                console.log('Completed INSERT into waterusage_by_month');
            })
        } else {
            var updateMonthQuery = client.query('UPDATE waterusage_by_month SET usage = usage + ($1), lastUpdate = ($2) WHERE userId=($3) AND month=($4)',
                [req.body.usage, date, 1, date.yyyymm()]);

            updateMonthQuery.on('end', function() {
                console.log('Completed UPDATE to waterusage_by_month');
            });
        }

    });



    // Insert or update water usage by month

    res.redirect('/api/test/getAllBySession/' + req.body.userId);

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
