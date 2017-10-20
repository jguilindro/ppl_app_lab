//http://some.api.com/posts/comments?fields=name,image.
let ProfesorController = require('../controllers/profesores.controller')

module.exports = (app) => {
  const profesorController = new ProfesorController()
  app.route('/profesores')
    .get((req, res) => {
      profesorController.obtenerTodosProfesores().then(function(respuesta) {
        res.status(respuesta.codigo_estado)
        res.json(respuesta.datos)
      })
    })
}