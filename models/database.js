/**
 * Created by Jonathan on 6/10/2015.
 */
var pg = require('pg');
var fs = require('fs');
var sql = fs.readFileSync('dbUpdates.sql').toString();

var client = new pg.Client(process.env.DATABASE_URL);
client.connect();

var query = client.query(sql);
query.on('end', function() { client.end(); });
