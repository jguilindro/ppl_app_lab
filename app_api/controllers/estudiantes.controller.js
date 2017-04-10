const EstudianteModel = require('../models/estudiante.model');
var respuesta = require('../utils/responses');
/*
* Estudiante metodos basicos
*/
const obtenerTodosEstudiantes = (req, res) => {
  EstudianteModel.obtenerTodosEstudiantes((err, estudiantes) => {
    if (err) return respuesta.serverError(res);
    return respuesta.ok(res, estudiantes);
  })
}

const crearEstudiante = (req, res) => {
  let estudiante = new EstudianteModel({
    nombres: req.body.nombres,
    apellidos: req.body.apellidos,
    correo: req.body.correo,
    matricula: req.body.matricula
  })
  estudiante.crearEstudiante((err) => {
    if (err) return respuesta.serverError(res);
    return respuesta.creado(res, estudiante);
  })
}

const obtenerEstudiante = (req, res) => {
	res.send(`obtenerEstudiante ${req.params.id_estudiante}`);
}

const verificarEstudiantePuedeDarLeccion = (req, res) => {
  const { _id } = req.session
}

module.exports = {
	obtenerTodosEstudiantes,
	crearEstudiante,
	obtenerEstudiante,
  // leccion
  verificarEstudiantePuedeDarLeccion,
}
