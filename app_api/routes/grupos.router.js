var router = require('express').Router();
const GruposController = require('../controllers/grupos.controller');

router.get('/', GruposController.obtenerTodosGrupos);
router.get('/:id_grupo', GruposController.obtenerGrupo);
router.post('/', GruposController.crearGrupo);
router.delete('/:id_grupo', GruposController.eliminarGrupo);

module.exports = router
