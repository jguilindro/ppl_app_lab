var router = require('express').Router();
var CalificacionController = require('../controllers/calificacion.controller');

router.post('/', CalificacionController.crearRegistro);
router.get('/:id_leccion/:id_grupo', CalificacionController.obtenerRegistro);
router.put('/:id_leccion/:id_grupo', CalificacionController.anadirParticipante);
router.put('/calificar/:id_leccion/:id_grupo', CalificacionController.calificar);
router.get('/leccion/:id_leccion', CalificacionController.obtenerRegistroPorLeccion);

module.exports = router;