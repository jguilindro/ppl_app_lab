const db = require('../../config/db').modelos()
const SCHEMA = require('./SCHEMA')
const Controller = require('./materias.controller')({ db })

module.exports = function (app, opts, next) {
  
  app.post('/materias', async (req, res) => {
    let { nombre, codigo } = req.body
    let resp = await Controller.Crear({ nombre, codigo })
    return resp
  })

  app.get('/materias', async (req, res) => {
    let resp = await Controller.ObtenerTodos()
    res.code(resp.codigoEstado)
    .send(resp)
  })
  next()
}
