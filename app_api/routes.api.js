const authApi = require('./config/auth.api')
function ignoreFavicon (req, res, next) {
  if (req.originalUrl === '/favicon.ico') {
    res.status(204).json({nope: true})
  } else {
    next()
  }
}
module.exports = (app) => {
  app.use(ignoreFavicon)
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