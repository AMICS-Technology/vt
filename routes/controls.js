var express = require('express');
var router = express.Router();

var seedType;
var sectionDistance;
var totalDistance;

/* GET users listing. */
router.get('/', function(req, res) {
  res.render('main/controls', {seedType: seedType, sectionDistance:sectionDistance, totalDistance:totalDistance});
});

router.get('/state', function(req, res) {
  res.send('"'+ seedType + '|' + sectionDistance + '|' + totalDistance + '"');
});

router.post('/values', function(req, res) {
  seedType = req.body.seedType;
  sectionDistance = req.body.sectionDistance;
  totalDistance = req.body.totalDistance;
  res.redirect('/');
});

module.exports = router;
