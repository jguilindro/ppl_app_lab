/* eslint class-methods-use-this:
  ["error", { "exceptMethods":
  ["getLeccionesByEstudianteCorreo"] }]
*/

/* eslint comma-dangle: ["error", "never"] */

class Leccion {
  constructor(db) {
    this.db = db
  }
  
  getLeccionesByEstudianteCorreo(correo) {
    return new Promise((resolve, reject) => {
      this.db.from('estudiantes')
        .innerJoin(
          'estudiante_lecciones',
          'estudiante_lecciones.estudiante_id',
          'estudiantes.id'
        )
        .innerJoin(
          'lecciones',
          'estudiante_lecciones.leccion_id',
          'lecciones.id'
        )
        .select([
          'estudiante_lecciones.calificacion',
          'lecciones.nombre',
          'lecciones.tipo',
          'lecciones.fecha_terminado',
          'lecciones.id'])
        .where({ 'estudiantes.correo': correo })
        .then((lecciones) => {
          return resolve(lecciones)
        })
        .catch((error) => {
          logger.info(error)
          logger.error(`Leccion model Error ${error}`)
          reject(error)
        })
    })
  }
}

module.exports = Leccion
