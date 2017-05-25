var authApi = require('../config/auth.api')
var router = require('express').Router();
const ProfesorController = require('../controllers/profesores.controller')

router.get('/', authApi.estudiante, ProfesorController.obtenerTodosProfesores);
router.get('/:id_profesor', authApi.estudiante, ProfesorController.obtenerProfesor);
router.post('/', authApi.profesor, ProfesorController.crearProfesor);

module.exports = router;
