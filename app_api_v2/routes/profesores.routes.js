var router = require('express').Router();
const ProfesorController = require('../controllers/profesores.controller')

router.get('/', ProfesorController.obtenerTodosProfesores);

module.exports = router;
