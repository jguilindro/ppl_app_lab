// Aqui se haran las validaciones de los request
// usar la libreria joi para las validaciones, https://github.com/hapijs/joi

var { 
  obtenerTodosProfesores 
  } = require('../models/profesor.model')

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