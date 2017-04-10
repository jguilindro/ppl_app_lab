var cookie = require('cookie');
var cookieParser = require('cookie-parser')
var MongoClient = require('mongodb').MongoClient
var url = require('../utils/change_database').session();
var EstudianteModel = require('../models/estudiante.model');
var GrupoModel = require('../models/grupo.model');

function realtime(io) {
  // estudiantes en la pagina ingresar codigo
  var no_codigo = io.of('/no_codigo');
  no_codigo.on('connection', function(socket){
    console.log('someone connected');
    socket.broadcast.emit('estudiante tratando ingresar', 'es')
  });

  // estudiantes conectados
  var tomado_leccion = io.of('/tomando_leccion');
  var estudiantes_conectados = []
  tomado_leccion.on('connection', function(socket) {
    var cookies = cookie.parse(socket.request.headers.cookie);
    var cook = cookies['connect.sid'].split('.').filter((ele,index) => index == 0)[0].split(':')[1]

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
          console.log(`${res}`)
          socket.join(`${res._id}`);
          io.to(`${res._id}`).emit('some event');
        })

      .catch(err => console.log(err))

    socket.on('disconnect', function() {
      socket.broadcast.emit('estudiante desconectado', socket.estudiante)
    })
  })
}

module.exports = realtime


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
    if (!_estudiante) return resolve('no es estudiante')
    GrupoModel.obtenerGrupoDeEstudiante(_estudiante._id, (err, grupo) => {
      if (err) return reject(err)
      if (!grupo) return resolve('no existe en grupo')
      resolve(grupo)
    })
  })
}
