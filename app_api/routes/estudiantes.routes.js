const EstudiantesController = require('../controllers/estudiantes.controller')
const Estudiante = require('../models/estudiante.model')
const Leccion = require('../models/leccion.model')

const EstudianteModel = new Estudiante(logger, db)
const LeccionModel = new Leccion(logger, db)

const Estudiantes = new EstudiantesController(logger, responses, EstudianteModel, LeccionModel)

module.exports = (app) => {
  app.route('/estudiantes/perfil')
    /**
      * @api {get} /estudiantes/perfil Obtener Datos Perfil Estudiante
      * @apiName ObtenerPerfilEstudiante
      * @apiGroup Estudiantes
      * @apiPermission Estudiantes Admin
      * @apiDescription Obtener Datos Perfil Estudiante, debe estar loggeado. 
      * Ya que con la cookie se identifica quien es.
      * @apiSchema {jsonschema=./schema/estudiantes/perfil.res.json} apiSuccess
      * @apiSampleRequest off
    */
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
