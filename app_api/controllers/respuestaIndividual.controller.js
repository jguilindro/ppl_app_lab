const RespuestaIndividualModel = require('../models/respuestaIndividual');
var response = require('../utils/responses');

const crearRespuesta = (req, res) => {
	let resp = new RespuestaIndividualModel({
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

module.exports = {
	crearRespuesta
}