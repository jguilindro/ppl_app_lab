const ProfesorController = require('../controllers/profesores.controller')

module.exports = (app) => {
  const profesorController = new ProfesorController()
  app.route('/profesores')
    /**
      * @api {get} /api/profesores Obtener profesores
      * @apiName ObtenerProfesores
      * @apiGroup Profesores
      * @apiPermission Profesores Admin
      * @apiDescription Todos los Profesores
      * @apiSchema (Body) {jsonschema=./schema/profesores.req.json} apiParam
      * @apiSchema {jsonschema=./schema/profesores.res.json} apiSuccess
      * @apiSampleRequest /profesores
    */
    .get((req, res) => {
      profesorController.obtenerTodosProfesores().then((respuesta) => {
        res.status(respuesta.codigo_estado)
        res.json(respuesta.datos)
        return res
      })
    })
}
