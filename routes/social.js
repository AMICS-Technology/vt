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

router.get('/login/auth/facebook', function(req, res, next) {
    /* Need authorization logic for facebook */
    res.sendfile('public/social/main.html');
});


router.get('/login/auth/twitter', function(req, res, next) {
    res.sendfile('public/social/main.html');
});


router.get('/login/auth/google', function(req, res, next) {
    res.sendfile('public/social/main.html');
});


router.post('/login', function (req, res, next) {
    res.sendfile('public/social/main.html');
});

module.exports = router;