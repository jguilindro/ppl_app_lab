var EstudianteController = require('../controllers/estudiantes.controller')
function estudiantePuedeDarLeccion(req, res, next) {
  EstudianteController.verificarPuedeDarLeccion(req.session._id, (match) => {
    if (match) {
      res.redirect('/estudiantes/leccion')
    } else {
      next()
    }
  })
}

function estudianteDandoLeccion(req, res, next) {
  EstudianteController.verificarPuedeDarLeccion(req.session._id, (match) => {
    if (!match) {
      res.redirect('/estudiantes/tomar-leccion')
    } else {
      next()
    }
  })
}

module.exports = {
  estudiantePuedeDarLeccion,
  estudianteDandoLeccion,
}
