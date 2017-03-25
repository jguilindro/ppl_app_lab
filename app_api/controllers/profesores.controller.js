const ProfesorModel = require('../models/profesore.model')

const obtenerTodosProfesores =  function(req, res, next) {
  ProfesorModel.obtenerTodosProfesores(function(err, profesores) {
    res.send(profesores)
  })
}

const crearProfesor = function(req, res, next) {
  res.send('crear profesro');
}

const editarProfesor = function(req, res, next) {
  res.send('editar profesor');
}

const eliminarProfesor = function(req, res, next) {
  res.send('borrar profesor');
}

module.exports = {
  obtenerTodosProfesores,
  crearProfesor,
  editarProfesor,
  eliminarProfesor
}
