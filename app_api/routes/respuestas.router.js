var router = require('express').Router();
var RespuestaController = require('../controllers/respuestas.controller');

router.post('/', RespuestaController.crearRespuesta);
router.put('/:id_respuesta', RespuestaController.actualizarRespuesta);
router.get('/:id_respuesta', RespuestaController.obtenerRespuestaPorId);

router.post('/buscar', RespuestaController.obtenerRespuestasPorGrupoAPregunta);
router.get('/buscar/:id_leccion/:id_pregunta/:id_grupo', obtenerRespuestasPorGrupoAPreguntaGet);
router.get('/buscar/leccion/:id_leccion/pregunta/:id_pregunta/estudiante/:id_estudiante', RespuestaController.obtenerRespuestaDeEstudiante);
router.put('/calificar/leccion/:id_leccion/pregunta/:id_pregunta/grupo/:id_grupo', RespuestaController.calificarRespuestaGrupal);

module.exports = router;