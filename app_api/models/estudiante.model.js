/* eslint class-methods-use-this: ["error", { "exceptMethods": ["getByCorreo", "getAll"] }] */

/* eslint comma-dangle: ["error", "never"] */

class Estudiante {
  constructor(db) {
    this.db = db
  }
  
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
          logger.info(error)
          logger.error(`Estudiante model Error ${error}`)
          reject(error)
        })
    })
  }

  getAll() {
    return new Promise((resolve, reject) => {
      this.db.select().from('estudiantes').then((profesores) => {
        return resolve(profesores)
      }).catch((error) => {
        logger.info(error)
        logger.error(`Estudiante model Error ${error}`)
        reject(error)
      })
    })
  }
}

module.exports = Estudiante
