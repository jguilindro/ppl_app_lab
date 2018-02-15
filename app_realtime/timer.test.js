const timer = require('./timer')
const moment       = require('moment')
const tz           = require('moment-timezone')
const co           = require('co')
// const schedule = require('node-schedule')
const logger = require('../config/logger')
require("moment-duration-format")

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
  let paraleloId = -1
  const proto = {
    emit(leccionLabel, tiempoRestante) {
      if (process.env.NODE_ENV !== 'testing')
        console.log(tiempoRestante)
    },
    join(paraleloIdJoin) {
      paraleloId = paraleloIdJoin
      if (process.env.NODE_ENV !== 'testing')
        console.log(paraleloIdJoin)
    },
    obtenerParaleloId() {
      return empezarLeccion
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
          } else if (leccionLabel == '') {

          } else {
            //if (process.env.NODE_ENV !== 'testing')
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
    this.Timer = timer({ moment, tz, logger, co, db })
    this.clock = lolex.install()
  })
  afterEach(function () {
     this.clock.uninstall()
  })
  it('comenzar: Terminar con setInterval', function() {
    const socket = socketMock()
    assert.equal(socket.obtenerEmpezarLeccion(), false, 'No debe haber empezado la leccion')
    assert.equal(socket.obtenerTerminadaLeccion(), false, 'No debe haber terminado la leccion')
    this.Timer.run({ accion: 'comenzar', socket, leccionId: 1, paraleloId: 5, fechaInicioTomada: moment().toISOString(), tiempoEstimado: 20, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(socket.obtenerTiempoRestante(), 15, 'Debe haber pasado solo 5 segundos (15)')
    assert.equal(socket.obtenerTerminadaLeccion(), false, 'No debe haber terminado la leccion')
    assert.equal(socket.obtenerEmpezarLeccion(), true, 'Debe haber empezado la leccion')
    assert.equal(this.Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
    this.clock.tick(15000)
    assert.equal(this.Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1 timeouts')
    assert.equal(socket.obtenerTerminadaLeccion(), true, 'Debe haber terminado la leccion')
    this.clock.tick(25000)
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(socket.obtenerTerminadaLeccion(), true, 'Debe haber terminado la leccion')
  })
  it('terminar: Terminar leccion por parte del moderador', function () {
    const socket = socketMock()
    this.Timer.run({ accion: 'comenzar', socket, leccionId: 1, paraleloId: 5, fechaInicioTomada: moment().toISOString(), tiempoEstimado: 20, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(socket.obtenerTiempoRestante(), 15, 'Debe haber pasado solo 5 segundos (15)')
    assert.equal(socket.obtenerTerminadaLeccion(), false, 'No debe haber terminado la leccion')
    assert.equal(socket.obtenerEmpezarLeccion(), true, 'Debe haber empezado la leccion')
    assert.equal(this.Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
    this.Timer.terminar({ socket,  leccionId: 1, paraleloId: 5, usuarioId: 2 })
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    assert.equal(socket.obtenerTerminadaLeccion(), true, 'Debe haber terminado la leccion')
  })
  it('aumentar y terminadaLeccion: Aumentar tiempo leccion por parte del moderador y terminado por moderador', function () {
    const socket = socketMock()
    let fechaInicioTomada = moment().toISOString()
    this.Timer.run({ accion: 'comenzar',socket, leccionId: 1, paraleloId: 5, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: 20, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(socket.obtenerTiempoRestante(), 15, 'Debe haber pasado solo 5 segundos (15)')
    assert.equal(socket.obtenerTerminadaLeccion(), false, 'No debe haber terminado la leccion')
    assert.equal(socket.obtenerEmpezarLeccion(), true, 'Debe haber empezado la leccion')
    assert.equal(this.Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
    this.Timer.run({ accion: 'aumentarTiempo', socket, leccionId: 1, paraleloId: 5, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: 50, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(socket.obtenerTiempoRestante(), 40, 'Debe haber pasado solo 10 segundos (40)')
    this.Timer.terminar({ socket,  leccionId: 1, paraleloId: 5, usuarioId: 2 })
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    assert.equal(socket.obtenerTerminadaLeccion(), true, 'Debe haber terminado la leccion')
  })
  it('aumentar e Interval: Aumentar tiempo leccion por parte del moderador y terminado por Interval', function () {
    const socket = socketMock()
    let fechaInicioTomada = moment().toISOString()
    this.Timer.run({ accion: 'comenzar', socket, leccionId: 1, paraleloId: 5, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: 20, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(socket.obtenerTiempoRestante(), 15, 'Debe haber pasado solo 5 segundos (15)')
    assert.equal(socket.obtenerTerminadaLeccion(), false, 'No debe haber terminado la leccion')
    assert.equal(socket.obtenerEmpezarLeccion(), true, 'Debe haber empezado la leccion')
    assert.equal(this.Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
    this.Timer.run({ accion: 'aumentarTiempo', socket, leccionId: 1, paraleloId: 5, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: 50, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(socket.obtenerTiempoRestante(), 40, 'Debe haber pasado solo 10 segundos (40)')
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1 timeouts')
    this.clock.tick(40000)
    assert.equal(this.Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1 timeouts')
    assert.equal(socket.obtenerTerminadaLeccion(), true, 'Debe haber terminado la leccion')
    this.clock.tick(25000)
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
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