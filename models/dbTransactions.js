/**
 * Created by jonathan on 7/5/15.
 */

var pg = require('pg');


module.exports = {
    getSessionByUser : function () {
        console.log('do SessionByUser');
    },

    getDayByUser: function () {
        console.log('do DayByUser');

    },

    getMonthByUser: function() {
        console.log('do MonthByUser');

    }

};

/*
var client = new pg.Client({
    user: "imzyqdkhwhmmly",
    password: "N_vtZuYXu_HblK2M7nG0vflupd",
    database: "d8dje8d8vfe1dp",
    port: 5432,
    host: "ec2-54-83-36-90.compute-1.amazonaws.com",
    ssl: true
});
client.connect();

var getAllBySession = client.query('SELECT * from waterusage_per_session', function(err, results) {
    done();
        console.log('do something!');

    if(err) {
        return console.error('error running query', err);
    }
    console.log(result.rows[0]);
    }
);

    */