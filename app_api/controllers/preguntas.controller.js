/**
* @name Preguntas
* @author Edison Mora, Jaminson Riascos
*/
const Joi = require('joi');
const PreguntaModel = require('../models/pregunta.model')
const PreguntaSchema = require('../schemas/pregunta.schema')

const array = [
	{
		descripcion     : 'Primera subpregunta',
		puntaje         : 5,
		tiempo_estimado : 7
	},
	{
		descripcion     : 'Segunda subpregunta',
		puntaje         : 10,
		tiempo_estimado : 8
	}
]

module.exports.getAll = (req, res, next) => {
	return PreguntaModel.getAll()
	.then((preguntas) => {
		return responses.okGet(res, preguntas)
	})
	.catch((error) => {
		logger.info(error)
    logger.error(`Preguntas Controller Error ${error}`)
    return responses.serverError(res, error)
	})
}

/**
  * Obtener la pregunta indicada por el id
  * @param {idPregunta}
  * @return {Json} json con el formato responses ok
  * @error {Error} error object
  * @author Edison Mora
*/
module.exports.getById = (req, res, next) => {
	const idPregunta = req.params.id_pregunta
	return PreguntaModel.getById(idPregunta)
	.then( pregunta => {
		if ( pregunta ) return responses.okGet(res, pregunta)
		return responses.noEncontrado(res)
	})
	.catch( error => {
		logger.info(error)
    logger.error(`Preguntas Controller Error ${error}`)
    return responses.noEncontrado(res)
	})
}

module.exports.crearPregunta = (req, res, next) => {
	const pregunta = {
		nombre 			    : req.body.nombre,
		tipo_leccion    : req.body.tipo_leccion,
		tipo_pregunta   : req.body.tipo_pregunta,
		capitulo_id     : req.body.capitulo_id,
		tiempo_estimado : req.body.tiempo_estimado,
		descripcion			: req.body.descripcion,
		puntaje 				: req.body.puntaje,
		idMongo					: req.body.idMongo,
		profesor_id 		: req.body.profesor_id
	}

	//valido el input
	Joi.validate(pregunta, PreguntaSchema.schema, function (err, value) {

		if (err === null){ // si no hay error de validacion
			//Primero creo la transacción
			db.transaction( function(trx){
				return PreguntaModel.insert(pregunta, trx)
				.then((id) => {
					//Aquí estará la parte de las subpreguntas
					trx.commit
					return responses.okCreate(res, id)	
				})
				.catch((error) => {
					trx.rollback
					logger.info(error)
			    logger.error(`Preguntas Controller Error ${error}`)
			    return responses.serverError(res, error)
				})
			})
			.then(() => {
				console.log('Entró al then exterior')
				console.log('Transaccion terminada')
			})
			.catch((error) => {
				logger.info(error)
		    logger.error(`Transaction Error ${error}`)
			})

		}else{

			logger.info(err)
			logger.error(`Validation Error: ${err}`)
		}
	 });

	
}

module.exports.eliminarPregunta = (req, res, next) => {
	const idPregunta = req.params.id_pregunta
	return PreguntaModel.delete(idPregunta)
	.then((cantidad) => {
		if ( cantidad === 1 ) {
			return responses.okDelete(res)
		}	else if ( cantidad === 0 ) {
			return responses.noEncontrado(res)
		} else {
			return responses.error(res, 'Server error', cantidad)
		}
	})
	.catch((error) => {
		logger.info(error)
    logger.error(`Preguntas Controller Error ${error}`)
    return responses.serverError(res, error)
	})
}