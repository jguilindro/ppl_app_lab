/* SERVER MODES
  production .- usado en el servidor
  production:test .- usado para pruebas locales del CAS
  development .- usado para desarrollo local
  debug .- usado para debug con visual studio code
  heroku .- usado para HEROKU
  testing .- usado para los test automaticos
  testprofesores.- usado para las reuniones de ppl
*/

if (process.env.NODE_ENV == 'production') {
  require('dotenv').config()
}

var spawn = require('child_process').spawn;
//var usage = require('usage');

const express     = require('express');
path              = require('path');
favicon           = require('serve-favicon');
morgan            = require('morgan');
cookieParser      = require('cookie-parser');
cors              = require('cors');
bodyParser        = require('body-parser'),
session           = require('express-session'),
MongoStore        = require('connect-mongo')(session),
compression = require('compression'),
CASAuthentication = require('cas-authentication'), //https://github.com/kylepixel/cas-authentication
// at /home/manager/ppl-assessment/node_modules/cas-authentication/index.js:79:41
//     at Parser.<anonymous> (/home/manager/ppl-assessment/node_modules/xml2js/lib/xml2js.js:489:18)
//     at CASAuthentication._validate (/home/manager/ppl-assessment/node_modules/cas-authentication/index.js:67:13)
// at CASAuthentication.<anonymous> (/home/manager/ppl-assessment/node_modules/cas-authentication/index.js:345:18)
MongoClient  = require('mongodb').MongoClient,
URL         = require('./app_api/utils/change_database').local();
var URL_ESPOL_SERVER = 'http://ppl-assessment.espol.edu.ec'
var URL_HEROKU = 'https://ppl-realtime.herokuapp.com/'
var SERVICE_URL = ''
//https://gist.github.com/bag-man/5570809
// var os = require('os')
// function cpuAverage(){

//   //Initialise sum of idle and time of cores and fetch CPU info
//   var totalIdle = 0, totalTick = 0;
//   var cpus = os.cpus();

//   //Loop through CPU cores
//   for(var i = 0, len = cpus.length; i < len; i++) {

//     //Select CPU core
//     var cpu = cpus[i];

//     //Total up the time in the cores tick
//     for(type in cpu.times) {
//       totalTick += cpu.times[type];
//    }     

//     //Total up the idle time of the core
//     totalIdle += cpu.times.idle;
//   }

//   //Return the average Idle and Tick times
//   return {idle: totalIdle / cpus.length,  total: totalTick / cpus.length};
// }
// function CPULoad(avgTime, callback) {
//   this.samples = [];
//   this.samples[1] = cpuAverage();
//   this.refresh = setInterval(() => {
//     this.samples[0] = this.samples[1];
//     this.samples[1] = cpuAverage();
//     var totalDiff = this.samples[1].total - this.samples[0].total;
//     var idleDiff = this.samples[1].idle - this.samples[0].idle;
//     callback(1 - idleDiff / totalDiff);
//   }, avgTime);
// }

// // load average for the past 1000 milliseconds
// var load = CPULoad(1000, (load) => console.log((100*load).toFixed(1)));

// base de datos mongoose
require('./app_api/models/db')

// sync db y web service
require('./app_api/ws').update()

var app = express();
var server = require('http').Server(app);
var debug = require('debug')('espol-ppl:server');
var port = normalizePort('8000')

if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'production:test' || process.env.NODE_ENV == 'production' || process.env.NODE_ENV === 'testprofesores') {
  var URL_CAS_LOCALHOST = 'http://localhost:8000'
} else if (process.env.NODE_ENV == 'debug') {
  var URL_CAS_LOCALHOST = 'http://localhost:7000'
  port = normalizePort('7000')
} else if (process.env.NODE_ENV == 'heroku') {
  port = normalizePort(process.env.PORT || '8000');
}

app.set('port', port);
server.listen(port);

var io = require('socket.io')(server, {'pingInterval': 60000, 'pingTimeout': 120000});
// app.use(function(req, res, next){
//   res.io = io;
//   next();
// });

// variables de entorno
if ( process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'production:test' ||process.env.NODE_ENV == 'debug' || process.env.NODE_ENV === 'testprofesores' ) {
  app.use(morgan('dev'));
  SERVICE_URL = URL_CAS_LOCALHOST
} else if ( process.env.NODE_ENV == 'production' ) {
  SERVICE_URL = URL_ESPOL_SERVER
  app.use(morgan('tiny'))
} else if (process.env.NODE_ENV == 'heroku') {
  SERVICE_URL = URL_HEROKU
  app.use(morgan('tiny'))
}

app.use(compression()); //use compression 
app.use(favicon(path.join(__dirname, 'public', 'img/favicon.ico')))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
	secret: require('./app_api/config/main').secret,  // <= en un .env
	resave: true,
  expire: 1 * 24 * 60 * 60 ,
	saveUninitialized: true,
  store: new MongoStore({
      url: require('./app_api/utils/change_database').local(),
      ttl: 12 * 60 * 60
    })
}));

var cas = new CASAuthentication({
  cas_url      : 'https://auth.espol.edu.ec',
  service_url  : SERVICE_URL,
  cas_version  : '2.0',
  dev_mode_user: 'joeedrod',
  is_dev_mode  : false,
  session_name : 'cas_user',
  session_info : 'cas_userinfo',
  destroy_session: true
});

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/scripts', express.static(__dirname + '/node_modules/'));

// El problema de las imagenes es por el cors, esta puede ser la solucion
app.all('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  next();
});

function redirecion(req, res , next) {
  if (!req.session.cas_user) {
    res.redirect('/')
  } else {
    next();
  }
}

// Control de rutas(para que estudiantes no puedan ingresar a profesor ruta)
var procesarSession = require('./app_api/config/auth.cas.config').session
var procesarSessionEstudiante = require('./app_api/config/auth.cas.config').sessionEstudiante
var middleEstudianteControl = require('./app_api/config/auth.cas.config').middlewareControlEstudiante
var middleProfesorControl = require('./app_api/config/auth.cas.config').middlewareControlProfesor


// variables de entorno de middlewares
if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV == 'debug' || process.env.NODE_ENV === 'testprofesores') {
  app.use('/', express.static(path.join(__dirname, 'app_client/login')));
  app.use('/api/session', require('./app_api/routes/login.router'));
  var { authProfesor, authEstudiante, authApiProfesor, authApiEstudiante } = require('./app_api/config/auth.config')
  var procesarSession = function(req, res, next) {
    next()
  }
  var redirecion = function(req, res, next) {
    next()
  }
} else if ( process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production:test' ||  process.env.NODE_ENV == 'heroku' ) {
  app.get( '/', cas.bounce, function(req, res, next) { // FIXME: para que sirve?
    res.redirect('/profesores') // asi sea estudiante o profesor, despues se redirigira solo
  });
  var authProfesor = cas.block;
  var authApiProfesor = cas.block;
  var authEstudiante = cas.block;
  var authApiEstudiante = cas.block;
  app.get('/api/session/usuario_conectado', require('./app_api/controllers/login.controller').obtenerUsuarioLoggeado)
  app.get( '/api/session/logout', cas.logout)
}

require('./app_api/realtime/realtime')(io)

/*
  Profesores
 */
app.use('/profesores',redirecion, authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores')));

app.use('/profesores/grupos', redirecion,authProfesor , procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/grupos')));

app.use('/profesores/preguntas/banco', redirecion, authProfesor, procesarSession, middleProfesorControl,  express.static(path.join(__dirname, 'app_client/profesores/preguntas/banco')));

//app.use('/profesores/preguntas/estimacion', redirecion, authProfesor, procesarSession, middleProfesorControl,  express.static(path.join(__dirname, 'app_client/profesores/preguntas/estimacion')));

app.use('/profesores/preguntas/:id', redirecion, authProfesor, procesarSession, middleProfesorControl,  express.static(path.join(__dirname, 'app_client/profesores/preguntas/ver-pregunta')));

//app.use('/profesores/preguntas/tutorial',redirecion, authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/preguntas/tutorial')));

app.use('/profesores/preguntas/:id', redirecion,authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/preguntas/ver-pregunta')));

//app.use('/profesores/preguntas/laboratorio', redirecion,authProfesor, procesarSession, middleProfesorControl,  express.static(path.join(__dirname, 'app_client/profesores/preguntas/laboratorio')));

app.use('/profesores/preguntas/:id', redirecion,authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/preguntas/ver-pregunta')));

app.use('/profesores/preguntas/nueva-pregunta',redirecion, authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/preguntas/nueva-pregunta')));

app.use('/profesores/leccion/crear',redirecion,authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/crear')));

app.use('/profesores/leccion/',redirecion,authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/')))

app.use('/profesores/leccion/calificar/grupos/:id_leccion',redirecion,authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/calificar/grupos')))

app.use('/profesores/leccion/calificar/:id_leccion/:id_estudiante/:id_grupo',redirecion,authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/calificar')))

app.use('/profesores/lecciones',redirecion,authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/lecciones')))

app.use('/profesores/leccion/modificar/:id',redirecion,authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/modificar')))

app.use('/profesores/leccion-panel/:id_leccion/paralelo/:id_paralelo' ,redirecion,authProfesor, procesarSession,  middleProfesorControl,express.static(path.join(__dirname, 'app_client/profesores/leccion-panel')));

app.use('/profesores/leccion/calificar',redirecion, authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/calificar')));

app.use('/profesores/leccion/:id',redirecion, authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/ver/')));

app.use('/profesores/leccion/recalificar/grupos/:id',redirecion, authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/recalificar/grupos')));

app.use('/profesores/leccion/recalificar/:id_leccion/:id_estudiante/:id_grupo',redirecion,authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/recalificar')));

app.use('/profesores/rubrica/',redirecion,authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/rubrica/')))

/*
 Estudiantes
 */
app.use('/app_client/estudiantes/dist',redirecion, authEstudiante, procesarSession, middleEstudianteControl, express.static(path.join(__dirname, 'app_client/estudiantes/dist')));
app.get('/estudiantes/single_page', function (req, res) {
  res.sendFile( path.resolve(__dirname + '/app_client/estudiantes/index.html') );
});

// router.get('/*', function(req, res) { res.sendFile(rootPath + 'public/index.html', { user: req.user }); });

app.get('/estudiantes', function (req, res) {
 res.sendFile( path.resolve(__dirname + '/app_client/estudiantes/perfil/index.html') );
});
app.use('/app_client/estudiantes/perfil',redirecion, authEstudiante, procesarSession, middleEstudianteControl, express.static(path.join(__dirname, '/app_client/estudiantes/perfil')));

app.use('/estudiantes/ver-leccion/:id',redirecion, authEstudiante, procesarSession, middleEstudianteControl, express.static(path.join(__dirname, 'app_client/estudiantes/ver-leccion')));

app.use('/app_client/estudiantes/tomar-leccion',redirecion, authEstudiante, procesarSession, middleEstudianteControl, express.static(path.join(__dirname, '/app_client/estudiantes/tomar-leccion')));


app.get('/estudiantes/tomar-leccion',redirecion,  authEstudiante, procesarSession, middleEstudianteControl, function(req, res, next) {
  var EstudianteModel = require('./app_api/models/estudiante.model')
  var ParaleloModel = require('./app_api/models/paralelo.model')
  EstudianteModel.obtenerEstudiante(req.session._id, (err, estudiante) => {
    ParaleloModel.obtenerParaleloDeEstudiante(req.session._id, (err, paralelo) => {
      if (estudiante.codigoIngresado &&  paralelo.leccionYaComenzo) {
        res.redirect('/estudiantes/leccion')
      } else {
        res.sendFile( path.resolve(__dirname + '/app_client/estudiantes/tomar-leccion/index.html') );
      }
    })
  })
});

app.use('/app_client/estudiantes/leccion',redirecion, authEstudiante, procesarSession, middleEstudianteControl, express.static(path.join(__dirname, '/app_client/estudiantes/leccion')));

app.get('/estudiantes/leccion',redirecion, authEstudiante, procesarSession, middleEstudianteControl, function(req, res, next) {
  var EstudianteModel = require('./app_api/models/estudiante.model')
  var ParaleloModel = require('./app_api/models/paralelo.model')
  EstudianteModel.obtenerEstudiante(req.session._id, (err, estudiante) => {
    ParaleloModel.obtenerParaleloDeEstudiante(req.session._id, (err, paralelo) => {
      if (estudiante.codigoIngresado && paralelo.leccionYaComenzo) {
        res.sendFile( path.resolve(__dirname + '/app_client/estudiantes/leccion/index.html') );
      } else {
        res.redirect('/estudiantes/tomar-leccion')
      }
    })
  })
},express.static(path.join(__dirname, 'app_client/estudiantes/leccion'))); // otro middleware que no pueda ingresar si no esta dando leccion

// otros
app.use('/otros', function(req, res, next) {
  if (req.sessionID) {
      if (res) {
        MongoClient.connect(URL, function(err, db) {
          var collection = db.collection('sessions');
          collection.remove({_id: req.sessionID}, function(err, docs) {
            req.session = null
            db.close();
            return next()
          })
        });
      } else {
        req.session = null
        return next()
      }
  } else {
    req.session = null
    next()
  }
}, express.static(path.join(__dirname, 'app_client/otros')), cas.logout)

// navbars
app.use('/navbar/profesores' ,express.static(path.join(__dirname, 'app_client/profesores/partials/navbar.html')))

// documentation
app.use('/docs/api' ,express.static(path.join(__dirname, 'docs/api')))
app.use('/docs/code' ,express.static(path.join(__dirname, 'docs/code/_book')))

/*
  API
 */
var authApi = require('./app_api/config/auth.api')
app.use('/api/profesores', require('./app_api/routes/profesores.router'));
app.use('/api/estudiantes', require('./app_api/routes/estudiantes.router'));
app.use('/api/grupos', require('./app_api/routes/grupos.router'));
app.use('/api/paralelos', require('./app_api/routes/paralelos.router'));
app.use('/api/lecciones', require('./app_api/routes/lecciones.router'));
app.use('/api/preguntas', require('./app_api/routes/preguntas.router'));
app.use('/api/respuestas', authApi.estudiante, require('./app_api/routes/respuestas.router'));
app.use('/api/capitulos', authApi.profesor, require('./app_api/routes/capitulo.router'));
app.use('/api/calificaciones', authApi.estudiante, require('./app_api/routes/calificacion.router'));
app.use('/api/rubrica', authApi.profesor, require('./app_api/routes/rubrica.router'));


// CONFIGS FILES
app.use(function(req, res, next) {
  var err = new Error('Url o metodo no valido');
  err.status = 404;
  next(err);
});
app.use(function(err, req, res, next) {
  // set locals, only providing error in development  <= OJO PRODUCTION LOGGER
  var mensaje = err.message;
  var error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.json({"errorMessage": mensaje, "errorCodigo": error.status, "estado": false});
});
var debug = require('debug')('espol-ppl:server');
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
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
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
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}
