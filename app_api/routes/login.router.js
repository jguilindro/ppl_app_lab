var router = require('express').Router();
var LoginController = require('../controllers/login.controller');

router.post('/login', LoginController.login);
router.post('/logout', LoginController.logout);

module.exports = router;
