const moment = require('moment')

/**
* @name Profesores
* @author Joel Rodriguez
*/
class Estudiantes {
  /**
  * crea una instancia de Profesores
  * @param {logger} modulo logger
  * @param {responses} modulo responses
  * @param {EstudianteModel}
  * @param {LeccionModel}
  * @author Joel Rodriguez
  */
  constructor(logger, responses, EstudianteModel, LeccionModel) {
    this.logger = logger
    this.responses = responses
    this.EstudianteModel = EstudianteModel
    this.LeccionModel = LeccionModel
  }

  /**
  * Obtener todos los estudiants
  * @return {Json} json con el formato responses ok
  * @error {Error} error object
  * @author Joel Rodriguez
  */
  getAll() {
    return this.EstudianteModel.getAll()
      .then((res) => {
        return this.responses.ok(res)
      })
      .catch((error) => {
        this.logger.info(error)
        this.logger.error(`Leccion Controller Error ${error}`)
        return this.responses.ERROR_SERVIDOR
      })
  }

  /**
  * Obtener estudiante el correo
  * @param {correo}
  * @return {Json} estudiante en formato json
  * @error {Error} error object
  * @author Joel Rodriguez
  */
  getByCorreo(correo) {
    return this.EstudianteModel.getByCorreo(correo)
      .then((res) => {
        const resp = this.responses.ok(res)
        return resp
      })
      .catch((error) => {
        this.logger.info(error)
        this.logger.error(`Leccion Controller Error ${error}`)
        return this.responses.ERROR_SERVIDOR
      })
  }

  /**
  * Obtener datos del estudiante que se mostraran en el perfil del mismo, devuelve el json con fecha_terminado y hora_termiando
  * @param {correo}
  * @return {Json} datos del estudiante en formato json, mas las lecciones que ha dado
  * @error {Error} error object
  * @author Joel Rodriguez
  */
  getPerfilByCorreo(_correo_) {
    return Promise.all([
      this.LeccionModel.getLeccionesByEstudianteCorreo(_correo_),
      this.EstudianteModel.getByCorreo(_correo_)])
      .then((values) => {
        const ESTUDIANTE_DATOS_FILTRADO = (
          ({ nombres, apellidos, correo }) =>
            ({ nombres, apellidos, correo })
        )(values[1])
        const LECCIONES = values[0].reduce((tmp, actual) => {
          let actual_tmp = actual
          const fecha_tomada_tmp = moment(actual.fecha_terminado, moment.ISO_8601).format('DD-MM-YYYY')
          const hora_tomada_tmp = moment(actual.fecha_terminado, moment.ISO_8601).format('LT')
          actual_tmp['fecha_terminado'] = fecha_tomada_tmp
          actual_tmp['hora_terminado'] = hora_tomada_tmp
          tmp.push(actual_tmp)
          return tmp
        }, [])
        return this.responses.ok({ estudiante: ESTUDIANTE_DATOS_FILTRADO, lecciones: LECCIONES })
      })
      .catch((error) => {
        this.logger.info(error)
        this.logger.error(`Leccion Controller Error ${error}`)
        return this.responses.ERROR_SERVIDOR
      })
  }
}

module.exports = Estudiantes
