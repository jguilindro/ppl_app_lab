var cookie = require('cookie');
var cookieParser = require('cookie-parser')
var MongoClient = require('mongodb').MongoClient
var url = require('../utils/change_database').session();
var EstudianteModel = require('../models/estudiante.model');
var GrupoModel = require('../models/grupo.model');

function realtime(io) {
  var estudiantes_conectados = []
  io.on('connection', function(socket) {

    var cookies = cookie.parse(socket.request.headers.cookie);
    var cook = cookies['connect.sid'].split('.').filter((ele,index) => index == 0)[0].split(':')[1]

    var mongoSession = function() {
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

    var obtenerEstudiante = function(_usuario_cookie) {
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

    var obtenerGrupo = function(_estudiante) {
      return new Promise((resolve, reject) => {
        if (!_estudiante) return resolve('no es estudiante')
        GrupoModel.obtenerGrupoDeEstudiante(_estudiante._id, (err, grupo) => {
          if (err) return reject(err)
          if (!grupo) return resolve('no existe en grupo')
          resolve(grupo)
        })
      })
    }

    mongoSession()
      .then(obtenerEstudiante)
      .then(obtenerGrupo)
      .then(res => console.log(`${res}`))
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
