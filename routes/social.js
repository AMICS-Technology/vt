/**
 * Created by jonathan on 9/5/15.
 */
var express = require('express');
var router = express.Router();
var path    = require("path");

/* GET home page. */
router.get('/', function(req, res, next) {
    res.sendfile('public/social/index.html');
});

module.exports = router;