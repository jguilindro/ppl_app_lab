var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./app_api/routes/index');
var login = require('./app_api/routes/login.js')

//api
var profesores_api = require('./app_api/routes/profesores')

var app = express();

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static(path.join(__dirname, 'app_client/login'))); //Esta parte será dada por el CAS, no sé como será el trep aquí - Edison
// Login middleware, verifica si el usuario esta loggeado
/*app.use(function(req, res, next) {
  if (false) {
    return next()
  } else {
    res.redirect('/')
  }
})*/
app.use('/profesores', express.static(path.join(__dirname, 'app_client/profesores')));
app.use('/estudiantes', express.static(path.join(__dirname, 'app_client/estudiantes')));
app.use('/profesores/grupos', express.static(path.join(__dirname, 'app_client/profesores/grupos/')))
// app_api
app.use('/api/profesores/login', profesores_api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
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
  res.json({message: mensaje, error: error});
});

module.exports = app;
