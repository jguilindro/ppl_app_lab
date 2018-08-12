var respuestas = {
  template: '<div class="row row_respuestas" v-for="(res, index) in respuestasGrupos">\
    <div class="card-panel col s12 m12 l6" v-if= "res.respuestas.length > 0">\
      <div class="card-content">\
        <p><i class="material-icons cyan-text text-darken-2">group</i>{{res.Nombre}}</p>\
        <p><i class="material-icons cyan-text text-darken-2">person</i>Estudiante : {{res.respuesta[0].estudianteNombre}} {{res.respuesta[0].estudianteApellido}}</p>\
        <p><i class="material-icons cyan-text text-darken-2">info_outline</i>{{res.respuesta[0].preguntaNombre}}</p>\
      </div>\
      <ul id="projects-collection" class="collection">\
        <li class="collection-item avatar">\
          <i class="material-icons circle light-blue darken-2">question_answer</i>\
            <span class="collection-header">Respuestas</span>\
        </li>\
        <li class="collection-item" v-for="(sub, index) in res.respuesta[0].arraySubrespuestas" v-if="sub.respuesta">\
          <div class="row">\
            <div class="col s8">\
              <p class="collections-title indigo-text text-darken-4">Subrespuesta  {{sub.ordenPregunta}}</p>\
              <p class="collections-content">{{sub.respuesta}}</p>\
            </div>\
            <div class="col s4">\
              <img class="materialboxed" :data-caption="sub.respuesta" width="250" :src="sub.imagen">\
            </div>\
          </div>\
        </li>\
      </ul>\
    </div></div>',
  props: ['respuestasGrupos'],
}


var App = new Vue({
  el: '#app',
  mounted() {
    $('.modal').modal({
        dismissible: false
    });
    $('.materialboxed').materialbox();
    $('.collapsible').collapsible({
         accordion : true
      });
  },
  created() {
    this.obtenerLeccion();
    this.obtenerParalelo();
  },
  data: {
    estudiantes_conectados: [],
    grupos: [],
    leccion: {},
    paralelo: {},
    tiempo: '',
    dataEstudiantes: '',
    mas_tiempo: 0,
    respuestas: [],
    respuestasGrupos: [],
    respuestasPreguntas: [],
  },
  components : {
    'ver-respuestas' : respuestas
  },
  methods: {
    obtenerLeccion() {
      var id_leccion = window.location.href.toString().split('/')[5]
      
      this.$http.get(`/api/lecciones/${id_leccion}`).then(function(res) {
        this.leccion = res.body.datos
        if (this.leccion.leccionYaComenzo) {
        document.getElementById('pausar-leccion').disabled = false
        }

        this.obtenerPreguntas(this.leccion);
        this.obtenerTabsPreguntas();
        $('.collapsible').collapsible({
          onOpen: function(el) {
            var self = this;
            self.CollapsibleOpen = true;
          }
      });
      })
    },
    /*
      Abrir/Cerrar el acordeón
    */
    collapsibleClicked: function(event){
      var self = this;
      if(self.DOMupdated && !self.CollapsibleOpen){
        $('.collapsible').collapsible({
          onOpen: function(el) {
            self.CollapsibleOpen = true;
          },
          onClose: function(el){
            self.CollapsibleOpen = false;
          }
        });
        self.DOMupdated = false;
      }
    },
    obtenerParalelo() {
      var id_paralelo = window.location.href.toString().split('/')[7]
      this.$http.get(`/api/paralelos/${id_paralelo}/obtener_paralelo`).then(res => {
        this.paralelo = JSON.parse(JSON.stringify(res.body.datos))
        this.grupos = this.paralelo.grupos
        //
        this.obtenerRespuestaGrupos(this.grupos); 
        //
        this.grupos.forEach(grupo => {
          grupo.estudiantes_conectados = []
        })
      })
    },
    obtenerGrupoEstudiante(_estudiante) {
      let grupo_index = this.grupos.findIndex(grupo => {
        let estudiante = grupo.estudiantes.find(estudiante => {
          return estudiante._id === _estudiante._id
        })
        if (estudiante)
          return true
      })
      return grupo_index
    },
    obtenerConectados(id_grupo) {
      var grupo =  App.grupos.find(function(g) {
        return g._id == id_grupo
      })
      return grupo.estudiantes_conectados.length
    },
    bloquearEstudiante(id_estudiante) {
      console.log(id_estudiante);
    },
    obtenerRespuestaGrupos(grupos){
      console.log('ObtenerRespuestaGrupos');
      for (var i = 0; i < grupos.length; i++) {
        var grupo = {
          nombre : grupos[i].nombre,
          _id : grupos[i]._id,
          respuestas : []
        };
        this.respuestasGrupos.push(grupo)
      }
    },
    obtenerPreguntas(leccion){
      for (var i = 0; i < leccion.preguntas.length; i++) {
        var pregunta = {
          orden : leccion.preguntas[i].ordenPregunta,
          _id : leccion.preguntas[i].pregunta,
          descripcion : '',
          respuestas : []
        };
        this.respuestasPreguntas.push(pregunta)
      }
    },
    obtenerTabsPreguntas(){
      var $tabs = $('#tabsRes');
      for (var i = 0; i < this.respuestasPreguntas.length; i++) {
        a = i+1
        $tabs.children().removeAttr('style');  
        $tabs.append('<li class="tab col s3"><a href="#'+a+'">Seccion '+a+'</a></li>');
        $tabs.tabs().tabs('select_tab','Seccion'+i);
      }
    },
    guardarRespuesta(respuesta){
      console.log('guardarRespuesta');
      //var resGeneral = this.respuestasGrupos;
      var resPreguntas = this.respuestasPreguntas;
      for (var i = 0; i < resPreguntas.length; i++) {
        if(resPreguntas[i]._id == respuesta.pregunta){
          resPreguntas[i].descripcion = respuesta.descripcion;
          if(resPreguntas[i].respuestas.length > 0){
            for (var j = 0; j < resPreguntas[i].respuestas.length; j++) {
              if(resPreguntas[i].respuestas[j].grupoId == respuesta.grupoId){
                if(resPreguntas[i].respuestas[j].arraySubrespuestas.length < respuesta.arraySubrespuestas.length){
                  //resGeneral[i].respuestas[j] = respuesta;
                  resPreguntas[i].respuestas.splice(j,1);
                  resPreguntas[i].respuestas.push(respuesta);
                  resPreguntas[i].respuestas.reverse();
                  Materialize.toast('¡ El '+ respuesta.grupoNombre + 
                  ' Ha respondido a la sección: ' + respuesta.orden + ' !', 5000, 'rounded')
                  break;
                }
                else{
                  console.log('No entra');
                  break;
                }
              }
              else{
                console.log('Sección nueva');
                if ( j == resPreguntas[i].respuestas.length-1){
                  console.log('ultimo elemento');
                  if(resPreguntas[i].respuestas[j] != respuesta.pregunta){
                    console.log('sección añadida');
                    resPreguntas[i].respuestas.push(respuesta);
                    resPreguntas[i].respuestas.reverse();
                    Materialize.toast('¡ El '+ respuesta.grupoNombre + 
                  'Ha respondido a la sección: ' + respuesta.orden + ' !', 5000, 'rounded')
                    break;
                  }
                  else {
                    if(resPreguntas[i].respuestas[j].arraySubrespuestas.length < respuesta.arraySubrespuestas.length){
                      resPreguntas[i].respuestas[j] = respuesta;
                      Materialize.toast('¡ El '+ respuesta.grupoNombre + 
                  'Ha respondido a la sección: ' + respuesta.orden + ' !', 5000, 'rounded')
                      break;
                    }
                    else{break;}
                  }
                }
              }
            }
            break;
          }
          else {
            resPreguntas[i].respuestas.push(respuesta);
            break;
          }
        }
      }
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
                  document.getElementById('pausar-leccion').disabled = false
                  // document.getElementById('leccion-no-dar').disabled = true
                  document.getElementById('comenzar-leccion').disabled = true
                  document.getElementById('terminar-leccion').disabled = false
                  document.getElementById('anadir-tiempo').disabled = false
                }
              })
            }
          }
        })
      }
    }
  }
})


document.getElementById('terminar-leccion').disabled = true
document.getElementById('pausar-leccion').disabled = true

var leccion = io('/tomando_leccion');
// var socket = io({transports: ['websocket']});
leccion.on('TIEMPO_RESTANTE', function(tiempo) {
  //console.log(tiempo)
  // document.getElementById('leccion-no-dar').disabled = true
  document.getElementById('comenzar-leccion').disabled = true
  document.getElementById('terminar-leccion').disabled = false
  setTimeout(function() {
    document.getElementById('anadir-tiempo').disabled = false
  }, 10000)
  // document.getElementById('tiempo').disabled = false
  App.tiempo = tiempo
})

leccion.on('TERMINADO_LECCION', function(match) {
  App.dataEstudiantes = App.estudiantes_conectados.length
  if (!match) {
    Materialize.toast('Hubo un error al terminar la leccion', 5000);
  } else {
    App.tiempo = 'leccion detenida'
    // document.getElementById('leccion-no-dar').disabled = true
    // document.getElementById('aument').disabled = true
    document.getElementById('anadir-tiempo').disabled = true
    document.getElementById('terminar-leccion').disabled = true
    document.getElementById('comenzar-leccion').disabled = true
    $('#modal1').modal('open');
  }
})

leccion.on('estudiante conectado', function(estudiante) {
  let grupo_index = App.obtenerGrupoEstudiante(estudiante)
  var existe = App.estudiantes_conectados.some(est => est._id == estudiante._id)
  if (!existe) {
    if (grupo_index != -1 &&  grupo_index < App.grupos.length) {
        App.estudiantes_conectados.push(estudiante)
        App.grupos[grupo_index].estudiantes_conectados.push(estudiante)
        $('#'+ estudiante._id).removeClass('offline')
        $('#'+ estudiante._id).addClass('online')
    }
  }
})

leccion.on('leccion datos', function(leccion) {
  if (leccion.pausada) {
    document.getElementById('pausar-leccion').disabled = true
    document.getElementById('continuar-leccion').disabled = false
  }
  App.estudiantes_conectados = []
  var equals = function(x,y){
    return x.matricula === y.matricula;
  };
  for (var i = 0; i < App.grupos.length; i++) {
    App.grupos[i].estudiantes_conectados = []
  }
  App.estudiantes_conectados = _.differenceWith(leccion.estudiantesDandoLeccion, leccion.estudiantesDesconectados, equals)
  // console.log(App.estudiantes_conectados);
  console.log('conectados');
  console.log(JSON.stringify(App.estudiantes_conectados))
  // console.log('desconectados');
  // console.log(JSON.stringify(leccion.estudiantesDesconectados))
  for (var i = 0; i < App.estudiantes_conectados.length; i++) {
    var existe = App.estudiantes_conectados.some(estudiante => estudiante._id == App.estudiantes_conectados[i]._id)
    // esto da error de index
    let grupo_index = App.obtenerGrupoEstudiante(App.estudiantes_conectados[i])
    if (grupo_index != -1 &&  grupo_index < App.grupos.length) {
      // for (var i = 0; i < App.grupos[grupo_index].estudiantes_conectados.length; i++) {
      //   if (App.grupos[grupo_index].estudiantes_conectados[i].codigoIngresado) {
      //     $('#esperando-'+ App.grupos[grupo_index].estudiantes_conectados[i]._id).addClass('spinner')
      //   }
      // }
      App.grupos[grupo_index].estudiantes_conectados.push(App.estudiantes_conectados[i])
    }
  }
  if (App.paralelo.estudiantes) {
    for (var i = 0; i < App.paralelo.estudiantes.length; i++) {
      $('#'+ App.paralelo.estudiantes[i]).removeClass('online')
      $('#'+ App.paralelo.estudiantes[i]).addClass('offline')
      // $('#esperando-'+ App.paralelo.estudiantes[i]).removeClass('spinner')
      // $('#esperando-'+ App.paralelo.estudiantes[i]).removeClass('fa-thumbs-o-up fa fa-lg icono')
      // $('#'+ App.paralelo.estudiantes[i]).removeClass('.dando-leccion')
    }
    for (var i = 0; i < App.estudiantes_conectados.length; i++) {
      $('#'+ App.estudiantes_conectados[i]._id).removeClass('offline')
      $('#'+ App.estudiantes_conectados[i]._id).addClass('online')
      // if (App.estudiantes_conectados[i].codigoIngresado && !App.estudiantes_conectados[i].dandoLeccion) {
      //   $('#esperando-'+ App.estudiantes_conectados[i]._id).addClass('spinner')
      // }
      // if (App.estudiantes_conectados[i].dandoLeccion) {
      //    $('#esperando-'+ App.estudiantes_conectados[i]._id).addClass('fa-thumbs-o-up fa fa-lg icono')
      // }
    }
  }
})
var conectado_estado = false
function comenzar() {
  // document.getElementById('anadir-tiempo').disabled = false
  leccion.emit('comenzar leccion', true)
}
document.getElementById('anadir-tiempo').disabled = true
function terminarLeccion() {
  App.dataEstudiantes = App.estudiantes_conectados.length
  $.ajax({
    url: '/api/lecciones/terminar_leccion',
    method: 'POST',
    success: function(response) {
      leccion.emit('parar leccion', 'la leccion ha sido detenida')
      document.getElementById('terminar-leccion').disabled = true
      document.getElementById('comenzar-leccion').disabled = true
    }
  })
}

function terminarLeccionDevelopment() {
  leccion.emit('parar leccion development', 'la leccion ha sido detenida')
  document.getElementById('terminar-leccion-delelopment').disabled = true
}

Offline.on('down', function(data) {
  console.log('desconectado');
  document.getElementById('anadir-tiempo').disabled = true
  document.getElementById('terminar-leccion').disabled = true
  document.getElementById('anadir-tiempo').disabled = true
})

Offline.on('up', function(data) {
  console.log('conectado');
  document.getElementById('terminar-leccion').disabled = false
  document.getElementById('anadir-tiempo').disabled = false
  // emitir a calcular el tiempo y enviarselo a todos estudiantes
})

leccion.on('connect', function() {
  $('.toast').remove()
  if (conectado_estado) {
    document.getElementById('anadir-tiempo').disabled = true
    document.getElementById('terminar-leccion').disabled = true
  }
  conectado_estado = true
  $.get({
    url: '/api/session/usuario_conectado',
    success: function(data) {
      var id_paralelo = window.location.href.toString().split('/')[7]
      var id_leccion = window.location.href.toString().split('/')[5]
      $.get({
        url: `/api/paralelos/${id_paralelo}/obtener_paralelo`,
        success: function(paralelo) {
          // delete paralelo.datos.paralelo
          delete paralelo.datos.grupos
          // delete paralelo.datos.estudiantes
          data.datos['leccion'] = { tiempoEstimado: App.leccion['tiempoEstimado'], fechaInicioTomada: App.leccion['fechaInicioTomada'] }
          data.datos['paraleloId'] = id_paralelo
          data.datos['paralelo'] = paralelo.datos
          data.datos['leccionId'] = id_leccion
          leccion.emit('usuario profesor', data.datos)
        }
      })
    }
  })
})

// leccion.on('connecting', function() {
//   console.log('tratando de reconecta');
// })
//
leccion.on('connect_failed', function() {
  document.getElementById('anadir-tiempo').disabled = true
  document.getElementById('terminar-leccion').disabled = true
})

leccion.on('disconnect', function() {
  Materialize.toast('<h3 style="color: red;"> NO ESTA CONECTADO </h3>');
  document.getElementById('anadir-tiempo').disabled = true
  document.getElementById('terminar-leccion').disabled = true
  document.getElementById('anadir-tiempo').disabled = true
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


function terminarLeccionAjax() {
  
}
document.getElementById('continuar-leccion').disabled = true
leccion.on('get_message', function(mensaje) {
  console.log(mensaje);
})


function pausar() {
  document.getElementById('pausar-leccion').disabled = true
  document.getElementById('continuar-leccion').disabled = false
  document.getElementById('terminar-leccion').disabled = true
  leccion.emit('pausar leccion', {leccion: App.leccion._id, paralelo: App.paralelo._id})
}

function continuar() {
  document.getElementById('pausar-leccion').disabled = false
  document.getElementById('continuar-leccion').disabled = true
   document.getElementById('terminar-leccion').disabled = false
  leccion.emit('continuar leccion',  App.leccion._id)
}

leccion.on('respuesta para profesor', function(respuesta_estudiante) {
  
  //App.validarRespuesta(respuesta_estudiante);
  //console.log(App.respuestas);
  //App.respuestas.push(respuesta_estudiante);

  App.guardarRespuesta(respuesta_estudiante);
  console.log(App.respuestasPreguntas);

  //Materialize.toast('¡ El '+ respuesta_estudiante.grupoNombre + 
  //  ' Ha respondido a la ' + respuesta_estudiante.preguntaNombre + ' !', 5000, 'rounded')

  console.log('respuesta de estudiante')
  console.log(respuesta_estudiante)
})

function terminarLeccionModal() {
  $('#seguroTerminar').modal('open')
}

function cancelarTerminarModal() {
  $('#seguroTerminar').modal('close')
}