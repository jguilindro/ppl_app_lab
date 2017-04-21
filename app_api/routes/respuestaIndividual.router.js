var router = require('express').Router();
var RespuestaIndividualController = require('../controllers/respuestaIndividual.controller');

router.post('/', RespuestaIndividualController.crearRespuesta);

module.exports = router;