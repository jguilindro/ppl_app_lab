const express  = require('express');
path         = require('path');
favicon      = require('serve-favicon');
logger       = require('morgan');
cookieParser = require('cookie-parser');
cors         = require('cors');
bodyParser   = require('body-parser'),
passport     = require('passport'),
session      = require('express-session'),
MongoStore   = require('connect-mongo')(session);

// base de datos mongoose
require('./app_api/models/db')

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: 'MY-SESSION-DEMO',
	resave: true,
	saveUninitialized: false,
  store: new MongoStore({ url: require('./app_api/config/main').mlab_sesiones })
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'app_client/login')));
app.use('/api/session', require('./app_api/routes/login.router'));

// Auth middleware
const { authProfesor, authEstudiante, authApiProfesor, authApiEstudiante } = require('./app_api/config/auth.config')

//vistas
app.use('/profesores', authProfesor, express.static(path.join(__dirname, 'app_client/profesores')));
app.use('/profesores/grupos', authProfesor, express.static(path.join(__dirname, 'app_client/profesores/grupos')));
app.use('/profesores/preguntas', authProfesor, express.static(path.join(__dirname, 'app_client/profesores/preguntas')));
app.use('/profesores/preguntas/nueva-pregunta', authProfesor, express.static(path.join(__dirname, 'app_client/profesores/preguntas/nueva-pregunta')));
app.use('/estudiantes', authEstudiante, express.static(path.join(__dirname, 'app_client/estudiantes/perfil')));
app.use('/estudiantes/tomar-leccion', authEstudiante, express.static(path.join(__dirname, 'app_client/estudiantes/tomar-leccion')))
// app_api
app.use('/api/profesores', authApiProfesor, require('./app_api/routes/profesores.router'));
app.use('/api/estudiantes', authApiEstudiante, require('./app_api/routes/estudiantes.router'));
app.use('/api/grupos', authApiProfesor, require('./app_api/routes/grupos.router'));
app.use('/api/paralelos', authApiProfesor, require('./app_api/routes/paralelos.router'));
app.use('/api/lecciones', authApiProfesor, require('./app_api/routes/lecciones.router'));
app.use('/api/preguntas', authApiProfesor, require('./app_api/routes/preguntas.router'));

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

module.exports = app;
