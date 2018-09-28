process.on('uncaughtException', (err) => {
  console.error('Caught exception: ' + err)
  console.error(err.stack)
})

let urlServidor = ''
if (require("os").userInfo().username == 'User') { // usado para cuando estoy en el basar
  urlServidor = 'mongodb://ppl:ppl@ds157499.mlab.com:57499/ppl_development'
} else if (process.env.NODE_ENV){
  if (process.env.NODE_ENV === 'development:cas') {
    urlServidor = `mongodb://localhost/ppl_development`
  } else if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'production'){
    urlServidor = 'mongodb://localhost:443/ppl_development'
    // urlServidor = `mongodb://localhost/ppl_${process.env.NODE_ENV}`
  }
} else {
  console.error('Error no escogio ninguna variable de entorno')
  process.exit(1)
}

const express = require('express')
const path = require('path')
const favicon = require('serve-favicon')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const bodyParser = require('body-parser')
const morgan = require('morgan')
const CronJob = require('cron').CronJob
const app = express()
const server = require('http').Server(app)
const PORT = process.env.PORT || '8000'

const db = require('./databases/mongo/mongo')

// base de datos mongo
if (process.env.NODE_ENV !== 'testing') {
  db.Conectar(urlServidor)
  .then(() => {
    // const WSPPL = require('./web_service/index.js')
    // const dbWebService = require('./databases/webService.db')
    // const { exec } = require('child_process')
    // const rutaScriptBackup = path.join(__dirname, 'scripts', 'mongoBackup.sh')
    // if (process.env.NODE_ENV === 'production') {
    //   const wsPPL = WSPPL({ db: dbWebService, local: false })
    //   wsPPL.inicializar().then(() => {
    //     new CronJob('00 00 23 * * *', function() {
    //       exec(`sh ${rutaScriptBackup}`, function (error, stdout, stderr) {
    //         if (error) {
    //           console.error(error)
    //         } else {
    //           // wsPPL.actualizar()
    //         }
    //       })
    //     }, null, true, 'America/Guayaquil')
    //   }).catch((err) => {
    //     console.error('Erro en inicializar')
    //     console.error(err)
    //   })
    // } else {
    //   const dump = require('./web_service/dump')
    //   const wsPPL = WSPPL({ db: dbWebService, anio: '2018', termino: '1s', local: false, dump })
    //   wsPPL.inicializar().then((resp) => {
    //     // exec(`sh ${rutaScriptBackup}`, function (error, stdout, stderr) {
    //     //   if (error) {
    //     //     console.log(error)
    //     //   } else {
    //     //     wsPPL.actualizar()
    //     //   }
    //     // })
    //   }).catch((err) => {
    //     console.error('Erro en inicializar')
    //     console.error(err)
    //   })
    // }
  })
  .catch((err) => {
    console.error(err)
    console.error('Error en mongo')
    process.exit(1)
  })
}

const io = require('socket.io')(server, {'pingInterval': 60000, 'pingTimeout': 120000})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(favicon(path.join(__dirname, 'public', 'img/favicon.ico')))
app.use(express.static(path.join(__dirname, 'public')))
app.use('/scripts', express.static(__dirname + '/node_modules/'))
app.use(morgan('tiny'))
app.use(cookieParser())

if (process.env.NODE_ENV !== 'production' || process.env.NODE_ENV === 'development:cas') { // se hace esto para aumentar el tiempo de respuesta. Se usara solo en development
  app.use(session({                         // debido a que siempre se reinicia el servidor si algo pasa
  secret: process.env.SECRET,
  resave: true,
  name: 'SID',
  unset: 'destroy',
  maxAge: 1 * 24 * 60 * 60 ,
  saveUninitialized: true,
  store: new MongoStore({
      url: urlServidor,
      ttl: 12 * 60 * 60
    })
  }))
  // global.db = require('./databases').relationalDB
} else {
  app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true
  }))
}

/*
  ===============
  MONTAR LAS APPS
  ===============
*/

// api v1
const api = express()
require('./app_api/routes.api')(api)
app.use('/api', api)

// api v2
// const apiV2 = express()
// require('./app_api_v2/routes.api.v2')(apiV2)
// app.use('/api/v2', apiV2)

// realtime
require('./app_api/realtime/realtime')(io)

// realtime v2
// if (process.env.NODE_ENV !== 'production') {
//   const realtime = express()
//   require('./realtime/routes.realtime')(realtime, io)
//   app.use('/api/realtime', realtime)
// }

// app client
const client = express()
require('./app_client/routes.client')(client)
app.use('/', client)

// app client v2
const clientv2 = express()
require('./app_client_v2/routes.client.v2')(clientv2)
app.use('/v2', clientv2)

app.use('/undefined', (req, res) => { res.redirect('/')})

// ATT
// try {
//   const att = require('./att/app').app
//   app.use('/', att(io))
// } catch(err) {
//   console.error('no tiene instalado el modulo att. Revise el README')
//   console.log(err)
// }

// error page
// app.use(function(req, res, next) {
//   if (process.env.NODE_ENV === 'production') {
//     res.redirect('/')
//   } else {
//     var err = new Error('Url o metodo no valido')
//     err.status = 404
//     next(err)
//   }
// })

app.set('port', PORT)

module.exports = {
  app,
  server
}