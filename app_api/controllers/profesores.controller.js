/**
* @name Profesores
* @author Joel Rodriguez
*/
class Profesores {
  /**
  * crea una instancia de Profesores
  * @param {logger} modulo logger
  * @param {responses} modulo responses
  * @param {ProfesorModel}
  * @author Joel Rodriguez
  */
  constructor(logger, responses, ProfesorModel) {
    this.logger = logger
    this.responses = responses
    this.ProfesorModel = ProfesorModel
  }

  /**
  * Devuelve todos los profesores
  * @returns {Json} formato responses ok
  * @error {Json} formato erro server
  * @author Joel Rodriguez
  */
  getAll() {
    return this.ProfesorModel.getAll()
      .then((res) => {
        return this.responses.ok(res)
      })
      .catch((error) => {
        this.logger.info(error)
        this.logger.error(`Profesor Controller Error ${error}`)
        return this.responses.ERROR_SERVIDOR
      })
  }

  getByCorreo(correo) {
    return this.ProfesorModel.getByCorreo(correo)
      .then((res) => {
        return this.responses.ok(res)
      })
      .catch((error) => {
        this.logger.info(error)
        this.logger.error(`Profesor Controller Error ${error}`)
        return this.responses.ERROR_SERVIDOR
      })
  }
}

module.exports = Profesores
