// Aqui se haran las validaciones de los request
// usar la libreria joi para las validaciones, https://github.com/hapijs/joi

// http://usejsdoc.org/about-getting-started.html
// https://github.com/documentationjs/documentation/blob/master/docs/GETTING_STARTED.mdn
// https://esdoc.org/
var { 
  obtenerTodosProfesores 
  } = require('../models/profesor.model')

/**
 * Profesor
 * @author Joel Rodriguez
 * @constructor
 * @param {string} title - The title of the book.
 * @param {string} author - The author of the book.
 */
class ProfesoresController { 
  constructor(params) {
    this.params = params
  }

  obtenerTodosProfesores() {
    return obtenerTodosProfesores()
      .then(res => {
        return responses.ok(res)
      })
      .catch(error => { 
        return responses.ERROR_SERVIDOR
       })
  }
}

module.exports = ProfesoresController