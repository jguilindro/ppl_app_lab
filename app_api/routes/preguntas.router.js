var authApi = require('../config/auth.api')
var router = require('express').Router()
var PreguntasController = require('../controllers/preguntas.controller');
//CRUD
router.get('/', authApi.estudiante, PreguntasController.obtenerTodasPreguntas);
router.get('/:id_pregunta', authApi.estudiante, PreguntasController.obtenerPregunta);
router.post('/',  authApi.profesor, PreguntasController.crearPregunta);
router.put('/:id_pregunta', authApi.estudiante,PreguntasController.actualizarPregunta);
router.delete('/:id_pregunta',authApi.profesor, PreguntasController.eliminarPregunta);
//METODOS APARTE
router.get('/profesor/:id_profesor',authApi.profesor, PreguntasController.obtenerPreguntasPorCreador);



module.exports = router;
