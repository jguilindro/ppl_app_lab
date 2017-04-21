var App = new Vue({
  el: '#app',
  methods: {
    obtenerLeccion() {
      var id_leccion = window.location.href.toString().split('/')[5]
      this.$http.get(`/api/lecciones/${id_leccion}`).then(res => this.leccion = res.body.datos)
    },
    obtenerParalelo() {
      var id_paralelo = window.location.href.toString().split('/')[7]
      this.$http.get(`/api/paralelos/${id_paralelo}`).then(res => {
        this.paralelo = JSON.parse(JSON.stringify(res.body.datos))
        this.grupos = this.paralelo.grupos
        this.grupos.forEach(grupo => {
          grupo.estudiantes_conectados = []
        })
      })
    },
    obtenerGrupoEstudiante(_estudiante) {
      let grupo_index = this.grupos.findIndex(grupo => {
        console.log(grupo);
        let estudiante = grupo.estudiantes.find(estudiante => {
          return estudiante === _estudiante._id
        })
        if (estudiante)
          return true
      })
      //console.log(grupo_index);
      return grupo_index
    }
  },
  data: {
    estudiantes_conectados: [

    ],
    grupos: [
    ],
    leccion: {},
    paralelo: [],
    tiempo: ''
  }
})

App.obtenerLeccion()
App.obtenerParalelo()

var leccion = io('/tomando_leccion');

leccion.on('connection', function() {
  console.log('intentado connection');
})
leccion.on('ingresado profesor', function(data) {

})

leccion.on('estudiante conectado', function(_estudiante) {
  var existe = App.estudiantes_conectados.some(estudiante => estudiante._id == _estudiante._id)
  if (!existe) {
    App.estudiantes_conectados.push(_estudiante)
    let grupo_index = App.obtenerGrupoEstudiante(_estudiante)
    if(grupo_index == -1) {
      // TODO: mensaje que un estudiante no tiene grupo
      console.log(`${_estudiante} no existe estudiante en grupo`);
    } else {
      App.grupos[grupo_index].estudiantes_conectados.push(_estudiante)
    }
  }
})

leccion.on('estudiante desconectado', function(_estudiante) {
  App.grupos = App.grupos.map(grupo => {
    let grupop = grupo.estudiantes_conectados.filter((estudiante) => estudiante._id != _estudiante._id)
    grupo.estudiantes_conectados = grupop
    return grupo
  })
  App.estudiantes_conectados = App.estudiantes_conectados.filter((estudiante) => estudiante._id != _estudiante._id)
})

leccion.on('tiempo restante', function(tiempo) {
  App.tiempo = tiempo
})

leccion.on('terminado leccion', function(match) {
  App.tiempo = 'leccion detenida'
	console.log('se ha terminado la leccion')
})

function terminarLeccion() {
  document.getElementById('terminar-leccion').disabled = true
  leccion.emit('parar leccion', 'la leccion ha sido detenida')
}

function terminarLeccionDevelopment() {
  leccion.emit('parar leccion development', 'la leccion ha sido detenida')
}

// grupos del curso
// var no_codigo_ingresado = io('/no_codigo')
// no_codigo_ingresado.on('estudiante tratando ingresar', function(data) {
//   //console.log(data)
// })

// var socket = io('/tomando_leccion')
// socket.on('estudiante conectado', function(_estudiante) {
//   var existe = App.estudiantes_conectados.some(estudiante => estudiante._id == _estudiante._id)
//   if (!existe) App.estudiantes_conectados.push(_estudiante)
// })
//
// socket.on('estudiante desconectado', function(_estudiante) {
//   App.estudiantes_conectados = App.estudiantes_conectados.filter((estudiante) => estudiante._id != _estudiante._id)
// })
//
// socket.on('disconnect', function() {
//   App.estudiantes_conectados = []
// })
//
// socket.on('reconexion profesor', function(_estudiantes) {
//   App.estudiantes_conectados = _estudiantes
// })

// validar si la leccion no esta habilitada para ser tomadaa o ya ha sido tomada
