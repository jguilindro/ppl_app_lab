/* NO borrar lineas de codigo para pruebas*/
// const mongoose = require('mongoose');
// const URL_LOCAL = require('../../config/main').local
// const URL_MLAB = require('../../config/main').mlab
// mongoose.connect(URL_LOCAL)
// const db = mongoose.connection;
//
// db.on('error', function(err) {
//   console.log(`error ${err}`);
// })
//
// db.on('connected', function() {
//   console.log(`base de datos conectada`);
// })
// const fs   = require('fs');
// var estudiantesWS = require('./estudiantes.json') // reemplazarlo por pedir a la base de datos los datos?


const EstudianteModel = require('../../models/estudiante.model');
const ParaleloModel = require('../../models/paralelo.model');
const GrupoModel = require('../../models/grupo.model')
const utils  = require('../utils.ws');

const co            = require('co'),
logger        = require('tracer').console(),
path          = require('path'),
_             = require('lodash'),
jsondiffpatch = require('jsondiffpatch').create({
  arrays: {
    detectMove: true,
    includeValueOnMove: true
  }
});

/*
cambiado anadido eliminado posibilidad estado
  0         0       1         1          [x]
  0         0       0         2          [x]
  0         1       1         3          [x]
  0         1       0         4          [x]
  1         0       1         5          [x]
  1         0       0         6          [x]
  1         1       1         7          [x]
  1         1       0         8          [x]
*/

// falta llevarlo a promise
function init() {
  return new Promise((resolve, reject) => {
    utils.estudiantesDB(estudiantesDB => {
      utils.estudiantesWS(estudiantesWS => {
        estudiantesWS = _.sortBy(estudiantesWS, ['nombres']);
        estudiantesDB = _.sortBy(estudiantesDB, ['nombres']);
        var diferencias = jsondiffpatch.diff(estudiantesDB, estudiantesWS);
        if (estudiantesDB.length == estudiantesWS.length && !diferencias) {
            // POSIBILIDAD 2
          logger.info('sync db y web service; sin nada que cambiar')
        } else {
          var estudiantes_nuevos = []
          var estudiantes_eliminados = _.differenceWith(estudiantesDB, estudiantesWS, _.isEqual);
          var estudiantes_nuevo = _.differenceWith(estudiantesWS, estudiantesDB, _.isEqual);
          var estudiantes_editados =  _.intersectionBy(estudiantes_eliminados, estudiantes_nuevo, 'matricula');
          var estudiantes_eliminadosDB = _.differenceBy(estudiantes_eliminados, estudiantes_editados, 'matricula');
          var estudiantes_nuevoWS = _.differenceBy(estudiantes_nuevo, estudiantes_editados, 'matricula');
          logger.info('Estudiantes eliminados', estudiantes_eliminadosDB.length, estudiantes_eliminadosDB)
          logger.info('Estudiantes anadidos', estudiantes_nuevoWS.length, estudiantes_nuevoWS)
          logger.info('Estudiantes editados', estudiantes_editados.length, estudiantes_editados)
          co(function* () {
            var paralelos = yield obtenerTodosParalelos()
            for (var i = 0; i < estudiantes_eliminadosDB.length; i++) {
              let est = estudiantes_eliminadosDB[i]
              var paralelo = encontrarParalelo(est.paralelo, est.codigomateria, est.anio, est.termino, paralelos)
              var hecho = yield eliminarEstudianteDB(est.correo, paralelo._id)
              if (!hecho) {
                logger.error('error al eliminar estudiante de paralelo')
              }
            }
            var estudiantes_creados = estudiantes_nuevoWS.map(est => {
              return new EstudianteModel({
                nombres: est.nombres,
                apellidos: est.apellidos,
                correo: est.correo,
                matricula: est.matricula
              })
            })
            for (var i = 0; i < estudiantes_creados.length; i++) {
              var est = estudiantes_creados[i]
              var estm = estudiantes_nuevoWS[i]
              var paralelo = encontrarParalelo(estm.paralelo, estm.codigomateria, estm.anio, estm.termino, paralelos)
              var anadido_estudiante = crearEstudianteYAnadirloAParalelo(paralelo._id, est)
              if (!anadido_estudiante) {
                logger.error('no se pudieron crear los estudiantes nuevos')
              }
            }
            var estudiantesDB_editados = estudiantesDB.filter(est => {
              for (var i = 0; i < estudiantes_editados.length; i++) {
                if (estudiantesIguales(estudiantes_editados[i], est)) {
                  return estudiantes_editados[i]
                }
              }
            })
            var estudiantesWS_editados = estudiantesWS.filter(est => {
              for (var i = 0; i < estudiantes_editados.length; i++) {
                if (estudiantesIguales(estudiantes_editados[i], est)) {
                  return estudiantes_editados[i]
                }
              }
            })
            diferencias = jsondiffpatch.diff(estudiantesDB_editados, estudiantesWS_editados);
            if (diferencias) {
              var est = yield estudiantesCambiadosDeCurso(diferencias, estudiantes_editados)
              resolve(true)
            } else {
              resolve(true)
            }
          }).catch(fail => {console.log(fail);})
        }
      })
    })
  })
}

function estudiantesIguales(estudiante1, estudiante2) {
  var matricula = estudiante1.matricula === estudiante2.matricula
  if (matricula) {
    return true
  }
  return false
}

function eliminarEstudianteDB(correo_estudiante, id_paralelo) {
  return new Promise((resolve, reject) => {
    EstudianteModel.obtenerEstudiantePorCorreoNoPopulate(correo_estudiante, (err, est) => {
      if (err) {
        logger.error('error al tratar eliminar estudiante de paralelo', err)
        return resolve(null)
      }
      ParaleloModel.eliminarEstudianteDeParalelo(id_paralelo, est._id, (err, res) => {
        if (err) {
          logger.error('error al tratar eliminar estudiante de paralelo', err)
          return resolve(null)
        }
        EstudianteModel.eliminarEstudiante(est._id, (err, res) => {
          if (err) {
            logger.error('error al tratar eliminar estudiante de paralelo', err)
            return resolve(null)
          }
          return resolve(true)
        })
      })
    })
  })
}

function obtenerEstudiantePorMatricula(matricula) {
  return new Promise((resolve, reject) => {
    EstudianteModel.obtenerEstudiantePorMatriculaNoPopulate(matricula, (err, estudiante) => {
      if (err) {
        logger.error('estudiante error al encontrar', err)
        return resolve(null)
      }
      return resolve(estudiante)
    })
  })
}

function obtenerTodosParalelos() {
  return new Promise((resolve, reject) => {
    ParaleloModel.obtenerTodosParalelosNoPopulate((err, paralelos) => {
      if (err) {
        logger.error('Error al tratar encontrar paralelo', err)
        return resolve(null)
      }
      return resolve(paralelos)
    })
  })
}

function encontrarParalelo(paralelo, codigomateria, anio, termino, paralelos) {
  return paralelos.find(para => {
    if (termino == para.termino && paralelo == para.nombre && anio == para.anio && codigomateria == para.codigo) {
      return para
    }
  })
}

function cambiarEstudianteDeParalelo(id_paralelo, id_paralelo_nuevo, id_estudiante) {
  return new Promise((resolve, reject) => {
    ParaleloModel.anadirEstudianteAParalelo(id_paralelo_nuevo, id_estudiante, (err , res) => {
      if (err) {
        logger.error('error al anadir estudiante a paralelo', err)
        return resolve(null)
      } else {
        ParaleloModel.eliminarEstudianteDeParalelo(id_paralelo, id_estudiante, (err, res) => {
          if (err) {
            logger.error('error al anadir eliminar estudiante de paralelo', err)
            return resolve(null)
          }
          return resolve(true)
        })
      }
    })
  })
}

function crearEstudianteYAnadirloAParalelo(id_paralelo, estudiante_nuevo) {
  return new Promise((resolve, reject) => {
    estudiante_nuevo.crearEstudiante((err, res) => {
      if (err) logger.error('Error al crear estudiante', err)
      ParaleloModel.anadirEstudianteAParalelo(id_paralelo, estudiante_nuevo._id, (err, res) => {
        if (err) logger.error('Error al anadir estudiante a paralelo', err)
        resolve(true)
      })
    })
  })
}

function estudiantesCambiadosDeCurso(diferencias, estudiantesDB) {
  console.log(diferencias);
  return new Promise((resolve, reject) => {
    var indexes = Object.keys(diferencias)
    var estudiantes_cambiados_paralelo = []
    var estudiantes_cambiados_correo = []
    var estudiantes_cambiados_nombres = []
    var estudiantes_cambiados_apellidos = []
    for (var i = 0; i < (indexes.length - 1); i++) {
      let estudiante_camb = estudiantesDB[indexes[i]]
      if (diferencias[indexes[i]].paralelo) {
        estudiante_camb.paralelo_nuevo = diferencias[indexes[i]].paralelo[1]
        estudiantes_cambiados_paralelo.push(estudiante_camb)
      }
      if (diferencias[indexes[i]].correo) {
        estudiante_camb.correo_nuevo = diferencias[indexes[i]].correo[1]
        estudiantes_cambiados_correo.push(estudiante_camb)
      }
      if (diferencias[indexes[i]].nombres) {
        estudiante_camb.nombres_nuevo = diferencias[indexes[i]].nombres[1]
        estudiantes_cambiados_nombres.push(estudiante_camb)
      }
      if (diferencias[indexes[i]].apellidos) {
        estudiante_camb.apellidos_nuevo = diferencias[indexes[i]].apellidos[1]
        estudiantes_cambiados_apellidos.push(estudiante_camb)
      }
    }
    logger.log('cambiado paralelo',estudiantes_cambiados_paralelo.length)
    logger.log('cambiado apellidos', estudiantes_cambiados_apellidos.length)
    logger.log('cambiando nombres', estudiantes_cambiados_nombres.length)
    logger.log('cambiando correo', estudiantes_cambiados_correo.length)
    co(function* () {
      var paralelos = yield obtenerTodosParalelos()
      // paralelo
      for (var i = 0; i < estudiantes_cambiados_paralelo.length; i++) {
        var est = estudiantes_cambiados_paralelo[i]
        var estudiante = yield obtenerEstudiantePorMatricula(est.matricula)
        var paralelo = encontrarParalelo(est.paralelo, est.codigomateria, est.anio, est.termino, paralelos)
        var paralelo_nuevo = encontrarParalelo(est.paralelo_nuevo, est.codigomateria, est.anio, est.termino, paralelos)
        var logrado = yield cambiarEstudianteDeParalelo(paralelo._id, paralelo_nuevo._id, estudiante._id)
        var eliminado_grupo = yield eliminarEstudianteDeGrupos(estudiante._id)
        if (!logrado) {
          logger.error('no se pudo cambiar estado estudiante')
          return reject(false)
        }
      }
      // correo
      for (var i = 0; i < estudiantes_cambiados_correo.length; i++) {
        var est = estudiantes_cambiados_correo[i]
        // var estudiante = yield obtenerEstudiantePorMatricula(est.matricula)
        var match_correo = yield editarCorreo(est.matricula, est.correo_nuevo)
        if (!match_correo) {
          logger.error('no se pudo cambiar correo estudiante')
          return reject(false)
        }
      }
      // nombres
      for (var i = 0; i < estudiantes_cambiados_nombres.length; i++) {
        var est = estudiantes_cambiados_nombres[i]
        // var estudiante = yield obtenerEstudiantePorMatricula(est.matricula)
        var match_nombres = yield editarNombres(est.matricula, est.nombres_nuevo)
        if (!match_nombres) {
          logger.error('no se pudo cambiar correo estudiante')
          return reject(false)
        }
      }
      // apellidos
      for (var i = 0; i < estudiantes_cambiados_apellidos.length; i++) {
        var est = estudiantes_cambiados_apellidos[i]
        // var estudiante = yield obtenerEstudiantePorMatricula(est.matricula)
        var match_apellidos = yield editarApellidos(est.matricula, est.apellidos_nuevo)
        if (!match_apellidos) {
          logger.error('no se pudo cambiar correo estudiante')
          return reject(false)
        }
      }
      return resolve(true)
    }).catch(fail => console.log(fail))
  })
}

function editarApellidos(matricula, apellidos) {
  return new Promise((resolve, reject) => {
    EstudianteModel.editarApellidosPorMatricula (matricula, apellidos, (err, res) => {
      if (err) {
        logger.error('error al cambiar apellidos estudiante', err)
        return reject(err)
      }
      return resolve(true)
    })
  })
}

function editarNombres(matricula, nombres) {
  return new Promise((resolve, reject) => {
    EstudianteModel.editarNombresPorMatricula (matricula, nombres, (err, res) => {
      if (err) {
        logger.error('error al cambiar nombres estudiante', err)
        return reject(err)
      }
      return resolve(true)
    })
  })
}

function editarCorreo(matricula, correo) {
  return new Promise((resolve, reject) => {
    EstudianteModel.editarCorreoPorMatricula (matricula, correo, (err, res) => {
      if (err) {
        logger.error('error al cambiar correo estudiante', err)
        return reject(err)
      }
      return resolve(true)
    })
  })
}

function eliminarEstudianteDeGrupos(id_estudiante) {
  return new Promise((resolve, reject) => {
    GrupoModel.obtenerGrupoDeEstudiante(id_estudiante, (err, grupo) => {
      if (err) {
        logger.error('Error al eliminar estudiante de grupo')
        return reject(err)
      }
      if (grupo) {
        GrupoModel.eliminarEstudiante(grupo._id, id_estudiante, (err, grupo) => {
          if (err) {
            logger.error('Error al eliminar estudiante de grupo')
            return reject(err)
          }
          return resolve(true)
        })
      }
      return resolve(true)
    })
  })
}

module.exports = init
