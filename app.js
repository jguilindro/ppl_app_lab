if (process.env.NODE_ENV == 'production') { // FIXME: borrarlo y hacerlo con varibles de entorno
  require('dotenv').config()
}

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const cors = require('cors')
const compression = require('compression')
const MongoClient = require('mongodb').MongoClient
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const morgan = require('morgan')

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

const io = require('socket.io')(server, {'pingInterval': 60000, 'pingTimeout': 120000})
require('./app_api/realtime/realtime')(io)

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(compression())
app.use(favicon(path.join(__dirname, 'public', 'img/favicon.ico')))
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/scripts', express.static(__dirname + '/node_modules/'))
app.use(cookieParser())
app.use(session({
  secret: process.env.SECRET,
  resave: true,
  expire: 1 * 24 * 60 * 60 ,
  saveUninitialized: true,
  store: new MongoStore({
      url: process.env.MONGO_URL,
      ttl: 12 * 60 * 60
    })
}))

// api version 1
const api = express()
require('./app_api/routes.api')(api)
app.use('/api', api)

if (process.env.NODE_ENV != 'production') {
  global.db = require('./databases').relationalDB
  
  // api version 2
  const apiV2 = express()
  require('./app_api_v2/routes.api.v2')(apiV2)
  app.use('/api/v2', apiV2)
}

const realtime = express()
require('./app_realtime/routes.realtime')(realtime, io)
app.use('/realtime', realtime)

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