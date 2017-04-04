const mongoose = require('mongoose');
const dbURL = require('../config/main');

mongoose.connect(dbURL.mlab);

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
