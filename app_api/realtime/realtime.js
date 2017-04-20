const cookie = require('cookie'),
cookieParser = require('cookie-parser'),
MongoClient  = require('mongodb').MongoClient,
moment       = require('moment'),
tz           = require('moment-timezone'),
co           = require('co');

require("moment-duration-format");

const URL       = require('../utils/change_database').session(),
EstudianteModel = require('../models/estudiante.model'),
ProfesorModel   = require('../models/profesor.model'),
ParaleloModel   = require('../models/paralelo.model'),
GrupoModel      = require('../models/grupo.model'),
LeccionModel    = require('../models/leccion.model');

function realtime(io) {
  var leccion = io.of('/tomando_leccion');
  leccion.on('connection', function(socket) {
    var cook = obtenerCook(socket.request.headers.cookie)
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
    co(function *() {
      const COOKIE = yield mongoSession(cook)
      const profesor = yield obtenerProfesor(COOKIE)
      const estudiante = yield obtenerEstudiante(COOKIE)
      if (profesor) {
        const HORA_LOCAL = moment();
        const CURRENT_TIME_GUAYAQUIL = moment(HORA_LOCAL.tz('America/Guayaquil').format());
        const PARALELO = yield obtenerParaleloProfesorPromise(profesor)
        const LECCION_TOMANDO = yield obtenerLeccion(PARALELO.leccion)
        const INICIO_LECCION = moment(LECCION_TOMANDO.fechaInicioTomada)
        console.log(`fecha inicio ${INICIO_LECCION.format('YY/MM/DD hh:mm:ss')}`);
        const TIEMPO_MAXIMO = INICIO_LECCION.add(LECCION_TOMANDO.tiempoEstimado, 'm')
        console.log(`tiempo maximo ${TIEMPO_MAXIMO.format('YY/MM/DD hh:mm:ss')}`);
        interval = setInterval(function() {
          let tiempo_rest = TIEMPO_MAXIMO.subtract(1, 's');
          var duration = moment.duration(tiempo_rest.diff(CURRENT_TIME_GUAYAQUIL)).format("h:mm:ss");
          // console.log(`tiempo restado ${tiempo_rest.format('YY/MM/DD hh:mm:ss')}`);
          // console.log(`tiempo restante ${duration}`);
          // si duracion == 0, limpiar lecciones(dandoLeccion) y estudiantes(dandoLeccion)
          if (!isNaN(duration)) { // FIXME si se recarga la pagina antes que llege a cero continua
            if (parseInt(duration) == 0) {
              clearInterval(interval);
              leccionTerminada(PARALELO, PARALELO.leccion)
              leccion.in(PARALELO._id).emit('terminado leccion', true)
            }
          }
          leccion.in(PARALELO._id).emit('tiempo restante', duration)
        }, 1000)
      }
      if (estudiante) {
        const GRUPO = yield obtenerGrupo(estudiante)
        const PARALELO = yield obtenerParaleloDeEstudiante(estudiante)
        const LECCION_ID = yield queLeccionEstaDandoEstudiante(estudiante)
        // buscar leccion y emitir al estudiante
        socket.join(GRUPO._id)
        socket.join(PARALELO._id)
        socket.to(GRUPO._id).emit('mi grupo', estudiante)
        socket.estudiante = estudiante
        socket.broadcast.emit('estudiante conectado', estudiante)
        socket.emit('leccion id', LECCION_ID)
      }
    }).catch(fail => console.log(fail))
    socket.on('disconnect', function() {
      clearInterval(interval)
      socket.broadcast.emit('estudiante desconectado', socket.estudiante)
    })
    socket.on('parar leccion', function() {
      // boton para terminar la leccion
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
  var cookies = cookie.parse(cookie_socket);
  var cook = cookies['connect.sid'].split('.').filter((ele,index) => index == 0)[0].split(':')[1]
  return cook
}

// ORGANIZACION FUNCIONES
// se hara por medio de lecciones segun en que estado este la leccion
/*
* LECCION ANTES TOMANDO
 */

// obtener paralelo, leccion => globales ` grupo,pregunta` => dependiente de estudiante
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

/**
 * En `paralelo` buscar los grupos y luego ir a GrupoLeccion y settear la `leccion` id y el grupo id, fecha empezado
 * @param  {Object} paralelo
 * @param  {Object} leccion
 */
function anadirLeccionAGrupos(paralelo, leccion) {

}

/**
 * Con `estudiante` busco en Estudiante.leccion y obtengo la leccion que esta dando
 * @param  {Object} estudiante
 * @return {Promise}            id leccion
 */
function queLeccionEstaDandoEstudiante(estudiante) {
  return new Promise((resolve, reject) => {
    EstudianteModel.obtenerLeccionEstudianteRealtime(estudiante._id, (err, est) => {
      if (err) return resolve(false)
      return resolve(est.leccion)
    })
  })
}

// /**
//  * Con `estudiante` busco en Estudiante y le anado la `leccion` y le anado tambien Estudiante.lecciones.fechaEmpezado
//  * @param  {Object} estudiante
//  * @param  {Object} leccion
//  */
// function estudianteComenzadoLeccion(estudiante, leccion) {
//
// }


/**
 * Con `grupo` busco el grupo y la `leccion` que el `estudiante` este dando y anadirlo a GrupoLeccion.participantes
 * @param  {Object} grupo
 * @param  {Object} leccion
 * @param  {Object} estudiante
 * @see    si un estudiante se reconecta, si el estudiante existe no agregalo, si se desconecta eliminarlo
 */
function guardarParticipanteLeccionGrupo(grupo, leccion, estudiante) {

}

// TODO: para que me servira?
function guardarSocketIdEstudiante(grupo) {

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

/**
 * Con `grupo` obtengo el Grupo.preguntaActual y con `leccion` busco en Leccion para encontrar a que pregunta pertence Grupo.preguntaActual
 * @param {Object} grupo
 */
function obtenerSiguientePregunta(grupo, leccion) {
  //
}

/**
 * Con `grupo` busco de Grupo y dentro a `leccion` y dentro a `estudiante` y cambiar el valor Grupo.participantes.estudiante.preguntaActual a true. Actualizar la Grupo.preguntaActual por + 1
 * @param {Object} grupo
 * @param {Object} leccion
 * @param {Object} estudiante
 * @see   como saber que ha terminado la pregunta {@link obtenerNumeroUltimaPregunta} y verificar con {@link obtenerPreguntaActual} si son las mismas
 */
function preguntaTerminada(grupo, leccion, estudiante) {

}

/**
 * Obtener de un `grupo` el valor Grupo.preguntaActual
 * @param  {String} grupo
 * @return {Promise}       number de la pregunta
 */
function obtenerPreguntaActual(grupo) {

}

/**
 * Obtener el numero de la ultima pregunta de una determinada `leccion`
 * @param  {Object} leccion
 * @return {Promise} numero de la ultima pregunta
 */
function obtenerNumeroUltimaPregunta(leccion) {

}

/**
 * Busca a `grupo` en el modelo Grupo y actualiza a false el valor participantes.contestadoPreguntaActual a false de todos
 * @param  {Object} grupo
 */
function preguntaComenzando(grupo) {

}

/**
 * Verificar si todos los del `grupo` contestaron todas la preguntas en la que estan actualmente en una `leccion`
 * @param {Object} grupo
 * @param {Object} leccion
 * @returns {Promise} true si todos los del grupo contestaron la pregunta que les tocaba
 */
function todosEstudiantesGrupoContestaron() {
  // esto se hara buscando en cada Grupo.participantes y si todos los campos contestadoPreguntaActual estan en true
}

/**
 * Guardar la respuesta que da el estudiante
 * @param  {Object} paralelo
 * @param  {Object} leccion
 * @param  {Object} pregunta
 * @param  {Object} grupo
 * @param  {Object} estudiante
 * @param  {String} respuestaEstudiante lo que el estudiante contesto
 * @return {Promise}            si la accion a sido completada
 */
function guardarRespuestaIndividual(paralelo, leccion, pregunta, grupo, estudiante, respuestaEstudiante) {

}


/*
* LECCION FINALIZADO
 */

/**
  * Anade a cada estudiante la leccion, cambia valor boolean
  * @param {Object} paralelo
  * @param {String} id_leccion
*/
function leccionTerminada(paralelo, id_leccion) {
 // TODO: limpiar el GRUPO.participantes por vacio
 // TODO: cambiar GRUPO.preguntaActual por 0

 // ingresa la fecha de culminacion de la leccion y cambi el campo estado por 'terminado'
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
* Desconecciones  y reconecciones
 */
// TODO: lista de todos los estudiantes conectador durante la leccion para reconeccion profesor
// TODO: cuando un estudiante de desconecta y no se vuelte a reconectar (se va del curso)
// TODO: cuando un estudiante se reconecta
// TODO: cuando un profesor recarga la pagina, reconectar todos los estudiantes
// TODO: cuando un estudiante recarga la pagina
