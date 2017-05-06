var router = require('express').Router();
var CapituloController = require('../controllers/capitulo.controller');

//CRUD
router.post('/', CapituloController.crearCapitulo);
router.get('/', CapituloController.obtenerTodosCapitulos);
router.put('/:id_capitulo', CapituloController.agregarPregunta);
router.get('/materia/:codigo_materia', CapituloController.obtenerCapitulosPorMateria);

module.exports = router;