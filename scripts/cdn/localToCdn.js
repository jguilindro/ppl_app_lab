var json = require('./data.json')
var fs = require('fs')
var co = require('co')
var path = require('path')
var child_process = require('child_process')
// array de los path de los archivos a cambiar
// reemplazar todos por el cdn respectivo
var archivos = [
  //path.join(__dirname, '../../app_client/estudiantes/perfil/index.html'),
  //path.join(__dirname, '../../app_client/estudiantes/leccion/index.html'),
  path.join(__dirname, '../../app_client/estudiantes/tomar-leccion/index.html'),
  // path.join(__dirname, '../../app_client/estudiantes/ver-leccion/index.html')
]
co(function* () {
  for (var i = 0; i < archivos.length; i++) {
    archivos[i]
    for (var j = 0; j < json.locales.length; j++) {
      var hecho = yield writeFile(archivos[i], json.locales[j].link, json.cdn[j].link)
      child_process.execSync("sleep 0.2");
      // if (j == 4) {
      //   break
      // }
    }
  }
})

function writeFile(someFile, aReemplazar, reemplazo) {
  return new Promise((resolve, reject) => {
    fs.readFile(someFile, 'utf8', function (err,data) {
      if (err) return reject(new Error('error al leer archivo'))
      var result = data.replace(aReemplazar, reemplazo);
      resolve(true)
      if (result) {
        fs.writeFile(someFile, result, 'utf8', function (err) {
          if (err) return reject(new Error('error al escribir archivo'))
          return resolve(true)
        });
      } else {
        resolve(true)
      }
    });
  })
}
