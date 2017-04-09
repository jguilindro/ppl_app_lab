app = new Vue({
  el: '#app',
  methods: {
    obtenerLogeado() {
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
            this.estudiante = res.body.datos
          }
        })
    }
  },
  data: {
    estudiante: {}
  }
})

app.obtenerLogeado()
var socket = io()
// socket.on('login', function(data) {
//   console.log(data)
// })
