/* eslint comma-dangle: ["error", "never"] */
/**
* @name Leccion
* @author Joel Rodriguez
*/
class Leccion {
  /**
  * crea una instancia de Leccion
  * @param {logger} modulo logger
  * @param {db} modulo database
  * @author Joel Rodriguez
  */
  constructor(logger, db) {
    this.logger = logger
    this.db = db
  }

  /**
  * Obtener las lecciones del estudiante por el correo y ordenadas por fecha por mas reciente
  * @param {correo}
  * @return {Promise} lecciones del estudiante en formato json
  * ej: {calificacion, nombre, tipo, fecha_terminado, id}
  * @error {Error} error object
  * @author Joel Rodriguez
  */
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
        .orderBy('lecciones.fecha_terminado', 'desc')
        .then((lecciones) => {
          return resolve(lecciones)
        })
        .catch((error) => {
          this.logger.info(error)
          this.logger.error(`Leccion model Error ${error}`)
          reject(error)
        })
    })
  }
}

module.exports = Leccion
