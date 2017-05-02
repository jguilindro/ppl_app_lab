const logger = require('tracer').console(),
co           = require('co');

const ParaleloModel = require('../models/paralelo.model'),
ProfesorModel       = require('../models/profesor.model'),
wesService          = require('./utils.ws');

// TODO: verificar que el profesor_titular ya esta en otro curso

function inicial() {
  return new Promise((resolve, reject) => {
    wesService.profesoresWS(function(profesores_titulares, profesores_peers) {
      co(function* () {
        for (var i = 0; i < profesores_titulares.length; i++) {
          let profe = profesores_titulares[i]
          let nombres = profe.nombres
          let apellidos = profe.apellidos
          let correo = profe.correo
          let tipo = profe.tipo
          let profesor_nuevo = new ProfesorModel({
            nombres,
            apellidos,
            tipo,
            correo
          })
          let profesor_creado = yield crearProfesor(profesor_nuevo)
          let paralelo = yield buscarParalelo(profe.paralelo, profe.codigomateria, profe.anio, profe.termino)
          let profesor_anadido = yield anadirProfesorAParalelo(paralelo._id, profesor_nuevo._id)
          if (!profesor_creado || !paralelo || !profesor_anadido) {
            logger.error('Error al completar operacion de profesor')
          }
        }
        logger.info('terminado anadir profesores titulares')

        /*  CREAR PEERS */
        var profesores_peers_stringify = profesores_peers.map(profe => {
          return JSON.stringify({
            nombres: profe.nombres,
            apellidos: profe.apellidos,
            tipo: profe.tipo,
            correo: profe.correo
          })
        })
        let profesores_peers_uniq = [...new Set(profesores_peers_stringify)].map(info => {
          return JSON.parse(info)
        })
        for (var i = 0; i < profesores_peers_uniq.length; i++) {
            let profe = profesores_peers_uniq[i]
            let nombres = profe.nombres
            let apellidos = profe.apellidos
            let correo = profe.correo
            let tipo = profe.tipo
            let profesor_nuevo = new ProfesorModel({
              nombres,
              apellidos,
              tipo,
              correo
            })
            let profesor_creado = yield crearProfesor(profesor_nuevo)
            if (!profesor_creado) {
              logger.error('Error al completar operacion de profesor peer')
            }
        }
        logger.info('terminado anadir profesores peers')

        /*ANADIENDO PEERS A PARALELO*/
        for (var i = 0; i < profesores_peers.length; i++) {
          let profe = profesores_peers[i]
          let profesor_encontrado = yield obtenerProfesorPorNombres(profe.nombres) // cambiarlo por correo
          let paralelo = yield buscarParalelo(profe.paralelo, profe.codigomateria, profe.anio, profe.termino)
          let profesor_anadido = yield anadirPeerAParalelo(paralelo._id, profesor_encontrado._id)
          if (!profesor_encontrado || !paralelo || !profesor_anadido) {
            logger.error('Error al completar operacion de profesor peer anadido a paralelo')
          }
        }
        logger.info('terminado anadir peers a curso')
        resolve(true)
      }).catch(fail => console.log(fail))
    })
  })
}

function anadirPeerAParalelo(id_paralelo, id_profesor) {
  return new Promise((resolve, reject) => {
    ParaleloModel.anadirPeerAParalelo(id_paralelo, id_profesor, function(err, res) {
      if (err) {
        logger.error('error al anadir peer a paralelo', err)
        return resolve(null)
      }
      return resolve(true)
    })
  })
}

function anadirProfesorAParalelo(id_paralelo, id_profesor) {
  return new Promise((resolve, reject) => {
    ParaleloModel.anadirProfesorAParalelo(id_paralelo, id_profesor, function(err, res) {
      if (err) {
        logger.error('error al anadir profesor a paralelo', err)
        return resolve(null)
      }
      return resolve(true)
    })
  })
}

function crearProfesor(profesor_nuevo) {
  return new Promise((resolve, reject) => {
    profesor_nuevo.crearProfesor((err, res) => {
      if (err) {
        logger.error('Erro al crear profesor', err)
        return resolve(null)
      }
      return resolve(true)
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

function obtenerProfesorPorCorreo(correo) {
  return new Promise((resolve, reject) => {
    ProfesorModel.obtenerProfesorPorCorreo(correo, (err, profesor) => {
      if (err) {
        logger.error('erro al buscar profesor por correo')
        return resolve(null)
      }
      return resolve(profesor)
    })
  })
}

function obtenerProfesorPorNombres(nombres) {
  return new Promise((resolve, reject) => {
    ProfesorModel.obtenerProfesorPorNombres(nombres, (err, profesor) => {
      if (err) {
        logger.error('erro al buscar profesor por correo')
        return resolve(null)
      }
      return resolve(profesor)
    })
  })
}


module.exports = inicial
