var express = require('express');
var app = express()
var router = express.Router();

router.get('/', function(req, res, next) {
  res.send('api profesor')
});

module.exports = router;
