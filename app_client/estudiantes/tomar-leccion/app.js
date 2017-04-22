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
      if (!this.codigo_leccion) {
        Materialize.toast('Ingrese el codigo', 4000)
      } else {
        this.$http.get(`/api/estudiantes/leccion/verificar/${this.codigo_leccion}`).
          then(res => {
            console.log(res.body);
            if (res.body.estado) {
              window.location.href = `/estudiantes/leccion`
            } else {
              if (res.body.datos) {
                Materialize.toast(res.body.datos.mensaje, 4000)
              } else {
                Materialize.toast('no hay lecciones por dar', 4000)
              }
              console.log(res.body)
            }
          })
      }
    }
  },
  data: {
    estudiante: {},
    codigo_leccion: ''
  }
})

app.obtenerLogeado()
var socket = io('/no_codigo');
