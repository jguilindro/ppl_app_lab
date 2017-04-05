var respuesta = require('../utils/responses');

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

function authApiProfesor (req, res, next) {
  if (req.session.login && req.session.privilegios === 'profesor') {
    next()
  }  else {
    respuesta.noAutorizado(res)
  }
}

function authApiEstudiante(req, res, next) {
  if (req.session.login && req.session.privilegios === 'estudiante') {
    next()
  }  else {
    respuesta.noAutorizado(res)
  }
}

module.exports = {
  authProfesor,
  authEstudiante,
  authApiProfesor,
  authApiEstudiante,
}
