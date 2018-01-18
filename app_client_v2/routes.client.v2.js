const path = require('path')
const express = require('express')

module.exports = (app) => {
  // app.use('/profesores', express.static(path.join(__dirname, 'profesores/dist')))
  app.use('/estudiantes', express.static(path.join(__dirname, 'estudiantes/dist')))
  // app.use('/no_autorizado', express.static(path.join(__dirname, 'varios/no_autorizado')))
}
