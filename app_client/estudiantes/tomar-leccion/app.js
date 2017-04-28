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
            if (res.body.datos && res.body.datos.mensaje == 'leccion_empezo') {
              window.location.href = `/estudiantes/leccion`
            }
            else if (res.body.estado) {
              var load = document.getElementById('loading')
              load.setAttribute('class', 'enable')
              var a = document.getElementById('app')
              a.setAttribute('class', 'disabled')
              console.log('spinkit aqui');
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
var socket = io('/tomando_leccion');

socket.on('empezar leccion', function(data) {
  console.log('leccion empezada');
  if (data) {
    window.location.href = `/estudiantes/leccion`
  }
})
