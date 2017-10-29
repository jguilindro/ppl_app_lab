global.logger = require('./utils/logger')
global.responses = require('./utils/responses')
const profesores = require('./routes/profesores.routes')

module.exports = (app) => {
  profesores(app)
}
