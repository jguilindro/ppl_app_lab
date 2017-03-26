var router = require('express').Router();
const GruposController = require('../controllers/grupos.controller')

router.get('/', GruposController.obtenerTodosGrupos);
router.post('/', GruposController.crearGrupo);
router.delete('/:id_grupo', GruposController.eliminarGrupo);

module.exports = router