global.logger = require('./utils/logger')
const profesores = require('./routes/profesores.routes')
const estudiantes = require('./routes/estudiantes.routes')
const autenticacion = require('./routes/auth.routes')

module.exports = (app) => {
  estudiantes(app)
  profesores(app)
  autenticacion(app)
}
