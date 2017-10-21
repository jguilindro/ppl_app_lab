var mysql      = require('mysql')
var enviroment = process.env.NODE_ENV
var config = require('./knexfile.js')[enviroment]
var connection = mysql.createConnection({
  host     : config.connection.host,
  user     : config.connection.user,
  password : config.connection.password,
  database : config.connection.database
})

if (process.env.NODE_ENV !== 'testing') {
  connection.connect(function(err) {
    if (err) {
      console.error('Error coneccion MYSQL');
      console.log(err)
      process.exit(1)
      return;
    }
    console.log('Conectado a MYSQL');
  })
}
module.exports = require('knex')(config)