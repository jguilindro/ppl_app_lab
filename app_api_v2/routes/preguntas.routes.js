const PreguntasController = require('../controllers/preguntas.controller')

const express = require('express');
const router  = express.Router();

router.get('/', PreguntasController.getAll)
router.post('/', PreguntasController.crearPregunta)

router.get('/:id_pregunta', PreguntasController.getById)
router.delete('/:id_pregunta', PreguntasController.eliminarPregunta)

module.exports = router