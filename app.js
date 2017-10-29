/* SERVER MODES
  production .- usado en el servidor
  development .- usado para desarrollo local
  testing .- usado para los test automaticos
  debug .- usar el chome inscpector
  cas .- test cas
*/

global.db = require('./databases').relationalDB
const express = require('express') // libreria routing
const path = require('path')
const cors = require('cors')
const morgan = require('morgan') // logging
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session) // guardar sessiones en mongo
const chalk = require('chalk')
const mongo = require('./databases')
const logger = require('./app_api/utils/logger')

const app = express()
const port = process.env.PORT || 8000
app.set('port', port)

app.use(cors())
app.use(cookieParser())

// conectarse a mongodb
if (process.env.NODE_ENV !== 'testing') {
  mongo.Mongo.Conectar()
    .then(() => {
      app.use(session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false,
        expire: 1 * 24 * 60 * 60,
        store: new MongoStore({
          url: process.env.MONGO_URL,
          ttl: 1 * 24 * 60 * 60,
        }),
      }))
      logger.info(chalk.green('Conectado a MONGODB'))
      return true
    })
    .catch(() => {
      logger.info(chalk.red('Error Conexion MONGODB'))
      throw new Error('Error Conexion MONGODB')
    })
}

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'cas') {
  app.use(morgan('tiny'))
}

// documentacion
app.use('/docs/code', express.static(path.join(__dirname, './docs/code/_book')))
app.use('/docs/api', express.static(path.join(__dirname, './docs/api')))
app.use('/reports', express.static(path.join(__dirname, './app_client/varios/reports')))
app.use('/coverage', express.static(path.join(__dirname, './app_client/varios/coverage')))

const server = require('http').Server(app)

// cliente app
const client = express()
require('./app_client/server.routes.client')(client)

// api app
const api = express()
require('./app_api/server.routes.api')(api)

// realtime app
const realtime = express()
const io = require('socket.io')(server, { pingInterval: 60000, pingTimeout: 120000 })
require('./app_realtime/server.routes.realtime')(realtime, io)

// definicion subapps
app.use('/', client)
app.use('/api', api)
app.use('/realtime', realtime)

module.exports = {
  app,
  server,
}
