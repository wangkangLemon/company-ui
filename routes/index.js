var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'this is ui index' });
});

// 所有的视图页面
router.get('/view/*', function(req, res, next){
  res.set('Content-Type', 'text/html');
  res.sendFile(path.join(__dirname, '../public/index.html'));
})

/* ping for heartbeat */
router.get('/ping', function (re, res) {
    res.send('PONG');
})

module.exports = router;
