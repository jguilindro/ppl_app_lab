// usar la libreria joi para las validaciones, https://github.com/hapijs/joi
// http://usejsdoc.org/about-getting-started.html
// https://github.com/documentationjs/documentation/blob/master/docs/GETTING_STARTED.mdn
// https://esdoc.org/

const ProfesorModel = require('../models/profesor.model')
const db = require('../../databases').relationalDB
const responses = require('../utils/responses')

const Profesor = new ProfesorModel(db)

const getAll = () => {
  return Profesor.getAll()
    .then((res) => {
      return responses.ok(res)
    })
    .catch((error) => {
      logger.info(error)
      logger.error(`Profesor Controller Error ${error}`)
      return responses.ERROR_SERVIDOR
    })
}

const getByCorreo = (usuario) => {
  return Profesor.getByCorreo(usuario)
    .then((res) => {
      return responses.ok(res)
    })
    .catch((error) => {
      logger.info(error)
      logger.error(`Profesor Controller Error ${error}`)
      return responses.ERROR_SERVIDOR
    })
}

module.exports = {
  getAll,
  getByCorreo,
}
