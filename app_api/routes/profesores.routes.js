const ProfesorController = require('../controllers/profesores.controller')
const Profesor = require('../models/profesor.model')

const ProfesorModel = new Profesor(logger, db)

const Profesores = new ProfesorController(logger, responses, ProfesorModel)

module.exports = (app) => {
  app.route('/profesores')
    .get((req, res) => {
      Profesores.getAll()
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
