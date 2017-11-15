global.logger 	 = require('./utils/logger')
global.responses =	require('./utils/responses')

const profesores 		= require('./routes/profesores.routes')
const estudiantes 	= require('./routes/estudiantes.routes')
const lecciones 		= require('./routes/lecciones.routes')
const autenticacion = require('./routes/auth.routes')

module.exports = (app) => {
  estudiantes(app)
  profesores(app)
  lecciones(app)
  autenticacion(app)
}
