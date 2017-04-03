var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');

// base de datos mongoose
require('./app_api/models/db')

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



//vistas
app.use('/profesores', express.static(path.join(__dirname, 'app_client/profesores')));
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
app.use('/api/preguntas', require('./app_api/routes/preguntas.routes'));
app.use('/api/preguntas', require('./app_api/routes/preguntas.routes'));

app.use(session({
	secret: 'MY-SESSION-DEMO',
	resave: true,
	saveUninitialized: false
}));

app.get('/', function(req, res, next){
if(req.session["username"]){
	if (req.session["username"]== "profesor"){
		res.redirect('profesores/grupos') ;
		return;
	} else if (req.session["username"]== "estudiante"){
		res.redirect('/estudiantes');
		return;
	} else {
	res.sendStatus(500);
	}
} else{
	 res.sendfile('app_client/login/login.html', {root: __dirname });
	}});
	
app.get('/estudiantes', function(req, res, next){
if(req.session["username"]){
	if (req.session["username"]!= "estudiante"){
		res.sendStatus(403);
	} else {
	res.sendfile('app_client/estudiantes/perfil/estudiante.html', {root: __dirname });
	}
} else{
	res.sendStatus(401);
	}});

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

	}else{res.status(500);}


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
