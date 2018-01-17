var MongoClient = require('mongodb').MongoClient
let Conectar = function() {
    return new Promise(function(resolve, reject) {
          MongoClient.connect(process.env.MONGO_URL, function(err, db) {
          if (err) {
            reject(err)
          } else {
            resolve()
          }
        })
    })
}

module.exports = {
  Conectar
}