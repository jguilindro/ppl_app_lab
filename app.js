const express     = require('express');
path              = require('path');
favicon           = require('serve-favicon');
morgan            = require('morgan');
cookieParser      = require('cookie-parser');
cors              = require('cors');
bodyParser        = require('body-parser'),
session           = require('express-session'),
MongoStore        = require('connect-mongo')(session),
CASAuthentication = require('cas-authentication'),
MongoClient  = require('mongodb').MongoClient,
URL         = require('./app_api/utils/change_database').local(),
os = require('os');

// CAS URLS
var URL_CAS_LOCALHOST = 'http://localhost:3000'
var URL_CAS_PRODUCTION = 'https://ppl-espol.herokuapp.com'
var SERVICE_URL = ''
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'production-test' || process.env.NODE_ENV == 'testing' || process.env.NODE_ENV == 'api') {
  SERVICE_URL = URL_CAS_LOCALHOST
} else if (process.env.NODE_ENV == 'production') {
  SERVICE_URL = URL_CAS_PRODUCTION
} else if (process.env.NODE_ENV == 'testing') {
  SERVICE_URL = URL_CAS_PRODUCTION
}

// base de datos mongoose
require('./app_api/models/db')
// sync db y ws
require('./app_api/ws').update()

if (os.hostname() === 'joelerll-laptop') {
  // require('./app_api/utils/telegram_bot')
} else if (process.env.NODE_ENV == 'production') {
  // require('./app_api/utils/telegram_bot')
} else if (process.env.APP && process.env.APP == 'realtime' || process.env.NODE_ENV == 'api') {
  require('./app_api/utils/telegram_bot')
}

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(function(req, res, next){
  res.io = io;
  next();
});

if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'production-test' || process.env.NODE_ENV == 'api') {
  app.use(morgan('dev'));
} else if (process.env.NODE_ENV == 'production' || process.env.NODE_ENV == 'testing') {
  app.use(morgan('tiny'))
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
	secret: 'MY-SESSION-DEMO',  // <= en un env
	resave: false,
  expire: 1 * 24 * 60 * 60 ,
	saveUninitialized: false,
  store: new MongoStore({
      url: require('./app_api/utils/change_database').local(),
      ttl: 12 * 60 * 60 // = 14 days. Default
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
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


// Control de rutas(para que estudiantes no puedan ingresar a profesor ruta)
var procesarSession = require('./app_api/config/auth.cas.config').session
var procesarSessionEstudiante = require('./app_api/config/auth.cas.config').sessionEstudiante
var middleEstudianteControl = require('./app_api/config/auth.cas.config').middlewareControlEstudiante
var middleProfesorControl = require('./app_api/config/auth.cas.config').middlewareControlProfesor

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'api') {
  app.use('/', express.static(path.join(__dirname, 'app_client/login')));
  app.use('/api/session', require('./app_api/routes/login.router'));
  var { authProfesor, authEstudiante, authApiProfesor, authApiEstudiante } = require('./app_api/config/auth.config')
  var procesarSession = function(req, res, next) {
    next()
  }
} else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production-test' || process.env.NODE_ENV === 'testing' ) {
  app.get( '/', cas.bounce, function(req, res, next) {
    res.redirect('/profesores') // asi sea estudiante o profesor, despues se redirigira solo
  });
  var authProfesor = cas.bounce;
  var authApiProfesor = cas.block;
  var authEstudiante = cas.bounce;
  var authApiEstudiante = cas.block;
  app.get('/api/session/usuario_conectado', require('./app_api/controllers/login.controller').obtenerUsuarioLoggeado)
  app.get( '/api/session/logout', cas.logout)
}

require('./app_api/realtime/realtime')(io)

//vistas
app.use('/profesores', authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores')));

app.use('/profesores/grupos',authProfesor , procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/grupos')));

app.use('/profesores/preguntas/estimacion', authProfesor, procesarSession, middleProfesorControl,  express.static(path.join(__dirname, 'app_client/profesores/preguntas/estimacion')));

app.use('/profesores/preguntas/estimacion/:id', authProfesor, procesarSession, middleProfesorControl,  express.static(path.join(__dirname, 'app_client/profesores/preguntas/ver-pregunta')));

app.use('/profesores/preguntas/tutorial', authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/preguntas/tutorial')));

app.use('/profesores/preguntas/tutorial/:id', authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/preguntas/ver-pregunta')));

app.use('/profesores/preguntas/laboratorio', authProfesor, procesarSession, middleProfesorControl,  express.static(path.join(__dirname, 'app_client/profesores/preguntas/laboratorio')));

app.use('/profesores/preguntas/laboratorio/:id', authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/preguntas/ver-pregunta')));

app.use('/profesores/preguntas/nueva-pregunta', authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/preguntas/nueva-pregunta')));

app.use('/profesores/leccion/crear',authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/crear')));

app.use('/profesores/leccion/',authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/')))

app.use('/profesores/leccion/calificar/grupos/:id_leccion',authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/calificar/grupos')))

app.use('/profesores/leccion/calificar/:id_leccion/:id_estudiante/:id_grupo',authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/calificar')))

app.use('/profesores/lecciones',authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/lecciones')))

app.use('/profesores/leccion/modificar/:id',authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/modificar')))

app.use('/profesores/leccion-panel/:id_leccion/paralelo/:id_paralelo' ,authProfesor, procesarSession,  middleProfesorControl,express.static(path.join(__dirname, 'app_client/profesores/leccion-panel')));

app.use('/profesores/leccion/calificar', authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/calificar')));

app.use('/profesores/leccion/:id', authProfesor, procesarSession, middleProfesorControl, express.static(path.join(__dirname, 'app_client/profesores/leccion/ver/')));

/*
 Estudiantes
 */
const { estudianteDandoLeccion, estudiantePuedeDarLeccion } = require('./app_api/middlewares/estudiante.middlewares')

app.use('/estudiantes/', express.static(path.join(__dirname, 'app_client/estudiantes/perfil')));

app.use('/estudiantes/ver-leccion/:id', authEstudiante, procesarSession, middleEstudianteControl, express.static(path.join(__dirname, 'app_client/estudiantes/ver-leccion')));

app.use('/estudiantes/tomar-leccion',  authEstudiante, procesarSession, middleEstudianteControl, function(req, res, next) {
  var EstudianteModel = require('./app_api/models/estudiante.model')
  var ParaleloModel = require('./app_api/models/paralelo.model')
  EstudianteModel.obtenerEstudiante(req.session._id, (err, estudiante) => {
    ParaleloModel.obtenerParaleloDeEstudiante(req.session._id, (err, paralelo) => {
      if (estudiante.codigoIngresado &&  paralelo.leccionYaComenzo) {
        res.redirect('/estudiantes/leccion')
      } else {
        next()
      }
    })
  })
} , express.static(path.join(__dirname, 'app_client/estudiantes/tomar-leccion')));

app.use('/estudiantes/leccion', authEstudiante, procesarSession, middleEstudianteControl, function(req, res, next) {
  var EstudianteModel = require('./app_api/models/estudiante.model')
  var ParaleloModel = require('./app_api/models/paralelo.model')
  EstudianteModel.obtenerEstudiante(req.session._id, (err, estudiante) => {
    ParaleloModel.obtenerParaleloDeEstudiante(req.session._id, (err, paralelo) => {
      if (estudiante.codigoIngresado && paralelo.leccionYaComenzo) {
        next()
      } else {
        res.redirect('/estudiantes/tomar-leccion')
      }
    })
  })
},express.static(path.join(__dirname, 'app_client/estudiantes/leccion'))); // otro middleware que no pueda ingresar si no esta dando leccion

// app.use('/estudiantes/tomar-leccion' , procesarSession, middleEstudianteControl, estudiantePuedeDarLeccion,express.static(path.join(__dirname, 'app_client/estudiantes/tomar-leccion')));
//
// app.use('/estudiantes/leccion', authEstudiante, procesarSession, estudianteDandoLeccion, middleEstudianteControl, express.static(path.join(__dirname, 'app_client/estudiantes/leccion'))); // otro middleware que no pueda ingresar si no esta dando leccion

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

// app_api OJO aqui esta expuesta
app.use('/api/profesores', require('./app_api/routes/profesores.router'));
app.use('/api/estudiantes', require('./app_api/routes/estudiantes.router'));
app.use('/api/grupos', require('./app_api/routes/grupos.router'));
app.use('/api/paralelos', require('./app_api/routes/paralelos.router'));
app.use('/api/lecciones', require('./app_api/routes/lecciones.router'));
app.use('/api/preguntas', require('./app_api/routes/preguntas.router'));
app.use('/api/respuestas', require('./app_api/routes/respuestas.router'));
app.use('/api/capitulos', require('./app_api/routes/capitulo.router'));
app.use('/api/calificaciones', require('./app_api/routes/calificacion.router'));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Url o metodo no valido');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  var mensaje = err.message;
  var error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json({"errorMessage": mensaje, "errorCodigo": error.status, "estado": false});
});

module.exports = {app: app, server: server};
