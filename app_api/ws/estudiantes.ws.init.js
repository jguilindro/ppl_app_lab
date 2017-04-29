const mongoose = require('mongoose');
const dbURL = require('../config/main');
mongoose.connect(require('../utils/change_database').local());
const db = mongoose.connection;

db.on('error', function(err) {
  console.log(`error ${err}`);
})

const soap = require('soap'),
logger     = require('tracer').console(),
co         = require('co'),
cheerio    = require('cheerio');

const EstudianteModel = require('../models/estudiante.model');
const ParaleloModel = require('../models/paralelo.model');

const url = 'https://ws.espol.edu.ec/saac/wsPPL.asmx?WSDL';

const ANIO = '2017'
const TERMINO = '1s'
const PARALELOS = ['FISG1002', 'FISG1003']

var argumentosEstudiantes = {
  anio: ANIO, // 2017
  termino: TERMINO, // [1s,2s]
  codigomateria: '', // [FISG1002, FISG1003]
  paralelo: '', // [1,2,3 ....]
}

// objeto base de estudiante entregada por el soap
var estudiante = {
  nombres: '',
  apellidos: '',
  matricula: '', // matricula
  email: '',
  paralelo: '',  // nombre
  codigomateria: '', // formato FISG1002  // codigo
  nombremateria: '', // formato Fisica II //nombreMateria
}

soap.createClient(url, function(err, client) {
  const wsConsultaEstudiantes = function(_argumentosEstudiantes) {
    return new Promise((resolve, reject) => {
      client.wsConsultaEstudiantes(_argumentosEstudiantes, function(err, result, raw) {
        if (err) return reject('error de consulta estudiante')
        let $ = cheerio.load(raw)
        var estudiantes_y_paralelo = []
        $('Estudiantes').each(function(index, elem) {
          var $this = $(this);
          let c = cheerio.load($.html($this))
          let nombres = c('NOMBRES').text().trim()
          let apellidos = c('APELLIDOS').text().trim()
          let matricula = c('COD_ESTUDIANTE').text().trim()
          let correo = c('EMAIL').text().trim()
          let paralelo = c('PARALELO').text().trim()
          let codigomateria  = c('COD_MATERIA_ACAD').text().trim()
          let anio = ANIO
          let termino = parseInt(TERMINO.split('')[0])
          let ext = { nombres, apellidos, matricula, correo, paralelo, codigomateria, anio, termino }
          estudiantes_y_paralelo.push(ext)
        })
        return resolve(estudiantes_y_paralelo)
      })
    })
  }

  co(function *() {
    var todos_estudiantes = []
    for (var i = 0; i < PARALELOS.length; i++) {
      argumentosEstudiantes.codigomateria = PARALELOS[i]
      argumentosEstudiantes.paralelo = 1
      while (true) {
        let estudiantes = yield wsConsultaEstudiantes(argumentosEstudiantes)
        ++argumentosEstudiantes.paralelo
        if (!estudiantes.length) {
          break
        }
        todos_estudiantes = [...todos_estudiantes, ...estudiantes]
      }
    }
    var cantidadEstudiantes = todos_estudiantes.length
    for (var i = 0; i < cantidadEstudiantes; i++) {
      let estudiante = todos_estudiantes[i]
      var paralelo = yield buscarParalelo(estudiante.paralelo, estudiante.codigomateria, estudiante.anio, estudiante.termino)
      let estudiante_nuevo = new EstudianteModel({
        nombres:  estudiante.nombres,
        apellidos: estudiante.apellidos,
        matricula: estudiante.matricula,
        correo: estudiante.correo,
      })
      let estudiante_anadido = yield crearEstudianteYAnadirloAParalelo(paralelo._id,estudiante_nuevo)
    }
    console.log('terminado de crear todos');
    mongoose.connection.close()
  })
})


function buscarParalelo(paralelo, codigomateria, anio, termino) {
  return new Promise((resolve, reject) => {
    ParaleloModel.obtenerParaleloWebService(paralelo, codigomateria, anio, termino, (err, res) => {
      if (err) resolve(null)
      return resolve(res)
    })
  })
}

function crearEstudianteYAnadirloAParalelo(id_paralelo, estudiante_nuevo) {
  return new Promise((resolve, reject) => {
    estudiante_nuevo.crearEstudiante((err, res) => {
      if (err) logger.error('Error al crear estudiante', err)
      ParaleloModel.anadirEstudianteAParalelo(id_paralelo,estudiante_nuevo._id, (err, res) => {
        if (err) logger.error('Error al anadir estudiante a paralelo', err)
        resolve(true)
      })
    })
  })
}


// VALIDACIONES
// Si el estudiante ya existe, es decir, si ya tomo la materia y esta repitiendo
