const EstudiantesController = require('../controllers/estudiantes.controller')
const Estudiante = require('../models/estudiante.model')
const Leccion = require('../models/leccion.model')

const EstudianteModel = new Estudiante(logger, db)
const LeccionModel = new Leccion(logger, db)

const Estudiantes = new EstudiantesController(logger, responses, EstudianteModel, LeccionModel)

module.exports = (app) => {
  app.route('/estudiantes/perfil')
    .get((req, res) => {
      Estudiantes.getPerfilByCorreo(req.session.correo)
        .then((respuesta) => {
          res.status(respuesta.codigo_estado)
          res.json(respuesta)
          return res
        })
        .catch((error) => {
          logger.info(error)
          logger.error(`Estudiante Router Error ${error}`)
          res.status(error.codigo_estado)
          res.json(error.estado)
          return res
        })
    })
}
