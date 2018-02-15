const expect = require('chai').expect
const server = require('./app.realtime')
const io = require('socket.io-client')
const moment       = require('moment')
const lolex = require("lolex")
const ioOptions = { transports: ['websocket'] , forceNew: true , reconnection: false } //  path: '/leccion'

describe('Profesor eventos', function(){
  let sender
  let receiver
  beforeEach(function(done){
    this.clock = lolex.install()
    server.listen(process.env.PORT || 3000)
    // sender = io('/leccion', ioOptions);
    // receiver = io('/leccion', ioOptions);
    sender = io(`http://localhost:${process.env.PORT || 3000}/`, ioOptions)
    receiver = io(`http://localhost:${process.env.PORT || 3000}/`, ioOptions)
    done()
  })
  afterEach(function(done){
    sender.disconnect()
    receiver.disconnect()
    server.close()
    this.clock.uninstall()
    done()
  })
  after(function() {
    server.close()
  })

  describe('Comenzar Leccion', function(){
    it('El moderador iniciara la leccion', function(done){
      sender.emit('comenzar-leccion', { leccionId: 1, paraleloId: 1, fechaInicioTomada: moment().toISOString(), tiempoEstimado: 50, usuarioId: 1 })
      // this.clock.tick(5000)
      done()
      // receiver.on('message', function(msg){
      //   console.log(msg)
      //   // expect(msg).to.equal(testMsg)
      //   done()
      // })
    })
  })
})