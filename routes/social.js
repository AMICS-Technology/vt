/**
 * Created by jonathan on 9/5/15.
 */
var express = require('express');
var router = express.Router();
var path    = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendfile('public/social/login.html');
});

router.get('/login', function (req, res, next) {
    res.sendfile('public/social/login.html');
});

router.post('/login', function (req, res, next) {
    res.sendfile('public/social/main.html');
});

module.exports = router;