/*const mongoose = require('mongoose');
const URL_LOCAL = require('../config/main').local
// const URL_MLAB = require('../config/main').mlab
mongoose.connect("mongodb://localhost/ppl", { useMongoClient: true })
const db = mongoose.connection;

db.on('error', function(err) {
  console.log(`error ${err}`);
})

db.on('connected', function() {
  console.log(`base de datos local para upload`);
})*/

var co = require('co')
var CronJob = require('cron').CronJob;
var colors = require('colors');
var logger        = require('tracer').colorConsole({
  filters : [colors.underline, colors.yellow]
});

module.exports = {
  init: function() {
    // Primero se crean los paralelos, los estudiantes son anadidos al paralelo ,luego los profesores son anadidos al paralelo correspondiente
    var paralelos = require('./paralelos.ws.init')
    var estudiantes = require('./estudiantes.ws.init')
    var profesores = require('./profesores.ws.init')
    co(function* () {
      var p = yield paralelos()
      var e = yield estudiantes()
      var pro = yield profesores()
    }).catch(fail => {
      console.log(fail);
    })
  },
  paralelos_nuevo_semestre() {

  },
  update: function() {
    if (process.env.NODE_ENV == 'production') {
      // var estudiantes = require('./update/estudiantes.ws.update')
      // co(function* () {
      //   var estudiantes = require('./update/estudiantes.ws.update')
      //   var e = yield estudiantes
      //   logger.info('actualizada db')
      // })
      // var estudiantes = require('./update/estudiantes.ws.update')
      // co(function* () {
      //   var estudiantes = require('./update/estudiantes.ws.update')
      //   var e = yield estudiantes()
      //   logger.info('actualizada db')
      // })
      // var estudiantes = require('./update/estudiantes.ws.update')
      // new CronJob('00 30 04 * * 1-7', function() {
      //   var estudiantes = require('./update/estudiantes.ws.update')
      //   co(function* () {
      //     var e = yield estudiantes
      //     logger.info('actualizada db')
      //   })
      // }, null, true, 'America/Guayaquil');
    }
    if (process.env.NODE_ENV == 'development') {
      // var estudiantes = require('./update/estudiantes.ws.update')
      // co(function* () {
      //   var estudiantes = require('./update/estudiantes.ws.update')
      //   var e = yield estudiantes
      //   logger.info('actualizada db')
      // })
      // new CronJob('* * * * * *', function() {
      //   var estudiantes = require('./update/estudiantes.ws.update')
      //   co(function* () {
      //     var estudiantes = require('./update/estudiantes.ws.update')
      //     var e = yield estudiantes
      //     logger.info('actualizada db')
      //   })
      // }, null, true, 'America/Guayaquil');
    }
    // require(./update/paralelos.ws.update)
    // require('./update/profesores.ws.update')
  }
}
