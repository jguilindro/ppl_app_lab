var mysql      = require('mysql')
var enviroment = process.env.NODE_ENV
var config = require('./knexfile.js')[enviroment]
var connection = mysql.createConnection({
  host     : config.connection.host,
  user     : config.connection.user,
  password : config.connection.password,
  database : config.connection.database
})

let knex = null
const Conectar = () => {
  return new Promise((resolve) => {
    connection.connect(function(err) {
      if (err) {
        console.error(`Error conexión ${config.client.toUpperCase()}`)
        console.log(err)
        process.exit(1)
      } else {
        if (process.env.NODE_ENV !== 'testing')
          console.log(`Conectado a ${config.client.toUpperCase()}`)
        knex = require('knex')(config)
        resolve(connection)
      }
    })
  })
}

const Desconectar = () => {
  return new Promise((resolve) => {
    resolve(connection.end())
  })
}

const Crear = () => {
  let connection = mysql.createConnection({
    host     : config.connection.host,
    user     : config.connection.user,
    password : config.connection.password
  })
  let config_tmp = JSON.parse(JSON.stringify(config))
  delete(config_tmp.connection.database)
  let knex = require('knex')(config_tmp)
  return new Promise((resolve) => {
    connection.connect(function(err) {
    if (err) {
        console.error('Error coneccion MYSQL')
        console.error(err)
        process.exit(1)
      }
      knex.raw(`DROP DATABASE IF EXISTS ${config.connection.database}`)
      .then(function() {
        knex.raw(`CREATE DATABASE ${config.connection.database}`).then(function() {
          if (process.env.NODE_ENV !== 'testing')
            console.log(`Creada base de datos ${config.connection.database}`)
          resolve(true)
        })
      })
    })
  })
}

const Limpiar = () => {

}

module.exports = {
  Conectar,
  Desconectar,
  Limpiar,
  knex,
  Crear
}




