var App = new Vue({
  el: '#app',
  methods: {

  },
  data: {
    tiempo: ''
  }
})

var socket = io('/tomando_leccion')
socket.emit('hola', 'sdsads')

socket.on('mi grupo', function(data) {
  console.log(data);
})

socket.on('tiempo restante', function(tiempo) {
  App.tiempo = tiempo
})
