const ProfesorController = require('../controllers/profesores.controller')

module.exports = (app) => {
  app.route('/profesores')
    /**
      * @api {get} /api/profesores Obtener profesores
      * @apiName ObtenerProfesores
      * @apiGroup Profesores
      * @apiPermission Profesores Admin
      * @apiDescription Todos los Profesores
      * @apiSchema {jsonschema=./schema/profesores/profesores.res.json} apiSuccess
      * @apiSampleRequest off
    */
    .get((req, res) => {
      ProfesorController.getAll()
        .then((respuesta) => {
          res.status(respuesta.codigo_estado)
          res.json(respuesta)
          return res
        })
        .catch((err) => {
          res.status(err.codigo_estado)
          res.json(err.estado)
          return res
        })
    })
}
