const timer = require('./timer')
const moment       = require('moment')
const logger = require('../config/logger')
require("moment-duration-format")
require('moment-timezone')

const assert = require('assert')
const lolex = require("lolex")

var lecciones = [] // [{ paraleloId, tiempo, empezo }]

function socketMock() {
  const proto = {
   join(paraleloIdJoin) {
      lecciones.push({ paraleloId: paraleloIdJoin, tiempo: -1, empezo: false })
    }
  }
  return Object.assign(Object.create(proto), {})
}


function SocketMock() {
  const proto = {
    obtenerEmpezarLeccion(paraleloId) {
      let leccion = lecciones.find(leccion => paraleloId == leccion.paraleloId)
      if (leccion != undefined)
        return  leccion.empezo
      return false
    },
    obtenerTerminadaLeccion(paraleloId) {
      let leccion = lecciones.find(leccion => paraleloId == leccion.paraleloId)
      if (leccion != undefined )
        return  false
      return true
    },
    obtenerTiempoRestante(paraleloId) {
      let leccion = lecciones.find(leccion => paraleloId == leccion.paraleloId)
      return leccion.tiempo
    },
    in(paraleloId) {
      const protoIn = {
        emit(leccionLabel, respuesta) {
          if (leccionLabel == 'tiempo-restante-leccion') {
            let index = lecciones.findIndex(obj => obj.paraleloId == paraleloId)
            if (index != -1)
              lecciones[index].tiempo = respuesta
          } else if (leccionLabel == 'terminada-leccion') {
            lecciones = lecciones.filter(leccion => paraleloId != leccion.paraleloId)
          } else if (leccionLabel == 'empezar-leccion') {
            let index = lecciones.findIndex(obj => obj.paraleloId == paraleloId)
            lecciones[index].empezo = true
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
    this.Timer = timer({ moment, logger })
    this.clock = lolex.install()
  })
  afterEach(function () {
    this.clock.uninstall()
  })
  it('terminar y setInterval', function() {
    const socket = socketMock()
    const Socket = SocketMock()
    let paraleloId = 5
    assert.equal(Socket.obtenerEmpezarLeccion(paraleloId), false, 'No debe haber empezado la leccion')
    this.Timer.run({ accion: 'comenzar', socket, Socket, leccionId: 1, paraleloId, fechaInicioTomada: moment().toISOString(), tiempoEstimado: 20, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(Socket.obtenerTiempoRestante(paraleloId), 15, 'Debe haber pasado solo 5 segundos (15)')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId), false, 'No debe haber terminado la leccion')
    assert.equal(Socket.obtenerEmpezarLeccion(paraleloId), true, 'Debe haber empezado la leccion')
    assert.equal(this.Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
    this.clock.tick(15000)
    assert.equal(this.Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1 timeouts')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId), true, 'Debe haber terminado la leccion')
    this.clock.tick(25000)
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId), true, 'Debe haber terminado la leccion')
  })
  it('terminar por moderador', function () {
    const socket = socketMock()
    const Socket = SocketMock()
    let paraleloId = 5
    this.Timer.run({ accion: 'comenzar', socket, Socket, leccionId: 1, paraleloId, fechaInicioTomada: moment().toISOString(), tiempoEstimado: 20, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(Socket.obtenerTiempoRestante(paraleloId), 15, 'Debe haber pasado solo 5 segundos (15)')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId), false, 'No debe haber terminado la leccion')
    assert.equal(Socket.obtenerEmpezarLeccion(paraleloId), true, 'Debe haber empezado la leccion')
    assert.equal(this.Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
    this.Timer.terminar({ Socket,  leccionId: 1, paraleloId: 5, usuarioId: 2 })
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId), true, 'Debe haber terminado la leccion')
  })
  it('aumentar y terminadaLeccion', function () {
    const socket = socketMock()
    const Socket = SocketMock()
    let fechaInicioTomada = moment().toISOString()
    let paraleloId = 5
    this.Timer.run({ accion: 'comenzar', socket, Socket, leccionId: 1, paraleloId, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: 20, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(Socket.obtenerTiempoRestante(paraleloId), 15, 'Debe haber pasado solo 5 segundos (15)')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId), false, 'No debe haber terminado la leccion')
    assert.equal(Socket.obtenerEmpezarLeccion(paraleloId), true, 'Debe haber empezado la leccion')
    assert.equal(this.Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
    this.Timer.run({ accion: 'aumentarTiempo', socket, Socket, leccionId: 1, paraleloId, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: 50, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(Socket.obtenerTiempoRestante(paraleloId), 40, 'Debe haber pasado solo 10 segundos (40)')
    this.Timer.terminar({ Socket,  leccionId: 1, paraleloId: 5, usuarioId: 2 })
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId), true, 'Debe haber terminado la leccion')
  })
  it('aumentar e Interval', function () {
    const socket = socketMock()
    const Socket = SocketMock()
    let fechaInicioTomada = moment().toISOString()
    let paraleloId = 5
    this.Timer.run({ accion: 'comenzar', socket, Socket, leccionId: 1, paraleloId, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: 20, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(Socket.obtenerTiempoRestante(paraleloId), 15, 'Debe haber pasado solo 5 segundos (15)')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId), false, 'No debe haber terminado la leccion')
    assert.equal(Socket.obtenerEmpezarLeccion(paraleloId), true, 'Debe haber empezado la leccion')
    assert.equal(this.Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
    this.Timer.run({ accion: 'aumentarTiempo', socket, Socket, leccionId: 1, paraleloId, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: 50, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(Socket.obtenerTiempoRestante(paraleloId), 40, 'Debe haber pasado solo 10 segundos (40)')
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1 timeouts')
    this.clock.tick(40000)
    assert.equal(this.Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1 timeouts')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId), true, 'Debe haber terminado la leccion')
    this.clock.tick(25000)
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId), true, 'Debe haber terminado la leccion')
  })
  it('pausar, continuar, terminar por moderador', function () {
    const socket = socketMock()
    const Socket = SocketMock()
    let fechaInicioTomada = moment().toISOString()
    let paraleloId = 5
    this.Timer.run({ accion: 'comenzar', socket, Socket, leccionId: 1, paraleloId, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: 20, usuarioId: 2 })
    this.clock.tick(5000)
    assert.equal(Socket.obtenerTiempoRestante(paraleloId), 15, 'Debe haber pasado solo 5 segundos (15)')
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1 timeouts')
    this.Timer.pausar({ Socket, leccionId: 1, paraleloId: 5, usuarioId: 2 })
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    this.clock.tick(20000)
    // para colocar el tiempoEstimado debe ser lo que se quedo de tiempoEstimado anteriormente
    // tiempoEstimado(15) = 20 + 20
    this.Timer.run({ accion: 'continuar', socket, Socket, leccionId: 1, paraleloId, fechaInicioTomada: fechaInicioTomada, tiempoEstimado: 40, usuarioId: 2 })
    this.clock.tick(1000)
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1')
    assert.equal(this.Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
    assert.equal(Socket.obtenerTiempoRestante(paraleloId), 14, 'Debe haber pasado solo 26 segundos (14)')
    this.clock.tick(14000)
    assert.equal(this.Timer.obtenerIntervals().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1 timeouts')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId), true, 'Debe haber terminado la leccion')
    this.clock.tick(25000)
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId), true, 'Debe haber terminado la leccion')
  }),
  it('dos lecciones al mismo tiempo', function() {
    const socket = socketMock()
    const Socket = SocketMock()
    let fechaInicioTomadaUno = moment().toISOString()
    let paraleloId_1 = 1
    let paraleloId_2 = 2
    // TimerT = timer({ moment, tz, logger, co, db })
    this.Timer.run({ accion: 'comenzar', socket, Socket, leccionId: 1, paraleloId: paraleloId_1, fechaInicioTomada: fechaInicioTomadaUno, tiempoEstimado: 20, usuarioId: 1 })
    this.clock.tick(5000)
    assert.equal(this.Timer.obtenerIntervals().length, 1, 'Tamano debe ser 1')
    let fechaInicioTomadaDos = moment().toISOString()
    this.Timer.run({ accion: 'comenzar', socket, Socket, leccionId: 2, paraleloId: paraleloId_2, fechaInicioTomada: fechaInicioTomadaDos, tiempoEstimado: 30, usuarioId: 2 })
    assert.equal(this.Timer.obtenerIntervals().length, 2, 'Tamano debe ser 2')
    assert.equal(this.Timer.obtenerTimeouts().length, 2, 'Tamano debe ser 2 timeouts')
    assert.equal(Socket.obtenerTiempoRestante(paraleloId_1), 15, 'Debe haber pasado solo 5 segundos en la leccion 1 (15)')
    this.clock.tick(1000)
    assert.equal(Socket.obtenerTiempoRestante(paraleloId_2), 29, 'Debe haber pasado solo 1 segundo en la leccion 2 (29)')
    this.clock.tick(10000)
    assert.equal(Socket.obtenerTiempoRestante(paraleloId_1), 4, 'Debe haber pasado solo 16 segundos en la leccion 1 (4)')
    assert.equal(Socket.obtenerTiempoRestante(paraleloId_2), 19, 'Debe haber pasado solo 1 segundo en la leccion 11 (19)')
    assert.equal(this.Timer.estaCorriendoLeccionInterval(1), true, 'Leccion 1 debe estar corriendo el interval')
    assert.equal(this.Timer.estaCorriendoLeccionTimeout(1), true, 'Leccion 1 debe estar corriendo el timeout')
    assert.equal(this.Timer.estaCorriendoLeccionInterval(2), true, 'Leccion 2 debe estar corriendo el interval')
    assert.equal(this.Timer.estaCorriendoLeccionTimeout(2), true, 'Leccion 2 debe estar corriendo el timeout')
    assert.equal(this.Timer.obtenerIntervals().length, 2, 'Tamano debe ser 2')
    assert.equal(this.Timer.obtenerTimeouts().length, 2, 'Tamano debe ser 2 timeouts')
    this.clock.tick(4000)
    assert.equal(Socket.obtenerTiempoRestante(paraleloId_2), 15, 'Debe haber pasado solo 1 segundo en la leccion 15 (15)')
    assert.equal(this.Timer.estaCorriendoLeccionInterval(1), false, 'Leccion 1 debe estar parado el interval')
    assert.equal(this.Timer.estaCorriendoLeccionTimeout(1), true, 'Leccion 1 debe estar corriendo el timeout')
    assert.equal(this.Timer.obtenerTimeouts().length, 2, 'Tamano debe ser 2')
    this.clock.tick(5000)
    assert.equal(Socket.obtenerTiempoRestante(paraleloId_2), 10, 'Debe haber pasado solo 20 (10)')
    assert.equal(this.Timer.obtenerTimeouts().length, 1, 'Tamano debe ser 1')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId_1), true, 'Leccion 1 debe estar terminada')
    assert.equal(Socket.obtenerTerminadaLeccion(paraleloId_2), false, 'Leccion 2 debe estar corriendo')
    this.clock.tick(10000)
    assert.equal(this.Timer.estaCorriendoLeccionInterval(2), false, 'Leccion 2 debe estar parado el interval')
    assert.equal(this.Timer.estaCorriendoLeccionTimeout(2), true, 'Leccion 2 debe estar corriendo el timeout')
    this.clock.tick(5000)
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
    assert.equal(this.Timer.obtenerTimeouts().length, 0, 'Tamano debe ser 0')
  })
})