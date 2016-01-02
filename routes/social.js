/**
 * Created by jonathan on 9/5/15.
 */
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('main/login', { title: 'Hello World', body: 'The login page!'})
});

router.get('/login', function (req, res, next) {

    res.render('main/home', { title: 'Hello World', body: 'Hello World'});

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