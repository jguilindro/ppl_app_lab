const AuthController = require('../controllers/auth.controller')
const Profesor = require('../models/profesor.model')
const Estudiante = require('../models/estudiante.model')

const ProfesorModel = new Profesor(logger, db)
const EstudianteModel = new Estudiante(logger, db)

const Auth = new AuthController(logger, responses, EstudianteModel, ProfesorModel)

module.exports = (app) => {
  app.route('/login')
    .post((req, res) => {
      Auth.login(`${req.body.usuario.toLowerCase()}@espol.edu.ec`)
        .then((respuesta) => {
          if (respuesta.estado) {
            req.session.correo = respuesta.datos.correo  // @todo  Esta accion crea side effect, dificil de testear?
            req.session.privilegios = respuesta.datos.privilegios
            req.session.save((err) => {
              if (err) {
                logger.info(err)
                logger.error(`Auth Routes Error ${err}`)
                res.status(respuesta.codigo_estado)
                res.json(respuesta.estado)
                return res
              } else {
                res.status(respuesta.codigo_estado)
                res.json(respuesta.estado)
                return res
              }
            })
          } else {
            res.status(respuesta.codigo_estado)
            res.json(respuesta)
            return res
          }
        })
        .catch((err) => {
          res.status(err.codigo_estado)
          res.json(err.estado)
          return res
        })
    })

  app.route('/logout')
    .get((req, res) => {
      req.session.destroy((err) => {
        if (err) {
          return res.send(false)
        }
        return res.send(true)
      })
    })
}
