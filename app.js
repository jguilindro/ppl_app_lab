var express  = require('express');
path         = require('path');
favicon      = require('serve-favicon');
logger       = require('morgan');
cookieParser = require('cookie-parser');
cors         = require('cors');
bodyParser   = require('body-parser'),
passport         = require('passport'),
session      = require('express-session');

// base de datos mongoose
require('./app_api/models/db')

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
	secret: 'MY-SESSION-DEMO',
	resave: true,
	saveUninitialized: false
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static(path.join(__dirname, 'app_client/login')));
app.use('/api/session', require('./app_api/routes/login.router'));

function auth(req, res, next) {
  console.log(req.session)
  if (req.session.login) {
    next()
  }  else {
    res.redirect('/')
  }
}

//vistas
app.use('/profesores', auth, express.static(path.join(__dirname, 'app_client/profesores')));
app.use('/profesores/grupos', auth, express.static(path.join(__dirname, 'app_client/profesores/grupos')));
app.use('/profesores/preguntas', auth, express.static(path.join(__dirname, 'app_client/profesores/preguntas')));
app.use('/profesores/preguntas/nueva-pregunta', auth, express.static(path.join(__dirname, 'app_client/profesores/preguntas/nueva-pregunta')));
app.use('/estudiantes', auth, express.static(path.join(__dirname, 'app_client/estudiantes/perfil')));
app.use('/estudiantes/tomar-leccion', auth, express.static(path.join(__dirname, 'app_client/estudiantes/tomar-leccion')))
// app_api
app.use('/api/profesores', auth, require('./app_api/routes/profesores.router'));
app.use('/api/estudiantes', auth, require('./app_api/routes/estudiantes.router'));
app.use('/api/grupos', auth, require('./app_api/routes/grupos.router'));
app.use('/api/paralelos', auth, require('./app_api/routes/paralelos.router'));
app.use('/api/lecciones', auth, require('./app_api/routes/lecciones.router'));
app.use('/api/preguntas', auth, require('./app_api/routes/preguntas.router'));

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
