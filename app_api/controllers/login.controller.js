// Por facilidad que hicieron llamadas a la base de datos desde aqui y no desde el modelo
// solo en este caso se uso

var db = require('../db/db')
var responses = require('../utils/responses')

function login(req, res, next) {
  const correo = `${req.body.cas_user.toLowerCase()}@espol.edu.ec`

  let estudiante = new Promise(( resolve, reject ) => {
    db.select().from('estudiantes').where({correo: correo}).first('correo', 'nombres', 'apellidos').then(function(estudiante, err) {
      if (err) {
        return reject(err)
      }
      if (estudiante) {
        req.session.correo = correo
        req.session.privilegios = 'estudiante'
        req.session.save(function(err) {
          if (err) {
            return reject(err)
          }
          return resolve(estudiante) 
        })
      } else {
        return resolve(false)
      }
    })
  })

  let profesor = new Promise(( resolve, reject ) => {
    db.select().from('profesores').where({correo: correo}).first('correo', 'nombres', 'apellidos').then(function(profesor, err) {
      if (err) {
        return reject(err)
      }
      if (profesor) {
        req.session.correo = correo
        req.session.privilegios = 'profesor'
        req.session.save(function(err) {
          if (err) {
            return reject(err)
          }
          return resolve(profesor) 
        })
      } else {
        return resolve(false)
      }
    })
  })

  let admin = new Promise(( resolve, reject ) => {
    db.select().from('admin').where({correo: correo}).first('correo', 'nombres', 'apellidos').then(function(admin, err) {
      if (err) {
        return reject(err)
        
      }
      if (admin) {
        req.session.correo = correo
        req.session.privilegios = 'admin'
        req.session.save(function(err) {
          if (err) {
            return reject(err)
          }
          return resolve(admin) 
        })
      } else {
        return resolve(false)
      }
    })
  })

  Promise.all([estudiante, profesor, admin]).then(values => {
    if ( values[0] ) {
      return responses.ok(res,values[0])
    }
    if ( values[1] ) {
      return responses.ok(res,values[1])
    }
    if ( values[2] ) {
      return responses.ok(res,values[2])
    }
    return responses.noAutorizado(res)
  }, reason => {
    return responses.serverError(res)
  })
}

function logout(req, res) {
  req.session.destroy(function( err ) {
    if ( err ) {
      res.send(false)
    } else {
      res.send(true)
    }
  })
}

module.exports = {
  login,
  logout
}