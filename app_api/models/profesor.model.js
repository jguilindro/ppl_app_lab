/* eslint comma-dangle: ["error", "never"] */

/**
* @name Profesor
* @author Joel Rodriguez
*/
class Profesor {
  /**
  * crea una instancia de Profesor
  * @param {logger} modulo logger
  * @param {db} modulo database
  * @author Joel Rodriguez
  */
  constructor(logger, db) {
    this.logger = logger
    this.db = db
  }

  /**
  * Obtener profesor por el correo
  * @param {correo}
  * @return {Promise} json profesor
  * @error {Promise} error object
  * @author Joel Rodriguez
  */
  getByCorreo(correo) {
    return new Promise((resolve, reject) => {
      this.db.select().from('profesores')
        .where({ correo })
        .then((profesor) => {
          if (profesor.length === 0) {
            return resolve({})
          }
          return resolve(profesor)
        })
        .catch((error) => {
          this.logger.info(error)
          this.logger.error(`Profesor model Error ${error}`)
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
  getAll() {
    return new Promise((resolve, reject) => {
      this.db.select().from('profesores')
        .then((profesores) => {
          return resolve(profesores)
        })
        .catch((error) => {
          this.logger.info(error)
          this.logger.error(`Profesor model Error ${error}`)
          reject(error)
        })
    })
  }
}

module.exports = Profesor
