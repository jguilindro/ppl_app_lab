/* SERVER MODES
  production .- usado en el servidor
  development .- usado para desarrollo local
  testing .- usado para los test automaticos
  debug .- usar el chome inscpector
  cas .- test cas
*/

global.db = require('./databases').relationalDB

var express = require('express') // libreria routing
var path = require('path')
var cors = require('cors')
var morgan = require('morgan') // logging
var cookieParser = require('cookie-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session) // guardar sessiones en mongo
var chalk = require('chalk')

var app = express()
var port = normalizePort(process.env.PORT || 8000)
app.set('port', port)

app.use(cors())
app.use(cookieParser());

// conectarse a mongodb
if (process.env.NODE_ENV !== 'testing') { 
  require('./databases').Mongo.Conectar()
    .then(function() {
      app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        expire: 1 * 24 * 60 * 60 ,
        store: new MongoStore({
            url: process.env.MONGO_URL,
            ttl: 1 * 24 * 60 * 60
          })
      }))
      console.info(chalk.green('Conectado a MONGODB'))
    })
    .catch(function() {
      console.error(chalk.red('Error Conexion MONGODB'))
    })
}

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'cas') {
   app.use(morgan('tiny'))
}

//documentacion
app.use('/docs/code',express.static(path.join(__dirname, './docs/code/_book')))
app.use('/docs/api',express.static(path.join(__dirname, './docs/api')))
app.use('/reports', express.static(path.join(__dirname, './app_client/varios/reports')))
app.use('/coverage', express.static(path.join(__dirname, './app_client/varios/coverage')))

// cliente app
var client = express()
require('./app_client/server.routes.client.js')(client)

// api app
var api = express()
require('./app_api/server.routes.api.js')(api)

// realtime app


// definicion subapps
app.use('/', client)
app.use('/api', api)


// no autorizado
// 404 not found
// app.use('/api*', function(req, res, next) {
//   console.log('api error')
//   res.send('error de api ruta no encontrada')
// })

// app.use('/*', function(req, res, next) {
//   // si no esta loggeado, /
//   // si esta loggedo, / mandarlo a profesores
//   // si esta loggeado y es una ruta no valida
//   console.log('client error')
//   res.send('client no found')
//   // if (!req.session.cas_user) {
//   //   res.redirect('/')
//   // } else {
//   //   //res.redirect('/profesores')
//   //   //res.redirect('/estudiantes') 
//   //   //res.redirect('/admin') 
//   //   next()
//   // }
// })


function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    return val;
  }
  if (port >= 0) {
    return port;
  }
  return false;
}

module.exports = app