/**
* @name Lecciones
* @author Edison Mora
*/

class Lecciones {
	/**
  * Crea una instancia de Lecciones
  * @param {logger} modulo logger
  * @author Edison Mora
  */
	constructor(logger, LeccionModel, responses) {
		this.logger 			= logger
		this.LeccionModel = LeccionModel
		this.responses 		= responses
	}

	/**
  * Obtener todas las lecciones
  * @return {Json} json con el formato responses ok
  * @error {Error} error object
  * @author Edison Mora
  */
	getAll() {
		return this.LeccionModel.getAll()
			.then( res => {
				return this.responses.ok(res)
			})
			.catch( error => {
				this.logger.info(error)
        this.logger.error(`Leccion Controller Error ${error}`)
        return this.responses.ERROR_SERVIDOR
			})
	}

	/**
  * Obtener todas las lecciones de los paralelos indicados
  * @param {paralelos}
  * @return {Json} json con el formato responses ok
  * @error {Error} error object
  * @author Edison Mora
  */
	getLeccionesDeParalelos(paralelos) {
		return this.LeccionModel.getLeccionesDeParalelos(paralelos)
		.then( res => {
				return this.responses.ok(res)
			})
			.catch( error => {
				this.logger.info(error)
        this.logger.error(`Leccion Controller Error ${error}`)
        return this.responses.ERROR_SERVIDOR
			})
	}

	/**
  * Obtener la leccion indicada por el id
  * @param {idLeccion}
  * @return {Json} json con el formato responses ok
  * @error {Error} error object
  * @author Edison Mora
  */
	getById(idLeccion) {
		return this.LeccionModel.getById(idLeccion)
		.then( res => {
				return this.responses.ok(res)
			})
			.catch( error => {
				this.logger.info(error)
        this.logger.error(`Leccion Controller Error ${error}`)
        return this.responses.ERROR_SERVIDOR
			})
	}
}

module.exports = Lecciones