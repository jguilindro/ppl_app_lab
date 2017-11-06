/* eslint comma-dangle: ["error", "never"] 
/**
* @name Estudiante
* @author Joel Rodriguez
*/
class Estudiante {
  /**
  * crea una instancia de Estudiante
  * @param {logger} modulo logger
  * @param {db} modulo database
  * @author Joel Rodriguez
  */
  constructor(logger, db) {
    this.logger = logger
    this.db = db
  }

  /**
  * Obtener estudiante por dado el correo
  * @param {correo}
  * @return {Promise} estudiante en formato json, si no lo encuentra devuelve un json vacio
  * @error {Error} error object
  * @author Joel Rodriguez
  */
  getByCorreo(correo) {
    return new Promise((resolve, reject) => {
      this.db.select().from('estudiantes').where({ correo })
        .then((estudiante) => {
          if (estudiante.lentgh === 0) {
            return resolve({})
          }
          return resolve(estudiante[0])
        })
        .catch((error) => {
          this.logger.info(error)
          this.logger.error(`Estudiante model Error ${error}`)
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
  getAll() {
    return new Promise((resolve, reject) => {
      this.db.select().from('estudiantes').then((profesores) => {
        return resolve(profesores)
      }).catch((error) => {
        this.logger.info(error)
        this.logger.error(`Estudiante model Error ${error}`)
        reject(error)
      })
    })
  }
}

module.exports = Estudiante
