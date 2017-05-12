const cookie = require('cookie'),
cookieParser = require('cookie-parser'),
MongoClient  = require('mongodb').MongoClient,
moment       = require('moment'),
tz           = require('moment-timezone'),
logger       = require('tracer').colorConsole(),
co           = require('co');

require("moment-duration-format");

const URL         = require('../utils/change_database').local(),
EstudianteModel   = require('../models/estudiante.model'),
ProfesorModel     = require('../models/profesor.model'),
ParaleloModel     = require('../models/paralelo.model'),
GrupoModel        = require('../models/grupo.model'),
GrupoLeccionModel = require('../models/grupoLeccion.model'),
LeccionRealtimeModel = require('../models/leccionRealtime'),
LeccionModel      = require('../models/leccion.model');

function realtime(io) {
  var leccion = io.of('/tomando_leccion');
  leccion.on('connection', function(socket) {
    const obtenerProfesor = function(_usuario_cookie) {
      return new Promise((resolve,reject) => {
        ProfesorModel.obtenerProfesorPorCorreo(_usuario_cookie.correo, (err, profesor) => {
          if (err) return reject(err)
          if (!profesor) return resolve(false)
          obtenerParaleloProfesor(profesor._id,paralelo => {
            if (!paralelo) return resolve(false)
            // FIXME: undefined si el paralelo no esta para dar leccion if(!paralelo)
            paralelo.grupos.forEach(grupo => {
              socket.join(paralelo._id)
              socket.join(grupo._id) // crear los room para cada grupo
            })
            return resolve(profesor)
          })
          socket.emit('ingresado profesor', profesor)
        })
      })
    }
    const obtenerEstudiante = function(_usuario_cookie) {
      return new Promise((resolve, reject) => {
        EstudianteModel.obtenerEstudiantePorCorreo(_usuario_cookie.correo, (err, estudiante) => {
          if (err) return reject(err)
          if (!estudiante) return resolve(false)
          return resolve(estudiante)
        })
      })
    }
    var interval
    function comenzar(profe) {
      co(function *() {
          const COOKIE = socket.user
          const profesor = yield obtenerProfesor(COOKIE)
          const estudiante = yield obtenerEstudiante(COOKIE)
          const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
          if (profesor && (profe || PARALELO.leccionYaComenzo)) {
            const HORA_LOCAL = moment();
            const CURRENT_TIME_GUAYAQUIL = moment(HORA_LOCAL.tz('America/Guayaquil').format());
            const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
            const LECCION_TOMANDO = yield obtenerLeccion(PARALELO.leccion)
            const INICIO_LECCION = moment(LECCION_TOMANDO.fechaInicioTomada)
            // verificar si ya fue creada
            const leccion_creada = yield leccionYaCreada(LECCION_TOMANDO._id)
            if (!leccion_creada) {
              let leccionRealtime = new LeccionRealtimeModel({
                leccion: LECCION_TOMANDO._id,
                profesor: profesor._id
              })
              const leccion_creada = yield crearLeccionRealtime(leccionRealtime)
            } else {
              let leccionR = yield obtenerLeccionRealtime(PARALELO.leccion)
              setTimeout(function(ee) {
                 socket.emit('leccion datos', leccionR)
              }, 1000)
            }
            console.log(`fecha inicio ${INICIO_LECCION.format('YY/MM/DD hh:mm:ss')}`);
            const TIEMPO_MAXIMO = INICIO_LECCION.add(LECCION_TOMANDO.tiempoEstimado, 'm')
            console.log(`tiempo maximo ${TIEMPO_MAXIMO.format('YY/MM/DD hh:mm:ss')}`);
            socket.inteval = setInterval(function() {
              let tiempo_rest = TIEMPO_MAXIMO.subtract(1, 's');
              var duration = moment.duration(tiempo_rest.diff(CURRENT_TIME_GUAYAQUIL)).format("h:mm:ss");
              // console.log(`tiempo restado ${tiempo_rest.format('YY/MM/DD hh:mm:ss')}`);
              // console.log(`tiempo restante ${duration}`);
              // si duracion == 0, limpiar lecciones(dandoLeccion) y estudiantes(dandoLeccion)
              if (!isNaN(duration)) { // FIXME si se recarga la pagina antes que llege a cero continua
                if (parseInt(duration) == 0) {
                  clearInterval(socket.inteval);
                  leccionTerminada(PARALELO, PARALELO.leccion)
                  leccion.in(PARALELO._id).emit('terminado leccion', true)
                }
              }
              leccion.in(PARALELO._id).emit('tiempo restante', duration)
            }, 1000)
          }
          if (estudiante) {
            console.log(estudiante);
            const GRUPO = yield obtenerGrupo(estudiante)
            const PARALELO = yield obtenerParaleloDeEstudiante(estudiante)
            const LECCION_ID = yield queLeccionEstaDandoEstudiante(estudiante)
            anadirParticipanteLeccionGrupo(GRUPO, LECCION_ID, estudiante) // anadir un estudiante a grupo de conectados
            // const NUMBER_PREGUNTA = yield obtenerPreguntaActual(GRUPO, LECCION_ID)
            // const PREGUNTA_ID = yield obtenerPreguntaConNumerOrden(LECCION_ID, NUMBER_PREGUNTA)// obtener que pregunta deberia tener este estudiante
            socket.join(GRUPO._id) // unir estudiante al canal grupo
            socket.join(PARALELO._id) // unir al estudiante al canal paralelo
            socket.estudiante = estudiante
            let leccionR = yield obtenerLeccionRealtime(PARALELO.leccion)
            socket.broadcast.emit('estudiante conectado', estudiante) // enviar el estudiante conectador a PROFESOR
            /*
              socket.emit('grupo contensto todo') // este enviara que contesto y esperara hasta que todos los estuidantes contestem
              socket.on('estudiante contesto pregunta') // este recibira de algun estudiante, seria on creo no emit y lo enviara a profesor
              socket.on('grupo contesto pregunta') // cuando el grupo termine
              socket.on('grupo bandera amarilla') // emite a profesor
              socket.on('grupo bandera roja') // emit a profesor
            */
            // socket.emit('pregunta actual', PREGUNTA_ID)
            socket.emit('leccion id', LECCION_ID)
          }
      }).catch(fail => console.log(fail))
    }
    socket.on('usuario', function(usuario) {
      // guardar el usuario conectado
      socket.user = usuario
      // anadirle la leccion el id
      console.log(usuario);
      co(function* () {
        const profesor = yield obtenerProfesor(usuario)
        if (profesor) {
          socket.inteval = interval
          // comenzar(true)
          // var paralelo = yield obtenerParaleloProfesorPromise(socket.user)
          // var leccion = yield leccionRealtime(paralelo.leccion)
          // if (leccion) {
          //   socket.broadcast.emit('leccion datos', leccionRealtime)
          // }
        } else {
          var paralelo = yield obtenerParaleloDeEstudiante(usuario)
          var estudiante_anadido = yield estudianteConectado(paralelo.leccion, usuario._id)
          var estudiante_rec = yield estudianteReconectado(paralelo.leccion, usuario._id)
          comenzar(false)
        }
      })
      comenzar(false)
    })

    socket.on('reconectar estudiante', function(estudiante) {
      co(function*() {
        if (estudiante) {
          const GRUPO = yield obtenerGrupo(estudiante)
          const PARALELO = yield obtenerParaleloDeEstudiante(estudiante)
          const LECCION_ID = yield queLeccionEstaDandoEstudiante(estudiante)
          socket.join(GRUPO._id) // unir estudiante al canal grupo
          socket.join(PARALELO._id) // unir al estudiante al canal paralelo
          socket.estudiante = estudiante
          socket.broadcast.emit('estudiante conectado', estudiante)
          socket.emit('leccion id', LECCION_ID)
        }
      })
    })

    socket.on('comenzar leccion', function() {
      comenzar(true)
      co(function *() {
        const COOKIE = socket.user
        const profesor = yield obtenerProfesor(COOKIE)
        const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
        leccion.in(PARALELO._id).emit('empezar leccion', true)
      }).catch(fail => console.log(fail))
    })

    socket.on('aumentar tiempo', function(minutos) {
      // en el modelo LECCION hay un campo tiempo estimado, sumarle lo que me manden y reenviar la parte de comenzar(true)
    })

    socket.on('disconnect', function() {
      clearInterval(socket.inteval)
      co(function* () {
        // var paralelo = yield obtenerParaleloDeEstudiante(socket.user)
        // var estudiante_desc = estudianteDesconectado(paralelo.leccion, socket.user._id)
        // socket.broadcast.emit('estudiante desconectado', socket.estudiante)
        var profesor
        if (socket.user) {
         profesor = yield obtenerProfesor(socket.user)
        } else {
          profesor = true
        }
        if (profesor) {
          // emitir a todos los estudiantes el tiempo
        } else {
          var paralelo = yield obtenerParaleloDeEstudiante(socket.user)
          var estudiante_desc = estudianteDesconectado(paralelo.leccion, socket.user._id)
          // socket.broadcast.emit('estudiantes desconectados', socket.estudiante)
          let leccionR = yield obtenerLeccionRealtime(paralelo.leccion)
          setTimeout(function(ee) {
            socket.broadcast.emit('estudiante desconectado', socket.estudiante)
          }, 1000)
          // enviarle al profesor el curso nuevamente o el estudiante puede ser?
        }
      }).catch(fail => console.log(fail))
      // cuando el profesor se desconecte, reenviarle los estudiante que estan conectados
    })
    socket.on('parar leccion', function(data) {
      co(function *() {
        const COOKIE = socket.user
        const profesor = yield obtenerProfesor(COOKIE)
        const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
        clearInterval(socket.inteval)
        leccionTerminada(PARALELO, PARALELO.leccion)
        leccion.in(PARALELO._id).emit('terminado leccion', true)
        io.sockets.sockets.forEach(function(s) {
            s.disconnect(true);
        });
      }).catch(fail => console.log(fail))
    })
    socket.on('parar leccion development', function(data) {
      co(function *() {
        const COOKIE = socket.user
        const profesor = yield obtenerProfesor(COOKIE)
        const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
        clearInterval(socket.inteval)
        leccionTerminadaDevelop(PARALELO, PARALELO.leccion)
        leccion.in(PARALELO._id).emit('terminado leccion', true)
        // io.sockets.sockets.forEach(function(s) {
        //     s.disconnect(true);
        // });
      }).catch(fail => console.log(fail))
    })
  })
}

module.exports = realtime

function mongoSession(cook) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(URL, function(err, db) {
      var collection = db.collection('sessions');
      collection.findOne({_id: cook}, function(err, docs) {
        var usuario_cookie = JSON.parse(docs.session)
        if (err) return reject(err);
        if (!docs) return reject('usuario no encontrado')
        resolve(usuario_cookie)
        db.close();
      })
    });
  })
}

function obtenerCook(cookie_socket) {
  // console.log(cookieParser.JSONCookie(cookie_socket, 'MY-SESSION-DEMO'));
  var cookies = cookie.parse(cookie_socket);
  if (!cookies) {
    return false
  }
  var cook = cookies['connect.sid'].split('.').filter((ele,index) => index == 0)[0].split(':')[1]
  return cook
}

/*aumentarTiempo = function(id_leccion, tiempo, callback)
estudianteConectado = function(id_leccion, id_estudiante, callback)
estudianteDesconectado = function(id_leccion, id_estudiante, callback)
estudianteReconectado = function(id_leccion, id_estudiante, callback)
*/

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

function obtenerParaleloProfesor(_id, callback) {
   ParaleloModel.obtenerParalelosProfesor(_id, (err, paralelos) => {
     let para = paralelos.find(paralelo => paralelo.dandoLeccion)
     if (err) return callback(null)
     callback(para)
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

function anadirLeccionAGrupos(paralelo, leccion) {

}

function queLeccionEstaDandoEstudiante(estudiante) {
  return new Promise((resolve, reject) => {
    EstudianteModel.obtenerLeccionEstudianteRealtime(estudiante._id, (err, est) => {
      if (err) return resolve(false)
      return resolve(est.leccion)
    })
  })
}

function anadirParticipanteLeccionGrupo(grupo, id_leccion, estudiante) {
  GrupoLeccionModel.participanteExiste(grupo._id, id_leccion, estudiante._id, (err, est) => {
    if (err) logger.error('anadir participante a grupo', err)
    if (!est) {
      GrupoLeccionModel.anadirParticipante(grupo._id, id_leccion, estudiante._id,(err, doc) => {
        if (err) logger.error('anadir participante a grupo', err)
      })
    }
  })
}


/*
* LECCION DURANTE TOMADO
*/
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

function obtenerSiguientePregunta(grupo, leccion) {

}

function obtenerPreguntaConNumerOrden(id_leccion, numero_pregunta) {
  return new Promise((resolve, reject) => {
    LeccionModel.obtenerLeccion(id_leccion, (err, leccion) => {
      if (err) resolve(false)
      let pregunta = leccion.preguntas.find(pregunta =>{
        return  pregunta.ordenPregunta === numero_pregunta
      })
      resolve(pregunta)
    })
  })
}

function preguntaTerminadaEstudiante(grupo, leccion, estudiante) {

}

function preguntaTerminada() {

}

function obtenerPreguntaActual(grupo, id_leccion) {
  return new Promise((resolve, reject) => {
    GrupoLeccionModel.obtenerGrupoLeccion(grupo._id, id_leccion, (err, leccion) => {
      if (err) {
        logger.error('Error obtener leccion', err)
        return resolve(false)
      }
      // FIXME: fatal error, da error al coger la leccion, sale que leccion no existe
      if(!leccion) {
        // logout estudiante OJO
        logger.error('Error de obtenerPreguntaActual')
        return resolve(false)
      }
      return resolve(leccion.preguntaActual)
    })
  })
}

function obtenerNumeroUltimaPregunta(id_leccion) {
  return new Promise((resolve, reject) => {
    LeccionModel.obtenerLeccion(id_leccion, (err, leccion) => {
      if (err) return resolve(false)
      resolve(leccion.preguntas.length)
    })
  })
}

function preguntaComenzando(grupo) {

}

function todosEstudiantesGrupoContestaron() {
  // esto se hara buscando en cada Grupo.participantes y si todos los campos contestadoPreguntaActual estan en true
}

function guardarRespuestaIndividual(paralelo, leccion, pregunta, grupo, estudiante, respuestaEstudiante) {

}


/*
* LECCION FINALIZADO
 */
function leccionTerminada(paralelo, id_leccion) {
 // TODO: limpiar el GRUPO.participantes por vacio
 // TODO: cambiar GRUPO.preguntaActual por 0

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
 Promise.all(promises).then(values => {
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


/*
* Desconecciones  y reconecciones
 */
// TODO: lista de todos los estudiantes conectador durante la leccion para reconeccion profesor
// TODO: cuando un estudiante de desconecta y no se vuelte a reconectar (se va del curso)
// TODO: cuando un estudiante se reconecta
// TODO: cuando un profesor recarga la pagina, reconectar todos los estudiantes
// TODO: cuando un estudiante recarga la pagina
