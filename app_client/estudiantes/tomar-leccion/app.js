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
        // `/api/codigo_ingresado`
        // `/api/estudiantes/leccion/verificar/${this.codigo_leccion}`
        // `/api/session/usuario_conectado`
        // window.location.href = `/estudiantes/leccion`
        // var load = document.getElementById('loading')
        // load.setAttribute('class', 'enable')
        // var a = document.getElementById('app')
        // a.setAttribute('class', 'disabled')
        // no_esta_anadido_a_paralelo
        // leccion_empezo
        // false es codigo mal ingresado
        this.$http.get(`/api/session/usuario_conectado`).then(res => {
          var usuario_conectado = res.body.datos
          this.$http.get(`/api/paralelos/estudiante/${this.estudiante._id}`).then(par => {
            var paralelo = par.body.datos
            if (!paralelo.dandoLeccion) {
              Materialize.toast('No hay lecciones por dar', 4000)
            } else {
              this.$http.get(`/api/estudiantes/leccion/verificar/${this.codigo_leccion}`).then(res => {
                var codigo_leccion_verificado = res.body.datos
                if (res.body.estado) {
                  this.$http.post(`/api/estudiantes/codigo_ingresado`).then(res => {
                    var ingresado = res.body
                    if (paralelo.leccionYaComenzo && ingresado.estado) {
                      window.location.href = `/estudiantes/leccion`
                    }
                    else if (ingresado.estado) {
                      var load = document.getElementById('loading')
                      load.setAttribute('class', 'enable')
                      var a = document.getElementById('app')
                      a.setAttribute('class', 'disabled')
                    }
                  })                  
                }else if (!res.body.estado) {
                  Materialize.toast('Codigo mal ingresado', 4000)
                } else if (codigo_leccion_verificado.mensaje == 'no_esta_anadido_a_paralelo') {
                  Materialize.toast('No esta en ningun paralelo', 4000)
                } else if (codigo_leccion_verificado.mensaje == 'leccion_empezo') {
                  this.$http.post(`/api/estudiantes/codigo_ingresado`).then(res => {
                    var ingresado = res.body.datos
                    if (ingresado.estado) {
                      var load = document.getElementById('loading')
                      load.setAttribute('class', 'enable')
                      var a = document.getElementById('app')
                      a.setAttribute('class', 'disabled')
                    }
                  })
                }
              })
            }
          })
        })
      }
    },
    estado() {
          this.$http.get('/api/session/usuario_conectado').
            then(user => {
              var usuario = user.body.datos
              this.$http.get(`/api/paralelos/estudiante/${usuario._id}`).then(par => {
                var paralelo = par.body.datos
                if (usuario.codigoIngresado && !paralelo.leccionYaComenzo) {
                  var load = document.getElementById('loading')
                  load.setAttribute('class', 'enable')
                  var a = document.getElementById('app')
                  a.setAttribute('class', 'disabled')
                }
              })
            })
    }
  },
  data: {
    estudiante: {},
    codigo_leccion: ''
  }
})
app.obtenerLogeado()
var socket = io('/tomando_leccion');
app.estado()
socket.on('empezar leccion', function(data) {
  console.log('leccion empezada');
  if (data) {
    window.location.href = `/estudiantes/leccion`
  }
})
$.get({
  url: '/api/session/usuario_conectado',
  success: function(data) {
    console.log(data);
    socket.emit('usuario', data.datos)
  }
})
// socket.emit('usuario', App.obtenerLogeado())

app.estado()
