const mongoose = require('mongoose');
const dbURL = require('../config/main');
mongoose.connect(require('../utils/change_database').local());
const db = mongoose.connection;

db.on('error', function(err) {
  console.log(`error ${err}`);
})

db.on('disconnected', function() {
  console.log(`base de datos desconectada`);
})

const soap = require('soap'),
logger     = require('tracer').console(),
co         = require('co'),
cheerio    = require('cheerio');

const ProfesorModel = require('../models/profesor.model.js');
const EstudianteModel = require('../models/estudiante.model.js');
const ParaleloModel = require('../models/paralelo.model.js');

const url = 'https://ws.espol.edu.ec/saac/wsPPL.asmx?WSDL';

const ANIO = '2017'
const TERMINO = '1s'
const PARALELOS = ['FISG1002', 'FISG1003']

var argumentosProfesores = {
  anio: ANIO, // 2017
  termino: TERMINO, // [1s,2s]
  codigomateria: '', // [FISG1002, FISG1003]
  paralelo: '', // [1,2,3 ....]
  tipo: '' // [0,1] 0 profesor titular, 1 profesor peer
}

// objeto base de profesor entregada por el soap
var profesor = {
  nombres: '',
  apellidos: '',
  paralelo: '',
  codigoMateria: '', // formato FISG1002
  nombreMateria: '', // formato Fisica II
}

soap.createClient(url, function(err, client) {
  const wsConsultaProfesores = function(_argumentosProfesores) {
    return new Promise((resolve, reject) => {
      client.wsConsultaProfesores(_argumentosProfesores, function(err, result, raw) {
        if (err) {
          logger.error('Error al cargar la web service profesores', err)
          return reject('error')
        }
        let $ = cheerio.load(raw)
        let nombres = $('NOMBRES').text().trim()
        let apellidos = $('APELLIDOS').text().trim()
        let paralelo = $('PARALELO').text().trim()
        let codigoMateria = $('CODIGOMATERIA').text().trim()
        let nombreMateria = $('NOMBRE').text().trim()
        profesor = { nombres, apellidos, paralelo, codigoMateria, nombreMateria }
        if (profesor.nombres) {
          return resolve(profesor)
        } else {
          return resolve(false)
        }
      })
    })
  }

    // peers
    // VALIDACIONES: si no existe agregarlo, si existe no agregarlo, si fue titular cambiarlo a peer
  })

});


function anadirProfesorAParalelo(id_paralelo, id_profesor) {
  ParaleloModel.anadirProfesorAParalelo(id_paralelo, id_profesor, function(err, res) {
    if (err) return console.log('error');
  })
}

function anadirEstudianteAParalelo(id_paralelo, id_estudiante) {

}

function verificarProfesorExiste(id_correo) {

}

function cambiarProfesorTipo(id_profesor, tipo) {

}
