const EstudianteModel = require('../models/estudiante.model')
const LeccionModel = require('../models/leccion.model')
const db = require('../../databases').relationalDB
const responses = require('../utils/responses')

const Estudiante = new EstudianteModel(db)
const Leccion = new LeccionModel(db)

const getAll = () => {
  return Estudiante.getAll()
    .then((res) => {
      return responses.ok(res)
    })
    .catch((error) => {
      logger.info(error)
      logger.error(`Leccion Controller Error ${error}`)
      return responses.ERROR_SERVIDOR
    })
}

const getByCorreo = (correo) => {
  return Estudiante.getByCorreo(correo)
    .then((res) => {
      const resp = responses.ok(res)
      return resp
    })
    .catch((error) => {
      logger.info(error)
      logger.error(`Leccion Controller Error ${error}`)
      return responses.ERROR_SERVIDOR
    })
}

const getPerfilByCorreo = (_correo_) => {
  return Promise.all([
    Leccion.getLeccionesByEstudianteCorreo(_correo_),
    Estudiante.getByCorreo(_correo_)])
    .then((values) => {
      const ESTUDIANTE_DATOS_FILTRADO = (
        ({ nombres, apellidos, correo }) =>
          ({ nombres, apellidos, correo })
      )(values[1])
      return responses.ok({ estudiante: ESTUDIANTE_DATOS_FILTRADO, lecciones: values[0] })
    })
    .catch((error) => {
      logger.info(error)
      logger.error(`Leccion Controller Error ${error}`)
      return responses.ERROR_SERVIDOR
    })
}

module.exports = {
  getAll,
  getByCorreo,
  getPerfilByCorreo,
}
