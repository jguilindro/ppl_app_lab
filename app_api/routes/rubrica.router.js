var router = require('express').Router();
var RubricaController = require('../controllers/rubrica.controller');

router.post('/', RubricaController.crearRegistro);

router.get('/:id_registro', RubricaController.obtenerRegistroPorId);

router.get('/paralelo/:paralelo/grupo/:grupo', RubricaController.obtenerRegistrosDeGrupo);

router.get('/paralelo/:paralelo/grupo/:grupo/capitulo/:capitulo', RubricaController.obtenerRegistrosDeCapituloDeGrupo);


module.exports = router;


/*
{
	_id
	materia
	paralelo
	grupo
	capitulo
	ejercicio: 1
	calificaciones: [
		{
			regla: presentacion-1
			calificacion
		},
		{
			regla: trabajoEnGrupo-1
			calificacion
		},
		{
			regla:
			calificacion
		}
	]
	total
},
{
	_id
	materia
	paralelo
	grupo
	capitulo
	ejercicio: 2
	calificaciones: [
		{
			regla:
			calificacion
		},
		{
			regla:
			calificacion
		},
		{
			regla:
			calificacion
		}
	]
	total
}
*/

/*
	arrayCalificaciones = [
		[{ regla: '', calificacion: 0}, { regla: '', calificacion: 0}, { regla: '', calificacion: 0}],
		[{ regla: '', calificacion: 0}, { regla: '', calificacion: 0}, { regla: '', calificacion: 0}],
		[{ regla: '', calificacion: 0}, { regla: '', calificacion: 0}, { regla: '', calificacion: 0}],
		[{ regla: '', calificacion: 0}, { regla: '', calificacion: 0}, { regla: '', calificacion: 0}],
	]
*/