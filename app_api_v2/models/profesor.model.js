var db = require('../db/db')
var logger = require('winston')

const obtenerTodosProfesores = function() {
  return new Promise((resolve, reject) => {
    db.select().from('profesores').then(function(profesores, err) {
      if (err) {
        reject(err)
      }
      resolve(profesores)
    })
  })
}

module.exports = {
  obtenerTodosProfesores
}