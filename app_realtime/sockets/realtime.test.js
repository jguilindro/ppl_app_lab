const expect = require('chai').expect
const server = require('./app.realtime').http
const db = require('./app.realtime').db
const io = require('socket.io-client')
const moment       = require('moment')
const assert = require('assert')
const lolex = require("lolex")
const ioOptions = { transports: ['websocket'] , forceNew: true , reconnection: false } 

// Si se edita algo de timer, se debe editar esto tambien o como se haria?

describe('Realtime', function(){
  beforeEach(function(){
    // this.clock = lolex.install()
    server.listen(process.env.PORT || 3000)
    moderador = io(`http://localhost:${process.env.PORT || 3000}/leccion`, ioOptions)
    estudiante = io(`http://localhost:${process.env.PORT || 3000}/leccion`, ioOptions)
  })
  afterEach(function(){
    moderador.disconnect()
    estudiante.disconnect()
    server.close()
    // this.clock.uninstall()
  })
  after(function() {
    server.close()
    // this.clock.uninstall()
  })
  describe('Lecciones',   function(done) {
    // 'usuario' emit: ser conectan los usuarios
    // 'comenzar-leccion' emit: profesor comienza leccion 
    // 'nuevo-estudiante-conectado' on: se detecta al nuevo estudiante conectado
    // 'tiempo-restante-leccion' on: se verifica que el tiempo de la leccion sea el correcto
    // 'terminar-leccion' emit: se termina la lecion
    // 'terminada-leccion' on: se detecta que se termino la leccion
    it('Comenzar leccion, estudiante recibe tiempo, terminar leccion (1s)', function(done) {
      this.timeout(6000)
      moderador.emit('usuario', { tipoUsuario: 'moderador', estado: '', dispositivoDatos: {}, paraleloId: 1, usuarioId: 1, usuarioDatos: {} })
      estudiante.emit('usuario', { tipoUsuario: 'estudiante', estado: 'dando-leccion', dispositivoDatos: {}, paraleloId: 1, usuarioId: 2, usuarioDatos: {nombres: 'Usuario1'} })
      console.log(db.obtenerEstudiantesConectados({ leccionId: 1, paraleloId: 1 }))
      moderador.emit('comenzar-leccion', { leccionId: 1, paraleloId: 1, fechaInicioTomada: moment().toISOString(), tiempoEstimado: 50, usuarioId: 1 })
      moderador.on('nuevo-estudiante-conectado', function(usuarioDatos) {
        assert.equal(usuarioDatos.nombres, 'Usuario1', 'Un usuario fue conectado')
        estudiante.on('tiempo-restante-leccion', function(tiempo) {
          assert.equal(tiempo, 49, 'La leccion debe haber pasado 49 segundos')
          moderador.emit('terminar-leccion', { leccionId: 1, paraleloId: 1, usuarioId: 1 })
          estudiante.on('terminada-leccion', function(estaTerminada) {
            assert.equal(estaTerminada, true, 'La leccion debe estar terminada')
            done()
          })
        })
      })
      
      
    })
  })
  // it('Comenzar leccion, pausar, continuar, terminar', function(done) {

  // })
  // describe('comenzar-pausar-continuar-terminar',   function(done) {
  //   it('Comenzar leccion, estudiante recibe tiempo, terminar leccion (1s)', function(done) {
  //     this.timeout(9000)
  //     let Tiempo = moment().toISOString()
  //     moderador.emit('usuario', { paraleloId: 'abc', usuarioId: 1, tipoUsuario: 'moderador', estado: '', dispositivoDatos: {}, usuarioDatos: {} })
  //     estudiante.emit('usuario', { paraleloId: 'abc', usuarioId: 2, tipoUsuario: 'estudiante', estado: 'dando-leccion', dispositivoDatos: {}, usuarioDatos: {} })
  //     moderador.emit('comenzar-leccion', { leccionId: 1, paraleloId: 'abc', fechaInicioTomada: Tiempo, tiempoEstimado: 50, usuarioId: 1 })
      
  //     estudiante.on('tiempo-restante-leccion', function(tiempo) {
  //       // console.log(tiempo)
  //       assert.equal(tiempo, 49, 'El principio leccion')
  //       moderador.emit('pausar-leccion', { leccionId: 1, paraleloId: 'abc', usuarioId: 1 })
  //       moderador.emit('continuar-leccion', { leccionId: 1, paraleloId: 1, fechaInicioTomada: Tiempo, tiempoEstimado: 49, usuarioId: 1 })
  //       setTimeout(function() {
  //         // estudiante.on('tiempo-restante-leccion', function(tiempo) {
  //         //   console.log(tiempo)
  //         //   moderador.emit('terminar-leccion', { leccionId: 1, paraleloId: 'abc', usuarioId: 1 })
  //         //   done()
  //         // })
  //         moderador.emit('terminar-leccion', { leccionId: 1, paraleloId: 'abc', usuarioId: 1 })
  //         done()
  //       },1000)
        
  //       // estudiante.on('tiempo-restante-leccion', function(tiempo) {
          
  //         // assert.equal(tiempo, 'Lección pausada', 'El principio leccion')
  //         // moderador.emit('continuar-leccion', { leccionId: 1, paraleloId: 1, fechaInicioTomada: tiempo, tiempoEstimado: 49, usuarioId: 1 })
  //         // estudiante.on('tiempo-restante-leccion', function(tiempo) {
  //         //   assert.equal(tiempo, 48, 'El principio leccion')
  //         //   moderador.emit('terminar-leccion', { leccionId: 1, paraleloId: 1, usuarioId: 1 })
  //         //   done()
  //         // })
  //       // })
  //     })
  //   })
  // })
})