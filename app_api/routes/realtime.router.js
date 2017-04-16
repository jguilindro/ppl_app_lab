const cookie = require('cookie'),
cookieParser = require('cookie-parser'),
MongoClient  = require('mongodb').MongoClient,
prettyjson   = require('prettyjson'),
moment       = require('moment'),
tz           = require('moment-timezone'),
co           = require('co');

require("moment-duration-format");

const url       = require('../utils/change_database').session(),
EstudianteModel = require('../models/estudiante.model'),
ProfesorModel   = require('../models/profesor.model'),
ParaleloModel   = require('../models/paralelo.model'),
GrupoModel      = require('../models/grupo.model'),
LeccionModel    = require('../models/leccion.model');

var hora = moment();
var current_time_guayaquil = moment(hora.tz('America/Guayaquil').format());

function realtime(io) {
  // verificar profesor, crear leccion canal y canal de cada grupo
  var leccion = io.of('/tomando_leccion');
  leccion.on('connection', function(socket) {
    var cook = obtenerCook(socket.request.headers.cookie)
    const obtenerProfesor = function(_usuario_cookie) {
      return new Promise((resolve,reject) => {
        ProfesorModel.obtenerProfesorPorCorreo(_usuario_cookie.correo, (err, profesor) => {
          if (err) return reject(err)
          if (!profesor) return resolve(false)
          obtenerParaleloProfesor(profesor._id,paralelo => {
            paralelo.grupos.forEach(grupo => {
              socket.join(paralelo._id)
              socket.join(grupo._id) // crear los room para cada grupo
            })
          })
          socket.emit('ingresado profesor', profesor)
          return resolve(profesor)
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

    co(function *() {
      const cookie = yield mongoSession(cook)
      const profesor = yield obtenerProfesor(cookie)
      const estudiante = yield obtenerEstudiante(cookie)
      if (profesor) {
        const paralelo = yield obtenerParaleloProfesorPromise(profesor)
        const leccion_tomando = yield obtenerLeccion(paralelo.leccion)
        const inicio_leccion = moment(leccion_tomando.fechaInicioTomada)
        var tiempo_maximo = inicio_leccion.add(leccion_tomando.tiempoEstimado, 'm')
        setInterval(function() {
          let tiempo_rest = tiempo_maximo.subtract(1, 's')
          var duration = moment.duration(tiempo_rest.diff(current_time_guayaquil)).format("h:mm:ss");
          // si duracion == 0, limpiar lecciones(dandoLeccion) y estudiantes(dandoLeccion)
          leccion.in(paralelo._id).emit('tiempo restante', duration)
        }, 1000)
      }
      if (estudiante) {
        const grupo = yield obtenerGrupo(estudiante)
        const paralelo = yield obtenerParaleloDeEstudiante(estudiante)
        socket.join(grupo._id)
        socket.join(paralelo._id)
        socket.to(grupo._id).emit('mi grupo', estudiante);
        socket.estudiante = estudiante
        socket.broadcast.emit('estudiante conectado', estudiante)
      }
    }, function(err) {
      console.log(err);
    })
    socket.on('disconnect', function() {
      socket.broadcast.emit('estudiante desconectado', socket.estudiante)
    })
    socket.on('parar leccion', function() {
      // boton para terminar la leccion
    })
  })
}

module.exports = realtime
//console.log(prettyjson.render(io.nsps['/profesor'].adapter.rooms));

// namespaces, un namespace por leccion?
// namespaces estudiante, /codigo, /leccion
// /codigo => data la coneccion, setear el _id, verificar cofigo correcto,
// /leccion => operaciones de la leccion con el profesor
// rooms, un room por cada grupo conectado

function mongoSession(cook) {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, function(err, db) {
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

function obtenerGrupo(_estudiante) {
  return new Promise((resolve, reject) => {
    GrupoModel.obtenerGrupoDeEstudiante(_estudiante._id, (err, grupo) => {
      if (err) return reject(err)
      if (!grupo) return resolve('no existe en grupo')
      return resolve(grupo)
    })
  })
}

function obtenerCook(cookie_socket) {
  var cookies = cookie.parse(cookie_socket);
  var cook = cookies['connect.sid'].split('.').filter((ele,index) => index == 0)[0].split(':')[1]
  return cook
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

function obtenerParaleloProfesor(_id, callback) {
    ParaleloModel.obtenerParalelosProfesor(_id, (err, paralelos) => {
      let para = paralelos.find(paralelo => paralelo.dandoLeccion)
      if (err) return callback(null)
      callback(para)
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

function obtenerLeccion(_id_leccion) {
  return new Promise((resolve, reject) => {
    LeccionModel.obtenerLeccion(_id_leccion, (err, leccion) => {
      if (err) return reject(err)
      if (!leccion) return reject('no se encontro leccion')
      return resolve(leccion)
    })
  })
}

function run(generator) {
  const iterator = generator()
  const iteration = iterator.next()
  const promise = iteration.value
  promise.then(x => {
    const anotherIterator = iterator.next(x)
    const anotherPromise = anotherIterator.value
    anotherPromise.then(y => iterator.next(y))
  })
}

/*

  // estudiantes en la pagina ingresar codigo
  var no_codigo = io.of('/no_codigo');
  no_codigo.on('connection', function(socket){
    var cook = obtenerCook(socket.request.headers.cookie)
    const obtenerEstudiante = function (_usuario_cookie) {
      return new Promise((resolve, reject) => {
        EstudianteModel.obtenerEstudiantePorCorreo(_usuario_cookie.correo, (err, estudiante) => {
          if (err) return reject(err)
          if (!estudiante) {
            // socket.profesor = true
            // return resolve(false)
          }
          socket.estudiante = estudiante;
          socket.broadcast.emit('estudiante tratando ingresar', estudiante)
          resolve(estudiante)
        })
      })
    }
    mongoSession(cook)
      .then(obtenerEstudiante)
      .then(obtenerGrupo)
      .then(res => {
          console.log(`${res}`)
          socket.join(`${res._id}`);
          io.to(`${res._id}`).emit('some event');
        })
      .catch(err => console.log(err))
  });

  // estudiantes conectados
  var tomando_leccion = io.of('/tomando_leccion');
  var estudiantes_conectados = []
  tomando_leccion.on('connection', function(socket) {
    var cook = obtenerCook(socket.request.headers.cookie)
    const obtenerEstudiante = function (_usuario_cookie) {
      return new Promise((resolve, reject) => {
        EstudianteModel.obtenerEstudiantePorCorreo(_usuario_cookie.correo, (err, estudiante) => {
          if (err) return reject(err)
          if (!estudiante) {
            socket.profesor = true
            return resolve(false)
          }
          socket.estudiante = estudiante;
          socket.broadcast.emit('estudiante conectado', estudiante)
          resolve(estudiante)
        })
      })
    }

      mongoSession(cook)
        .then(obtenerEstudiante)
        .then(obtenerGrupo)
        .then(res => {
          console.log('curso')
          socket.join(res._id) // anadir a estudiante al room de su grupo
          console.log(`${res}`)
        })
        .catch(err => console.log(err))
    socket.on('disconnect', function() {
      socket.broadcast.emit('estudiante desconectado', socket.estudiante)
    })
  })
  tomando_leccion.on('hola', function(data) {
    console.log(data)
  })
  //io.to('some room').emit('some event'); , leave
  /*
  io.on('connection', function(socket){
    socket.on('say to someone', function(id, msg){
      socket.broadcast.to(id).emit('my message', msg);
    });
  });
   */
