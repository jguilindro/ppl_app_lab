/**
* @name Profesores
* @author Joel Rodriguez
*/

const ProfesorModel = require('../models/pregunta.model')

/**
  * Devuelve todos los profesores
  * @returns {Json} formato responses ok
  * @error {Json} formato erro server
  * @author Joel Rodriguez
*/
module.exports.getAll = (req, res, next) => {
  return ProfesorModel.getAll()
  .then((profesores) => {
    return responses.okGet(res, profesores)
  })
  .catch((error) => {
    logger.info(error)
    logger.error(`Profesor Controller Error ${error}`)
    return responses.serverError(res, error)
  })
}

module.exports.getByCorreo = (req, res, next) => {
  const correo = req.params.correo
  return ProfesorModel.getByCorreo(correo)
  .then((profesor) => {
    if ( profesor ) return responses.okGet(res, profesor)
    return responses.noEncontrado(res)
  })
  .catch((error) => {
    logger.info(error)
    logger.error(`Profesor Controller Error ${error}`)
    return responses.noEncontrado(res)
  })
}