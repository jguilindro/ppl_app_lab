var json = require('./data.json')
var fs = require('fs')
var co = require('co')
var path = require('path')
// array de los path de los archivos a cambiar
// reemplazar todos por el cdn respectivo
var archivos = [
  path.join(__dirname, '../../app_client/estudiantes/leccion/index.html'),
  path.join(__dirname, '../../app_client/estudiantes/perfil/index.html'),
  path.join(__dirname, '../../app_client/estudiantes/tomar-leccion/index.html'),
  path.join(__dirname, '../../app_client/estudiantes/ver-leccion/index.html')
]
console.log(archivos);
co(function* () {
  for (var i = 0; i < archivos.length; i++) {
    archivos[i]
  }
})

function writeFile(someFile, aReemplazar, reemplazo) {
  return new Promise((resolve, reject) => {
    fs.readFile(someFile, 'utf8', function (err,data) {
      if (err) return reject(new Error('error al leer archivo'))
      var result = data.replace(/aReemplazar/g, reemplazo);
      for (var i = 0; i < json.length; i++) {
        var result = data.replace(json[i],)
      }
//       var str = "Visit Microsoft!";
// var res = str.replace("Microsoft", "W3Schools");
// var res = str.replace(/blue|house|car/gi, function myFunction(x){return x.toUpperCase();});
      fs.writeFile(someFile, result, 'utf8', function (err) {
        if (err) return reject(new Error('error al escribir archivo'))
        return resolve(true)
      });
    });
  })
}
