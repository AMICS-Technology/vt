/**
 * Created by Jonathan on 6/10/2015.
 */
var pg = require('pg');
var fs = require('fs');
var sql = fs.readFileSync('dbUpdates.sql').toString();

var client = new pg.Client({
    user: "imzyqdkhwhmmly",
    password: "N_vtZuYXu_HblK2M7nG0vflupd",
    database: "d8dje8d8vfe1dp",
    port: 5432,
    host: "ec2-54-83-36-90.compute-1.amazonaws.com",
    ssl: true
});
client.connect();

var query = client.query(sql);
query.on('end', function() { client.end(); });
