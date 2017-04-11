var App = new Vue({
  el: '#app',
  methods: {
    obtenerLeccion() {
      var id_leccion = window.location.href.toString().split('/')[5]
      this.$http.get(`/api/lecciones/${id_leccion}`).then(res => this.leccion = res.body.datos)
    }
  },
  data: {
    estudiantes_conectados: [

    ],
    grupos: [

    ],
    leccion: {}
  }
})

App.obtenerLeccion()

// grupos del curso
var no_codigo_ingresado = io('/no_codigo')
no_codigo_ingresado.on('estudiante tratando ingresar', function(data) {
  console.log(data)
})

var socket = io('/tomando_leccion')
socket.on('estudiante conectado', function(_estudiante) {
  var existe = App.estudiantes_conectados.some(estudiante => estudiante._id == _estudiante._id)
  if (!existe) App.estudiantes_conectados.push(_estudiante)
})

socket.on('estudiante desconectado', function(_estudiante) {
  App.estudiantes_conectados = App.estudiantes_conectados.filter((estudiante) => estudiante._id != _estudiante._id)
})

socket.on('disconnect', function() {
  App.estudiantes_conectados = []
})

socket.on('reconexion profesor', function(_estudiantes) {
  App.estudiantes_conectados = _estudiantes
})

// validar si la leccion no esta habilitada para ser tomadaa o ya ha sido tomada
