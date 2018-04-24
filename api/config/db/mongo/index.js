const mongoose = require('mongoose')

mongoose.Promise = Promise
var conn
var db
let Conectar = function(url) {
  return new Promise(function(resolve) {
    let options = {}
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'development:cas') {
      options = { autoIndex: false }
      db = mongoose.createConnection(url, options)
    } else {
      conn = mongoose.connect(url, options)
      db = mongoose.connection
    }
    // db = mongoose.connection
    db.on('error', function(err) {
      console.log(`error ${err}`)
    })

    db.on('connected', function() {
      if (process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'production')
        console.log(`base de datos conectada REALTIME`)
    })

    db.on('disconnected', function() {
      if (process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'production')
        console.log(`base de datos desconectada`)
    })
    resolve(db)
  })
}

let getDatabaseConnection = function() {
  return db
}

let Desconectar = function() {
   mongoose.connection.close()
}

let Limpiar = function() {
  return new Promise(function(resolve) {
    db.dropDatabase().then((resp) => {
      resolve(true)
    }).catch((err) => {
      console.log('Error en limpiar database')
      console.log(err)
      process.exit(1)
      // resolve(true)
    })
  })
}

module.exports = {
  Conectar,
  Desconectar,
  Limpiar,
  getDatabaseConnection
}
