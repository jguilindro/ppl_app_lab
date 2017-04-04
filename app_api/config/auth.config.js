function authProfesor (req, res, next) {
  console.log(req.session)
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
    res.status(401).json({estado: false, errorMessage: 'No autorizado'})
  }
}

function authApiEstudiante(req, res, next) {
  if (req.session.login && req.session.privilegios === 'estudiante') {
    next()
  }  else {
    res.status(401).json({estado: false, errorMessage: 'No autorizado'})
  }
}

module.exports = {
  authProfesor,
  authEstudiante,
  authApiProfesor,
  authApiEstudiante,
}
