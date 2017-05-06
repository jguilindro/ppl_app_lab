const CapituloModel = require('../models/capitulo.model');
var response = require('../utils/responses');

const crearCapitulo = (req, res) => {
	let capitulo = new CapituloModel({
		nombre: req.body.nombre,
		tipo: req.body.tipo,
		codigoMateria: req.body.codigoMateria,
		nombreMateria: req.body.nombreMateria
	});
	capitulo.crearCapitulo((err, doc) => {
		if(err) return response.serverError(res);
		return response.creado(res);
	});
}

const obtenerTodosCapitulos = (req, res) => {
	CapituloModel.obtenerTodosCapitulos((err, capitulos) => {
		if(err) return response.serverError(res);
		return response.ok(res, capitulos);
	})
}

const agregarPregunta = (req, res) => {
	CapituloModel.agregarPregunta(req.params.id_capitulo, req.body.pregunta, (err, doc) => {
		if(err) return response.serverError(res);
		return response.okActualizado(res);
	})
}

const obtenerCapitulosPorMateria = (req, res) => {
	CapituloModel.obtenerCapitulosPorMateria(req.params.codigo_materia, (err, capitulos) => {
		if(err) return response.serverError(res);
		return response.ok(res, capitulos)
	})
}


module.exports = {
	crearCapitulo,
	obtenerTodosCapitulos,
	agregarPregunta,
	obtenerCapitulosPorMateria,
}
