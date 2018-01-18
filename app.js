if (process.env.NODE_ENV == 'production') { // FIXME: borrarlo y hacerlo con varibles de entorno
  require('dotenv').config()
}

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const cors  = require('cors')
const compression = require('compression')

process.on('uncaughtException', (err) => {
  console.error('Caught exception: ' + err)
  console.error(err.stack)
})

// base de datos mongo
require('./app_api/models/db')

// sync db y web service
//require('./app_api/ws').update()

const app = express()
const server = require('http').Server(app)
const PORT = process.env.PORT || '8000'

let io = require('socket.io')(server, {'pingInterval': 60000, 'pingTimeout': 120000})
require('./app_api/realtime/realtime')(io)

app.use(compression())
app.use(favicon(path.join(__dirname, 'public', 'img/favicon.ico')))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/scripts', express.static(__dirname + '/node_modules/'))

// api version 1
const api = express()
require('./app_api/routes.api')(api)
app.use('/api', api)

const apiV2 = express()
require('./app_api_v2/routes.api.v2')(apiV2)
app.use('/api/v2', apiV2)

// app client
const client = express()
require('./app_client/routes.client')(client)
app.use('/', client)

// error page
app.use(function(req, res, next) {
  var err = new Error('Url o metodo no valido')
  err.status = 404
  next(err)
})

app.set('port', PORT)

module.exports = {
  app,
  server
}