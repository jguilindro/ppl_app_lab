const expect = require('chai').expect
const server = require('./app.realtime')
const io = require('socket.io-client')
const moment       = require('moment')
const assert = require('assert')
const lolex = require("lolex")
const ioOptions = { transports: ['websocket'] , forceNew: true , reconnection: false } 
// function logMemory() {
//     var memory = process.memoryUsage();
//     console.log((new Date()), 'RSS ',memory.rss, ', Heap Used ', memory.heapUsed, ' Heap Total ', memory.heapTotal);
// }
// logMemory();
// const used = process.memoryUsage().heapUsed / 1024 / 1024;
// console.log(`The script uses approximately ${Math.round(used * 100) / 100} MB`);
// const used = process.memoryUsage();
// for (let key in used) {
//   console.log(`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB`);
// }
describe('Profesor eventos', function(){
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
  describe('Comenzar Leccion',   function(done) {
    it('Comenzar leccion, estudiante recibe tiempo, terminar leccion (1s)', function(done) {
      this.timeout(6000)
      moderador.emit('usuario', { paraleloId: 1, usuarioId: 1 })
      estudiante.emit('usuario', { paraleloId: 1, usuarioId: 2 })
      moderador.emit('comenzar-leccion', { leccionId: 1, paraleloId: 1, fechaInicioTomada: moment().toISOString(), tiempoEstimado: 50, usuarioId: 1 })
      
      estudiante.on('tiempo-restante-leccion', function(tiempo) {
        assert.equal(tiempo, 49, 'El principio leccion')
        moderador.emit('terminar-leccion', { leccionId: 1, paraleloId: 1, usuarioId: 1 })

        done()
      })
    })
  })
})