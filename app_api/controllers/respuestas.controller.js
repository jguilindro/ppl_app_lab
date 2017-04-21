const RespuestaModel = require('../models/respuestas.model');
var response = require('../utils/responses');

const crearRespuesta = (req, res) => {
	let resp = new RespuestaModel({
		estudiante: req.body.estudiante,
		leccion: req.body.leccion,
		pregunta: req.body.pregunta,
		paralelo: req.body.paralelo,
		grupo: req.body.grupo,
		contestado: req.body.contestado,
		respuesta: req.body.respuesta,
		//fechaEmpezado: req.body.fechaEmpezado,
		//fechaTerminado: req.body.fechaTerminado,
		calificacion: 0,
		feedback: ''
	});
	console.log(resp)
	resp.crearRespuesta((err) => {
		if(err) return response.serverError(res);
		return response.creado(res, resp);
	});
}

const obtenerRespuestasPorGrupoAPregunta = (req, res) => {
	RespuestaModel.obtenerRespuestasPorGrupoAPregunta(req.body.leccion, req.body.pregunta, req.body.grupo, (err, respuesta) => {
		if(err) return response.serverError(res);
		return response.ok(res, respuesta);
	})
}

module.exports = {
	crearRespuesta,
	obtenerRespuestasPorGrupoAPregunta
}

