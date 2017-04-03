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
	saveUninitialized: false,
  cookie: { secure: true }
}));
app.use(cors());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', express.static(path.join(__dirname, 'app_client/login')));
app.post('/login', function(req, res, next) {
  var joel = req.app.get('estado')
  if (req.body.username === 'joel' && req.body.password === '123') {
    req.session.username = req.body.username;
    console.log('hoa')
    app.set('estado', true);
    res.redirect('/profesores')
    next()
  } else {
    res.redirect('/')
    app.set('estado', false);
  }
})
/*
middleware login
 */

//vistas
app.use('/profesores',function(req, res, next) {
  var joel = req.app.get('estado')
  console.log(joel)
  if (!joel) {
    return res.redirect('/')
  }
  console.log(req.session.username)
  next()
},express.static(path.join(__dirname, 'app_client/profesores')));

app.use('/profesores/grupos', express.static(path.join(__dirname, 'app_client/profesores/grupos')));
app.use('/profesores/preguntas', express.static(path.join(__dirname, 'app_client/profesores/preguntas')));
app.use('/profesores/preguntas/nueva-pregunta', express.static(path.join(__dirname, 'app_client/profesores/preguntas/nueva-pregunta')));
app.use('/estudiantes', express.static(path.join(__dirname, 'app_client/estudiantes/perfil')));
app.use('/estudiantes/tomar-leccion', express.static(path.join(__dirname, 'app_client/estudiantes/tomar-leccion')))
// app_api

app.use('/api/profesores', require('./app_api/routes/profesores.router'));
app.use('/api/estudiantes', require('./app_api/routes/estudiantes.router'));
app.use('/api/grupos', require('./app_api/routes/grupos.router'));
app.use('/api/paralelos', require('./app_api/routes/paralelos.router'));
app.use('/api/lecciones', require('./app_api/routes/lecciones.router'));
app.use('/api/preguntas', require('./app_api/routes/preguntas.router'));


//Handling del login
app.post('/login', function(req, res){
	var username= req.body.usuario;
	var password= req.body.password;

	if (username =="profesor" && password =="1234"){
		req.session ["username"]= username;
		res.redirect('profesores/grupos') ;
		return;
	} else if (username =="estudiante" && password =="1234"){
		req.session ["username"]= username;
		res.redirect('/estudiantes');
		return;

	}else{res.send(500,'showAlert');}


	/*
	if (username =="user" && password =="user1234"&& rol=="Paciente"){
		req.session ["username"]= username;
		req.session ["rol"]= rol;
		res.redirect('home');
		return;
	}

	*/

});

app.get('/logout', function(req, res, next){
	req.session.destroy();
	res.redirect('/');
});

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
