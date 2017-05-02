var co = require('co');
var EstudianteModel = require('../models/estudiante.model');
var ProfesorModel       = require('../models/profesor.model');
function session (req, res, next) {
  if (process.env.NODE_ENV == 'development') {
    next()
    return
  }
  co(function* () {
    let profesor = yield obtenerProfesorPorCorreo(req.session.cas_user)
    if (profesor) {
      req.session.privilegios = 'profesor';
      req.session.correo = profesor.correo;
      req.session._id = profesor._id;
      req.session.login = true;
      next()
    } else {
      res.redirect('/')
    }
  })
}

function sessionEstudiante(req, res, next) {
  if (process.env.NODE_ENV == 'development') {
    next()
    return
  }
  co(function* () {
    let estudiante = yield obtenerEstudiantePorCorreo(req.session.cas_user)
    if (estudiante) {
      req.session.privilegios = 'estudiante';
      req.session.correo = estudiante.correo;
      req.session._id = estudiante._id;
      req.session.login = true;
      next()
    } else {
      res.redirect('/')
    }
  })
}

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

module.exports = {
  session,
  sessionEstudiante,
}
