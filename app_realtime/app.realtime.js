const express = require('express')
const moment       = require('moment')
const co           = require('co')
const logger = require('../config/logger')
require("moment-duration-format")
require('moment-timezone')
const app = express()
const path = require('path')
const http = require('http').Server(app)
// const io = require('socket.io')(http)
const io = require('socket.io')(http, {'pingInterval': 60000, 'pingTimeout': 120000})
// io.set("log level", 0)

function dbMock() {
  const proto = {
    terminarLeccion() {

    },
    terminarLeccionPromise() {
      return new Promise((resolve, reject) => {
        if (process.env.NODE_ENV !== 'testing')
          console.log('DB: terminar leccion')
        resolve(true)
      })
    }
  }
  return Object.assign(Object.create(proto), {})
}
const db = dbMock({})
app.use('/', express.static(path.join(__dirname, '.')))
const Timer = require('./timer')
const timer = Timer({ moment, logger })
require('./realtime')({ io, co, db, logger, timer  })

module.exports = http