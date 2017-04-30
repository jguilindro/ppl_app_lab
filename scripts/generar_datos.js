var util = require('../app_api/ws/utils.ws.js')
var jsonfile = require('jsonfile')

var path = require('path')
util.estudiantesWS(estudiantes => {
  var obj = estudiantes
  var file = path.join(__dirname, './tmp/estudiantes.json')
  jsonfile.writeFile(file, obj, function (err) {
    console.error(err)
  })
})

util.profesoresWS((profes, peers) => {
  var file = path.join(__dirname, './tmp/profesores.json')
  jsonfile.writeFile(file, profes, function (err) {
    console.error(err)
  })
  var file = path.join(__dirname, './tmp/peers.json')
  jsonfile.writeFile(file, peers, function (err) {
    console.error(err)
  })
})

util.paralelosWS(paralelos => {
  var file = path.join(__dirname, './tmp/paralelos.json')
  jsonfile.writeFile(file, paralelos, function (err) {
    console.error(err)
  })
})
