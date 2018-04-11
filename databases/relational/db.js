var mysql      = require('mysql')
var enviroment = process.env.NODE_ENV
var config = require('./knexfile.js')[enviroment]
var chalk = require('chalk')
var connection = mysql.createConnection({
  host     : config.connection.host,
  user     : config.connection.user,
  password : config.connection.password,
  database : config.connection.database
})

if (process.env.NODE_ENV !== 'testing') {
  connection.connect(function(err) {
    if (err) {
      console.error(chalk.red(`Error conexión ${config.client.toUpperCase()}`))
      console.log(err)
      // process.exit(1)
    }
    console.log(chalk.green(`Conectado a ${config.client.toUpperCase()}`))
  })
}
var knex = require('knex')(config)
module.exports = knex