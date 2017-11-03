const AuthController = require('../controllers/auth.controller')

module.exports = (app) => {
  app.route('/login')
    // @apiSchema (Body) {jsonschema=./schema/profesores.req.json} apiParam
    .post((req, res) => {
      AuthController.login(`${req.body.usuario.toLowerCase()}@espol.edu.ec`)
        .then((respuesta) => {
          if (respuesta.estado) {
            req.session.correo = respuesta.datos.correo
            req.session.privilegios = respuesta.datos.privilegios
            req.session.save((err) => {
              if (err) {
                logger.info(err)
                logger.error(`Auth Routes Error ${err}`)
                res.status(respuesta.codigo_estado)
                res.json(respuesta.estado)
                return res
              }
              res.status(respuesta.codigo_estado)
              res.json(respuesta.estado)
              return res
            })
          }
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
