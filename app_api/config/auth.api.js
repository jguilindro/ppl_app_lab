const respuesta = require('../utils/responses')
const profesor = (req, res, next ) => {
  if (req.session.privilegios == 'profesor') {
    next()
  } else {
    respuesta.noAutorizado(res)
  }
}

const estudiante = (req, res, next) => {
  if (!req.session) {
    respuesta.noAutorizado(res)
  } else if (req.session.privilegios == 'estudiante') {
    next()
  } else if (req.session.privilegios == 'profesor') {
    next()
  }
}


module.exports = {
  profesor,
  estudiante
}
