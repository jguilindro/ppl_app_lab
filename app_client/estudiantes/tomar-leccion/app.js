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
    },
    verificarEstudiantPuedeDarLeccion() {
      this.$http.get(`/api/estudiantes/leccion/verificar`).
        then(res => {
          if (res.body.estado) {
            window.location.href = `/estudiantes/leccion`
          } else {
            console.log(res.body)
          }
        })
    }
  },
  data: {
    estudiante: {}
  }
})

app.obtenerLogeado()
var socket = io('/no_codigo');
