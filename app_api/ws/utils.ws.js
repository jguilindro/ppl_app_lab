const soap = require('soap'),
logger     = require('tracer').console(),
co         = require('co'),
cheerio    = require('cheerio');

const EstudianteModel = require('../models/estudiante.model');
const ParaleloModel   = require('../models/paralelo.model');

const url = 'https://ws.espol.edu.ec/saac/wsPPL.asmx?WSDL',
ANIO      = '2017',
TERMINO   = '1s',
PARALELOS = ['FISG1002', 'FISG1003'];

var argumentosEstudiantes = {
  anio: ANIO, // 2017
  termino: TERMINO, // [1s,2s]
  codigomateria: '', // [FISG1002, FISG1003]
  paralelo: '', // [1,2,3 ....]
}

var argumentosProfesores = {
  anio: ANIO, // 2017
  termino: TERMINO, // [1s,2s]
  codigomateria: '', // [FISG1002, FISG1003]
  paralelo: '', // [1,2,3 ....]
  tipo: '' // [0,1] 0 profesor titular, 1 profesor peer
}

/**
 * Obtener todos los estudiantes de la web service
 * @param [Function] Un callback
 * @return  Un array de estudiantes con el siguiente formato y null si da error
 * {
       nombres: '',
       apellidos: '',
       matricula: '', // matricula
       correo: '',
       paralelo: '',  // nombre
       codigomateria: '', // formato FISG1002  // codigo
       anio: ''
       termino: ''
    }
 */

 // objeto base creado a partir de leer el ws
var profesores_json = require('./profesores.json')
const estudiantesWS = function(callback) {
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
            let termino = TERMINO.split('')[0]
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
      callback(todos_estudiantes)
    }).catch(fail => {
      return callback(null)
    })
  })
}


/**
 * @return {nombres, apellidos, paralelo, codigomateria}
*/
// callback(profesores_titular, profesores_peers, paralelos)

/* Obtener los profesores titular y peers, pueden enviar profesores repetidos ya que pueden dar clase en varios cursos
 profesores_titular = {nombres, apellidos, paralelo, codigo, nombremateria, anio, termino tipo: 'titular'}
 profesores_peers = {nombres, apellidos, paralelo, codigo, nombremateria, anio, termino, tipo: 'peer'}
 paralelos = { }
 */

const profesoresWS = function(callback) {
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
          let codigomateria = $('CODIGOMATERIA').text().trim()
          let nombremateria = $('NOMBRE').text().trim()
          let correo = nombres ? obtenerProfesorJsonPorNombres(nombres).correo : ''
          // let correo = ''
          let anio = ANIO
          let termino = TERMINO.split('')[0]
          profesor = { nombres, apellidos, paralelo, codigomateria, nombremateria, anio, termino, correo}
          if (profesor.nombres) {
            return resolve(profesor)
          } else {
            return resolve(false)
          }
        })
      })
    }

    co(function *() {
      var profesores_titular = []
      var profesores_peers = []

      /* profesores titular */
      for (var i = 0; i < PARALELOS.length; i++) {
        argumentosProfesores.tipo = 0
        argumentosProfesores.codigomateria = PARALELOS[i]
        argumentosProfesores.paralelo = 1
        while (true) {
          var profe = yield wsConsultaProfesores(argumentosProfesores)
          argumentosProfesores.paralelo = argumentosProfesores.paralelo + 1;
          if (!profe) {
            break
          }
          if (profe) {
            profe.tipo = 'titular'
            profesores_titular.push(profe)
          }
        }
      }

      /*peers*/
      argumentosProfesores.tipo = 1
      argumentosProfesores.paralelo = 1
      curso = 0
      while (true) {
        argumentosProfesores.codigomateria = PARALELOS[curso]
        var profe = yield wsConsultaProfesores(argumentosProfesores)
        ++argumentosProfesores.paralelo;
        if (!profe) {
          if ( (PARALELOS.length - 1) != curso) {
            ++curso
            argumentosProfesores.paralelo = 1
          } else {
            break
          }
        }
        if (profe) {
          profe.tipo = 'peer'
          profesores_peers.push(profe)
        }
      }
      callback(profesores_titular, profesores_peers)
    })
  })
}

/**
 * Devuelve los paralelos de la ws service
 * @param  {Function} callback
 * @return { codido, nombremateria, paralelo, anio, termino }
 */
const paralelosWS = function(callback) {
  profesoresWS(function(paralelos) {
    var paralelos_return = []
    for (var i = 0; i < paralelos.length; i++) {
      var c = paralelos[i]
      paralelos_return.push({
        codigo: c.codigomateria,
        nombremateria: c.nombremateria,
        paralelo: c.paralelo,
        anio: ANIO,
        termino: TERMINO.split('')[0],
      })
    }
    callback(paralelos_return)
  })
}

const estudiantesDB = function(callback) {
  co(function* () {
    var paralelos = yield obtenerTodosParalelos()
    var estudiantes = []
    for (var i = 0; i < paralelos.length; i++) {
      var paralelo_temp = paralelos[i]
      for (var j = 0; j < paralelos[i].estudiantes.length; j++) {
        let estudiante_encontrado = paralelos[i].estudiantes[j]
        let estudiante = yield obtenerEstudiante(estudiante_encontrado)
        estudiantes.push({
          nombres: estudiante.nombres,
          apellidos: estudiante.apellidos,
          matricula: estudiante.matricula,
          correo: estudiante.correo,
          paralelo: paralelo_temp.nombre,
          codigomateria: paralelo_temp.codigo,
          anio: paralelo_temp.anio,
          termino: paralelo_temp.termino
        })
      }
    }
    callback(estudiantes)
  })
}

function obtenerEstudiante(id_estudiante) {
  return new Promise((resolve, reject) => {
    EstudianteModel.obtenerEstudianteNoPopulate(id_estudiante,(err, estudiantes) => {
      if (err) {
        logger.error('Error al obtener todos los estudiantes', err)
        resolve(null)
      }
      resolve(estudiantes)
    })
  })
}

function obtenerTodosParalelos() {
  return new Promise((resolve, reject) => {
    ParaleloModel.obtenerTodosParalelos((err, paralelos) => {
      if (err) {
        logger.error('Error al obtener todos los paralelos', err)
        return resolve(null)
      }
      resolve(paralelos)
    })
  })
}

function obtenerParaleloDeEstudiante(id_estudiante) {
  return new Promise((resolve, reject) => {
    ParaleloModel.obtenerParaleloDeEstudiante((err, paralelo) => {
      if (err) {
        logger.error('Error al encontrar paralelo', err)
        return resolve(null)
      }
      resolve(paralelo)
    })
  })
}

function obtenerProfesorJsonPorNombres(nombres) {
  return profesores_json.find(profe => {
    if (profe.nombres == nombres)
      return profe
  })
}

module.exports = {
  estudiantesWS,
  profesoresWS,
  paralelosWS,
  estudiantesDB,
}
