/* eslint comma-dangle: ["error", "never"] 
/**
* @name Estudiante
* @author Joel Rodriguez
*/

/**
  * Obtener estudiante por dado el correo
  * @param {correo}
  * @return {Promise} estudiante en formato json, si no lo encuentra devuelve un json vacio
  * @error {Error} error object
  * @author Joel Rodriguez
*/
module.exports.getByCorreo = (correo) => {
  return new Promise((resolve, reject) => {
    db.select().from('estudiantes').where({ correo })
      .then((estudiante) => {
        if (estudiante.lentgh === 0) {
          return resolve({})
        }
        return resolve(estudiante[0])
      })
      .catch((error) => {
        logger.info(error)
        logger.error(`Estudiante model Error ${error}`)
        reject(error)
      })
  })
}

/**
  * Obtener todos los estudiantes
  * @return {Promise} estudiantes en formato json
  * @error {Error} error object
  * @author Joel Rodriguez
*/
module.exports.getAll = () => {
  return new Promise((resolve, reject) => {
    db.select().from('estudiantes').then((estudiantes) => {
      return resolve(estudiantes)
    }).catch((error) => {
      logger.info(error)
      logger.error(`Estudiante model Error ${error}`)
      reject(error)
    })
  })
}