var express = require('express');
var app = express()
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send('home, root pageasdsasd')
});

module.exports = router;
