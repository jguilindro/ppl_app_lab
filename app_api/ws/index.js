module.exports = {
  init: function() {
    require('./profesores.ws.init')
    require('./estudiantes.ws.init')
  },
  upload: function() {
    require('./profesores.ws.update')
    require('./estudiantes.ws.update')
  }
}
