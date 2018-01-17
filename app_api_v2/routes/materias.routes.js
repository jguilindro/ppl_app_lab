const MateriaController = require('../controllers/materias.controller')

const express = require('express');
const router  = express.Router();

router.get('/', MateriaController.getAll)

module.exports = router