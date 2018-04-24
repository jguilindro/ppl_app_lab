const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cookieParser = require('cookie-parser')
const session = require('express-session')
const path = require('path')
const server = require('http').Server(app)
const PORT = process.env.PORT || '8000'

app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  saveUninitialized: true
}))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

const apiEstudiantes = express()
require('./estudiantes/estudiantes.routes')(apiEstudiantes)
app.use('/v2/api/estudiantes', apiEstudiantes)

const apiProfesores = express()
require('./profesores/profesores.routes')(apiProfesores)
app.use('/v2/api/profesores', apiProfesores)

const apiAdmin = express()
require('./admin/admin.routes')(apiAdmin)
app.use('/v2/api/admin', apiAdmin)

app.set('port', PORT)
module.exports = {
  app,
  server
}