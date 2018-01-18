const bodyParser = require('body-parser')
const authApi = require('./config/auth.api')

module.exports = (app) => {
  app.use(bodyParser.json())
  app.use(bodyParser.urlencoded({ extended: false }))

  app.use('/profesores', require('./routes/profesores.router'))
  app.use('/estudiantes', require('./routes/estudiantes.router'))
  app.use('/grupos', require('./routes/grupos.router'))
  app.use('/paralelos', require('./routes/paralelos.router'))
  app.use('/lecciones', require('./routes/lecciones.router'))
  app.use('/preguntas', require('./routes/preguntas.router'))
  app.use('/respuestas', authApi.estudiante, require('./routes/respuestas.router'))
  app.use('/capitulos', authApi.profesor, require('./routes/capitulo.router'))
  app.use('/calificaciones', authApi.estudiante, require('./routes/calificacion.router'))
  app.use('/rubrica', authApi.profesor, require('./routes/rubrica.router'))

}