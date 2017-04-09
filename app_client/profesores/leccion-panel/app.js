var App = new Vue({
  el: '#app',
  methods: {

  },
  data: {
    estudiantes_conectados: [

    ],
    grupos: [

    ]
  }
})

// grupos del curso

var socket = io()
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
