const path = require('path')
const express = require('express')
const morgan = require('morgan')
const co = require('co')
const CASAuthentication = require('cas-authentication')
const MongoClient = require('mongodb').MongoClient
var EstudianteModel = require('../app_api/models/estudiante.model')
var ProfesorModel = require('../app_api/models/profesor.model')
var ParaleloModel = require('../app_api/models/paralelo.model')

function obtenerProfesorPorCorreo(cas_user) {
  return new Promise((resolve, reject) => {
    let correo = `${cas_user}@espol.edu.ec`
    ProfesorModel.obtenerProfesorPorCorreo(correo, (err, profesor) => {
      if ( err ) return resolve(null)
      if ( !profesor ) resolve(false)
      resolve(profesor)
    })
  })
}

function obtenerEstudiantePorCorreo(cas_user) {
  return new Promise((resolve, reject) => {
    let correo = `${cas_user}@espol.edu.ec`
    EstudianteModel.obtenerEstudiantePorCorreo(correo, (err, estudiante) => {
      if ( err ) return resolve(null)
      if ( !estudiante ) resolve(false)
      resolve(estudiante)
    })
  })
}

function procesarSession (req, res, next) {
  co(function* () {
    if (!req.session.cas_user) {
      next()
    } else {
      let profesor = yield obtenerProfesorPorCorreo(req.session.cas_user.toLowerCase())
      let estudiante = yield obtenerEstudiantePorCorreo(req.session.cas_user.toLowerCase())
      if (profesor) {
        req.session.privilegios = 'profesor';
        req.session.correo = profesor.correo;
        req.session._id = profesor._id;
        req.session.login = true;
        return res.redirect('/profesores')
      }
      if (estudiante) {
        req.session.privilegios = 'estudiante';
        req.session.correo = estudiante.correo;
        req.session._id = estudiante._id;
        req.session.login = true;
        return res.redirect('/estudiantes')
      } else if (!estudiante && !profesor) {
        return res.redirect('/otros')
      }
    }
  }).catch((err) => {
    console.error(err)
  })
}

function middleEstudianteControl(req, res, next) {
  if (process.env.NODE_ENV == 'development') {
    next()
    return
  }
  if (req.session.privilegios == 'estudiante') {
    next()
    return
  }
  if (req.session.privilegios == 'profesor') {
    res.redirect('/profesores')
  }
}

function middleProfesorControl(req, res, next) {
  if (process.env.NODE_ENV == 'development') {
    next()
    return
  }
  if (req.session.privilegios == 'estudiante') {
    res.redirect('/estudiantes')
  }
  if (req.session.privilegios == 'profesor') {
    next()
    return
  }
}

function redirecion(req, res , next) {
  if (!req.session.cas_user) {
    res.redirect('/')
  } else {
    next();
  }
}

let urlServidor = ''
if (require("os").userInfo().username == 'User') { // usado para cuando estoy en el basar
  urlServidor = 'mongodb://ppl:ppl@ds157499.mlab.com:57499/ppl_development'
} else if (process.env.NODE_ENV){
  if (process.env.NODE_ENV === 'development:cas') {
    urlServidor = `mongodb://localhost/ppl_development`
  } else {
    urlServidor = `mongodb://localhost/ppl_${process.env.NODE_ENV}`
  }
} else {
  console.error('Error no escogio ninguna variable de entorno')
  process.exit(1)
}

module.exports = (app) => {
  const URL_ESPOL_SERVER = 'http://ppl-assessment.espol.edu.ec'
  let SERVICE_URL = ''
  if ( process.env.NODE_ENV === 'development'  || process.env.NODE_ENV === 'testing' || process.env.NODE_ENV === 'development:cas') {
    app.use(morgan('dev'));
    SERVICE_URL = 'http://localhost:' + process.env.PORT
  } else if ( process.env.NODE_ENV === 'production') {
    app.use(morgan('tiny'))
    SERVICE_URL = URL_ESPOL_SERVER
  }

  let cas = new CASAuthentication({
    cas_url      : 'https://auth.espol.edu.ec',
    service_url  : SERVICE_URL,
    cas_version  : '2.0',
    is_dev_mode  : false,
    destroy_session: true,
    renew: true,
    session_name : 'cas_user',
    session_info : 'cas_userinfo',
    destroy_session: true
  })

  if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing') {
    app.use('/', express.static(path.join(__dirname, 'login')))
    app.use('/api/session', require('../app_api/routes/login.router'))

    function authProfesor (req, res, next) {
      if (req.session.login && req.session.privilegios === 'profesor') {
        next()
      }  else {
        res.redirect('/')
      }
    }

    function authEstudiante(req, res, next) {
      if (req.session.login && req.session.privilegios === 'estudiante') {
        next()
      } else {
        res.redirect('/')
      }
    }

    procesarSession = function(req, res, next) { next() }
    redirecion = function(req, res, next) { next() }
  } else if ( process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development:cas' ) {
    app.get( '/', procesarSession,  cas.bounce_redirect)
    var authProfesor = cas.block
    var authEstudiante = cas.block
    app.get('/api/session/usuario_conectado', require('../app_api/controllers/login.controller').obtenerUsuarioLoggeado)
    app.get( '/api/session/logout', cas.logout)
  }

  app.use('/profesores',redirecion, authProfesor, middleProfesorControl, (req, res) => { res.redirect('/v2/profesores')})

  // app.use('/profesores',redirecion, authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores')))
  app.use('/profesores/grupos', redirecion,authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/grupos')))
  app.use('/profesores/preguntas/banco', redirecion, authProfesor, middleProfesorControl,  express.static(path.join(__dirname, 'profesores/preguntas/banco')))
  app.use('/profesores/preguntas/:id', redirecion, authProfesor, middleProfesorControl,  express.static(path.join(__dirname, 'profesores/preguntas/ver-pregunta')))
  app.use('/profesores/preguntas/:id', redirecion,authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/preguntas/ver-pregunta')))
  app.use('/profesores/preguntas/:id', redirecion,authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/preguntas/ver-pregunta')))
  app.use('/profesores/preguntas/nueva-pregunta',redirecion, authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/preguntas/nueva-pregunta')));
  app.use('/profesores/leccion/crear',redirecion,authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/leccion/crear')))
  app.use('/profesores/leccion/',redirecion,authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/leccion/')))
  app.use('/profesores/leccion/calificar/grupos/:id_leccion',redirecion,authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/leccion/calificar/grupos')))
  app.use('/profesores/leccion/calificar/:id_leccion/:id_estudiante/:id_grupo',redirecion,authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/leccion/calificar')))
  app.use('/profesores/lecciones',redirecion,authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/lecciones')))
  app.use('/profesores/leccion/modificar/:id',redirecion,authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/leccion/modificar')))
  app.use('/profesores/leccion-panel/:id_leccion/paralelo/:id_paralelo' ,redirecion,authProfesor,  middleProfesorControl,express.static(path.join(__dirname, 'profesores/leccion-panel')))
  app.use('/profesores/leccion/calificar',redirecion, authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/leccion/calificar')))
  app.use('/profesores/leccion/:id',redirecion, authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/leccion/ver/')));
  app.use('/profesores/leccion/recalificar/grupos/:id',redirecion, authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/leccion/recalificar/grupos')))
  app.use('/profesores/leccion/recalificar/:id_leccion/:id_estudiante/:id_grupo',redirecion,authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/leccion/recalificar')))
  app.use('/profesores/leccion/:id_leccion/estadisticas', redirecion, authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/leccion/estadisticas')))
  app.use('/profesores/rubrica/',redirecion,authProfesor, middleProfesorControl, express.static(path.join(__dirname, 'profesores/rubrica/')))
  app.use('/navbar/profesores' ,express.static(path.join(__dirname, 'profesores/partials/navbar.html')))
  app.use('/otros', function(req, res, next) {
    if (req.sessionID) {
      if (res) {
        MongoClient.connect(urlServidor, function(err, db) {
          var collection = db.collection('sessions')
          collection.remove({_id: req.sessionID}, function(err, docs) {
            req.session = null
            db.close()
            return next()
            })
          })
        } else {
          req.session = null
          return next()
        }
    } else {
      req.session = null
      next()
    }
  }, express.static(path.join(__dirname, 'otros')), cas.logout)

  app.get('/logout', function(req, res) {
    if (req.session) {
      req.session.destroy(function(err) {
        if (err) {
          res.send(false)
        } else {
          res.send(true)
        }
      })
    }
  })

  // ESTUDIANTES
  app.use('/estudiantes/leccion',redirecion, authEstudiante, middleEstudianteControl,  function(req, res, next) {
    EstudianteModel.obtenerEstudiante(req.session._id, (err, estudiante) => {
      ParaleloModel.obtenerParaleloDeEstudiante(req.session._id, (err, paralelo) => {
        if (estudiante.codigoIngresado && paralelo.leccionYaComenzo) {
          next()
        } else {
          res.redirect('/v2/estudiantes/#/ingresarCodigo')
        }
      })
    })
  }, express.static(path.join(__dirname, '/estudiantes/leccion')))
  app.use('/estudiantes',redirecion, authEstudiante, middleEstudianteControl, (req, res) => { res.redirect('/v2/estudiantes')})

  // app.use('*', express.static(path.join(__dirname, 'error')))
}
