const mongoose = require('mongoose');
const dbURL = require('../config/main');
// require('../config/main').mlab
let urlServidor = ''
if (process.env.NODE_ENV) {
  urlServidor = `mongodb://localhost/ppl_${process.env.NODE_ENV}`
} else if (require("os").userInfo().username === 'User'){
  urlServidor = 'mongodb://ppl:ppl@ds157499.mlab.com:57499/ppl_development'
} else {
  console.error('Error no escogio ninguna variable de entorno')
  process.exit(1)
}
mongoose.connect(urlServidor, { useMongoClient: true });

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
