const LeccionesController = require('../controllers/preguntas.controller')

const express = require('express');
const router  = express.Router();


router.get('/', LeccionesController.getAll)

router.get('/:id_leccion', LeccionesController.getById)

module.exports = router