logger     = require('tracer').console(),
co         = require('co');

const ParaleloModel = require('../models/paralelo.model');
var wesService = require('./utils.ws')

function inicial() {
  return new Promise((resolve, reject) => {
    wesService.paralelosWS(function(paralelos) {
      co(function* () {
        for (var i = 0; i < paralelos.length; i++) {
          para = paralelos[i]
          let paralelo_nuevo = new ParaleloModel({
            codigo: para.codigo,
            nombreMateria: para.nombremateria,
            nombre: para.paralelo,
            anio: para.anio,
            termino: para.termino
          })
          //console.log(paralelo_nuevo)
          var creado = yield crearParalelo(paralelo_nuevo)
          if (!creado) {
            return reject(false)
            logger.error('error al crear paralelo')
          }
        }
        logger.info('terminado de crear todos los paralelos')
        return resolve(true)
      })
    })
  })
}

function crearParalelo(paralelo_nuevo) {
  return new Promise((resolve, reject) => {
    paralelo_nuevo.crearParalelo((err, res) => {
      if (err) {
        logger.error('error al crear paralelo', err)
        return reject('error')
      }
      return resolve(true)
    })
  })
}


module.exports = inicial
