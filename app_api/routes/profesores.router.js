var router = require('express').Router();
const ProfesorController = require('../controllers/profesores.controller')

router.get('/login', function(req, res, next) {
  res.send('login')
})

router.get('/', ProfesorController.obtenerTodosProfesores);
router.post('/', ProfesorController.crearProfesor);
router.put('/:id_profesor', ProfesorController.editarProfesor);
router.delete('/:id_profesor', ProfesorController.eliminarProfesor);

module.exports = router;
