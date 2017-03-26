var router = require('express').Router();
const EstudiantesController = require('../controllers/estudiantes.controller');

// Estudiante CRUD
router.get('/', EstudiantesController.obtenerTodosEstudiantes);
router.get('/:id_estudiante', EstudiantesController.obtenerEstudiante);
router.post('/', EstudiantesController.crearEstudiante);

// Lecciones
router.get('/', EstudiantesController.obtenerLecciones);
router.post('/lecciones/:id_leccion', EstudiantesController.anadirLeccion);
router.put('/lecciones/:id_leccion', EstudiantesController.editarLeccion);
router.delete('/lecciones/:id_leccion', EstudiantesController.eliminarLeccion);

// Grupo
router.get('/grupo', EstudiantesController.obtenerGrupo);
router.post('/grupo/:id_grupo', EstudiantesController.anadirGrupo);
router.delete('/grupo/:id_grupo', EstudiantesController.eliminarGrupo);



module.exports = router;
