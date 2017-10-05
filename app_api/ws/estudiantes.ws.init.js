logger     = require('tracer').console(),
co         = require('co');

const EstudianteModel = require('../models/estudiante.model');
const ParaleloModel = require('../models/paralelo.model');

var wesService = require('./utils.ws')

function inicial() {
  return new Promise((resolve, reject) => {
    wesService.estudiantesWS(function(todos_estudiantes) {
      if (!todos_estudiantes) {
        return logger.error('error al crear los estudiandes a partir de la web service')
      }
      var cantidadEstudiantes = todos_estudiantes.length
      co(function* () {
        for (var i = 0; i < cantidadEstudiantes; i++) {
          let estudiante = todos_estudiantes[i]
          var paralelo = yield buscarParalelo(estudiante.paralelo, estudiante.codigomateria) // TODO: eficiente, buscar una vez los paralelos en un array
          let estudiante_nuevo = new EstudianteModel({
            nombres:  estudiante.nombres,
            apellidos: estudiante.apellidos,
            matricula: estudiante.matricula,
            correo: estudiante.correo,
          })
          let estudiante_tmp = yield obtenerEstudiantePorCorreo(estudiante_nuevo.correo)
          if (!estudiante_tmp) {
            let estudiante_anadido = yield crearEstudianteYAnadirloAParalelo(paralelo._id,estudiante_nuevo)
          }
        }
        logger.info('terminado de crear todos los estudiantes')
        resolve(true)
      }).catch(fail => console.log(fail))
    })

  })
}

function buscarParalelo(paralelo, codigomateria) {
  return new Promise((resolve, reject) => {
    ParaleloModel.obtenerParaleloWebService(paralelo, codigomateria, (err, res) => {
      if (err) resolve(null)
      return resolve(res)
    })
  })
}

function crearEstudianteYAnadirloAParalelo(id_paralelo, estudiante_nuevo) {
  return new Promise((resolve, reject) => {
    estudiante_nuevo.crearEstudiante((err, res) => {
      if (err) logger.error('Error al crear estudiante', err)
      ParaleloModel.anadirEstudianteAParalelo(id_paralelo,estudiante_nuevo._id, (err, res) => {
        if (err) logger.error('Error al anadir estudiante a paralelo', err)
        resolve(true)
      })
    })
  })
}

function obtenerEstudiantePorCorreo(estudiante) {
  return new Promise((resolve, reject) => {
    EstudianteModel.obtenerEstudiantePorCorreoNoPopulate(estudiante, (err, res) => {
      if (err) logger.error('Error al crear encontrar', err)
      resolve(res)
    })
  })
}


module.exports = inicial
// VALIDACIONES
// Si el estudiante ya existe, es decir, si ya tomo la materia y esta repitiendo
