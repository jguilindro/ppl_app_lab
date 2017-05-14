var App = new Vue({
  el: '#app',
  created: function(){
    this.obtenerLogeado();
  },
  mounted: function(){
    //Inicializaciones de Materializecss
    $('ul.tabs').tabs();
    $('.modal').modal();
    $('.tooltipped').tooltip({delay: 50});
    $.get({
      url: '/api/session/usuario_conectado',
      success: function(data) {
        data.datos.leccion = App.leccion._id
        console.log(App.leccion);
        socket.emit('usuario', data.datos)
      }
    })
  },
  methods: {
    //Funciones iniciales
    obtenerLogeado: function() {
      var self = this;
      $.get({
        url: '/api/session/usuario_conectado',
        success: function(res){
          console.log(res)
          if (res.estado) {
            self.estudiante = res.datos;
            self.obtenerGrupoDeEstudiante();
            self.obtenerParaleloDeEstudiante();
          }
        }
      })
    },
    obtenerGrupoDeEstudiante: function(){
      var self = this;
      var urlApi = '/api/grupos/estudiante/'
      urlApi = urlApi + self.estudiante._id;
      $.get({
        url: urlApi,
        success: function(response){
          self.estudiante.grupo = response.datos._id;
        }
      });
    },
    mostrarModal: function(imageUrl){
      $("#modal_Img .modal-content").empty();
      $("<img>",{'src': imageUrl, 'class' : 'center-block' }).appendTo("#modal_Img .modal-content")
      $('#modal_Img').modal('open');
    },
    anadirParticipanteARegistro: function(){
      var self = this;
      var url = '/api/grupos/estudiante/' + App.estudiante._id;
      var grupo = ''
      //Primero obtengo el grupo al que el estudiante pertenece. El id
      // self.$http.get(url).then(response => {
      $.get({
        url: url,
        success: function(response) {
          //console.log(response.body)
          grupo = response.datos._id;
          var urlRegistro = '/api/calificaciones/' + App.leccion._id + '/' + grupo;
          console.log('La url es: ' + urlRegistro);
          var estudiante = {
            estudiante: App.estudiante._id
          }
          console.log('Lo que se le va a agregar es: ' + estudiante)
          $.ajax({
            url: urlRegistro,
            type: 'PUT',
            data: JSON.stringify(estudiante),
            success: function(response) {
              console.log(response);
            }
          })
        }
      });
    },

    obtenerParaleloDeEstudiante: function(){
      var self = this;
      var url = '/api/paralelos/estudiante/'
      url = url + self.estudiante._id;
      $.ajax({
        url: url,
        method: 'GET',
        success: function(response) {
          App.estudiante.paralelo = response.datos._id;
        },
        error: function(response) {
          console.log('Error')
          console.log(response);
        }
      })
    },
    obtenerLeccion: function(leccionId){
      var self = this;
      var url = '/api/lecciones/' + leccionId;
      $.ajax({
        url: url,
        method: 'GET',
        success: function(response) {
          //succcess callback
          App.leccion = response.datos;
          App.anadirParticipanteARegistro();
          $.when($.ajax(App.obtenerPreguntas(leccionId))).then(function () {
            /*$.each(this.preguntas, function(index, pregunta){
              var idEditor = '#editor-' + pregunta._id
              $(idEditor).froalaEditor();
            });*/
            App.crearEditor();
          });
        },
        error: function(response) {
          console.log('ERROR');
        }
      })
    },
    obtenerPreguntas: function(leccionId){
      var self = this;
      var idPregunta = '';
      var apiPreguntasUrl = '/api/preguntas/'
      $.each(App.leccion.preguntas, function(index, pregunta){
        idPregunta = pregunta.pregunta;
        apiPreguntasUrl = apiPreguntasUrl + idPregunta;
        $.ajax({
          url: apiPreguntasUrl,
          methods: 'GET',
          success: function(response) {
            var pregunta = App.crearPregunta(response);
            App.preguntas.push(pregunta);
          },
          error: function(response) {
            consle.log('ERROR');
            console.log(response);
          }
        })
        apiPreguntasUrl = '/api/preguntas/';    //Vuelvo a instanciar la url
      });

    },
    crearPregunta: function(res){
      var self = this;
      var pregunta = res.datos;
      pregunta.respuesta = ''
      //Busca si la pregunta ya fue respondida, busca en la base de datos si existe una respuesta del estudiante a la pregunta escogida
      var url = '/api/respuestas/buscar/leccion/' + App.leccion._id + '/pregunta/' + pregunta._id + '/estudiante/' + App.estudiante._id;
      $.ajax({
        url: url,
        method: 'GET',
        success: function(response) {
          if (response.datos!=null) {          //Si la respuesta existe
            pregunta.respuesta = response.datos.respuesta;
            pregunta.respondida = true;
          }else{                                    //Si la respuesta no existe
            pregunta.respuesta = '';
            pregunta.respondida = false;
          }
        },
        error: function() {
          pregunta.respuesta = '';
          pregunta.respondida = false;
        }
      })
      return pregunta;
    },
    //Eventos
    responder: function(pregunta, event){
      var self = this;
      //Durante la leccion, mientras está respondiendo una pregunta y aún quedan más por responder
      if(!pregunta.respondida&&!self.corregirHabilitado){
        self.enviarRespuesta(pregunta);
      }
      //Después de haber respondido todas las preguntas, si quiere corregir alguna
      else if(pregunta.respondida&&self.corregirHabilitado){
        self.corregirRespuesta(pregunta);
      }
      //Durante la lección, si aún no ha respondido todas las preguntas y quiere volver a enviar una respuesta
      else{
         $('#modalCorregirRespuesta').modal('open');
      }
    },
    enviarRespuesta: function(pregunta){
      var self = this;
      var respuesta = self.crearRespuesta(pregunta);
      console.log('Va a enviar la respuesta: ')
      console.log(respuesta);
      var url = '/api/respuestas/';
      $.ajax({
        url: url,
        method: 'POST',
        data: JSON.stringify(respuesta),
        success: function(response) {
          //Success callback
          Materialize.toast('¡Su respuesta ha sido enviada!', 1000, 'rounded')
          console.log('Respuesta enviada... Se procede a bloquear el textarea y a verificar si ha respondido a todas las preguntas')
          pregunta.respondida = true;
          self.bloquearBtnRespuesta(event);
          self.bloquearTextAreaRespondida(pregunta);
          //self.bloquearEditor(pregunta);
          if(self.verificarTodasRespondidas()){
            $('#modalRevisarRespuestas').modal('open');
          }
        },
        error: function(response) {
          //Error callback
          Materialize.toast('¡Algo ha pasado!, no hemos podido enviar su respuesta', 1000, 'rounded')
          console.log('Error al tratar de enviar la respuesta... De alguna forma esto es culpa de Xavier Idrovo');
          console.log(response);
        }
      })
    },
    crearRespuesta: function(pregunta){
      var self = this;
      var idEditor = '#editor-' + pregunta._id; //Obtengo el id del editor en el que se encuantra la respuesta que se desea enviar.
      var respuestaEditor = $(idEditor).code() //Obtengo la respuesta escrita


      var respuesta = {
        estudiante: self.estudiante._id,
        leccion: self.leccion._id,
        pregunta: pregunta._id,
        paralelo: self.estudiante.paralelo,
        grupo: self.estudiante.grupo,
        contestado: true,
        respuesta: respuestaEditor,
        feedback: '',
        calificacion: 0
      }
      return respuesta;
    },
    bloquearBtnRespuesta: function(event){
      var self = this;
      var btnId = event.currentTarget.id;
      btnId = '#' + btnId;
      $(btnId).attr("disabled", true);
    },
    bloquearTextAreaRespondida: function(pregunta){
      var self = this;
      var textAreaId = "#textarea-respuesta-" + pregunta._id;
      $(textAreaId).attr("disabled", true);
    },
    bloquearEditor: function(pregunta){
      //TODO
    },
    responderTodas: function(){
      var self = this;
      $.each(self.preguntas, function(index, pregunta){
        if(!pregunta.respondida){
          self.responder(pregunta);
        }
      });
      window.location.href = "/estudiantes";
    },
    verificarTodasRespondidas: function(){
      var self = this;
      console.log(self.preguntas)
      var self = this;
      var todasRespondidas = true;
      $.each(self.preguntas, function(index, pregunta){
        console.log('----------------------------')
        console.log('Verificando la pregunta: ');
        console.log(pregunta);
        console.log('Ha sido respondida: ' + pregunta.respondida);
        if(!pregunta.respondida){
          console.log('La pregunta no ha sido respondida');
          todasRespondidas = false;
          return false;
        }
        console.log('----------------------------')
      });
      return todasRespondidas;
    },

    revisarLeccion: function(){
      var self = this;
      self.corregirHabilitado = true;
      $.each(self.preguntas, function(index, pregunta){
        self.desbloquearBtnRespuesta(pregunta);
        self.desbloquearTextAreaRespondida(pregunta);
      });

    },
    desbloquearTextAreaRespondida: function(pregunta){
      var self = this;
      var textAreaId = "#textarea-respuesta-" + pregunta._id;
      $(textAreaId).attr("disabled", false);
    },
    desbloquearEditor: function(pregunta){
      //TODO
    },
    desbloquearBtnRespuesta: function(pregunta){
      var self = this;
      var btnId = "#btn-responder-" + pregunta._id;
      $(btnId).attr("disabled", false);
    },
    corregirRespuesta: function(pregunta){
      var self = this;
      var url = "/api/respuestas/buscar/leccion/" + self.leccion._id + "/pregunta/" + pregunta._id + "/estudiante/" + self.estudiante._id
      $.ajax({
        url: url,
        method: 'GET',
        success: function(response) {
          var idRespuesta = response.datos._id;
          self.enviarCorreccion(idRespuesta, pregunta);
        }
      })
    },
    enviarCorreccion: function(idRespuesta, pregunta){
      var self = this;
      var urlPut = "/api/respuestas/" + idRespuesta;
      $.ajax({
        url: urlPut,
        method: 'PUT',
        data: JSON.stringify({respuesta: pregunta.respuesta}),
        success: function(response) {
          console.log('yaaaa')
        },
        error: function(response) {
          console.log(response);
          alert('Hubo un error al enviar la corrección. De alguna forma esto es culpa de Xavier')
        }
      })
    },
    crearEditor: function(){
      $.each(this.preguntas, function(index, pregunta){
        var idEditor = '#editor-' + pregunta._id;
        $(idEditor).materialnote({
          height: "50vh",
          toolbar: [
            // [groupName, [list of button]]
            ['style', ['bold', 'italic', 'underline']],
            ['para', ['ul', 'ol']],
            ['Insert', ['picture']]
          ],
          onImageUpload: function(files, editor, $editable) {
            var clientId = "300fdfe500b1718";
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://api.imgur.com/3/upload', true);
            xhr.setRequestHeader('Authorization', 'Client-ID ' + clientId);
            App.loading(true);
            xhr.onreadystatechange = function () {
              if (xhr.status === 200 && xhr.readyState === 4) {
                console.log('subido');
                App.loading(false);
                var url = JSON.parse(xhr.responseText)
                console.log(url.data.link);
                $(idEditor).materialnote('editor.insertImage', url.data.link);
              }
            }
            xhr.send(files[0]);
          }
        });
        $(".note-editor").find("button").attr("type", "button");
      });
    },
    loading: function(estado){
      //función que indicará que una foto se está subiendo (si tuviera lo alto y ancho podría simular a la foto en sí.)
      //Requiere el estado, si está cargando algo o no.
      if (estado){
        $(".note-editable").append('<div id="onLoad" class="preloader-wrapper big active"></div>');
        $("#onLoad").append('<div id="load-2" class="spinner-layer spinner-blue-only"></div>');
        $("#load-2").append('<div id="load-3" class="circle-clipper left"></div>');
        $("#load-3").append('<div id="load-4" class="circle"></div>');
      }else{
        $("#onLoad").remove();
      }
    }
  },
  data: {
    tiempo: '',
    leccion: {},
    preguntas: [],
    estudiante: {},
    respuesta: {
      respuesta: '',
      feedback: '',
      calificacion: 0,
      fechaRespuesta: '',
      grupo: '',
      pregunta: '',
      leccion: ''
    },
    respuestas: [],
    corregirHabilitado: false
  }
});

var socket = io('/tomando_leccion', {
  'reconnection delay': 100, // defaults to 500
  'reconnection limit': 100, // defaults to Infinity
  'max reconnection attempts': Infinity // defaults to 10
})

socket.on('tiempo restante', function(tiempo) {
  App.tiempo = tiempo
})

socket.on('terminado leccion', function(match) {
  App.responderTodas();
  //window.location.href = `/estudiantes`
	console.log('se ha terminado la leccion')
})
socket.on('leccion id', function(id_leccion) {
  App.obtenerLeccion(id_leccion)
})
socket.on('desconectarlo', function(dato) {
  Materialize.toast('hubo un error llamar', 15000)
})

$('body').on('click','img',function(){
  App.mostrarModal($(this).attr('src'));
})
// socket.on('pregunta actual', function(pregunta) {
//   console.log(pregunta);
// })


Offline.options = {
  checkOnLoad: true,
  requests: true,
}


Offline.on('down', function(data) {
  // mostrar mensaje que esta desconectado
  //  Materialize.toast('No esta conectado a internet', 6000)
})

Offline.on('up', function(data) {
  // pedir el tiempo
})

socket.on('connect', function() {
  console.log('conectado');
  // pedir tiempo
})

socket.on('tu tiempo', function(tiempo) {
  console.log(tiempo);
})

socket.on('connect', function() {
  $.get({
    url: '/api/session/usuario_conectado',
    success: function(data) {
      socket.emit('reconectar estudiante', data.datos)
    }
  })
  console.log('tratando de reconecta');
})

socket.on('connect_failed', function() {
  console.log('fallo al tratando de recontar');
})

socket.on('disconnect', function() {
  console.log('desconectado');
})
