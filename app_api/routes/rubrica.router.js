var router = require('express').Router();
var RubricaController = require('../controllers/rubrica.controller');

router.post('/', RubricaController.crearRegistro);

router.get('/:id_registro', RubricaController.obtenerRegistroPorId);

router.get('/paralelo/:paralelo/grupo/:grupo', RubricaController.obtenerRegistrosDeGrupo);

router.get('/paralelo/:paralelo/grupo/:grupo/capitulo/:capitulo', RubricaController.obtenerRegistrosDeCapituloDeGrupo);


module.exports = router;
