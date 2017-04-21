var router = require('express').Router();
var RespuestaController = require('../controllers/respuestas.controller');

router.post('/', RespuestaController.crearRespuesta);
router.post('/buscar', RespuestaController.obtenerRespuestasPorGrupoAPregunta);

module.exports = router;