// Librerias usadas
var express = require('express') // libreria routing
var bodyParser = require('body-parser') // parsear requests
var favicon = require('serve-favicon') // favicon
var cookieParser = require('cookie-parser') // manejo de cookies
var compression = require('compression') // comprimir los json
var db = require('./db/db.js') // base de datos

var app = express()
var server = require('http').Server(app)
var port = normalizePort(process.env.PORT || 8000)
app.set('port', port)

// Middlewares
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
// app.use(function(req, res, next) {
//   if (req.originalUrl !== '/favicon.ico') {
//     console.log(req.originalUrl)
//     console.log(res.statusCode)
//   }
//   next()
// })

// RutasApi
// development, testing, production database
//https://github.com/hapijs/joi
//https://www.npmjs.com/package/validator
// documentacion, apiDocs
// .yml travisci
// testing
// perfomance testing
// admin routes
// permisos por cada actor

app.use('/api/profesores', require('./routes/profesores.routes'));

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

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

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }
  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' correr en otro puerto, este puerto requiere permisos de root');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' el puerto ya esta en uso');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'puerto  ' + addr.port;
  console.log('escuchando ' + bind)
}
