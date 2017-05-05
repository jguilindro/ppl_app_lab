var router = require('express').Router();
const EstudiantesController = require('../controllers/estudiantes.controller');

// Estudiante CRUD
router.get('/', EstudiantesController.obtenerTodosEstudiantes);
router.get('/:id_estudiante', EstudiantesController.obtenerEstudiante);
router.post('/', EstudiantesController.crearEstudiante);
router.get('/leccion/verificar/:codigo_leccion', EstudiantesController.verificarEstudiantePuedeDarLeccion); // <= documentacion
router.put('/calificar/leccion/:id_leccion/estudiante/:id_estudiante', EstudiantesController.calificarLeccion)
router.get('/esperando_leccion', EstudiantesController.EditarANoesperandoLeccion)
router.post('/codigo_ingresado', EstudiantesController.ingresadocodigoLeccion)
module.exports = router;
