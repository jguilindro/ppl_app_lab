var router = require('express').Router();
var LoginController = require('../controllers/login');

router.post('/', function(req, res, next) {
  console.log(req.body)
  if (req.body.username === 'joel' && req.body.password==='123') {
    req.locals.status = true
    console.log('sad')
    res.send('coenctado')
  }
  res.send('no conectado')
});

module.exports = router;
