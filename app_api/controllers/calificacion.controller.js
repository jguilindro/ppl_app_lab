const CalificacionModel = require('../models/calificacion.model');
const GrupoModel = require('../models/grupo.model');
const EstudianteModel = require('../models/estudiante.model');
const LeccionModel = require('../models/leccion.model');
const ParaleloModel = require('../models/paralelo.model');
const ParaleloController = require('../controllers/paralelos.controller');
bodyParser        = require('body-parser');
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
	var id_leccion = req.params.id_leccion;
	var flag = false;
	var todosCalificados = true;
	CalificacionModel.calificar(req.params.id_leccion, req.params.id_grupo, req.body.calificacion, (err, doc) => {
		//Primero añado la calificación al registro
		if(err){
			return response.serverError(res);
		}
		else{
			CalificacionModel.obtenerRegistro(req.params.id_leccion, req.params.id_grupo, (err, registro) => {
				//Luego obtengo el registro completo de la calificación. Para usar el array de participantes
				if(err) {
					return response.serverError(res);
				}else{
					//Luego, a cada participante del registro le añado la calificación a la lección tomada
					registro[0].participantes.forEach(function(estudianteId){
						EstudianteModel.calificarLeccion(estudianteId, id_leccion, calificacion_nueva, (err, doc) => {
							if(err) {
								flag = true;
								return response.serverError(res);
							}
						});
					});
					//Finalmente, tengo que cambiar el estado de la lección a 'calificado'
					//Para eso reviso primero si ya todos los grupos de esta lección fueron calificados.
					CalificacionModel.obtenerRegistroPorLeccion(id_leccion, (err, registros) => {
						if(err){ 
							return response.serverError(res);
						}
						else{
							if(registros!=null){
								//Recorro todos los registros de la lección que se está calificando
								registros.forEach(function(registroCalificacion){
									//Si hay por lo menos uno que no ha sido calificado entonces no cambio esta cosa.
									if(!registroCalificacion.calificada&&registroCalificacion.participantes.length!=0){
										todosCalificados = false;
										return false;
									}
								});
								//Si al final de revisar todos los registros, veo que todos han sido calificados entonces cambio el estado
								if(todosCalificados){
									LeccionModel.calificar(id_leccion, (err, doc) => {
										if(err){
											flag = true;
											return response.serverError(res);
										}
									});
								}
							}
						}
					});
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

//no reconoce la id del grupo, y devuelve un array vacio, es muy raro
const obtenerRegistroPorGrupo = (req, res) => {
	CalificacionModel.obtenerRegistroPorGrupo(req.params.id_grupo, (err, registro) => {
		if(err) return response.serverError(res);
		return response.ok(res, registro);
	});
}

const obtenerRegistroParalelo = (req, res ) => {
	var paraleloId = '';
	var leccionesParalelo=[];
	var registros = [];
	ParaleloModel.obtenerParalelosProfesor(req.session._id, (err, paralelos) => {
		if (err) return respuesta.serverError(res);
		paraleloId = paralelos._id;
	})
	LeccionModel.obtenerLeccionesParalelo(paraleloId, (err, lecciones) => {
		if (err) return respuesta.serverError(res);
		leccionesParalelo = lecciones;
	})
	$.each(leccionesParalelo, function (index, value) {
		//CalificacionModel.obtenerRegistroPorLeccion
		CalificacionModel.obtenerRegistroPorLeccion(value._id, (err, registro) => {
			if(err) return response.serverError(res);
			registros.push(registro);
			//return response.ok(res, registros);
		});
	})
	return response.ok(res, registros);
}

const anadirNombreGrupo = (req, res) => {
	CalificacionModel.anadirNombreGrupo(req.params.id_grupo, req.body.nombre_grupo, (err, doc) => {
		if (err) return response.serverError(res);
		return response.okActualizado(res);
	})
}

/*
const obtenerRegistroPorGrupos = (req, res) => {
	var registros = [];
	ParaleloModel.obtenerParalelosProfesor(req.session._id, (err, paralelos) => {
		if (err) return respuesta.serverError(res);
		console.log(paralelos);
		console.log(paralelos.grupos);
		return response.ok(res, paralelos);
		$.each(paralelos.grupos,function (index, value) {
			CalificacionModel.obtenerRegistroPorGrupos(value._id,(err, registro) => {
				if(err) return response.serverError(res);
				registros.push(registro);
				//return response.ok(res, registro);
			});
		})
	})
	//return response.ok(res, registros);
}
*/

module.exports = {
	crearRegistro,
	obtenerRegistro,
	obtenerRegistroPorLeccion,
	anadirParticipante,
	calificar,
	anadirNombreGrupo,
	obtenerRegistroPorGrupo,
	obtenerRegistroParalelo
}
