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
        let estudiante = grupo.estudiantes.find(estudiante => {
          return estudiante === _estudiante._id
        })
        if (estudiante)
          return true
      })
      //console.log(grupo_index);
      return grupo_index
    },
    tomarLeccion() {
      var id_leccion = window.location.href.toString().split('/')[5]
      var id_paralelo = window.location.href.toString().split('/')[7]
      if (this.paralelo.leccionYaComenzo === false) {
        this.$http.post(`/api/lecciones/comenzar_leccion/${id_leccion}`).then(res => {
          if (res.body.estado) {
            if (res.body.estado) {
              this.$http.post(`/api/paralelos/${id_paralelo}/leccion_ya_comenzo`).then(res => {
                if (res.body.estado) {
                  comenzar()
                  document.getElementById('leccion-no-dar').disabled = true
                  document.getElementById('comenzar-leccion').disabled = true
                  document.getElementById('terminar-leccion').disabled = false
                  document.getElementById('anadir-tiempo').disabled = false
                }
              })
            }
            // tomando leccion en paralelo
            // /profesores/leccion-panel/:id_leccion/paralelo/:id_paralelo
          }
        })
      }
    }
  },
  data: {
    estudiantes_conectados: [

    ],
    grupos: [
    ],
    leccion: {},
    paralelo: [],
    tiempo: '',
    dataEstudiantes: '',
    mas_tiempo: 0
  },
  mounted() {
    $('.modal').modal({
        dismissible: false
    });
    $.get({
      url: "/navbar/profesores",
      success: function(data) {
        document.getElementById('#navbar').innerHTML = data;
        $(".button-collapse").sideNav();
        $(".dropdown-button").dropdown();
      }
    })
  }
})

App.obtenerLeccion()
App.obtenerParalelo()
document.getElementById('terminar-leccion').disabled = true


var leccion = io('/tomando_leccion');

// leccion.on('ingresado profesor', function(data) {
//
// })

// leccion.on('estudiante conectado', function(_estudiante) {
//   console.log('conectado');
//   console.log(_estudiante);
//   var existe = App.estudiantes_conectados.some(estudiante => estudiante._id == _estudiante._id)
//   console.log(App.estudiantes_conectados);
//   console.log(existe);
//   if (!existe) {
//     App.estudiantes_conectados.push(_estudiante)
//     let grupo_index = App.obtenerGrupoEstudiante(_estudiante)
//     if(grupo_index == -1) {
//       // TODO: mensaje que un estudiante no tiene grupo
//       console.log(`${_estudiante} no existe estudiante en grupo`);
//     } else {
//       App.grupos[grupo_index].estudiantes_conectados.push(_estudiante)
//     }
//   }
//   console.log(App.estudiantes_conectados);
// })

// leccion.on('estudiante desconectado', function(_estudiante) {
//   console.log('desconectado');
//   App.grupos = App.grupos.map(grupo => {
//     let grupop = grupo.estudiantes_conectados.filter((estudiante) => estudiante._id != _estudiante._id)
//     grupo.estudiantes_conectados = grupop
//     return grupo
//   })
//   App.estudiantes_conectados = App.estudiantes_conectados.filter((estudiante) => estudiante._id != _estudiante._id)
// })

leccion.on('tiempo restante', function(tiempo) {
  // document.getElementById('leccion-no-dar').disabled = true
  document.getElementById('comenzar-leccion').disabled = true
  document.getElementById('terminar-leccion').disabled = false
  setTimeout(function() {
    document.getElementById('anadir-tiempo').disabled = false
  }, 10000)
  // document.getElementById('tiempo').disabled = false
  App.tiempo = tiempo
})

leccion.on('terminado leccion', function(match) {
  App.tiempo = 'leccion detenida'
  // document.getElementById('leccion-no-dar').disabled = true
  document.getElementById('terminar-leccion').disabled = true
  document.getElementById('comenzar-leccion').disabled = true
  $('#modal1').modal('open');
})

leccion.on('leccion datos', function(leccion) {
  App.dataEstudiantes = leccion.estudiantesDandoLeccion
  App.estudiantes_conectados = []
  var equals = function(x,y){
    return x.matricula === y.matricula;
  };
  for (var i = 0; i < App.grupos.length; i++) {
    App.grupos[i].estudiantes_conectados = []
  }
  App.estudiantes_conectados = _.differenceWith(leccion.estudiantesDandoLeccion, leccion.estudiantesDesconectados, equals)
  console.log(App.estudiantes_conectados);
  for (var i = 0; i < App.estudiantes_conectados.length; i++) {
    var existe = App.estudiantes_conectados.some(estudiante => estudiante._id == App.estudiantes_conectados[i]._id)
    let grupo_index = App.obtenerGrupoEstudiante(App.estudiantes_conectados[i])
    App.grupos[grupo_index].estudiantes_conectados.push(App.estudiantes_conectados[i])
  }
})

function comenzar() {
  // document.getElementById('anadir-tiempo').disabled = false
  leccion.emit('comenzar leccion', true)
}
document.getElementById('anadir-tiempo').disabled = true
function terminarLeccion() {
  leccion.emit('parar leccion', 'la leccion ha sido detenida')
  document.getElementById('terminar-leccion').disabled = true
  document.getElementById('comenzar-leccion').disabled = true
  $('#modal1').modal('open');
}

function terminarLeccionDevelopment() {
  leccion.emit('parar leccion development', 'la leccion ha sido detenida')
  document.getElementById('terminar-leccion-delelopment').disabled = true
}

Offline.on('down', function(data) {
  console.log('desconectado');
})

Offline.on('up', function(data) {
  console.log('conectado');
  // emitir a calcular el tiempo y enviarselo a todos estudiantes
})

leccion.on('connect', function() {
  $.get({
    url: '/api/session/usuario_conectado',
    success: function(data) {
      leccion.emit('usuario', data.datos)
    }
  })
})

leccion.on('connecting', function() {
  console.log('tratando de reconecta');
})

leccion.on('connect_failed', function() {
  console.log('tratando de recontar');
})

leccion.on('disconnect', function() {
  //console.log('desconectado');
})

$('#comenzar-leccion').one('click', function() {
    $('#comenzar-leccion').attr('disabled','disabled');
    App.tomarLeccion()
});

// $('#anadir-tiempo').one('click', function() {
//     // $('#anadir-tiempo').attr('disabled','disabled');
//
// });
//
function mas() {
  $.ajax({
    url: '/api/lecciones/' + App.leccion._id + '/mas_tiempo',
    method: 'POST',
    data: {tiempo: App.mas_tiempo},
    success: function(res) {
      if (res.estado){
        Materialize.toast('Han sido añadido ' + App.mas_tiempo + ' minutos', 5000);
        leccion.emit('aumentar tiempo', true)
        App.mas_tiempo = 0
      }
    }
  })
  // App.tomarLeccion()
}


// var someElement = document.getElementById('comenzar-leccion');
// someElement.addEventListener('click', function(event){
//     App.tomarLeccion()
// ), false);

$('#input-tiempo').keypress(function(event){
    event.preventDefault();
});
