var path = require('path')
var express = require('express')
var CASAuthentication = require('cas-authentication')

module.exports = function (app) {
  // CAS configuration
  const URL_ESPOL_SERVER = 'http://ppl-assessment.espol.edu.ec'
  const URL_LOCALHOST = `http://localhost:${process.env.PORT || 8000}`
  var SERVICE_URL = ''
  if (process.env.NODE_ENV === 'production') {
    SERVICE_URL = URL_ESPOL_SERVER
  } else if (process.env.NODE_ENV === 'production:test') {
    SERVICE_URL = URL_LOCALHOST
  }
  var cas = new CASAuthentication({
    cas_url      : 'https://auth.espol.edu.ec',
    service_url  : SERVICE_URL,
    cas_version  : '2.0',
    is_dev_mode  : false,
    session_name : 'cas_user',
    session_info : 'cas_userinfo',
    destroy_session: true
  });

  if (process.env.NODE_ENV === 'development') {
    app.use('/', express.static(path.join(__dirname, 'varios/login')));
  } else if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'production:test') {
    if (process.env.NODE_ENV === 'production:test') {
    }
    app.get('/', cas.bounce, function(req, res) {
      // buscar es usuario en la base de datos, determinar si es admin, profesor, estudiante
      // guardarlo si es que existe, else redireccionarlo a que no esta autorizado
      req.session.save(function(err) {
        if ( err ) {
          //res.redirect('/')
        } else {
          res.redirect('/profesores')
        }
      })
    });
  }

  app.use('/profesores', express.static(path.join(__dirname, 'profesores/dist')));
  // app.use('/estudiantes', express.static(path.join(__dirname, 'app_client/estudiantes/dist')));
  // app.use('/admin', express.static(path.join(__dirname, 'app_client/admin/dist')));
  // app.use('/no_autorizado', express.static(path.join(__dirname, 'app_client/varios/no_autorizado')));
  // app.get('/logout', cas.logout );
  // app.use('/*',  express.static(path.join(__dirname, 'varios/error')));

}