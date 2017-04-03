var router = require('express').Router()
var PreguntasController = require('../controllers/preguntas.controller');

router.get('/', PreguntasController.obtenerTodasPreguntas);
router.get('/:id_pregunta', PreguntasController.obtenerPregunta);
router.get('/profesor/:id_profesor', PreguntasController.obtenerPreguntasPorCreador);
router.post('/', PreguntasController.crearPregunta);
router.put('/:id_pregunta', PreguntasController.actualizarPregunta);
router.delete('/:id_pregunta', PreguntasController.eliminarPregunta);

module.exports = router;
