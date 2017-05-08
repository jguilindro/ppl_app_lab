const CalificacionModel = require('../models/calificacion.model');
var response = require('../utils/responses');

const crearRegistro = (req, res) => {
	let calificacion = new CalificacionModel({
		leccion: req.body.leccion,
		grupo: req.body.grupo,
		calificacion: 0,
		leccionTomada: false,
		calificada: false
	});
	console.log(calificacion);
	calificacion.crearRegistro((err, doc) => {
		if(err) return response.serverError(res);
		return response.creado(res);
	})
}

const obtenerRegistro = (req, res) => {
	CalificacionModel.obtenerRegistro(req.params.id_leccion, req.params.id_grupo, (err, registro) => {
		if(err) return response.serverError(res);
		return response.ok(res, registro);
	});
}

const anadirParticipante = (req, res) => {
	CalificacionModel.anadirParticipante(req.params.id_leccion, req.params.id_grupo, req.body.estudiante, (err, doc) => {
		if(err) return response.serverError(res);
		return response.okActualizado(res);
	});
}

const calificar = (req, res) => {
	CalificacionModel.calificar(req.params.id_leccion, req.params.id_grupo, req.body.calificacion, (err, doc) => {
		if(err) return response.serverError(res);
		return response.okActualizado(res);
	});
}


module.exports = {
	crearRegistro,
	obtenerRegistro,
	anadirParticipante,
	calificar,
}