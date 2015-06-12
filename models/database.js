/**
 * Created by Jonathan on 6/10/2015.
 */
var pg = require('pg');
var conString = "postgres://root:vulpes123@vt.cvfd8nt5omdq.us-west-2.rds.amazonaws.com:5432/vt"


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