const RubricaModel 	= require('../models/rubrica.model');
const co 						= require('co');
const Excel 				= require("exceljs");
const response 			= require('../utils/responses');
let _ 							= require('lodash');
let unstream 				= require('unstream');


const crearRegistro = (req, res) => {
	let arrayCalificaciones = JSON.parse(req.body.calificaciones);
	let rub 								= JSON.parse(req.body.rubrica);

	const registro = new RubricaModel({
		materia 				: rub.materia,
		paralelo 				: rub.paralelo,
		grupo 					: rub.grupo,
		capitulo 				: rub.capitulo,
		ejercicio 			: rub.ejercicio,
		calificaciones 	: arrayCalificaciones,
		total 					: rub.total,
		evaluador 			: rub.evaluador
	});
  RubricaModel.editarOCrear(rub.grupo, rub.paralelo, rub.capitulo, rub.ejercicio, rub.materia, arrayCalificaciones, rub.total, rub.evaluador, (err, doc) => {
    if(err) return response.serverError(res)
    return response.creado(res);
  })
};

const obtenerRegistroPorId = (req, res) => {
	const idRegistro = req.params.id_registro;
	
	RubricaModel.obtenerRegistroPorId(idRegistro, (err, registro) => {
		if(err) return response.serverError(res);
		return response.ok(res, registro);
	});
}

const obtenerRegistrosDeGrupo = (req, res) => {
	const paralelo 	= req.params.paralelo;
	const grupo 		= req.params.grupo;

	RubricaModel.obtenerRegistrosDeGrupo(paralelo, grupo, (err, registros) => {
		if(err) return response.serverError(res);
		return response.ok(res, registros);
	});
};

const obtenerRegistrosDeCapituloDeGrupo = (req, res) => {
	const paralelo 	= req.params.paralelo;
	const grupo 		= req.params.grupo;
	const capitulo 	= req.params.capitulo;

	RubricaModel.obtenerRegistrosDeCapituloDeGrupo(paralelo, grupo, capitulo, (err, registros) => {
		if(err) return response.serverError(res);
		return response.ok(res, registros);
	});
};

const csv = (req, res) => {
	const calificacionPonderadaMax 	= 15;
	const materia 									= req.body.materia;
	const paralelos 								= JSON.parse(req.body.paralelos);
	const capitulos 								= JSON.parse(req.body.capitulos);

	co( function* (){
		/* Crear instancia de workbook */
		let workbook 			= new Excel.Workbook();
		workbook.creator 	= 'edanmora';
    workbook.created 	= new Date();
    workbook.modified = new Date();
    /* Por cada paralelo seleccionado */
    for (let i = 0; i < paralelos.length; i++) {
    	let paraleloActual 	= paralelos[i];
    	/* Creo el worksheet con el nombre del paralelo actual */
    	var worksheet 			= workbook.addWorksheet('Paralelo ' + paraleloActual);
    	worksheet.columns 	=	armarColumnas();
    	/* Por cada capítulo */
    	for (let j = 0; j < capitulos.length; j++) {
				let capituloActual 	= capitulos[j];
				/* Obtengo la calificación de cada grupo del paralelo actual */
				let ejercicios 			= yield obtenerRegistrosDeCapituloDeParalelo(materia, paraleloActual, capituloActual);
				let grupos          = _.groupBy( ejercicios, ejercicio => ejercicio.grupo );
				/* Por cada grupo obtengo su calificación */
				for( let grupo in grupos ){
					let ejercicioGrupo       = grupos[grupo];
					let calificacionCapituloT = obtenerTotalCalificaciones( ejercicioGrupo[0].calificaciones );
					let calificacionCapituloP = ponderarCalificacion(calificacionCapituloT, 15, 100).toFixed(2);
					/* Añado el registro al documento */
					let fila = armarFila(materia, paraleloActual, capituloActual, grupo, calificacionCapituloP);
					worksheet.addRow(fila);
				}
			}
    }
    
    workbook.xlsx.write(unstream({}, function(data) {
      return response.ok(res,data.toString('base64'))
    }));
	})
	.catch( fail => console.log(fail) );

}

module.exports = {
	crearRegistro,
	obtenerRegistroPorId,
	obtenerRegistrosDeGrupo,
	obtenerRegistrosDeCapituloDeGrupo,
	csv
}
/*
	@Autor: @edisonmora95
	@Descripción: De todos los ejercicios de un grupo, se obtiene la calificación ponderada
*/
function obtenerCalificacionDeGrupo(ejerciciosGrupo, calificacionPonderadaMax){
	let calificacionesDeEjercicio = [];
	let calificacionMaxEjercicios = 0;

	for ( let k = 0; k < ejerciciosGrupo.length; k++ ) {
		let ejercicioActual 				= ejerciciosGrupo[k];
		let calificacionEjercicioT 	= obtenerTotalCalificaciones(ejercicioActual.calificaciones);
		let calificacionEjercicioP 	= ponderarCalificacion(calificacionEjercicioT, 22, calificacionPonderadaMax);
		calificacionMaxEjercicios 	+= calificacionPonderadaMax;
		calificacionesDeEjercicio.push({ calificacion : calificacionEjercicioP });
	}
	let calificacionCapituloT = obtenerTotalCalificaciones(calificacionesDeEjercicio);
	let calificacionCapituloP = ponderarCalificacion(calificacionCapituloT, calificacionMaxEjercicios, 100).toFixed(2);

	return calificacionCapituloP;
}
/*
	@Autor: @edisonmora95
	@Descripcion: Obtiene de la base de datos los registros de todos los ejercicios del capítulo indicado del paralelo en la materia indicada.
*/
function obtenerRegistrosDeCapituloDeParalelo(idMateria, idParalelo, idCapitulo){
	return new Promise( (resolve, reject) => {
		RubricaModel.obtenerRegistrosDeCapituloDeParalelo(idMateria, idParalelo, idCapitulo, (err, registros) => {
			if (err) {
				return reject( new Error('No se pudo obtener el registro') );
			}else{
				return resolve(registros);
			}
		});	
	});
	
}
/*
	Dado un array de calificaciones, obtiene la sumatoria de todas sus calificaciones
*/
function obtenerTotalCalificaciones(arrayCalificaciones){
	let total = 0;
	for (var i = 0; i < arrayCalificaciones.length; i++) {
		total += arrayCalificaciones[i].calificacion;
	}
	return total;
}
/*
	Devuelve la calificación ponderada dada una calificación máxima y una ponderación.
	
	calificacionMaxima		calificacionPonderadaMax
	calificacionObtenida	x

	x = ( (calificacionObtenida * calificacionPonderadaMax ) / calificacionMaxima )
*/
function ponderarCalificacion(calificacionObtenida, calificacionMaxima, calificacionPonderadaMax){
	return ( ( calificacionObtenida * calificacionPonderadaMax ) / calificacionMaxima );
}

function armarColumnas(){
	let columnas = [
		{ header : 'Materia' , key : 'materia' , width : 12 },
		{ header : 'Paralelo', key : 'paralelo', width : 12 },
		{ header : 'Capítulo', key : 'capitulo', width : 12 },
		{ header : 'Grupo'   , key : 'grupo'   , width : 12 },
		{ header : 'Total'   , key : 'total'   , width : 12 },
	];
	return columnas;
}

function armarFila(materia, paralelo, capitulo, grupo, total){
	let fila = {
		materia 	: materia,
		paralelo 	: paralelo,
		capitulo 	: capitulo,
		grupo 		: grupo,
		total 		: total
	};
	return fila;
}