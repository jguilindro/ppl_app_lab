const express = require('express');
path          = require('path');
favicon       = require('serve-favicon');
logger        = require('morgan');
cookieParser  = require('cookie-parser');
cors          = require('cors');
bodyParser    = require('body-parser'),
passport      = require('passport'),
session       = require('express-session'),
MongoStore    = require('connect-mongo')(session);

// base de datos mongoose
require('./app_api/models/db')
//require('./app_api/utils/telegram_bot')

var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
app.use(function(req, res, next){
  res.io = io;
  next();
});
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
	secret: 'MY-SESSION-DEMO',
	resave: true,
	saveUninitialized: false,
  store: new MongoStore({ url: require('./app_api/utils/change_database').session() })
}));

app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'app_client/login')));
app.use('/api/session', require('./app_api/routes/login.router'));

// Auth middleware
const { authProfesor, authEstudiante, authApiProfesor, authApiEstudiante } = require('./app_api/config/auth.config')
require('./app_api/realtime/realtime')(io)

//vistas
app.use('/profesores', authProfesor, express.static(path.join(__dirname, 'app_client/profesores')));
app.use('/profesores/grupos', authProfesor, express.static(path.join(__dirname, 'app_client/profesores/grupos')));

app.use('/profesores/preguntas/estimacion', authProfesor, express.static(path.join(__dirname, 'app_client/profesores/preguntas/estimacion')));
app.use('/profesores/preguntas/estimacion/:id', authProfesor, express.static(path.join(__dirname, 'app_client/profesores/preguntas/ver-pregunta')));
app.use('/profesores/preguntas/tutorial', authProfesor, express.static(path.join(__dirname, 'app_client/profesores/preguntas/tutorial')));
app.use('/profesores/preguntas/tutorial/:id', authProfesor, express.static(path.join(__dirname, 'app_client/profesores/preguntas/ver-pregunta')));
app.use('/profesores/preguntas/laboratorio', authProfesor, express.static(path.join(__dirname, 'app_client/profesores/preguntas/laboratorio')));
app.use('/profesores/preguntas/laboratorio/:id', authProfesor, express.static(path.join(__dirname, 'app_client/profesores/preguntas/ver-pregunta')));
app.use('/profesores/preguntas/nueva-pregunta', authProfesor, express.static(path.join(__dirname, 'app_client/profesores/preguntas/nueva-pregunta')));

app.use('/profesores/leccion/crear',authProfesor, express.static(path.join(__dirname, 'app_client/profesores/leccion/crear')))
app.use('/profesores/leccion/',authProfesor, express.static(path.join(__dirname, 'app_client/profesores/leccion/')))
app.use('/profesores/lecciones',authProfesor, express.static(path.join(__dirname, 'app_client/profesores/lecciones')))
app.use('/profesores/leccion/modificar/:id',authProfesor, express.static(path.join(__dirname, 'app_client/profesores/leccion/modificar')))

app.use('/profesores/leccion-panel/:id_leccion/paralelo/:id_paralelo' ,authProfesor, express.static(path.join(__dirname, 'app_client/profesores/leccion-panel')));



app.use('/estudiantes/', authEstudiante, express.static(path.join(__dirname, 'app_client/estudiantes/perfil')));
app.use('/estudiantes/ver-leccion/:id', authEstudiante, express.static(path.join(__dirname, 'app_client/estudiantes/ver-leccion')));
app.use('/estudiantes/tomar-leccion', authEstudiante , function(req, res, next) {
  var EstudianteController = require('./app_api/controllers/estudiantes.controller')
  EstudianteController.verificarPuedeDarLeccion(req.session._id, (match) => {
    console.log(match);
    if (match) {
      res.redirect('/estudiantes/leccion')
    } else {
      next()
    }
  })
} ,express.static(path.join(__dirname, 'app_client/estudiantes/tomar-leccion')));
app.use('/estudiantes/leccion', authEstudiante, function(req, res, next) {

  var EstudianteController = require('./app_api/controllers/estudiantes.controller')
  EstudianteController.verificarPuedeDarLeccion(req.session._id, (match) => {
    if (!match) {
      res.redirect('/estudiantes/tomar-leccion')
    } else {
      next()
    }
  })
},express.static(path.join(__dirname, 'app_client/estudiantes/leccion'))); // otro middleware que no pueda ingresar si no esta dando leccion

// app_api
app.use('/api/profesores', require('./app_api/routes/profesores.router'));
app.use('/api/estudiantes', require('./app_api/routes/estudiantes.router'));
app.use('/api/grupos', require('./app_api/routes/grupos.router'));
app.use('/api/paralelos', require('./app_api/routes/paralelos.router'));
app.use('/api/lecciones', require('./app_api/routes/lecciones.router'));
app.use('/api/preguntas', require('./app_api/routes/preguntas.router'));
app.use('/api/respuestas', require('./app_api/routes/respuestas.router'));

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
