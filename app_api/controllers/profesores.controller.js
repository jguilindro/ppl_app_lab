const ProfesorModel = require('../models/profesor.model')

const obtenerTodosProfesores =  (req, res, next) => {
  ProfesorModel.obtenerTodosProfesores(function(err, profesores) {
    res.send(profesores)
  })
}

const obtenerProfesor = (req, res, next) => {
  res.send('un profoesr')
}

const crearProfesor = (req, res, next) => {
  res.send('crear profesro');
}

const editarProfesor = (req, res, next) => {
  res.send('editar profesor');
}

const eliminarProfesor = (req, res, next) => {
  res.send('borrar profesor');
}

module.exports = {
  obtenerTodosProfesores,
  obtenerProfesor,
  crearProfesor,
  editarProfesor,
  eliminarProfesor
}
