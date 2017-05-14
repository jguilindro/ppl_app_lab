var router = require('express').Router();
const EstudiantesController = require('../controllers/estudiantes.controller');

// Estudiante CRUD
router.get('/', EstudiantesController.obtenerTodosEstudiantes);
router.get('/:id_estudiante', EstudiantesController.obtenerEstudiante);
router.post('/', EstudiantesController.crearEstudiante);
router.put('/calificar/leccion/:id_leccion/estudiante/:id_estudiante', EstudiantesController.calificarLeccion)
router.get('/tomar_leccion/:codigo_leccion', EstudiantesController.tomarLeccion)
module.exports = router;
