var co = require('co')
var logger = require('../utils/logger')

var ProfesorModel = require('../models/profesor.model')

const obtenerTodosProfesores = (req, res, next) => {
  co(function* () {
    var profesores = yield ProfesorModel.obtenerTodosProfesores()
    logger.info('Hello again distributed logs');
    logger.error('Helllll')
    res.send(profesores)
  })
}

module.exports = {
  obtenerTodosProfesores
}
