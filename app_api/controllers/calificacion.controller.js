const CalificacionModel = require('../models/calificacion.model');
const GrupoModel = require('../models/grupo.model');
const EstudianteModel = require('../models/estudiante.model');
const LeccionModel = require('../models/leccion.model');
const ParaleloModel = require('../models/paralelo.model');
const ParaleloController = require('../controllers/paralelos.controller');
const co = require('co');
var json2csv = require('json2csv');
var fs = require('fs');

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
	var estudiante = req.body.estudiante;
	var calificacion_nueva = req.body.calificacion;
	var id_leccion = req.params.id_leccion;
	var flag = false;
	var todosCalificados = true;
	CalificacionModel.calificar(req.params.id_leccion, req.params.id_grupo, req.body.calificacion, req.body.estudiante, (err, doc) => {
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

const recalificar = (req, res) => {
	var id_leccion = req.params.id_leccion;
	var id_grupo = req.params.id_grupo;
	var calificacion_nueva = req.body.calificacion;
	var estudiante = req.body.estudiante;
	CalificacionModel.calificar(id_leccion, id_grupo, calificacion_nueva, estudiante, (err, doc) => {
		if(err) return response.serverError(res);
		return response.okActualizado(res);
	});
}

const anadirNombreGrupo = (req, res) => {
	CalificacionModel.anadirNombreGrupo(req.params.id_grupo, req.body.nombre_grupo, (err, doc) => {
		if (err) return response.serverError(res);
		return response.okActualizado(res);
	})
}


//Funciones para obtener los datos para generar el csv
const obtenerCalificaciones = (req, res) => {
	function obtenerParaleloProfesor(id_profesor){
		return new Promise((resolve, reject) => {
			ParaleloModel.obtenerParalelosProfesor(id_profesor, (err, paralelos) => {
				if (err) return reject(new Error('No se pudo obtener los paralelos'))
				return resolve(paralelos)
			})
		})
	}

	function obtenerLecciones(id_paralelo) {
		return new Promise((resolve, reject) => {
			LeccionModel.obtenerLeccionesParalelo(id_paralelo, (err, lecciones) => {
				if (err) return reject(new Error('No se pudo obtener las lecciones'))
				return resolve(lecciones)
			})
		})
	}

	function obtenerCalificacionPorLeccion(id_leccion){
		return new Promise((resolve, reject) => {
			CalificacionModel.obtenerRegistroPorLeccion(id_leccion, (err, registro) => {
				if (err) return reject(new Error('No se puedo obtener el registro'))
				return resolve(registro)
			})
		})
	}

	co(function* () {
		var id_profe = req.session._id;
		var calificacionesData = []; //Data para el JSON
		var campos = ['matricula', 'nombreEstudiante', 'apellidoEstudiante', 'grupo', 'materia', 'paralelo', 'nombreLeccion', 'tipoLeccion', 'puntaje'];

		var paralelo = yield obtenerParaleloProfesor(id_profe);
		//var lecciones = yield obtenerLecciones(paralelo[0]._id);

		if (paralelo.length > 1){
			console.log("OH NOOO ES UN PEER!!!");
			for(var z=0; z< paralelo.length; z++){
				var lecciones = yield obtenerLecciones(paralelo[z]._id);
				for (var i = 0; i < lecciones.length; i++){
					var calificacionesPorLeccion = yield obtenerCalificacionPorLeccion(lecciones[i]);
					for (var j = 0; j < calificacionesPorLeccion.length; j++){
						var calificacion = calificacionesPorLeccion[j];
						var participantes = calificacion.participantes;
						for (var x =0; x < participantes.length; x++){
							var calificacionJSON = {
								matricula: participantes[x].matricula,
								nombreEstudiante: participantes[x].nombres,
								apellidoEstudiante: participantes[x].apellidos,
								grupo: calificacion.nombreGrupo,
								materia: paralelo[0].nombreMateria,
								paralelo: calificacion.nombreParalelo,
								nombreLeccion: lecciones[i].nombre,
								tipoLeccion: lecciones[i].tipo,
								puntaje: calificacion.calificacion
							}
							calificacionesData.push(calificacionJSON);
						}
					}
				}
			}
		}else {
			console.log("Es un profesor!");
			var lecciones = yield obtenerLecciones(paralelo[0]._id);
			for (var i = 0; i < lecciones.length; i++){
				var calificacionesPorLeccion = yield obtenerCalificacionPorLeccion(lecciones[i]);
				for (var j = 0; j < calificacionesPorLeccion.length; j++){
					var calificacion = calificacionesPorLeccion[j];
					var participantes = calificacion.participantes;
					for (var x =0; x < participantes.length; x++){
						var calificacionJSON = {
							matricula: participantes[x].matricula,
							nombreEstudiante: participantes[x].nombres,
							apellidoEstudiante: participantes[x].apellidos,
							grupo: calificacion.nombreGrupo,
							materia: paralelo[0].nombreMateria,
							paralelo: calificacion.nombreParalelo,
							nombreLeccion: lecciones[i].nombre,
							tipoLeccion: lecciones[i].tipo,
							puntaje: calificacion.calificacion
						}
						calificacionesData.push(calificacionJSON);
					}
				}
			}
		}

		var csv = json2csv({ data: calificacionesData, fields: campos});
		fs.writeFile('Reporte1.csv', csv, function(err) {
			if (err) throw err;
			console.log('file saved');
		});
		response.ok(res)
	}).catch(fail => console.log(fail))
}


module.exports = {
	crearRegistro,
	obtenerRegistro,
	anadirParticipante,
	calificar,
	obtenerRegistroPorLeccion,
	obtenerCalificaciones,
	recalificar,
	anadirNombreGrupo
}
