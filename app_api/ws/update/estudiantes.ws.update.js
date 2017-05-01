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
// const fs   = require('fs'),
// var estudiantesWS = require('./estudiantes.json') // reemplazarlo por pedir a la base de datos los datos?


const EstudianteModel = require('../../models/estudiante.model');
const ParaleloModel = require('../../models/paralelo.model');
const utils  = require('../utils.ws');

const diff    = require('deep-diff').diff,
co            = require('co'),
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
  utils.estudiantesDB(estudiantesDB => {
    utils.estudiantesWS(estudiantesWS => {
      estudiantesWS = _.sortBy(estudiantesWS, ['nombres']);
      estudiantesDB = _.sortBy(estudiantesDB, ['nombres']);
      var diferencias = jsondiffpatch.diff(estudiantesDB, estudiantesWS);
      // console.log(diferencias);
      // if (diferencias) {
      //   console.log(estudiantesDB[131]);
      //   // console.log(estudiantesDB[131]);
      //   console.log(diferencias);
      //   return
      // }
      if (estudiantesDB.length == estudiantesWS.length && !diferencias) {
          // POSIBILIDAD 2
        logger.info('sync db y web service; sin nada que cambiar')
      } else if (estudiantesDB.length == estudiantesWS.length) {
        // LISTA POSIBILIDADES 3, 7, 6
        var estudiantes_nuevos = []
        var estudiantes_eliminados = _.differenceWith(estudiantesDB, estudiantesWS, _.isEqual);
        var estudiantes_nuevo = _.differenceWith(estudiantesWS, estudiantesDB, _.isEqual);
        var estudiantes_editados =  _.intersectionBy(estudiantes_eliminados, estudiantes_nuevo, 'matricula');
        var estudiantes_eliminadosDB = _.differenceBy(estudiantes_eliminados, estudiantes_editados, 'matricula');
        var estudiantes_nuevoWS = _.differenceBy(estudiantes_nuevo, estudiantes_editados, 'matricula');
        logger.info('detectado POSIBILIDAD 3 y 7')
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
        })
        for (var i = 0; i < estudiantes_eliminadosDB.length; i++) {
          estudiantesDB = estudiantesDB.filter(est => {
            return !estudiantesIguales(estudiantes_eliminadosDB[i], est)
          })
          estudiantesWS = estudiantesWS.filter(est => {
            return !estudiantesIguales(estudiantes_nuevoWS[i], est)
          })
        }
        diferencias = jsondiffpatch.diff(estudiantesDB, estudiantesWS);
        if (diferencias) {
          logger.info('detectado POSIBILIDAD 6')
          estudiantesCambiadosDeCurso(diferencias, estudiantesDB)
        } else {
          logger.info('NO detectado POSIBILIDAD 6')
        }
      } else if (estudiantesDB.length > estudiantesWS.length) {
        // LISTA POSIBILIDADES 1, 5
        var estudiante_salido = {}
        var estudiantes_salidos = []
        var estudiantesWS_temp = [...estudiantesWS]
        var numero_salidos = estudiantesDB.length - estudiantesWS.length;
        for (var i = 0; i < numero_salidos; i++) {
          for (var j = 0; j < estudiantesDB.length; j++) {
            if ((estudiantesWS.length - 1) < j) {
              estudiante_salido = JSON.parse(JSON.stringify(estudiantesDB[j]))
              break;
            }
            if (!estudiantesIguales(estudiantesDB[j], estudiantesWS[j])) {
              estudiante_salido = JSON.parse(JSON.stringify(estudiantesDB[j]))
              break;
            }
          }
          estudiantesWS.push(estudiante_salido)
          estudiantes_salidos.push(estudiante_salido)
          estudiantesWS = _.sortBy(estudiantesWS, ['nombres']);
        }
        logger.info('detectado POSIBILIDAD 1')
        co(function* () {
          var paralelos = yield obtenerTodosParalelos()
          for (var i = 0; i < estudiantes_salidos.length; i++) {
            let est = estudiantes_salidos[i]
            var paralelo = encontrarParalelo(est.paralelo, est.codigomateria, est.anio, est.termino, paralelos)
            var hecho = yield eliminarEstudianteDB(est.correo, paralelo._id)
            if (!hecho) {
              logger.error('error al eliminar')
            }
          }
        })
        for (var i = 0; i < estudiantes_salidos.length; i++) {
          estudiantesDB = estudiantesDB.filter(est => {
            return !estudiantesIguales(estudiantes_salidos[i], est)
          })
          estudiantesWS = estudiantesWS.filter(est => {
            return !estudiantesIguales(estudiantes_salidos[i], est)
          })
        }
        diferencias = jsondiffpatch.diff(estudiantesDB, estudiantesWS);
        if (diferencias) {
          logger.info('detectado POSIBILIDAD 5')
          estudiantesCambiadosDeCurso(diferencias, estudiantesDB)
        } else {
          logger.info('NO detectado POSIBILIDAD 5')
        }
      }else if (estudiantesDB.length < estudiantesWS.length) {
        // LISTA POSIBILIDADES 4, 8
        var estudiantes_anadidos = []
        var cantidad_anadidos = estudiantesWS.length - estudiantesDB.length
        for (var i = 0; i < cantidad_anadidos; i++) {
          for (var j = 0; j < estudiantesWS.length; j++) {
            if ((estudiantesDB.length - 1) < j) {
              estudiante_entrado = JSON.parse(JSON.stringify(estudiantesWS[j]))
              break;
            }
            if (!estudiantesIguales(estudiantesDB[j], estudiantesWS[j])) {
              estudiante_entrado = JSON.parse(JSON.stringify(estudiantesWS[j]))
              break;
            }
          }
          estudiantesDB.push(estudiante_entrado)
          estudiantes_anadidos.push(estudiante_entrado)
          estudiantesDB = _.sortBy(estudiantesDB, ['nombres']);
        }
        // crear estudiantes y anadirlos a paralelo
        logger.info('detectado POSIBILIDAD 4')
        var estudiantes_creados = estudiantes_anadidos.map(est => {
          return new EstudianteModel({
            nombres: est.nombres,
            apellidos: est.apellidos,
            correo: est.correo,
            matricula: est.matricula
          })
        })
        co(function* () {
          var paralelos = yield obtenerTodosParalelos()
          for (var i = 0; i < estudiantes_creados.length; i++) {
            var est = estudiantes_creados[i]
            var estm = estudiantes_anadidos[i]
            var paralelo = encontrarParalelo(estm.paralelo, estm.codigomateria, estm.anio, estm.termino, paralelos)
            var anadido_estudiante = crearEstudianteYAnadirloAParalelo(paralelo._id, est)
            if (!anadido_estudiante) {
              logger.error('no se pudieron crear los estudiantes nuevos')
            }
          }
        })
        for (var i = 0; i < estudiantes_anadidos.length; i++) {
          estudiantesDB = estudiantesDB.filter(est => {
            return !estudiantesIguales(estudiantes_anadidos[i], est)
          })
          estudiantesWS = estudiantesWS.filter(est => {
            return !estudiantesIguales(estudiantes_anadidos[i], est)
          })
        }
        diferencias = jsondiffpatch.diff(estudiantesDB, estudiantesWS);
        if (diferencias) {
          logger.info('detectado POSIBILIDAD 8')
          estudiantesCambiadosDeCurso(diferencias, estudiantesDB)
        } else {
          logger.info('NO detectado POSIBILIDAD 8')
        }
      } else {
        console.log('no se');
      }
    })
  })
}

function estudiantesIguales(estudiante1, estudiante2) {
  var nombres = estudiante1.nombres === estudiante2.nombres
  var apellidos = estudiante1.apellidos === estudiante2.apellidos
  var matricula = estudiante1.matricula === estudiante2.matricula
  if (nombres && apellidos && matricula) {
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

function obtenerEstudiantePorCorreo(correo) {
  return new Promise((resolve, reject) => {
    EstudianteModel.obtenerEstudiantePorCorreoNoPopulate(correo, (err, estudiante) => {
      if (err) {
        logger.error('estudiante error al encontrar', err)
        return resolve(null)
      }
      return resolve(estudiante)
    })
  })
}

function buscarParalelo(paralelo, codigomateria, anio, termino) {
  return new Promise((resolve, reject) => {
    ParaleloModel.obtenerParaleloWebService(paralelo, codigomateria, anio, termino, (err, res) => {
      if (err) {
        logger.error('Error al tratar encontrar paralelo', err)
        return resolve(null)
      }
      return resolve(res)
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
  var indexes = Object.keys(diferencias)
  var estudiantes_cambiados = []
  for (var i = 0; i < (indexes.length - 1); i++) {
    let estudiante_camb = estudiantesDB[indexes[i]]
    estudiante_camb.paralelo_nuevo = diferencias[indexes[i]].paralelo[1]
    // if (diferencias[indexes[i]].paralelo) {
    //   estudiante_camb.paralelo_nuevo = diferencias[indexes[i]].paralelo[1]
    // }
    // if (diferencias[indexes[i]].codigomateria) {
    //   estudiante_camb.codigomateria_nuevo = diferencias[indexes[i]].codigomateria[1]
    // }
    estudiantes_cambiados.push(estudiante_camb)
  }
  co(function* () {
    var paralelos = yield obtenerTodosParalelos()
    for (var i = 0; i < estudiantes_cambiados.length; i++) {
      var est = estudiantes_cambiados[i]
      var estudiante = yield obtenerEstudiantePorCorreo(est.correo)
      var paralelo = encontrarParalelo(est.paralelo, est.codigomateria, est.anio, est.termino, paralelos)
      // if (!est.paralelo_nuevo) {
      //   est.paralelo_nuevo = est.paralelo
      // }
      // if (!est.codigomateria_nuevo) {
      //   est.codigomateria_nuevo = est.codigomateria
      // } est.codigomateria_nuevo
      var paralelo_nuevo = encontrarParalelo(est.paralelo_nuevo, est.codigomateria, est.anio, est.termino, paralelos)
      var logrado = yield cambiarEstudianteDeParalelo(paralelo._id, paralelo_nuevo._id, estudiante._id)
      if (!logrado) {
        logger.error('no se pudo cambiar estado estudiante')
      }
    }
  })
}

module.exports = init()
