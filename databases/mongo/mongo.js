const mongoose = require('mongoose')
var conn
let Conectar = function(url) {
  return new Promise(function(resolve) {
      conn = mongoose.connect(url, { useMongoClient: true })
      const db = mongoose.connection
      db.on('error', function(err) {
        console.log(`error ${err}`)
      })

      db.on('connected', function() {
        if (process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'production')
          console.log(`base de datos conectada`)
      })

      db.on('disconnected', function() {
        if (process.env.NODE_ENV !== 'testing' && process.env.NODE_ENV !== 'production')
          console.log(`base de datos conectada`)
      })
      resolve(db)
  })
}

let Desconectar = function() {
   mongoose.connection.close()
}

let Limpiar = function() {
  return new Promise(function(resolve) {
    resolve(conn.connection.dropDatabase())
  })
}
module.exports = {
  Conectar,
  Desconectar,
  Limpiar
}