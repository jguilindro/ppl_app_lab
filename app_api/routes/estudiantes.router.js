var authApi = require('../config/auth.api')
var router = require('express').Router();
const EstudiantesController = require('../controllers/estudiantes.controller');

// Estudiante CRUD
router.get('/',authApi.estudiante, EstudiantesController.obtenerTodosEstudiantes);
router.get('/:id_estudiante',authApi.estudiante, EstudiantesController.obtenerEstudiante);
router.post('/', authApi.profesor, EstudiantesController.crearEstudiante);
router.put('/calificar/leccion/:id_leccion/estudiante/:id_estudiante', authApi.profesor, EstudiantesController.calificarLeccion)
router.get('/tomar_leccion/:codigo_leccion', authApi.estudiante, EstudiantesController.tomarLeccion)
router.get('/leccion/datos_leccion', authApi.estudiante,EstudiantesController.leccionDatos)
module.exports = router;
