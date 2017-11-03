/* eslint class-methods-use-this:
  ["error", { "exceptMethods":
  ["getByCorreo",
  "getAll"] }]
*/

/* eslint comma-dangle: ["error", "never"] */

class Profesor {
  constructor(db) {
    this.db = db
  }
  
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
          logger.info(error)
          logger.error(`Profesor model Error ${error}`)
          reject(error)
        })
    })
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.db.select().from('profesores')
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
}

module.exports = Profesor
