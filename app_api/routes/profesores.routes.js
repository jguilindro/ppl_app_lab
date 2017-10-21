//http://some.api.com/posts/comments?fields=name,image.
let ProfesorController = require('../controllers/profesores.controller')


// setear que si es development el auth debe de ser libre, si es production no
module.exports = (app) => {
  const profesorController = new ProfesorController()
  app.route('/profesores')
    /**
      * @api {get} /api/profesores Obtener profesores
      * @apiName ObtenerProfesores
      * @apiGroup Profesores
      * @apiPermission Profesores Admin
      * @apiDescription Todos los Profesores
      *
      * @apiSuccess {Number} id
      * @apiSuccess {String} nombres
      * @apiSuccess {String} apellidos
      * @apiSuccess {String} correo
      * @apiSampleRequest /profesores
    **/
    .get((req, res) => {
      profesorController.obtenerTodosProfesores().then(function(respuesta) {
        res.status(respuesta.codigo_estado)
        res.json(respuesta.datos)
      })
    })
}