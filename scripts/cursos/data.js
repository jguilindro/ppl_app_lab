const csv = require('csv')
require('../../app_api/models/db')
const fs = require('fs')
const path = require('path')
var jsonfile = require('jsonfile')
var file = '/tmp/data.json'
var cursos = []
var profesores = []
var estudiantes = []
var url = require('../../app_api/utils/change_database').session();
var MongoClient = require('mongodb').MongoClient
var EstudianteModel = require('../../app_api/models/estudiante.model')
var estudiante = {
  matricula: '',
  nombres: '',
  correo: '',
  apellidos: '',
  genero: '',
  paralelo: '',
  diasClase: '',
}
fs.readFile(path.join(__dirname, 'fake.csv'), function(err ,data){
  if (err) return console.log(err)
  var textChunk = data.toString('utf8');
  csv.parse(textChunk, function(err, output){
    estudiantes = output.map( (actual,dato) => {
      //console.log(actual)
      nombres_full = actual[3].split(' ')
      nombres = `${nombres_full[2] || ''} ${nombres_full[3] || ''}`
      apellidos = `${nombres_full[0] || ''} ${nombres_full[1] || ''}`
      paralelo = actual[5].split(':')
      nombre_paralelo = paralelo[0]
      profesor = ''
      horario = ''
      if (paralelo[1]) {
        profesor = paralelo[1].split('-')[3].trim()
      }
      genero = actual[4].toLowerCase()
      if (genero != 'masculino' || genero!= 'femenino') {
        genero = 'masculino'
      }
      return {
        matricula: actual[1],
        nombres: nombres,
        apellidos: apellidos,
        genero: genero,
        correo: `${actual[2]}@espol.edu.ec`,
      }
    },[]))
    // jsonfile.writeFile('estudiantes.json', estudiantes, function (err) {
    //   //console.error(err)
    // })
    estudiante_nuevo = estudiantes.map((actual,dato) => {
      let estudiante = new EstudianteModel({
        nombres: actual.nombres,
        apellidos: actual.apellidos,
        genero: actual.generos,
        correo: actual.correo,
        matricula: actual.matricula
      })
      estudiante.crearEstudiante((err) => {
        if (err) console.log(err)
      })
      return estudiante
    }, [])
  });
})
