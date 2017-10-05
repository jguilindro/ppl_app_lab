const mongoose = require('mongoose');
const dbURL = require('../config/main');
// require('../config/main').mlab

mongoose.connect(require('../utils/change_database').local(), { useMongoClient: true });

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
