var router = require('express').Router()
var LoginController = require('../controllers/login.controller')

router.post('/login/dev', LoginController.loginDev)
router.post('/login', LoginController.login)
router.get('/logout', LoginController.logout)
router.get('/usuario_conectado', LoginController.obtenerUsuarioLoggeado)
module.exports = router;
