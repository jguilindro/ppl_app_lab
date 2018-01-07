const EstudiantesController = require('../controllers/estudiantes.controller')

const express = require('express');
const router  = express.Router();

router.get('/perfil', EstudiantesController.getPerfilByCorreo)

module.exports = router
