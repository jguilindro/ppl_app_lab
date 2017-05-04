var desarroladores = require('../../app_api/ws/integrantes.json')
var profesores = require('../../app_api/ws/profesores.json')
var ProfesorModel = require('../../app_api/models/profesor.model.js')
var EstudianteModel = require('../../app_api/models/estudiante.model.js')
var ParaleloModel = require('../../app_api/models/paralelo.model.js')
var co = require('co')
const mongoose = require('mongoose');
const dbURL = 'mongodb://localhost/ppl-testing';
// require('../config/main').mlab
mongoose.connect(dbURL);

const db = mongoose.connection;

db.on('connected', function() {
  console.log(`base de datos conectada`);
})

db.on('error', function(err) {
  console.log(`error ${err}`);
})

db.on('disconnected', function() {
  console.log(`base de datos desconectada`);
})


co(function*() {
  var paralelo = new ParaleloModel({
    nombre: "1",
    nombreMateria: "FISG1002",
    codigo: "FISICA II",
    anio: "2017",
    termino: "1"
  })
  var paralelo_nuevo = yield crearParalelo(paralelo)
  for (var i = 0; i < desarroladores.length; i++) {
    let est = desarroladores[i]
    if (est.nombres == 'JOEL EDUARDO') {
      let profesor_nuevo = new ProfesorModel({
        nombres: est.nombres,
        apellidos: est.apellidos,
        correo: est.correo
      })
      var profr_creado = yield crearProfesor(profesor_nuevo)
      var para_nuevo = yield anadirProfesorAParalelo(paralelo_nuevo._id,profesor_nuevo._id)
      console.log(para_nuevo);
      continue
    }
    let estudiante_nuevo = new EstudianteModel({
      nombres: est.nombres,
      apellidos: est.apellidos,
      correo: est.correo
    })
    var est_creado = yield crearEstudiante(estudiante_nuevo)
    var anadido_paralelo = yield anadirEstudianteAParalelo(paralelo_nuevo._id, estudiante_nuevo._id)
  }
  for (var i = 0; i < profesores.length; i++) {
    let estudiante = profesores[i]
    let estudiante_nuevo = new EstudianteModel({
      nombres: estudiante.nombres,
      apellidos: estudiante.apellidos,
      correo: estudiante.correo
    })
    var est_creado = yield crearEstudiante(estudiante_nuevo)
    var anadido_paralelo = yield anadirEstudianteAParalelo(paralelo_nuevo._id, estudiante_nuevo._id)
  }
  console.log('estudiantes desarroladores, profesor y curso creado');
})


function crearParalelo(paralelo) {
  return new Promise((resolve, reject) => {
    paralelo.crearParalelo((err, res) => {
      if (err) return reject(new Error('No se pudo crear paralelo'))
      resolve(res)
    })
  })
}

function crearProfesor(profesor) {
  return new Promise((resolve, reject) => {
    profesor.crearProfesor((err, res) => {
      if (err) return reject(new Error('No se pudo crear paralelo'))
      resolve(res)
    })
  })
}

function anadirProfesorAParalelo(id_paralelo, id_profesor) {
  return new Promise((resolve, reject) => {
    ParaleloModel.anadirProfesorAParalelo(id_paralelo, id_profesor, (err ,res) =>{
      if (err) return reject(new Error('No se pudo anadir a profesor'))
      return resolve(true)
    })
  })
}

function crearEstudiante(estudiante) {
  return new Promise((resolve, reject) => {
    estudiante.crearEstudiante((err, res) => {
      if (err) return reject(new Error('No se pudo crear paralelo'))
      return resolve(true)
    })
  })
}

function anadirEstudianteAParalelo(id_paralelo, id_estudiante) {
  return new Promise((resolve, reject) => {
    ParaleloModel.anadirEstudianteAParalelo(id_paralelo, id_estudiante, (err, res) => {
      if (err) return reject(new Error('Error al anadir estudiante'))
      return resolve(true)
    })
  })
}
