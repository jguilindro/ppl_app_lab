/* eslint comma-dangle: ["error", "never"] */
/**
* @name Leccion
* @author Joel Rodriguez
*/

module.exports.getAll = () => {
  return new Promise( (resolve, reject) => {
    db.from('lecciones')
      .innerJoin('paralelos', 'lecciones.paralelo_id', 'paralelos.id')
      .innerJoin('materias', 'paralelos.materia_id', 'materias.id')
      .select([
        'lecciones.id',
        'lecciones.nombre',
        'lecciones.estado',
        'lecciones.tipo',
        'lecciones.profesor_id',
        'lecciones.paralelo_id',
        'lecciones.fecha_evaluacion',
        'paralelos.nombre as paralelo_nombre',
        'materias.nombre as materia_nombre',
        'materias.codigo as materia_codigo'
      ])
      .then( lecciones => {
        resolve(lecciones)
      })
      .catch( error => {
        logger.info(error)
        logger.error(`Leccion model Error ${error}`)
        reject(error)
      })
  })
}

/**
  * Obtiene todas las lecciones de los paralelos indicados
  * @param {paralelos}
  * @return {Promise} lecciones en formato json, si no lo encuentra devuelve un json vacio
  * @error {Error} error object
  * @author Edison Mora
*/
module.exports.getLeccionesDeParalelos = (paralelos) => {
  return new Promise( (resolve, reject) => {
    db.from('lecciones')
      .innerJoin('paralelos', 'lecciones.paralelo_id', 'paralelos.id')
      .innerJoin('materias', 'paralelos.materia_id', 'materias.id')
      .whereIn('paralelo_id', paralelos)
      .select([
        'lecciones.id',
        'lecciones.nombre',
        'lecciones.estado',
        'lecciones.tipo',
        'lecciones.profesor_id',
        'lecciones.paralelo_id',
        'lecciones.fecha_evaluacion',
        'paralelos.nombre as paralelo_nombre',
        'materias.nombre as materia_nombre',
        'materias.codigo as materia_codigo'
      ])
    .then( lecciones => {
      resolve(lecciones)
    })
    .catch( error => {
      logger.info(error)
      logger.error(`Leccion model Error ${error}`)
      reject(error)
    })
  })
}

/**
  * Obtiene la leccion indicada por el id
  * @param {idLeccion}
  * @return {Promise} leccion en formato json, si no lo encuentra devuelve un json vacio
  * @error {Error} error object
  * @author Edison Mora
*/
module.exports.getById = (idLeccion) => {
  return new Promise( (resolve, reject) => {
    db.from('lecciones')
      .select()
      .where({
        'lecciones.id' : idLeccion
      })
      .first()
      .then( leccion => {
        resolve(leccion);
      })
      .catch( error => {
        logger.info(error)
        logger.error(`Leccion model Error ${error}`)
        reject(error)
      });
  });
}

/**
  * Obtener las lecciones del estudiante por el correo y ordenadas por fecha por mas reciente
  * @param {correo}
  * @return {Promise} lecciones del estudiante en formato json
  * ej: {calificacion, nombre, tipo, fecha_terminado, id}
  * @error {Error} error object
  * @author Joel Rodriguez
*/
module.exports.getLeccionesByEstudianteCorreo = (correo) => {
  return new Promise((resolve, reject) => {
    db.from('estudiantes')
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
        resolve(lecciones)
      })
      .catch((error) => {
        logger.info(error)
        logger.error(`Leccion model Error ${error}`)
        reject(error)
      })
  })
}