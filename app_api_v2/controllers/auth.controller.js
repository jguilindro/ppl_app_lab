/**
* @name Auth
* @author Joel Rodriguez
*/

const ProfesorModel   = require('../models/profesor.model')
const EstudianteModel = require('../models/estudiante.model')


/**
  * Obtener datos usuario por medio del correo, si no existe response un json de no authorizado
  * @return {Json} json con el formato responses ok
  * @error {Error} error object
  * @author Joel Rodriguez
  */
  module.exports.login = (req, res, next) => {
    const usuario = `${req.body.usuario.toLowerCase()}@espol.edu.ec`
    return Promise.all([
      ProfesorModel.getByCorreo(usuario),
      EstudianteModel.getByCorreo(usuario)])
      .then((values) => {
        let resp = {}
        if (Object.keys(values[0]).length !== 0) {
          resp = { privilegios: 'profesor', correo: values[0].correo }
        } else if (Object.keys(values[1]).length !== 0) {
          resp = { privilegios: 'estudiante', correo: values[1].correo }
        } else {
          resp = { datos: { estado: false, datos: 'No autorizado' }, codigo_estado: 401 }
        }
        return responses.okGet(res, resp)
      })
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
      .catch((error) => {
        logger.info(error)
        logger.error(`Leccion model Error ${error}`)
        return responses.serverError(res, error)
      })
  }