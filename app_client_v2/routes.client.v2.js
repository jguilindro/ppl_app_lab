const path = require('path')
const express = require('express')
const CASAuthentication = require('cas-authentication')

module.exports = (app) => {
  // CAS configuration
  const URL_ESPOL_SERVER = 'http://ppl-assessment.espol.edu.ec'
  const URL_LOCALHOST = `http://localhost:${process.env.PORT || 8000}`
  let SERVICE_URL = ''
  if (process.env.NODE_ENV === 'production') {
    SERVICE_URL = URL_ESPOL_SERVER
  } else if (process.env.NODE_ENV === 'production:test') {
    SERVICE_URL = URL_LOCALHOST
  }
  const cas = new CASAuthentication({
    cas_url: 'https://auth.espol.edu.ec',
    service_url: SERVICE_URL,
    cas_version: '2.0',
    is_dev_mode: false,
    session_name: 'cas_user',
    session_info: 'cas_userinfo',
    destroy_session: true,
  })

  if (process.env.NODE_ENV === 'development') {
    app.use('/', function(req, res, next) {
      next()
    } ,
      express.static(path.join(__dirname, 'varios/login')))
  } else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'cas') {
    app.get('/', cas.bounce, (req, res) => {
      // buscar es usuario en la base de datos, determinar si es admin, profesor, estudiante
      // guardarlo si es que existe, else redireccionarlo a que no esta autorizado
      // req.session.save((err) => {
      //   if (err) {
      //     res.redirect('/')
      //   } else {
      //     res.redirect('/profesores')
      //   }
      // })
    })
  }

  app.use('/profesores', express.static(path.join(__dirname, 'profesores/dist')))
  app.use('/estudiantes', express.static(path.join(__dirname, 'estudiantes/dist')))
  app.use('/no_autorizado', express.static(path.join(__dirname, 'varios/no_autorizado')))
}
