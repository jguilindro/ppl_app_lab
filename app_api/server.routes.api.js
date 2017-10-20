// Aqui se llamaran todas las rutas y se instanciara las variables globales

// instanciacion de variables globales
global.logger = require('./utils/logger')
global.db = require('./db/db')
global.responses = require('./utils/responses')

module.exports = function (app) {
  require('./routes/profesores.routes')(app) // Profesores
}


/*
app.use(function(req, res, next) {
    console.log(req.session)
    next()
  })
*/