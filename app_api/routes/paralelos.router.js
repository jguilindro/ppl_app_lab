var router = require('express').Router();
const ParalelosController = require('../controllers/paralelos.controller');
var authApi = require('../config/auth.api')

router.get('/', authApi.estudiante, ParalelosController.obtenerTodosParalelos);
router.get('/:id_paralelo', authApi.estudiante, ParalelosController.obtenerParalelo);
router.post('/', authApi.profesor, ParalelosController.crearParalelo);
router.put('/:id_paralelo', authApi.profesor, ParalelosController.actualizarParalelo);
router.delete('/:id_paralelo',authApi.profesor,  ParalelosController.eliminarParalelo);

// grupos
router.post('/:id_paralelo/grupos/:id_grupo', authApi.profesor, ParalelosController.anadirGrupoAParalelo);
router.delete('/:id_paralelo/grupos/:id_grupo',authApi.profesor, ParalelosController.eliminarGrupoDeParalelo);

// profesores
router.post('/:id_paralelo/profesores/:id_profesor', authApi.profesor, ParalelosController.anadirProfesorAParalelo);
router.delete('/:id_paralelo/profesores',authApi.profesor,  ParalelosController.eliminarProfesorDeParalelo);
router.get('/profesores/mis_paralelos', authApi.profesor, ParalelosController.obtenerParalelosProfesor);
router.post('/:id_paralelo/peers/:id_profesor',authApi.profesor, ParalelosController.anadirPeerAParalelo)

// estudiantes
router.post('/:id_paralelo/estudiantes/:id_estudiante',authApi.profesor, ParalelosController.anadirEstudianteAParalelo);
router.delete('/:id_paralelo/estudiantes/:id_estudiante', authApi.profesor,  ParalelosController.eliminarEstudianteDeParalelo);
router.get('/estudiante/:id_estudiante',authApi.estudiante, ParalelosController.obtenerParaleloDeEstudiante);


// Lecciones
router.post('/:id_paralelo/leccion/:id_leccion', authApi.estudiante, ParalelosController.dandoLeccion) // <= DOCUMENTACION
router.post('/:id_paralelo/leccion_ya_comenzo',authApi.estudiante,  ParalelosController.leccionYaComenzo)
router.get('/:id_paralelo/obtener_paralelo',authApi.profesor, ParalelosController.obtenerParaleloParaLeccion)
module.exports = router
