//http://some.api.com/posts/comments?fields=name,image.
let ProfesorController = require('../controllers/profesores.controller')

// @apiSchema {jsonschema=./schema/api.res.json} apiSuccess
// setear que si es development el auth debe de ser libre, si es production no
// http://json-schema.org/example1.html
// @apiParamExample {json} Request-Example:
//  @apiSuccessExample {json} Success-Response:
// HTTP/1.1 200 OK
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
    **/
    .get((req, res) => {
      profesorController.obtenerTodosProfesores().then(function(respuesta) {
        res.status(respuesta.codigo_estado)
        res.json(respuesta.datos)
      })
    })
}