const moment       = require('moment')
const tz           = require('moment-timezone')
const logger       = require('tracer').colorConsole()
const co           = require('co')

require("moment-duration-format")

const URL = require('../utils/change_database').local()
const EstudianteModel = require('../models/estudiante.model')
const ProfesorModel = require('../models/profesor.model')
const ParaleloModel = require('../models/paralelo.model')
const GrupoModel = require('../models/grupo.model')
const LeccionRealtimeModel = require('../models/leccionRealtime')
const LeccionModel = require('../models/leccion.model')

var intervals = []

module.exports = (io) => {
  var leccion = io.of('/tomando_leccion')
  leccion.on('connection', function(socket) {
    console.log(`Cantidad Conectados: ${Object.keys(io.sockets.connected).length}`)
    /*
      @Description: inicializador de profesor timer, crear en la base de datos los profesor
      @LlamadasDB = 3
    */
    function profesorRealtime(boton, pausada) {
      co(function *() {
        const CURRENT_TIME_GUAYAQUIL = moment(moment().tz('America/Guayaquil').format())
        const paraleloId = socket['user']['paraleloId']
        const leccionId = socket['user']['leccionId'] 
        const leccionR = yield obtenerLeccionRealtime(leccionId)
        const LECCION_TOMANDO = yield obtenerLeccion(leccionId)
        const INICIO_LECCION = moment(LECCION_TOMANDO.fechaInicioTomada) // cambiar
        if (leccionR.pausada) {
          leccion.in(paraleloId).emit('TIEMPO_RESTANTE', 'Lección pausada')
        } else if (pausada == 'pausada') {
          logger.trace('pausada para continuar', leccionR)
          // por comodidad para pausar tiempo lo que se hace es disminuir el tiempo de cuando empezo la leccion
          var tiempo_pausado = CURRENT_TIME_GUAYAQUIL.diff(moment(leccionR.fechaPausada))
          var tiempo_pausado_restado = INICIO_LECCION.add(tiempo_pausado,'milliseconds')
          var aumentado = yield aumentarTiempo(leccionR.leccion._id, tiempo_pausado_restado.toISOString())
          if (aumentado) {
            profesorRealtime()
          }
        } else {
          socket.join(paraleloId)
          console.info(`fecha inicio ${INICIO_LECCION.format('YY/MM/DD hh:mm:ss')}`)
          const TIEMPO_MAXIMO = INICIO_LECCION.add(LECCION_TOMANDO.tiempoEstimado, 'm')
          console.info(`tiempo maximo ${TIEMPO_MAXIMO.format('YY/MM/DD hh:mm:ss')}`)
          if (boton) {
            yield corriendoTiempo(socket.leccion, true)
            leccion.in(paraleloId).emit('EMPEZAR_LECCION', 6000)
          }
          cleanIntervals(intervals, leccionId, true).then(function() {
            socket.interval = setInterval(function() {
              let tiempo_temp = TIEMPO_MAXIMO
              let tiempo_rest = TIEMPO_MAXIMO.subtract(1, 's')
              let duration = moment.duration(tiempo_rest.diff(CURRENT_TIME_GUAYAQUIL)).format("h:mm:ss")
              if (!CURRENT_TIME_GUAYAQUIL.isBefore(TIEMPO_MAXIMO)) {
                clearInterval(socket.interval)
                leccionTerminadaSocket(socket.paralelo, leccionId)
                leccion.in(paraleloId).emit('terminado leccion', true)
                leccion.in(paraleloId).emit('TIEMPO_RESTANTE', 'leccion terminada')
              } else {
                leccion.in(paraleloId).emit('TIEMPO_RESTANTE', duration) // envia el tiempo a todos los estudiante de un curso
              }
              delete tiempo_rest
              delete tiempo_temp
              delete duration
            }, 1000)
            socket.interval.ref()
            let leccion_id = socket.leccion
            intervals.push({ leccion_id, interval: socket.interval, intervalTiempo: 'intervalTiempo'})
          })
          // var termo = parseInt(moment.duration(TIEMPO_MAXIMO.diff(CURRENT_TIME_GUAYAQUIL), 'minutes').format("ss"), 1)
          // var intervalTiempo = setTimeout(function() {
          //   cleanIntervals(intervals, leccionId, true).then(function() {
          //     leccionTerminada(socket.paralelo, leccionId)
          //     leccion.in(paraleloId).emit('terminado leccion', true)
          //     console.log('leccion terminada por setTimeout')
          //   })
          // },termo)
        }
      }).catch((err) => {
        let error = new Error(err)
        console.log(error)
      })
    }

    /*
      @Description: usado para conocer quien se conecta
      @llamadasDb: 3
    */
    socket.on('usuario profesor', function(usuario) {
      co(function* () {
        socket.user = JSON.parse(JSON.stringify(usuario))
        // delete socket.user['paralelo']
        const profesor = usuario
        const paraleloId = usuario['paraleloId']
        const leccionId = usuario['leccionId']
        const PARALELO = usuario['paralelo']
        socket.paralelo = usuario['paralelo']
        leccion.in(paraleloId).emit('PROFESOR_ENTRO_A_PARALELO')
        const leccion_creada = yield leccionYaCreada(leccionId)
        socket.leccion = leccionId // importante, usado en comanzar leccion
        socket.join(paraleloId)
        if (!leccion_creada) {
          let leccionRealtime = new LeccionRealtimeModel({
            leccion: leccionId,
            profesor: profesor._id
          })
          yield crearLeccionRealtime(leccionRealtime)
        } else {
          let leccionR = yield obtenerLeccionRealtime(leccionId)
          leccion.in(paraleloId).emit('leccion datos', leccionR)
        }
        if (leccion_creada && PARALELO.dandoLeccion && PARALELO.leccionYaComenzo) {
          profesorRealtime() // PROFESOR_CONECTADO
        }
      }).catch((err) => {
        let error = new Error(err)
        console.log(error)
      })
    })

    /*
      @llamadasDb = 1
    */
    socket.on('comenzar leccion', function() {
      console.info('comenzar leccion')
      co(function*() {
        const leccionR = yield obtenerLeccionRealtime(socket.leccion)
        if (!leccionR.corriendoTiempo) {
          profesorRealtime(true) // COMENZAR_LECCION
        }
      }).catch((err) => {
        let error = new Error(err)
        console.log(error)
      })
    })

    /*
      @llamadasDB: 4
    */
    socket.on('parar leccion', function(data) {
      co(function *() {
        const profesor = yield obtenerProfesor(socket.user)
        const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
        var intervals_done = yield cleanIntervals(intervals, socket.leccion, true)
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

    /*
      @llamadasDB: 0
    */
    socket.on('aumentar tiempo', function(minutos) {
      profesorRealtime()
    })

    /*
      @llamadasDB: 1
    */
    socket.on('pausar leccion', function(datos) {
      co(function *() {
        var pausada = yield pausarLeccion(datos['leccion'])
        if (pausada) { // para asegurarse que no pause dos veces
          cleanIntervals(intervals, datos['leccion'], true)
          leccion.in(datos['paralelo']).emit('TIEMPO_RESTANTE', 'Lección pausada')
        }
      }).catch((err) => {
        let error = new Error(err)
        console.error(error)
      })
    })

    /*
      @llamadasDB: 1
    */
    socket.on('continuar leccion', function(id_leccion) {
      co(function *() {
        var continuada = yield continuarLeccion(id_leccion)
        if (continuada) {
          profesorRealtime(false, 'pausada') // CONTINUAR_LECCION
        }
      })
    })


    /*
    =======================
          ESTUDIANTES
    =======================
    */
    socket.on('usuario estudiante', function(usuario) {
        co(function* () {
          let estudianteId = usuario['_id']
          let leccionId = usuario['leccionRealtimeId']
          let paraleloId = usuario['paraleloId']
          socket.join(paraleloId)
          if (leccionId) {
            estudianteConectado(leccionId, estudianteId)
            leccion.in(paraleloId).emit('estudiante conectado', usuario)
          }
          socket.emit('ESTUDIANTE_ANADIDO_PARALELO') // usado para testear en el front
        }).catch(err => {
          let error = new Error(err)
          console.log(error)
        })
    })

    socket.on('respuesta estudiante', function(data) {
      leccion.in(data.paralelo).emit('respuesta para profesor', data)
    })

    socket.on('disconnect', function(user) {
      co(function* () {
        if (socket.leccion) {
          var limpiado = yield cleanIntervals(intervals, socket.leccion)
        }
      }).catch((err) => {
        let error = new Error(err)
        console.error(error)
      })
    })

  })
}

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
        return resolve(null)
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

function leccionTerminadaSocket(paralelo, id_leccion) {
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
      EstudianteModel.leccionTerminada(estudiante, (err, e) => {
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
