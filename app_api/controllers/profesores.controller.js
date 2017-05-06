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
  let profesor = new ProfesorModel({
    correo: req.body.correo,
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    tipo: req.body.tipo
  })
  profesor.crearProfesor(err => {
    if (err) res.send('error crear profesr')
    res.send(profesor)
  })
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
