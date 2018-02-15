const timer = require('./timer')
const moment       = require('moment')
const tz           = require('moment-timezone')
const co           = require('co')
// const schedule = require('node-schedule')
const logger = require('../config/logger')
require("moment-duration-format")

const sinon  = require('sinon')
const expect = require('chai').expect
const assert = require('assert')
const a_function_should_be_runned = sinon.spy()
const lolex = require("lolex")

function socketMock() {
  let tiempoRestante = -1 // [{ leccionId, tiempoRestante}]
  let terminadaLeccion = false // [{ leccionId, terminadaLeccion}]
  let empezarLeccion = false // [{ leccionId, empezarLeccion}]
  let paraleloId = -1 // [{ leccionId, paraleloId}]
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
    obtenerParaleloId(leccionId) {
      return paraleloId
    },
    obtenerEmpezarLeccion(leccionId) {
      return empezarLeccion
    },
    obtenerTerminadaLeccion(leccionId) {
      return terminadaLeccion
    },
    obtenerTiempoRestante(leccionId) {
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

describe('Timer test', function() {
  beforeEach(function () {
    // this.clock.useFakeTimers()
    this.Timer = timer({ moment, tz, logger, co, db })
    this.clock = lolex.install()
  })
  afterEach(function () {
    this.clock.uninstall()
  })
  it('terminar y setInterval', function() {
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
  it('terminar por moderador', function () {
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
  it('aumentar y terminadaLeccion', function () {
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
  it('aumentar e Interval', function () {
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
  it('pausar, continuar, terminar por moderador', function () {
    const socket = socketMock()
    let fechaInicioTomada = moment().toISOString()
    this.Timer.run({ accion: 'comenzar', socket, leccionId: 1, paraleloId: 5, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: 20, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(socket.obtenerTiempoRestante(), 15, 'Debe haber pasado solo 5 segundos (15)')
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1 timeouts')
    this.Timer.pausar({ socket, leccionId: 1, paraleloId: 5, usuarioId: 2 })
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    this.clock.tick(20000)
    // para colocar el tiempoEstimado debe ser lo que se quedo de tiempoEstimado anteriormente
    // tiempoEstimado(15) = 20 + 20
    this.Timer.run({ accion: 'continuar', socket, leccionId: 1, paraleloId: 5, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: 40, usuarioId: 2 })
    this.clock.tick(1000)
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1')
    assert.equal(this.Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
    assert.equal(socket.obtenerTiempoRestante(), 14, 'Debe haber pasado solo 14 segundos (14)')
    this.clock.tick(14000)
    assert.equal(this.Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1 timeouts')
    assert.equal(socket.obtenerTerminadaLeccion(), true, 'Debe haber terminado la leccion')
    this.clock.tick(25000)
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(socket.obtenerTerminadaLeccion(), true, 'Debe haber terminado la leccion')
  }),
  it('dos lecciones al mismo tiempo', function() {
    const socket = socketMock()
    let fechaInicioTomadaUno = moment().toISOString()
    let fechaInicioTomadaDos = moment().add(10, 'm').toISOString()
    this.Timer.run({ accion: 'comenzar', socket, leccionId: 1, paraleloId: 1, fechaInicioTomada: fechaInicioTomadaUno, tiempoEstimado: 20, usuarioId: 1 })
    this.Timer.run({ accion: 'comenzar', socket, leccionId: 2, paraleloId: 2, fechaInicioTomada: fechaInicioTomadaDos, tiempoEstimado: 20, usuarioId: 2 })
  })
})