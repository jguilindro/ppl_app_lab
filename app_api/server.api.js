/* SERVER MODES
  production .- usado en el servidor
  development .- usado para desarrollo local
  testing .- usado para los test automaticos
  production:test .- test cas
*/

// Librerias usadas
var express = require('express') // libreria routing
var bodyParser = require('body-parser') // parsear requests
var cookieParser = require('cookie-parser') // manejo de cookies
var morgan = require('morgan')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session)
var MongoClient = require('mongodb').MongoClient

MongoClient.connect(process.env.MONGO_URL, function(err, db) {
  if (err) {
    console.error('error al conectado a mongodb api')
  }
  console.log("conectado a mongodb api");
});

var app = express()
var server = require('http').Server(app)
var port = normalizePort(process.env.PORT || 8000)
app.set('port', port)

// Middlewares
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  expire: 1 * 24 * 60 * 60 ,
  store: new MongoStore({
      url: process.env.MONGO_URL,
      ttl: 1 * 24 * 60 * 60
    })
}));
// Middlewares env
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
  app.use(morgan('tiny'))
}


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
app.use(function(req, res, next) {
  console.log(req.session)
  next()
})

app.use('/profesores', require('./routes/profesores.routes'));
app.use('/login', require('./routes/login.routes'));
app.use('/*', function(req, res, next) {
  res.send('404 not found')
})

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
      console.error(bind + ' el puerto ya esta en uso api');
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
  console.log('server escuchando ' + bind)
}
