var router = require('express').Router();
const ProfesorController = require('../controllers/profesores.controller')

router.get('/', ProfesorController.obtenerTodosProfesores);
router.get('/:id_profesor', ProfesorController.obtenerProfesor);
router.post('/', ProfesorController.crearProfesor);

module.exports = router;
