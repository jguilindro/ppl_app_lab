var express = require('express') // libreria routing
var morgan = require('morgan') // logging
var path = require('path')
var cors = require('cors')
var cookieParser = require('cookie-parser')
var session = require('express-session')
var MongoStore = require('connect-mongo')(session) // guardar sessiones en mongo
var MongoClient = require('mongodb').MongoClient
var CASAuthentication = require('cas-authentication')

// CAS configuration
const URL_ESPOL_SERVER = 'http://ppl-assessment.espol.edu.ec'
const URL_LOCALHOST = `http://localhost:${process.env.PORT_CLIENT || 8001}`
var SERVICE_URL = ''
if (process.env.NODE_ENV === 'production') {
  SERVICE_URL = URL_ESPOL_SERVER
} else if (process.env.NODE_ENV === 'production:test') {
  SERVICE_URL = URL_LOCALHOST
}

// conectarse a mongodb
MongoClient.connect(process.env.MONGO_URL, function(err, db) {
  if (err) {
    console.error('error al conectado a mongodb cliente')
  }
  console.log("conectado a mongodb cliente");
});

var app = express()
var server = require('http').Server(app)
var port = normalizePort(process.env.PORT_CLIENT || 8001)
app.set('port', port)

var cas = new CASAuthentication({
  cas_url      : 'https://auth.espol.edu.ec',
  service_url  : SERVICE_URL,
  cas_version  : '2.0',
  is_dev_mode  : false,
  session_name : 'cas_user',
  session_info : 'cas_userinfo',
  destroy_session: true
});


app.use(cors())
app.use(cookieParser());
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

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('tiny'))
  app.use('/', express.static(path.join(__dirname, 'varios/login')));
} else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production:test') {
  if (process.env.NODE_ENV === 'production:test') {
    app.use(morgan('tiny'))
  }
  app.get('/', cas.bounce, function(req, res) {
    // buscar es usuario en la base de datos, determinar si es admin, profesor, estudiante
    // guardarlo si es que existe, else redireccionarlo a que no esta autorizado
    req.session.save(function(err) {
      if ( err ) {
        //res.redirect('/')
      } else {
        res.redirect('/profesores')
      }
    })
  });
}

app.use('/*', function(req, res, next) {
  if (!req.session.cas_user) {
    res.redirect('/')
  } else {
    //res.redirect('/profesores')
    //res.redirect('/estudiantes') 
    //res.redirect('/admin') 
    next()
  }
})
app.use('/profesores', express.static(path.join(__dirname, 'profesores/dist')));
app.use('/estudiantes', express.static(path.join(__dirname, 'estudiantes/dist')));
app.use('/admin', express.static(path.join(__dirname, 'admin/dist')));
app.use('/no_autorizado', express.static(path.join(__dirname, 'varios/no_autorizado')));
app.get('/logout', cas.logout );
app.use('/*',  express.static(path.join(__dirname, 'varios/error')));
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
      console.error(bind + ' el puerto ya esta en uso client');
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
  console.log('api corriendo en ' + bind)
}