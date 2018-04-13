const moment       = require('moment'),
tz           = require('moment-timezone'),
logger       = require('tracer').colorConsole(),
co           = require('co');
var os = require('os')
require("moment-duration-format");
var debug = require('debug')
//https://github.com/nodejs/node-v0.x-archive/issues/2157
const URL            = require('../utils/change_database').local(),
EstudianteModel      = require('../models/estudiante.model'),
ProfesorModel        = require('../models/profesor.model'),
ParaleloModel        = require('../models/paralelo.model'),
GrupoModel           = require('../models/grupo.model'),
LeccionRealtimeModel = require('../models/leccionRealtime'),
LeccionModel         = require('../models/leccion.model');
var fs = require('fs');

var intervals = []
function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};

function loggerCPU() {
  //console.log('==============')
 //1 global.gc();
  logger.trace('user_realtime', bytesToSize(process.cpuUsage().user));
  logger.trace('system_realtime', bytesToSize(process.cpuUsage().system));
  logger.trace('heapTotal', bytesToSize(process.memoryUsage().heapTotal));
  logger.trace('heapUsed', bytesToSize(process.memoryUsage().heapUsed));
}

clientes_conectados = -1
// inter = setInterval(function() {
//   console.log(clientes_conectados)
//   loggerCPU()
// }, 1000)
function prueba() {
  setInterval(function() {
    console.log('sads')
  },1000 ) 
}
function realtime(io) {
  // inter.ref()
  // setInterval(function() {
  //   clientes_conectados = io.engine.clientsCount
  // }, 1000)
  var leccion = io.of('/tomando_leccion');
  leccion.on('connection', function(socket) {
    // var clients[socket.id] = socket;
    // console.log(clientes);
    // inicializador de profesor timer, crear en la base de datos los profesor
    function profesorRealtime(boton, pausada) {

      //loggerCPU()
      logger.trace('profesor realtime')
      co(function *() {
        const HORA_LOCAL = moment();
        const CURRENT_TIME_GUAYAQUIL = moment(HORA_LOCAL.tz('America/Guayaquil').format());
        const profesor = yield obtenerProfesor(socket.user)
        const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
        const leccionR = yield obtenerLeccionRealtime(PARALELO.leccion)

        const LECCION_TOMANDO = yield obtenerLeccion(PARALELO.leccion)

        const INICIO_LECCION = moment(LECCION_TOMANDO.fechaInicioTomada) // cambiar
        
        if (leccionR.pausada) {
          leccion.in(PARALELO._id).emit('tiempo restante', 'Lección pausada')
          console.log('pausado', PARALELO._id)
        } else if (pausada == 'pausada') {
          logger.trace('pausada para continuar', leccionR);
          // por comodidad para pausar tiempo lo que se hace es disminuir el tiempo de cuando empezo la leccion
          var tiempo_pausado = CURRENT_TIME_GUAYAQUIL.diff(moment(leccionR.fechaPausada))
          var tiempo_pausado_restado = INICIO_LECCION.add(tiempo_pausado,'milliseconds')
          //console.log(tiempo_pausado_restado.toISOString())
         // console.log('Tiempo pausado' + tiempo_pausado_restado.format("YY/MM/DD hh:mm:ss"))
          var aumentado = yield aumentarTiempo(leccionR.leccion._id, tiempo_pausado_restado.toISOString())
          if (aumentado) {
            profesorRealtime()
          }
           //profesorRealtime()
        } else {
          socket.join(PARALELO._id) // crear el room para emitir el tiempo de paralelo
          // for (var i = 0; i < PARALELO.grupos.length; i++) {
          //   socket.join(PARALELO.grupos[i]._id) // crear los room para cada grupo
          // }

          console.log(`fecha inicio ${INICIO_LECCION.format('YY/MM/DD hh:mm:ss')}`);
          const TIEMPO_MAXIMO = INICIO_LECCION.add(LECCION_TOMANDO.tiempoEstimado, 'm');
          console.log(`tiempo maximo ${TIEMPO_MAXIMO.format('YY/MM/DD hh:mm:ss')}`);
           var hec = yield cleanIntervals(intervals, socket.leccion._id, true)
          if (boton) {
            var c = yield corriendoTiempo(socket.leccion._id, true);
            leccion.in(PARALELO._id).emit('EMPEZAR_LECCION', 6000) // sirve para redirigir a todos los estudiantes una vez  que empieze la leccoin
          }
          //loggerCPU()
          cleanIntervals(intervals, PARALELO.leccion, true).then(function() {
            socket.interval = setInterval(function() {
              let tiempo_temp = TIEMPO_MAXIMO
              let tiempo_rest = TIEMPO_MAXIMO.subtract(1, 's');
              //duration = -1
              let duration = moment.duration(tiempo_rest.diff(CURRENT_TIME_GUAYAQUIL)).format("h:mm:ss");
              if (!CURRENT_TIME_GUAYAQUIL.isBefore(TIEMPO_MAXIMO)) {
                clearInterval(socket.interval);
                leccionTerminada(PARALELO, PARALELO.leccion)
                leccion.in(PARALELO._id).emit('terminado leccion', true)
                leccion.in(PARALELO._id).emit('tiempo restante', 'leccion terminada')
              } else {
                leccion.in(PARALELO._id).emit('tiempo restante', duration) // envia el tiempo a todos los estudiante de un curso
              }
              delete tiempo_rest
              delete tiempo_temp
              delete duration
            }, 1000)
            socket.interval.ref()
            var leccion_id = socket.leccion._id
            intervals.push({leccion_id: leccion_id, interval: socket.interval, intervalTiempo: 'intervalTiempo'})
          })
          // var termo = parseInt(moment.duration(TIEMPO_MAXIMO.diff(CURRENT_TIME_GUAYAQUIL), 'seconds').format("ss"), 10)
          // var intervalTiempo = setTimeout(function() {
          //   cleanIntervals(intervals, PARALELO.leccion, true).then(function() {
          //     leccionTerminada(PARALELO, PARALELO.leccion)
          //     leccion.in(PARALELO._id).emit('terminado leccion', true)
          //     console.log('leccion terminada por setTimeout')
          //   })
          // },termo)
          
        }
          
       
        //loggerCPU()
       
        delete HORA_LOCAL
        delete CURRENT_TIME_GUAYAQUIL
        delete profesor
        delete PARALELO
        delete LECCION_TOMANDO
        delete INICIO_LECCION
        delete leccionR 
        // console.log(intervals);
      }).catch(fail => {
        let error = new Error(fail)
        console.log(error);
      })
    }

    socket.on('comenzar leccion', function() {
      //loggerCPU()
      console.log('comenzar leccion');
      co(function*() {
        logger.trace('hello', process.cpuUsage());
        const leccionR = yield obtenerLeccionRealtime(socket.leccion._id)
        logger.trace('obtener leccion realtime',leccionR);
        if (!leccionR.corriendoTiempo) {
          logger.trace('leccion corriendo tiempo', leccionR);
          profesorRealtime(true)
        }
      })
    })

    // usado para conocer quien se conecta
    socket.on('usuario', function(usuario) {
      // guardar el usuario conectado
      socket.user = usuario
      // console.log(`usuario ${Object.keys(io.sockets.sockets).length}`);
      // console.log();
      co(function* () {
        //loggerCPU()
        const profesor = yield obtenerProfesor(usuario)
        const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
        const paralelo = yield obtenerParaleloDeEstudiante(usuario)
        if (profesor && PARALELO) {
         // loggerCPU()
          const LECCION_TOMANDO = yield obtenerLeccion(PARALELO.leccion)
          const leccion_creada = yield leccionYaCreada(LECCION_TOMANDO._id)
          socket.leccion = LECCION_TOMANDO
          socket.join(PARALELO._id)
          // registar la leccion cuando el profesor ingresa
          if (!leccion_creada) {
            //loggerCPU()
            let leccionRealtime = new LeccionRealtimeModel({
              leccion: LECCION_TOMANDO._id,
              profesor: profesor._id
            })
            const leccion_creada = yield crearLeccionRealtime(leccionRealtime)
            delete leccionRealtime
            delete leccion_creada
          } else {
            let leccionR = yield obtenerLeccionRealtime(PARALELO.leccion)
            leccion.in(PARALELO._id).emit('leccion datos', leccionR)
            delete leccionR
          }
          if (leccion_creada && PARALELO.dandoLeccion && PARALELO.leccionYaComenzo) { // verificar cuando el profesor se conecte por primera vez no comienze la leccion
            //loggerCPU()
            profesorRealtime()
          }
        } else if (paralelo) {
          //loggerCPU()
          const estudiante_anadido = yield estudianteConectado(paralelo.leccion, usuario._id)
          const estudiante_rec = yield estudianteReconectado(paralelo.leccion, usuario._id)
          const estudiante = yield obtenerEstudiante(socket.user)
          const GRUPO = yield obtenerGrupo(estudiante)
          const PARALELO = yield obtenerParaleloDeEstudiante(estudiante)
          const LECCION_ID = yield queLeccionEstaDandoEstudiante(estudiante)
          socket.join(GRUPO._id) // unir estudiante al canal grupo
          socket.join(PARALELO._id) // unir al estudiante al canal paralelo
          socket.estudiante = estudiante
          let leccionR = yield obtenerLeccionRealtime(PARALELO.leccion)
          leccion.in(PARALELO._id).emit('leccion datos', leccionR)
          //loggerCPU()
          socket.emit('leccion id', LECCION_ID)
          socket.emit('ESTUDIANTE_ANADIDO_PARALELO')
          delete estudiante_anadido
          delete estudiante_rec
          delete estudiante
          delete GRUPO
          delete PARALELO
          delete LECCION_ID
          delete leccionR
        }
        delete profesor
        delete paralelo
        delete PARALELO
      }).catch(fail => {
        let error = new Error(fail)
        //loggerCPU()
        console.log(error);
      })
    })

    socket.on('reconectar estudiante', function(estudiante) {
      // cambio
      console.log('reconectar estudiante');
      co(function*() {
        if (estudiante) {
          const GRUPO = yield obtenerGrupo(estudiante)
          const PARALELO = yield obtenerParaleloDeEstudiante(estudiante)
          const LECCION_ID = yield queLeccionEstaDandoEstudiante(estudiante)
          const estudiante_anadido = yield estudianteConectado(PARALELO.leccion, estudiante._id)
          const estudiante_rec = yield estudianteReconectado(PARALELO.leccion, estudiante._id)
          socket.join(GRUPO._id) // unir estudiante al canal grupo
          socket.join(PARALELO._id) // unir al estudiante al canal paralelo
          socket.user = estudiante
          let leccionR = yield obtenerLeccionRealtime(PARALELO.leccion)
          leccion.in(PARALELO._id).emit('leccion datos', leccionR)
          socket.emit('leccion id', LECCION_ID)
          delete GRUPO
          delete PARALELO
          delete LECCION_ID
          delete estudiante_anadido
          delete estudiante_rec
          delete leccionR
        }
      }).catch(fail => {
        let error = new Error(fail)
        console.log(error);
      })
    })

    socket.on('aumentar tiempo', function(minutos) {
      //loggerCPU()
      profesorRealtime()
    })

    socket.on('disconnect', function(user) {
     // loggerCPU()
      // cambio
      co(function* () {
        if (socket.user) {
          var estudiante = yield obtenerEstudiante(socket.user)
          var profesor = yield obtenerProfesor(socket.user)
          if (estudiante) {
            // var paralelo = yield obtenerParaleloDeEstudiante(socket.user)
            // var estudiante_desc = estudianteDesconectado(paralelo.leccion, socket.user._id)
            // let leccionR = yield obtenerLeccionRealtime(paralelo.leccion)
            // leccion.in(paralelo._id).emit('leccion datos', leccionR)
          } else {
            if (socket.leccion) {
              // var hecc = yield cleanCrons(crons_intervals, socket.leccion._id);
              var limpiado = yield cleanIntervals(intervals, socket.leccion._id)
            }
          }
        }
      }).catch(fail => {
        let error = new Error(fail)
        console.log(error);
      })
    })

    socket.on('pausar leccion', function(datos) {
      co(function *() {
        var pausada = yield pausarLeccion(datos['leccion'])
        if (pausada) {
          cleanIntervals(intervals, datos['leccion'], true)
          leccion.in(datos['paralelo']).emit('tiempo restante', 'Lección pausada')
          console.log('leccion pausada', datos['leccion'])
        }
      })
      
    })

    socket.on('continuar leccion', function(id_leccion) {
      co(function *() {
        var continuada = yield continuarLeccion(id_leccion)
        if (continuada) {
          profesorRealtime(false, 'pausada')
          console.log('leccion continuada', id_leccion)
        }
      })
    })

    socket.on('respuesta estudiante', function(data) {
      console.log(data)
      leccion.in(data.paralelo).emit('respuesta para profesor', data)
    })

    // terminar leccion
    socket.on('parar leccion', function(data) {
      co(function *() {
        //loggerCPU()
        // TODO: verificar que sea un profesor
        const profesor = yield obtenerProfesor(socket.user)
        const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
        var intervals_done = yield cleanIntervals(intervals, socket.leccion._id, true)
        // var limpiado = yield cleanIntervals(intervals, socket.leccion._id)
        var lecciones_terminadas = yield leccionTerminada(PARALELO, PARALELO.leccion)
        if (profesor &&  PARALELO && lecciones_terminadas && intervals_done) {
          leccion.in(PARALELO._id).emit('terminado leccion', true)
        } else {
          leccion.in(PARALELO._id).emit('terminado leccion', false)
        }
      }).catch(fail => {
        let error = new Error(fail)
        console.log(error);
      })
    })

    // solo se usa para pruebas
    socket.on('parar leccion development', function(data) {
      co(function *() {
        const profesor = yield obtenerProfesor(socket.user)
        const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
        clearInterval(socket.interval)
        leccionTerminadaDevelop(PARALELO, PARALELO.leccion)
        leccion.in(PARALELO._id).emit('terminado leccion', true)
      }).catch(fail => {
        let error = new Error(fail)
        console.log(error);
      })
    })
  })

}

module.exports = realtime

function aumentarTiempo(id_leccion, tiempo) {
  return new Promise((resolve, reject) => {
    LeccionModel.setearTiempo(id_leccion, tiempo, function(err) {
      if (err) reject(err)
      resolve(true)
    })
  })

}

function cleanIntervals(todos_intervals, id_leccion, todo) {
  return new Promise((resolve, reject) => {
    intervals = intervals.filter(inicial => { // intervals es variable global
      if (inicial.leccion_id != id_leccion) {
        return inicial
      } else {
        if (todo) {
           // clearTimeout(inicial.intervalTiempo)
        }
        clearInterval(inicial.interval)
      }
    })
    return resolve(true)
  })
}

function cleanCrons(todos_crons, id_leccion) {
  return new Promise((resolve, reject) => {
    crons_intervals = crons_intervals.filter(inicial => { // crons_intervals es variable global
      if (inicial.leccion_id != id_leccion) {
        return inicial
      } else {
        inicial.job.stop()
        return resolve(true)
      }
    })
    return resolve(crons_intervals)
  })
}

function pausarLeccion(id_leccion) {
  return new Promise((resolve, reject) => {
    LeccionRealtimeModel.pausar(id_leccion, (err, res) => {
       if (err) return reject(err)
        resolve(true)
    })
  })
}


function continuarLeccion(id_leccion) {
  return new Promise((resolve, reject) => {
    LeccionRealtimeModel.continuar(id_leccion, (err, res) => {
       if (err) return reject(err)
        resolve(true)
    })
  })
}

function obtenerEstudiante(_usuario_cookie) {
  return new Promise((resolve, reject) => {
    EstudianteModel.obtenerEstudiantePorCorreo(_usuario_cookie.correo, (err, estudiante) => {
      if (err) return reject(err)
      if (!estudiante) return resolve(false)
      return resolve(estudiante)
    })
  })
}

function obtenerProfesor(_usuario_cookie) { // FIXME: eliminar la parte de creacion de sockets
  return new Promise((resolve,reject) => {
    ProfesorModel.obtenerProfesorPorCorreo(_usuario_cookie.correo, (err, profesor) => {
      if (err) return reject(err)
      if (!profesor) return resolve(false)
      return resolve(profesor)
    })
  })
}

function corriendoTiempo(id_leccion, valor) {
  return new Promise((resolve, reject) => {
    LeccionRealtimeModel.corriendoTiempo(id_leccion, valor, (err, res) => {
      if (err) return reject(err)
      resolve(true)
    })
  })
}

/*anadir un estudiante a conectado */
function estudianteConectado(id_leccion, id_estudiante) {
  return new Promise((resolve, reject) => {
    LeccionRealtimeModel.estudianteConectado(id_leccion, id_estudiante, (err, doc) => {
      if (err) return reject(new Error('Error al anadir estudiante a conectado'))
      return resolve(true)
    })
  })
}

function estudianteDesconectado(id_leccion, id_estudiante) {
  return new Promise((resolve, reject) => {
    LeccionRealtimeModel.estudianteDesconectado(id_leccion, id_estudiante, (err, doc) => {
      if (err) return reject(new Error('Error al anadir estudiante a desconectado'))
      return resolve(true)
    })
  })
}

function estudianteReconectado(id_leccion, id_estudiante) {
  return new Promise((resolve, reject) => {
    LeccionRealtimeModel.estudianteReconectado(id_leccion, id_estudiante, (err, doc) => {
      if (err) return reject(new Error('Error al anadir estudiante a reconectado'))
      return resolve(true)
    })
  })
}

function obtenerLeccionRealtime(id_leccion) {
  return new Promise((resolve, reject) => {
    LeccionRealtimeModel.buscarLeccionPopulate(id_leccion, (err, leccion) => {
      if (err) return reject(new Error('Error al anadir encontrar leccion'))
      var tmp = []
      if (leccion) {
        for (var i = 0; i < leccion.estudiantesDandoLeccion.length; i++) {
          tmp.push({
            _id: leccion.estudiantesDandoLeccion[i]._id,
            nombres: leccion.estudiantesDandoLeccion[i].nombres,
            apellidos: leccion.estudiantesDandoLeccion[i].apellidos,
            matricula: leccion.estudiantesDandoLeccion[i].matricula,
            correo: leccion.estudiantesDandoLeccion[i].correo,
            leccion: leccion.estudiantesDandoLeccion[i].leccion,
            codigoIngresado: leccion.estudiantesDandoLeccion[i].codigoIngresado,
            dandoLeccion: leccion.estudiantesDandoLeccion[i].dandoLeccion
          })
        }
        leccion.estudiantesDandoLeccion = tmp
        var tmp2 = []
        for (var i = 0; i < leccion.estudiantesDesconectados.length; i++) {
          tmp2.push({
            _id: leccion.estudiantesDesconectados[i]._id,
            nombres: leccion.estudiantesDesconectados[i].nombres,
            apellidos: leccion.estudiantesDesconectados[i].apellidos,
            matricula: leccion.estudiantesDesconectados[i].matricula,
            correo: leccion.estudiantesDesconectados[i].correo,
            leccion: leccion.estudiantesDesconectados[i].leccion,
            codigoIngresado: leccion.estudiantesDesconectados[i].codigoIngresado,
            dandoLeccion: leccion.estudiantesDesconectados[i].dandoLeccion
          })
        }
        leccion.estudiantesDesconectados = tmp2
      } else {
        return resolve([])
      }
      return resolve(leccion)
    })
  })
}

function leccionYaCreada(id_leccion) {
  return new Promise((resolve, reject) => {
    LeccionRealtimeModel.buscarLeccion(id_leccion, (err, leccion) => {
      if (err) return reject(new Error('Error al anadir estudiante a conectado'))
      if (!leccion) return resolve(false)
      return resolve(true)
    })
  })
}

function crearLeccionRealtime(leccion) {
  return new Promise((resolve, reject) => {
    leccion.crearLeccion((err, doc) => {
      if (err) return reject(new Error('Error al crear leccion realtime'))
      return resolve(true)
    })
  })
}

function obtenerParaleloProfesorPromise(_profesor) {
 return new Promise((resolve, reject) => {
   ParaleloModel.obtenerParalelosProfesor(_profesor._id, (err, paralelos) => {
     let para = paralelos.find(paralelo => paralelo.dandoLeccion)
     if (err) return reject(null)
     return resolve(para)
   })
 })
}

function obtenerLeccion(_id_leccion) {
  return new Promise((resolve, reject) => {
    LeccionModel.obtenerLeccion(_id_leccion, (err, leccion) => {
      if (err) return reject(err)
      if (!leccion) return reject('no se encontro leccion')
      return resolve(leccion)
    })
  })
}


function queLeccionEstaDandoEstudiante(estudiante) {
  return new Promise((resolve, reject) => {
    EstudianteModel.obtenerLeccionEstudianteRealtime(estudiante._id, (err, est) => {
      if (err) return resolve(false)
      return resolve(est.leccion)
    })
  })
}

function obtenerParaleloDeEstudiante(estudiante, callback) {
 return new Promise((resolve, reject) => {
   ParaleloModel.obtenerParaleloDeEstudiante(estudiante._id, (err, paralelo) => {
     if (err) return reject(null)
     return resolve(paralelo)
   })
 })
}

function obtenerGrupo(_estudiante) {
 return new Promise((resolve, reject) => {
   GrupoModel.obtenerGrupoDeEstudiante(_estudiante._id, (err, grupo) => {
     if (err) return reject(err)
     if (!grupo) return resolve('no existe en grupo')
     return resolve(grupo)
   })
 })
}

/*
* LECCION FINALIZADA
 */
function leccionTerminada(paralelo, id_leccion) {
  // ingresa la fecha de culminacion de la leccion y cambio el campo estado por 'terminado'
  LeccionModel.leccionTerminada(id_leccion, (err, res) => {
    if (err) return console.log(err);
    console.log('leccion terminado ' + id_leccion);
  })
  // cambia valor dandoLeccion en paralelo por false
  ParaleloModel.leccionTerminada(paralelo._id, (err, res) => {
    if (err) return console.log(err);
    console.log('leccion terminada ' + paralelo._id);
  })
  var promises = []
  // anade a cada estudiante la leccion y cambia el boolean dandoLeccion por false
  // TODO: anadir fecha empezado leccion
  paralelo.estudiantes.forEach(estudiante => {
    promises.push(new Promise((resolve, reject) => {
      EstudianteModel.leccionTerminada(estudiante._id, (err, e) => {
        if (err) return reject(err)
        return resolve(true)
      })
    }))
  })
  return Promise.all(promises).then(values => {
    for (var i = 0; i < values.length; i++) {
      if (values[i] != true){
        return false
      }
    }
    return true
    console.log('terminado leccion estudiantes');
  }, fail => {
   console.log(fail);
  })
}


/*
* Funcion solo para development
 */
function leccionTerminadaDevelop(paralelo, id_leccion) {
  LeccionModel.leccionTerminadaDevelop(id_leccion, (err, res) => {
   if (err) return console.log(err);
   console.log('leccion terminado ' + id_leccion);
  })
  // cambia valor dandoLeccion en paralelo por false
  ParaleloModel.leccionTerminada(paralelo._id, (err, res) => {
   if (err) return console.log(err);
   console.log('leccion terminada ' + paralelo._id);
  })
  var promises = []
  // anade a cada estudiante la leccion y cambia el boolean dandoLeccion por false
  // TODO: anadir fecha empezado leccion
  paralelo.estudiantes.forEach(estudiante => {
   promises.push(new Promise((resolve, reject) => {
     EstudianteModel.leccionTerminada(estudiante._id, (err, e) => {
       if (err) return reject(err)
       return resolve(true)
     })
   }))
  })
  Promise.all(promises).then(values => {
   console.log('terminado leccion estudiantes');
  }, fail => {
   console.log(fail);
  })
}
