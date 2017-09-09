const RubricaModel = require('../models/rubrica.model');

var response = require('../utils/responses');


const crearRegistro = (req, res) => {
	let arrayCalificaciones = JSON.parse(req.body.calificaciones);
	let rub = JSON.parse(req.body.rubrica);

	const registro = new RubricaModel({
		materia : rub.materia,
		paralelo : rub.paralelo,
		grupo : rub.grupo,
		capitulo : rub.capitulo,
		ejercicio : rub.ejercicio,
		calificaciones : arrayCalificaciones,
		total : rub.calificacion,
		evaluador : rub.evaluador
	});

	registro.crearRegistro((err, doc) => {
		if(err) return response.serverError(res)
		return response.creado(res);
	});
};

const obtenerRegistroPorId = (req, res) => {
	const idRegistro = req.params.id_registro;
	
	RubricaModel.obtenerRegistroPorId(idRegistro, (err, registro) => {
		if(err) return response.serverError(res);
		return response.ok(res, registro);
	});
}

const obtenerRegistrosDeGrupo = (req, res) => {
	const paralelo = req.params.paralelo;
	const grupo = req.params.grupo;

	RubricaModel.obtenerRegistrosDeGrupo(paralelo, grupo, (err, registros) => {
		if(err) return response.serverError(res);
		return response.ok(res, registros);
	});
};

const obtenerRegistrosDeCapituloDeGrupo = (req, res) => {
	const paralelo = req.params.paralelo;
	const grupo = req.params.grupo;
	const capitulo = req.params.capitulo;

	RubricaModel.obtenerRegistrosDeCapituloDeGrupo(paralelo, grupo, capitulo, (err, registros) => {
		if(err) return response.serverError(res);
		return response.ok(res, registros);
	});
};

module.exports = {
	crearRegistro,
	obtenerRegistroPorId,
	obtenerRegistrosDeGrupo,
	obtenerRegistrosDeCapituloDeGrupo
}