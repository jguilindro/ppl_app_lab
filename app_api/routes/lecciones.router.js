var router = require('express').Router();
const LeccionController = require('../controllers/lecciones.controller');

router.get('/', LeccionController.obtenerTodasLecciones);
router.get('/:id_leccion', LeccionController.obtenerLeccion);
router.post('/', LeccionController.crearLeccion);
router.put('/:id_leccion', LeccionController.actualizarLeccion);
router.delete('/:id_leccion', LeccionController.eliminarLeccion);
router.post('/tomar/:id_leccion', LeccionController.tomarLeccion); // <= DOCUMENTACION
router.post('/comenzar_leccion/:id_leccion', LeccionController.comenzarLeccion) // <= DOCUMENTACION
router.post('/:id_paralelo/estudiantes', LeccionController.habilitarEstudiantesCursoParaLeccion) // DOCUMENTACION
router.get('/:id_leccion/grupo/:id_grupo', LeccionController.obtenerEstudiantesDeLeccion);

module.exports = router;
