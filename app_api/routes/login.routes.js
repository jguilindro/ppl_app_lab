var router = require('express').Router();
const LoginController = require('../controllers/login.controller')

router.post('/entrar', LoginController.login);
router.get('/salir', LoginController.logout);

module.exports = router;
