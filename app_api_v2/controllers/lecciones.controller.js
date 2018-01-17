/**
* @name Lecciones
* @author Edison Mora
*/

const LeccionModel = require('../models/pregunta.model')

/**
  * Obtener todas las lecciones
  * @return {Json} json con el formato responses ok
  * @error {Error} error object
  * @author Edison Mora
*/
module.exports.getAll= (req, res, next) => {
	return LeccionModel.getAll()
		.then( lecciones => {
			return responses.okGet(res, lecciones)
		})
		.catch( error => {
			logger.info(error)
      logger.error(`Leccion Controller Error ${error}`)
      return responses.serverError(res, error)
		})
}

/**
  * Obtener todas las lecciones de los paralelos indicados
  * @param {paralelos}
  * @return {Json} json con el formato responses ok
  * @error {Error} error object
  * @author Edison Mora
*/
module.exports.getLeccionesDeParalelos = (req, res, next) => {
	const paralelos = req.params.paralelos
	return LeccionModel.getLeccionesDeParalelos(paralelos)
	.then( lecciones => {
			return responses.okGet(res, lecciones)
		})
		.catch( error => {
			logger.info(error)
      logger.error(`Leccion Controller Error ${error}`)
      return responses.serverError(res, error)
		})
}

/**
  * Obtener la leccion indicada por el id
  * @param {idLeccion}
  * @return {Json} json con el formato responses ok
  * @error {Error} error object
  * @author Edison Mora
*/
module.exports.getById = (req, res, next) => {
	const idLeccion = req.params.id_leccion
	return LeccionModel.getById(idLeccion)
	.then( leccion => {
		if ( leccion ) return responses.okGet(res, leccion)
		return responses.noEncontrado(res)
	})
	.catch( error => {
		logger.info(error)
    logger.error(`Leccion Controller Error ${error}`)
    return responses.noEncontrado(res)
	})
}