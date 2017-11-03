const ProfesorModel = require('../models/profesor.model')
const EstudianteModel = require('../models/estudiante.model')
const db = require('../../databases').relationalDB
const responses = require('../utils/responses')

const Profesor = new ProfesorModel(db)
const Estudiante = new EstudianteModel(db)



const login = (usuario) => {
  return Promise.all([
    Profesor.getByCorreo(usuario),
    Estudiante.getByCorreo(usuario)])
    .then((values) => {
      let resp = {}
      if (Object.keys(values[0]).length !== 0) {
        resp = responses.ok({ privilegios: 'profesor', correo: values[0].correo })
      } else if (Object.keys(values[1]).length !== 0) {
        resp = responses.ok({ privilegios: 'estudiante', correo: values[1].correo })
      } else {
        resp = responses.NO_AUTORIZADO
      }
      return resp
    })
    .catch((error) => {
      logger.info(error)
      logger.error(`Leccion model Error ${error}`)
      return responses.ERROR_SERVIDOR
    })
}

module.exports = {
  login,
}
