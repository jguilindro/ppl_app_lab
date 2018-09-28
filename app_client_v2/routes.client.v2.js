const path = require('path')
const express = require('express')

function isLogin(req, res, next) {
  if (req.session && req.session.correo) {
    return next()
  } else {
    res.redirect('/')
  }
}

module.exports = (app) => {
  // app.use('/profesores', express.static(path.join(__dirname, 'profesores/dist')))
  app.use('/estudiantes', isLogin, express.static(path.join(__dirname, 'estudiantes/dist')))

  app.use('/profesores', isLogin, express.static(path.join(__dirname, 'profesores/dist')))
  // app.use('/no_autorizado', express.static(path.join(__dirname, 'varios/no_autorizado')))
}
