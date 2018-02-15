const express = require('express')
const timer = require('./timer')
const moment       = require('moment')
const tz           = require('moment-timezone')
const co           = require('co')
const logger = require('../config/logger')
require("moment-duration-format")
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
io.set("log level", 0)

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

const Timer = require('./timer')
const timer = Timer({ moment, tz, logger, co, db })
require('./realtime')({ io, co, db, logger, timer  })

module.exports = http