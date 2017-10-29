// usar la libreria joi para las validaciones, https://github.com/hapijs/joi
// http://usejsdoc.org/about-getting-started.html
// https://github.com/documentationjs/documentation/blob/master/docs/GETTING_STARTED.mdn
// https://esdoc.org/

const { obtenerTodosProfesores } = require('../models/profesor.model')

/**
 * Profesor
 * @author Joel Rodriguez
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
  */
/* eslint class-methods-use-this: ["error", { "exceptMethods": ["obtenerTodosProfesores"] }] */
class ProfesoresController {
  constructor(params) {
    this.params = params
  }

  get obtenerTodosProfesores() {
    return obtenerTodosProfesores()
      .then((res) => {
        const resp = responses.ok(res)
        return resp
      })
      .catch(() => {
        const error = responses.ERROR_SERVIDOR
        return error
      })
  }
}

module.exports = ProfesoresController
