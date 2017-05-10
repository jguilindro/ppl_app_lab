app = new Vue({
  el: '#app',
  methods: {
    obtenerLogeado() {
      $.get({
        url: '/api/session/usuario_conectado',
        success: function(res) {
          if (res.estado) {
            app.estudiante = res.datos
          }
        }
      })
    },
    verificarEstudiantPuedeDarLeccion() {
      if (!app.codigo_leccion) {
        Materialize.toast('Ingrese el codigo', 4000)
      } else {
        $.get({
          url: '/api/session/usuario_conectado',
          success: function(res) {
            var usuario_conectado = res.datos
            $.get({
              url: `/api/paralelos/estudiante/${app.estudiante._id}`,
              success: function(par) {
                var paralelo = par.datos
                if (!paralelo.dandoLeccion) {
                  Materialize.toast('No hay lecciones por dar', 4000)
                } else {
                  $.get({
                    url: `/api/estudiantes/leccion/verificar/${app.codigo_leccion}`,
                    success: function(res) {
                      var codigo_leccion_verificado = res.datos
                      if (res.estado) {
                        $.post({
                          url: '/api/estudiantes/codigo_ingresado',
                          success: function(res) {
                            var ingresado = res
                            if (paralelo.leccionYaComenzo && ingresado.estado) {
                              window.location.href = `/estudiantes/leccion`
                            }
                            else if (ingresado.estado) {
                              var load = document.getElementById('loading')
                              load.setAttribute('class', 'enable')
                              var a = document.getElementById('app')
                              a.setAttribute('class', 'disabled')
                            }
                          }
                        })
                      }else if (!res.estado) {
                        Materialize.toast('Codigo mal ingresado', 4000)
                      } else if (codigo_leccion_verificado.mensaje == 'no_esta_anadido_a_paralelo') {
                        Materialize.toast('No esta en ningun paralelo', 4000)
                      } else if (codigo_leccion_verificado.mensaje == 'leccion_empezo') {
                        $.post({
                          url: '/api/estudiantes/codigo_ingresado',
                          success: function(res) {
                            var ingresado = res.datos
                            if (ingresado.estado) {
                              var load = document.getElementById('loading')
                              load.setAttribute('class', 'enable')
                              var a = document.getElementById('app')
                              a.setAttribute('class', 'disabled')
                            }
                          }
                        })
                      }
                    }
                  })
                }
              }
            })
          }
        })
      }
    },
    estado() {
      $.get({
        url: '/api/session/usuario_conectado',
        success: function(user) {
          var usuario = user.datos
          $.get({
            url: `/api/paralelos/estudiante/${usuario._id}`,
            success: function(par) {
              var paralelo = par.datos
              if (usuario.codigoIngresado && !paralelo.leccionYaComenzo) {
                var load = document.getElementById('loading')
                load.setAttribute('class', 'enable')
                var a = document.getElementById('app')
                a.setAttribute('class', 'disabled')
              }
            }
          })
        }
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
    socket.emit('usuario', data.datos)
  }
})
// socket.emit('usuario', App.obtenerLogeado())

app.estado()
