/**
 * Created by Jonathan on 6/10/2015.
 */
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

var query = client.query('DROP TABLE IF EXISTS waterusage_by_session; CREATE TABLE waterusage_by_session(' +
    'sessionId SERIAL PRIMARY KEY, ' +
    'faucetId INT' +
    'userId INT,' +
    'usage INT,' +
    'date DATE' +
')');
query.on('end', function() { client.end(); });

var query = client.query('DROP TABLE IF EXISTS users; CREATE TABLE users(' +
    'userId SERIAL PRIMARY KEY, ' +
    'name varchar(50),' +
    'facebook varchar(100),' +
    'twitter varchar(100),' +
    'dateRegistered DATE' +
    ')');
query.on('end', function() { client.end(); });

var query = client.query('DROP TABLE IF EXISTS faucets; CREATE TABLE faucets(' +
    'userId INT, ' +
    'faucetId INT' +
    ')');
query.on('end', function () { client.end(); });

var query = client.query('DROP TABLE IF EXISTS waterusage_by_day; CREATE TABLE waterusage_by_day(' +
    'userId INT,' +
    'usage INT,' +
    'date DATE' +
    ')');
query.on('end', function() { client.end(); });

var query = client.query('DROP TABLE IF EXISTS waterusage_by_month; CREATE TABLE waterusage_by_month(' +
    'userId INT,' +
    'month VARCHAR(30),' +
    'usage INT,' +
    'lastUpdate DATE' +
')');
query.on('end', function() { client.end(); });