var router = require('express').Router();
const EstudiantesController = require('../controllers/estudiantes.controller');

// Estudiante CRUD
router.get('/', EstudiantesController.obtenerTodosEstudiantes);
router.get('/:id_estudiante', EstudiantesController.obtenerEstudiante);
router.post('/', EstudiantesController.crearEstudiante);
router.get('/leccion/verificar', EstudiantesController.verificarEstudiantePuedeDarLeccion); // <= documentacion
module.exports = router;
