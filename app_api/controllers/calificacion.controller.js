const CalificacionModel = require('../models/calificacion.model');
const GrupoModel = require('../models/grupo.model');
const EstudianteModel = require('../models/estudiante.model');
bodyParser        = require('body-parser')
var response = require('../utils/responses');

const crearRegistro = (req, res) => {
	GrupoModel.obtenerGrupo(req.body.grupo, (err, grupo) => {
		let calificacion = new CalificacionModel({
			leccion: req.body.leccion,
			grupo: req.body.grupo,
			calificacion: 0,
			leccionTomada: false,
			calificada: false,
			nombreGrupo: grupo.nombre,
			paralelo: req.body.paralelo,
			nombreParalelo: req.body.nombreParalelo
		});
		console.log(calificacion);
		calificacion.crearRegistro((err, doc) => {
			if(err) return response.serverError(res);
			return response.creado(res);
		})
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
	var calificacion_nueva = req.body.calificacion;
	var id_leccion = req.params.id_leccion
	var flag = false
	CalificacionModel.calificar(req.params.id_leccion, req.params.id_grupo, req.body.calificacion, (err, doc) => {
		if(err){
			return response.serverError(res);
		} 
		else{
			CalificacionModel.obtenerRegistro(req.params.id_leccion, req.params.id_grupo, (err, registro) => {
				if(err) {
					return response.serverError(res);
				}else{
					registro[0].participantes.forEach(function(estudianteId){
						EstudianteModel.calificarLeccion(estudianteId, id_leccion, calificacion_nueva, (err, doc) => {
							if(err) {
								flag = true;
								return response.serverError(res);
							}
						});
					})
					if(!flag){
						return response.okActualizado(res);
					}	
				}
			});
		}
	});


}

const obtenerRegistroPorLeccion = (req, res) => {
	CalificacionModel.obtenerRegistroPorLeccion(req.params.id_leccion, (err, registros) => {
		if(err) return response.serverError(res);
		return response.ok(res, registros);
	});
}

const anadirNombreGrupo = (req, res) => {
	CalificacionModel.anadirNombreGrupo(req.params.id_grupo, req.body.nombre_grupo, (err, doc) => {
		if (err) return response.serverError(res);
		return response.okActualizado(res);
	})
}


module.exports = {
	crearRegistro,
	obtenerRegistro,
	obtenerRegistroPorLeccion,
	anadirParticipante,
	calificar,
	anadirNombreGrupo
}