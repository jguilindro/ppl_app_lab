var router = require('express').Router();
const LeccionController = require('../controllers/lecciones.controller');

router.get('/', LeccionController.obtenerTodasLecciones);
router.get('/:id_leccion', LeccionController.obtenerLeccion);
router.post('/', LeccionController.crearLeccion);
router.put('/:id_leccion', LeccionController.actualizarLeccion);
router.delete('/:id_leccion', LeccionController.eliminarLeccion);

module.exports = router;
