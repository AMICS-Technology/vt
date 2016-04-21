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
  res.send('"<'+ seedType + '|' + sectionDistance + '|' + totalDistance + '>"');
});

router.get('/state/seedType', function(req, res) {
  if(seedType.toLowerCase() == 'almond') {
    res.send(seedType + '"<50>"');
  } else if(seedType.toLowerCase() == 'acorn') {
    res.send(seedType + '"<25>"');
  }
});

router.get('/state/sectionDistance', function(req, res) {
  res.send('"<' + sectionDistance + '>"');
});

router.get('/state/totalDistance', function(req, res) {
  res.send('"<' + totalDistance+ '>"');
});

router.post('/values', function(req, res) {
  seedType = req.body.seedType;
  sectionDistance = req.body.sectionDistance;
  totalDistance = req.body.totalDistance;
  res.redirect('/controls');
});

module.exports = router;
