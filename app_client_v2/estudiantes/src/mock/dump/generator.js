const jsonfile = require('jsonfile')
var request = require('request').defaults({jar: true})
const Datastore = require('nedb')
const path = require('path')
const db = new Datastore({ filename: path.join(__dirname, 'data', 'ejemplo.json'), autoload: true })
const correoUsuario = 'leoismar@espol.edu.ec'
// db.insert([{ a: 5 }, { a: 42 }], function (err, newDocs) {
//   // Two documents were inserted in the database
//   // newDocs is an array with these documents, augmented with their _id
// });

const usuarioConectado = () => {
  return new Promise((resolve, reject) => {
    request({
    method: 'GET',
    url: 'http://localhost:8000/api/session/usuario_conectado'
    }, (err, httpResponse, body) => {
      jsonfile.writeFile(path.join(__dirname, 'data', 'usuarioDatos.json'), body, {spaces: 2}, function (err) {
      })
      resolve(body)
    })
  })
}

function lengthInUtf8Bytes(str) {
  var m = encodeURIComponent(str).match(/%[89ABab]/g);
  return str.length + (m ? m.length : 0);
}

function bytesToSize(bytes) {
   var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
   if (bytes == 0) return '0 Byte';
   var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
   return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
};


request({
  method: 'POST',
  url: 'http://localhost:8000/api/session/login/dev',
  form: { correo: correoUsuario }
  },
  async (err, httpResponse, body) => {
    console.log(body)
    let datosUsuario = await usuarioConectado()
    // console.log(bytesToSize(lengthInUtf8Bytes(JSON.stringify(datosUsuario))))
    console.log(datosUsuario)
  }
)
