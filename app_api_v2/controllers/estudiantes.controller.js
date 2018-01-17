const moment = require('moment')

const EstudianteModel = require('../models/pregunta.model')
const LeccionModel    = require('../models/pregunta.model')

/**
* @name Profesores
* @author Joel Rodriguez
*/

/**
  * Obtener todos los estudiants
  * @return {Json} json con el formato responses ok
  * @error {Error} error object
  * @author Joel Rodriguez
*/
module.exports.getAll = (req, res, next) => {
  return EstudianteModel.getAll()
  .then((estudiantes) => {
    return responses.okGet(res, estudiantes)
  })
  .catch((error) => {
    logger.info(error)
    logger.error(`Leccion Controller Error ${error}`)
    return responses.serverError(res, error)
  })
}

/**
  * Obtener estudiante el correo
  * @param {correo}
  * @return {Json} estudiante en formato json
  * @error {Error} error object
  * @author Joel Rodriguez
*/
module.exports.getByCorreo = (req, res, next) => {
  const correo = req.params.correo
  return EstudianteModel.getByCorreo(correo)
  .then((estudiante) => {
    if ( estudiante ) return responses.okGet(res, estudiante)
    return responses.noEncontrado(res)
  })
  .catch((error) => {
    logger.info(error)
    logger.error(`Leccion Controller Error ${error}`)
    return responses.noEncontrado(res)
  })
}

 /**
  * Obtener datos del estudiante que se mostraran en el perfil del mismo, devuelve el json con fecha_terminado y hora_termiando
  * @param {correo}
  * @return {Json} datos del estudiante en formato json, mas las lecciones que ha dado
  * ej: [estudiante: {nombres, apellidos, correo}, lecciones:{calificacion, nombre, tipo, fecha_terminado, hora_terminado, id]}
  * @error {Error} error object
  * @author Joel Rodriguez
*/
module.exports.getPerfilByCorreo = (req, res, next) => {
  const _correo_ = req.params.correo
  return Promise.all([
    LeccionModel.getLeccionesByEstudianteCorreo(_correo_),
    EstudianteModel.getByCorreo(_correo_)])
    .then((values) => {
      const ESTUDIANTE_DATOS_FILTRADO = (
        ({ nombres, apellidos, correo }) =>
          ({ nombres, apellidos, correo })
      )(values[1])

      // anadir a cada leccion la fecha_terminado y hora_terminado
      const LECCIONES = values[0].reduce((lecciones, actual) => {
        let actual_tmp = actual
        // Traducción de Moment a Español. Fuente:https://es.stackoverflow.com/questions/56219/como-cambio-el-idioma-del-plugin-momentjs
        moment.locale('es', {
          weekdaysShort: 'Dom._Lun._Mar._Mier._Jue._Vier._Sab.'.split('_'),
        })
        const fecha_tomada_tmp = moment(actual.fecha_terminado, moment.ISO_8601).format('ddd DD/MM')
        const hora_tomada_tmp  = moment(actual.fecha_terminado, moment.ISO_8601).format('LT')
        actual_tmp['fecha_terminado'] = fecha_tomada_tmp
        actual_tmp['hora_terminado']  = hora_tomada_tmp
        lecciones.push(actual_tmp)
        return lecciones
      }, [])
      return responses.okGet(res, {estudiante : ESTUDIANTE_DATOS_FILTRADO, lecciones : LECCIONES})
    })
    .catch((error) => {
      logger.info(error)
      logger.error(`Leccion Controller Error ${error}`)
      return responses.serverError(res, error)
    })
}