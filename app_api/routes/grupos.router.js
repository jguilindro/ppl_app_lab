var authApi = require('../config/auth.api')
var router = require('express').Router();
const GruposController = require('../controllers/grupos.controller');

router.get('/',authApi.estudiante, GruposController.obtenerTodosGrupos);
router.get('/:id_grupo', authApi.estudiante,GruposController.obtenerGrupo);
router.post('/', authApi.profesor,GruposController.crearGrupo);
router.delete('/:id_grupo',authApi.profesor, GruposController.eliminarGrupo);

// Estudiantes
router.post('/:id_grupo/estudiantes/:id_estudiante',authApi.profesor, GruposController.anadirEstudiante);
router.delete('/:id_grupo/estudiantes/:id_estudiante', authApi.profesor,GruposController.eliminarEstudiante);


router.get('/estudiante/:id_estudiante', authApi.estudiante, GruposController.obtenerGrupoDeEstudiante);

module.exports = router
