/**
* @name Auth
* @author Joel Rodriguez
*/
class Auth {
  /**
  * crea una instancia de Profesores
  * @param {logger} modulo logger
  * @param {responses} modulo responses
  * @param {EstudianteModel}
  * @param {ProfesorModel}
  * @author Joel Rodriguez
  */
  constructor(logger, responses, EstudianteModel, ProfesorModel) {
    this.logger = logger
    this.responses = responses
    this.EstudianteModel = EstudianteModel
    this.ProfesorModel = ProfesorModel
  }

  /**
  * Obtener datos usuario por medio del correo, si no existe response un json de no authorizado
  * @return {Json} json con el formato responses ok
  * @error {Error} error object
  * @author Joel Rodriguez
  */
  login(usuario) {
    return Promise.all([
      this.ProfesorModel.getByCorreo(usuario),
      this.EstudianteModel.getByCorreo(usuario)])
      .then((values) => {
        let resp = {}
        if (Object.keys(values[0]).length !== 0) {
          resp = this.responses.ok({ privilegios: 'profesor', correo: values[0].correo })
        } else if (Object.keys(values[1]).length !== 0) {
          resp = this.responses.ok({ privilegios: 'estudiante', correo: values[1].correo })
        } else {
          resp = this.responses.NO_AUTORIZADO
        }
        return resp
      })
      .catch((error) => {
        this.logger.info(error)
        this.logger.error(`Leccion model Error ${error}`)
        return this.responses.ERROR_SERVIDOR
      })
  }
}

module.exports = Auth
