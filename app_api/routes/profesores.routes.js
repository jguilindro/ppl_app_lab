const ProfesorController = require('../controllers/profesores.controller')

const express = require('express');
const router  = express.Router();

router.get('/', ProfesorController.getAll)

module.exports = router
