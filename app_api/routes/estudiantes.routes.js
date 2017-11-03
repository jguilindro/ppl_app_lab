const EstudiantesController = require('../controllers/estudiantes.controller')

module.exports = (app) => {
  app.route('/estudiantes/perfil')
    /**
      * @api {get} /estudiantes/perfil Obtener Datos Perfil Estudiante
      * @apiName ObtenerPerfilEstudiante
      * @apiGroup Estudiantes
      * @apiPermission Estudiantes Admin
      * @apiDescription Obtener Datos Perfil Estudiante, debe estar loggeado. Ya que con la cookie se identifica quien es.
      * @apiSchema {jsonschema=./schema/estudiantes/perfil.res.json} apiSuccess
      * @apiSampleRequest off
    */
    .get((req, res) => {
      EstudiantesController.getPerfilByCorreo(req.session.correo)
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
