var router = require('express').Router();
var RespuestaController = require('../controllers/respuestas.controller');

router.post('/', RespuestaController.crearRespuesta);
router.post('/buscar', RespuestaController.obtenerRespuestasPorGrupoAPregunta);
router.get('/buscar/leccion/:id_leccion/pregunta/:id_pregunta/estudiante/:id_estudiante', RespuestaController.obtenerRespuestaDeEstudiante);
router.put('/:id_respuesta', RespuestaController.actualizarRespuesta);
router.get('/:id_respuesta', RespuestaController.obtenerRespuestaPorId);

module.exports = router;