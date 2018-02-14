const timer = require('./timer')
const moment       = require('moment')
const tz           = require('moment-timezone')
// const schedule = require('node-schedule')
const logger = require('../config/logger')
require("moment-duration-format")

const socket = socketMock()
const database = require('./database')
const db = database({})

const sinon  = require('sinon')
const expect = require('chai').expect
const assert = require('assert')
const a_function_should_be_runned = sinon.spy()
const lolex = require("lolex")

function socketMock() {
  let tiempoRestante = -1
  let terminadaLeccion = false
  let empezarLeccion = false
  const proto = {
    emit(leccionLabel, tiempoRestante) {
      console.log(tiempoRestante)
    },
    obtenerEmpezarLeccion() {
      return empezarLeccion
    },
    obtenerTerminadaLeccion() {
      return terminadaLeccion
    },
    obtenerTiempoRestante() {
      return tiempoRestante
    },
    in(paraleloId) {
      const protoIn = {
        emit(leccionLabel, respuesta) {
          if (leccionLabel == 'tiempo-restante-leccion') {
            tiempoRestante = respuesta
            if (process.env.NODE_ENV !== 'testing')
              console.log(tiempoRestante)
          } else if (leccionLabel == 'terminada-leccion') {
            terminadaLeccion = respuesta
            if (process.env.NODE_ENV !== 'testing')
              console.log(tiempoRestante)
          } else if (leccionLabel == 'empezar-leccion') {
            empezarLeccion = true
            if (process.env.NODE_ENV !== 'testing')
              console.log(tiempoRestante) 
          } else {
            if (process.env.NODE_ENV !== 'testing')
              console.log(`terminado ${leccionLabel}`)
          }
        }
      }
      return Object.assign(Object.create(protoIn), {})
    }
  }
  return Object.assign(Object.create(proto), {})
}

describe('Timer test', function() {
  beforeEach(function () {
    // this.clock.useFakeTimers()
    this.clock = lolex.install()
  })
  afterEach(function () {
     this.clock.uninstall()
  })
  it('comenzar: Terminar con setInterval', function() {
    const Timer = timer({ moment, tz, logger, db, socket })
    assert.equal(socket.obtenerEmpezarLeccion(), false, 'No debe haber empezado la leccion')
    assert.equal(socket.obtenerTerminadaLeccion(), false, 'No debe haber terminado la leccion')
    Timer.comenzar({ leccionId: 1, paraleloId: 5, fechaInicioTomada: moment().toISOString(), tiempoEstimado: 20, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(socket.obtenerTiempoRestante(), 15, 'Debe haber pasado solo 5 segundos (15)')
    assert.equal(socket.obtenerTerminadaLeccion(), false, 'No debe haber terminado la leccion')
    assert.equal(socket.obtenerEmpezarLeccion(), true, 'Debe haber empezado la leccion')
    assert.equal(Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
    this.clock.tick(15000)
    assert.equal(Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    assert.equal(Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1 timeouts')
    assert.equal(socket.obtenerTerminadaLeccion(), true, 'Debe haber terminado la leccion')
    this.clock.tick(25000)
    assert.equal(Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(socket.obtenerTerminadaLeccion(), true, 'Debe haber terminado la leccion')
  })
  // it('comenzar: Terminar con setTimeout', function() {
  //   const Timer = timer({ moment, tz, logger, db, socket })
  //   Timer.comenzar({ leccionId: 1, paraleloId: 5, fechaInicioTomada: moment().toISOString(), tiempoEstimado: 20, usuarioId: 2 })
  //   assert.equal(Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
  //   this.clock.tick(20000)
  //   assert.equal(Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
  //   // simular que no acaba con setInterval
  //   // determinar que setInterval sigue con 1 el array asi haya terminado el tiempo
  //   // determinar que limpio el array intervals y timeouts
  // })
})