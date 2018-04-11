const EstudianteModel = require('../models/estudiante.model')
const ProfesorModel = require('../models/profesor.model')
const respuesta = require('../utils/responses')

function loginDev(req, res) {
  let correo = ''
  if (req.body.correo.split('@').length != 2) {
    correo = `${req.body.correo}@espol.edu.ec`
  } else {
    correo = req.body.correo
  }
  let estudiante = new Promise(( resolve, reject ) => {
    EstudianteModel.obtenerEstudiantePorCorreo(correo, ( err, estudiante ) => {
      if ( err ) return reject('error')
      if ( !estudiante ) return resolve(false)
      req.session.privilegios = 'estudiante'
      req.session.correo = correo
      req.session._id = estudiante._id
      req.session.login = true
      return resolve(true)
    })
  })

  let profesor = new Promise(( resolve, reject ) => {
    ProfesorModel.obtenerProfesorPorCorreo(correo, ( err, profesor ) => {
      if ( err ) return reject('error')
      if ( !profesor ) return resolve(false)
      req.session.privilegios = 'profesor'
      req.session.correo = correo
      req.session._id = profesor._id
      req.session.login = true
      return resolve(true)
    })
  })

  Promise.all([estudiante, profesor]).then(values => {
    if ( values[0] ) {
      return res.json({ estado: true, tipo: 'estudiante'})
    }
    if ( values[1] ) {
      return res.json({ estado: true, tipo: 'profesor'})
    }
    return res.json({ estado: false})
  }, reason => {
    res.json({ estado: false})
  })
}

function login(req, res) {
  let correo = ''
  if (req.body.correo.split('@').length != 2) {
    correo = `${req.body.correo}@espol.edu.ec`
  } else {
    correo = req.body.correo
  }
  let estudiante = new Promise(( resolve, reject ) => {
    EstudianteModel.obtenerEstudiantePorCorreo(correo, ( err, estudiante ) => {
      if ( err ) return reject('error')
      if ( !estudiante ) return resolve(false)
      req.session.privilegios = 'estudiante'
      req.session.correo = correo
      req.session._id = estudiante._id
      req.session.login = true
      return resolve(true)
    })
  })

  let profesor = new Promise(( resolve, reject ) => {
    ProfesorModel.obtenerProfesorPorCorreo(correo, ( err, profesor ) => {
      if ( err ) return reject('error')
      if ( !profesor ) return resolve(false)
      req.session.privilegios = 'profesor'
      req.session.correo = correo
      req.session._id = profesor._id
      req.session.login = true
      return resolve(true)
    })
  })

  Promise.all([estudiante, profesor]).then(values => {
    if ( values[0] ) {
      return res.redirect('/estudiantes')
    }
    if ( values[1] ) {
      return res.redirect('/profesores')
    }
    return res.redirect('/')
  }, reason => {
    res.redirect('/')
  })
}

function logout( req, res ) {
  req.session.destroy(function( err ) {
		if ( err ) {
			console.log(err)
		}
    res.redirect('/')
	})
}

function obtenerUsuarioLoggeado(req, res) {
  if ( req.session.privilegios == 'profesor' ) {
    ProfesorModel.obtenerProfesorPorCorreo(req.session.correo, (err, profesor) => {
      if ( err ) return res.json({errorMensaje: 'error'})
      if ( !profesor ) return res.json({errorMensaje: 'profesor no encontrado'})
      return respuesta.ok(res, profesor)
    })
  } else if ( req.session.privilegios == 'estudiante' ) {
    EstudianteModel.obtenerEstudiantePorCorreo(req.session.correo, (err, estudiante) => {
      if ( err ) return res.json({errorMensaje: 'error'})
      if ( !estudiante ) return res.json({errorMensaje: 'profesor no encontrado'})
      return respuesta.ok(res, estudiante)
    })
  } else {
    return respuesta.noAutorizado(res)
  }
}

module.exports = {
  login,
  logout,
  obtenerUsuarioLoggeado,
  loginDev
}
