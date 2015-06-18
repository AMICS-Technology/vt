/**
 * Created by Jonathan on 6/10/2015.
 */
var pg = require('pg');
var conString = "postgres://imzyqdkhwhmmly:imzyqdkhwhmmly@ec2-54-83-36-90.compute-1.amazonaws.com:5432/d8dje8d8vfe1dp"


var client = new pg.Client(conString);
client.connect();

var query = client.query('DROP TABLE waterusage_by_session; CREATE TABLE waterusage_by_session(' +
    'sessionId SERIAL PRIMARY KEY, ' +
    'userId INT,' +
    'milliliter INT,' +
    'date DATE' +
')');
query.on('end', function() { client.end(); });

var query = client.query('DROP TABLE waterusage_by_month; CREATE TABLE waterusage_by_month(' +
    'userId INT,' +
    'month VARCHAR(30),' +
    'milliliter INT,' +
    'lastUpdate DATE' +
')');
query.on('end', function() { client.end(); });