// TODO: hacer una copia de la base de datos de ppl con datos necesarios para usarlos como testing
// cargar estos datos para la base de datos
// realizar una prueba con estos datos para simular el uso en produccion de los mismos
process.on('uncaughtException', function(err) {
  logger.error('Caught exception: ' + err)
  logger.error(err.stack)
})
const mongo = require('../databases').Mongo
const co = require('co')
const moment       = require('moment')
const LeccionesRealtime = require('./schema')
const logger = require('../config/logger')
const assert = require('assert')
const MongoDB = require('./database')
async function ConectarMongo() {
  try {
    await 
    mongo.Conectar(process.env.MONGO_URL_TEST)
  } catch (err) {
    console.error(err)
    exit(1)
  }
}
let mongodb = MongoDB({ LeccionesRealtime, logger, co, moment })
describe('Databases', function() {
  before(function(done) {
    co(function *() {
      yield ConectarMongo()
      yield mongo.Limpiar()
      done()
    })
  })
  after(function(done) {
    mongo.Desconectar()
    done()
  })
  beforeEach(function () {
  })
  afterEach(function () {
  })
  it('guardar leccion en base de datos de leccion realtime', function(done) {
    co(function *() {
      let leccionDatos = {
        codigo: '1234567',
        paralelo: {
          _id: 1,
          nombre: '1',
          nombreMateria: 'Fisica 1'
        },
        grupos: [
          {
            _id: 'Hkcoa5w3-',
            nombre: 'Grupo 1',
            estudiantes: [
              {
                _id: 'BJxgRuOvenZ',
                nombres: 'JOHARA ELVIRA',
                apellidos: 'SARMIENTO TAPIA',
                matricula: '201501116',
                correo: 'johelsar@espol.edu.ec'
              },
              {
                _id: 'SJmeCudPl3W',
                nombres: 'ANTHONY DARIO',
                apellidos: 'HERNANDEZ TAMAYO',
                matricula: '201504309',
                correo: 'antdhern@espol.edu.ec'
              }
            ]
          },
          {
            _id: 'ryfyAcw2b',
            nombre: 'Grupo 2',
            estudiantes: [
              {
                _id: 'BJDeAd_vln-',
                nombres: 'BREW JONATHAN',
                apellidos: 'COBOS GRANDA',
                matricula: '201505975',
                correo: 'bjcobos@espol.edu.ec'
              }
            ]
          }
        ],
        leccion: {
          _id: 1,
          creador: {
            _id: 'abc',
            nombres: 'Joel Eduardo',
            apellidos: 'Rodriguez Llamuca',
            correo: 'joelerll@gmail.com'
          },
          nombre: 'Leccion 1',
          tiempoEstimado: 50, // tiempo en minutos
          tipo: 'taller'
        },
        moderadoresConectados: [],
        preguntas: [{
            _id: 'a',
            nombre: 'Pregunta 1',
            tiempoEstimado: 5,
            puntaje: 20,
            descripcion: 'Mi pregunta 1',
            subpreguntas: [
              {
                orden : 1,
                puntaje : "4",
                contenido: 'Mi subpregunta 1-1'
              },
              {
                orden : 2,
                puntaje : "5",
                contenido: 'Mi subpregunta 1-2'
              },
              {
                orden : 3,
                puntaje : "2",
                contenido: 'Mi subpregunta 1-3'
              }
            ],
            tipoPregunta: 'justificacion'
          },
          {
            _id: 'aa',
            nombre: 'Pregunta 2',
            tiempoEstimado: 1,
            puntaje: 10,
            descripcion: 'Mi pregunta 2',
            subpreguntas: [
              {
                orden : 1,
                puntaje : "3",
                contenido: 'Mi subpregunta 2-1'
              },
              {
                orden : 2,
                puntaje : "1",
                contenido: 'Mi subpregunta 2-2'
              }
            ],
            tipoPregunta: 'justificacion'
          }
        ],
        estudiantes: [
          {
            _id: 'BJxgRuOvenZ',
            nombres: 'JOHARA ELVIRA',
            apellidos: 'SARMIENTO TAPIA',
            matricula: '201501116',
            correo: 'johelsar@espol.edu.ec'
          },
          {
            _id: 'SJmeCudPl3W',
            nombres: 'ANTHONY DARIO',
            apellidos: 'HERNANDEZ TAMAYO',
            matricula: '201504309',
            correo: 'antdhern@espol.edu.ec'
          },
          {
            _id: 'BJDeAd_vln-',
            nombres: 'BREW JONATHAN',
            apellidos: 'COBOS GRANDA',
            matricula: '201505975',
            correo: 'bjcobos@espol.edu.ec'
          }
        ],
        estudiantesDandoLeccion: [],
        respuestas: [],
        fechaInicio: moment().toISOString(),
        aumentados: [],
        pausas: [],
        continuadas: [],
        estado: 'pendiente'
      }
      let codigo = yield mongodb.cacheLeccion({ leccionDatos })
      // assert.equal(estaCreada, true, 'Debe haber creado la leccionRealtime')
      let leccion = yield mongodb.obtenerLeccionPorCodigo({ codigo })
      assert.equal(codigo, leccion['codigo'], 'Debe haber creado el codigo de la leccion')
      done()
    }).catch(err => console.error(err))
  })
  it('tomar leccion', function(done) {
    let leccion = yield mongodb.obtenerLeccionPorCodigo({ codigo })
    let leccionId = leccion['_id']
  })
})