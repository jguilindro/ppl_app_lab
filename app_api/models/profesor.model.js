/* eslint comma-dangle: ["error", "never"] */

/**
* @name Profesor
* @author Joel Rodriguez
*/


/**
  * Obtener profesor por el correo
  * @param {correo}
  * @return {Promise} json profesor
  * @error {Promise} error object
  * @author Joel Rodriguez
*/
module.exports.getByCorreo = (correo) => {
  return new Promise((resolve, reject) => {
    db.select().from('profesores')
      .where({ correo })
      .then((profesor) => {
        if (profesor.length === 0) {
          return resolve({})
        }
        return resolve(profesor)
      })
      .catch((error) => {
        logger.info(error)
        logger.error(`Profesor model Error ${error}`)
        reject(error)
      })
  })
}

/**
  * Obtener todos los profesores
  * @return {Promise} json profesor
  * @error {Promise} error object
  * @author Joel Rodriguez
*/
module.exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.select().from('profesores')
      .then((profesores) => {
        return resolve(profesores)
      })
      .catch((error) => {
        logger.info(error)
        logger.error(`Profesor model Error ${error}`)
        reject(error)
      })
  })
}