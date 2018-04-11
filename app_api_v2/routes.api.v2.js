// global.logger 	 = require('./utils/logger')
// global.responses =	require('./utils/responses')

// const materias 			= require('./routes/materias.routes')
// const preguntas			= require('./routes/preguntas.routes')
// const profesores 		= require('./routes/profesores.routes')
// const estudiantes 	= require('./routes/estudiantes.routes')
// const lecciones 		= require('./routes/lecciones.routes')
// const autenticacion = require('./routes/auth.routes')

module.exports = (app) => {
	app.use('/ping', function(req, res) {
    res.json({'mensaje': 'api version 2'})
  })
	// app.use('/preguntas', preguntas)
	// app.use('/lecciones', lecciones)
	// app.use('/estudiantes', estudiantes)
	// app.use('profesores', profesores)
	// app.use('/auth', autenticacion)
}
