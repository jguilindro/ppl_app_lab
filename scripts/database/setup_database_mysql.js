var mysql      = require('mysql')
var enviroment = process.env.NODE_ENV
var config = require('../../app_api/db/knexfile.js')[enviroment]
const chalk = require('chalk');
var connection = mysql.createConnection({
  host     : config.connection.host,
  user     : config.connection.user,
  password : config.connection.password
})
var config_tmp = JSON.parse(JSON.stringify(config))
delete(config_tmp.connection.database)
var knex = require('knex')(config_tmp)
connection.connect(function(err) {
  if (err) {
    console.error(chalk.red('Error coneccion MYSQL'))
    console.error(err)
    process.exit(1)
    return;
  }
   knex.raw(`DROP DATABASE IF EXISTS ${config.connection.database}`)
  .then(function() {
     knex.raw(`CREATE DATABASE ${config.connection.database}`).then(function() {
      console.log(chalk.green(`Creada base de datos ${config.connection.database}`))
      process.exit(0)
     })
   })
})