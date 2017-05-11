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
    $('.modal').modal();
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
      var url = '/api/grupos/estudiante/' + self.estudiante._id;
      var grupo = ''
      //Primero obtengo el grupo al que el estudiante pertenece. El id
      self.$http.get(url).then(response => {
        //console.log(response.body)
        grupo = response.body.datos._id;
        var urlRegistro = '/api/calificaciones/' + self.leccion._id + '/' + grupo;
        console.log('La url es: ' + urlRegistro);
       //var estudiante = self.estudiante._id;
        var estudiante = {
          estudiante: self.estudiante._id
        }
        console.log('Lo que se le va a agregar es: ' + estudiante)
        self.$http.put(urlRegistro, estudiante).then(response => {
          console.log(response);
        });
      });
      //console.log(grupo)


    },
    
    obtenerParaleloDeEstudiante: function(){
      var self = this;
      var url = '/api/paralelos/estudiante/'
      url = url + self.estudiante._id;
      this.$http.get(url).then(response => {
        //SUCCESS CALLBACK
        self.estudiante.paralelo = response.body.datos._id;
      }, response => {
        //ERROR CALLBACK
        console.log('Error')
        console.log(response);
      })
    },
    obtenerLeccion: function(leccionId){
      var self = this;
      var url = '/api/lecciones/' + leccionId;
      this.$http.get(url).then(response => {
        //succcess callback
        self.leccion = response.body.datos;
        self.anadirParticipanteARegistro();
        $.when($.ajax(self.obtenerPreguntas(leccionId))).then(function () {
          /*$.each(this.preguntas, function(index, pregunta){
            var idEditor = '#editor-' + pregunta._id
            $(idEditor).froalaEditor();
          });*/
          self.crearEditor();
        });
      }, response => {
        //error callback

      });
    },
    obtenerPreguntas: function(leccionId){
      var self = this;
      var idPregunta = '';
      var apiPreguntasUrl = '/api/preguntas/'
      $.each(self.leccion.preguntas, function(index, pregunta){
        idPregunta = pregunta.pregunta;
        apiPreguntasUrl = apiPreguntasUrl + idPregunta;
        self.$http.get(apiPreguntasUrl).then(response => {
          //SUCCESS CALLBACK
          var pregunta = self.crearPregunta(response);
          self.preguntas.push(pregunta);
        }, response => {
          //ERROR CALLBACK
          consle.log('ERROR');
          console.log(response);
        });
        apiPreguntasUrl = '/api/preguntas/';    //Vuelvo a instanciar la url
      });

    },
    crearPregunta: function(res){
      var self = this;
      var pregunta = res.body.datos;
      pregunta.respuesta = ''
      //Busca si la pregunta ya fue respondida, busca en la base de datos si existe una respuesta del estudiante a la pregunta escogida
      var url = '/api/respuestas/buscar/leccion/' + self.leccion._id + '/pregunta/' + pregunta._id + '/estudiante/' + self.estudiante._id;
      self.$http.get(url).then(response => {
        //SUCCESS CALLBACK
        if (response.body.datos!=null) {          //Si la respuesta existe
          pregunta.respuesta = response.body.datos.respuesta;
          pregunta.respondida = true;
        }else{                                    //Si la respuesta no existe
          pregunta.respuesta = '';
          pregunta.respondida = false;
        }
      }, response => {
        //ERROR CALLBACK
        pregunta.respuesta = '';
        pregunta.respondida = false;
      });
      return pregunta;
    },
    //Eventos
    subirImagen: function(pregunta){
      var self = this;
      var fileId = '#file-' + pregunta._id;
      var file = $(fileId);
      /*
      //Compresion a lo Silicon Valley
      var source_img = file[0].files[0];
      var target_img = file[0].files[0];

      var quality =  80;
      output_format = 'jpg';
      target_img.src = jic.compress(source_img,quality,output_format).src
      */
      var clientId = "300fdfe500b1718";
      var xhr = new XMLHttpRequest();
      xhr.open('POST','https://api.imgur.com/3/upload', true);
      xhr.setRequestHeader('Authorization', 'Client-ID ' + clientId);
      xhr.onreadystatechange = function (){
        if (xhr.status === 200 && xhr.readyState === 4) {
          //console.log('subido');
          var url = JSON.parse(xhr.responseText)
          //console.log(url)
          //console.log(url.data.link);
          pregunta.respuesta += 'La imagen subida se encuentra en este link: ' + url.data.link
          $('#modalImagenSubida').modal('open');
        }
      }
      xhr.send(target_img);
    },
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
      this.$http.post(url, respuesta).then(response => {
        //Success callback
        Materialize.toast('¡Su respuesta ha sido enviada!', 1000, 'rounded') // 4000 is the duration of the toast
        console.log('Respuesta enviada... Se procede a bloquear el textarea y a verificar si ha respondido a todas las preguntas')
        pregunta.respondida = true;
        self.bloquearBtnRespuesta(event);
        self.bloquearTextAreaRespondida(pregunta);
        //self.bloquearEditor(pregunta);
        if(self.verificarTodasRespondidas()){
          $('#modalRevisarRespuestas').modal('open');
        }
      }, response => {
        //Error callback
        console.log('Error al tratar de enviar la respuesta... De alguna forma esto es culpa de Xavier Idrovo');
        console.log(response);
      });
    },
    crearRespuesta: function(pregunta){
      var self = this;
      var idEditor = '#editor-' + pregunta._id; //Obtengo el id del editor en el que se encuantra la respuesta que se desea enviar.
      var respuestaEditor = $(idEditor).froalaEditor('html.get') //Obtengo la respuesta escrita
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
      self.$http.get(url).then(response => {
        var idRespuesta = response.body.datos._id;
        self.enviarCorreccion(idRespuesta, pregunta);
      }, response => {

      })
    },
    enviarCorreccion: function(idRespuesta, pregunta){
      var self = this;
      var urlPut = "/api/respuestas/" + idRespuesta;
      self.$http.put(urlPut, {respuesta: pregunta.respuesta}).then(response => {
        //SUCCESS CALLBACK
        console.log('yaaaa')
      }, response => {
        //ERROR CALLBACK
        console.log(response);
        alert('Hubo un error al enviar la corrección. De alguna forma esto es culpa de Xavier')
      });
    },
    crearEditor: function(){
      $.each(this.preguntas, function(index, pregunta){
        var idEditor = '#editor-' + pregunta._id
        $(idEditor).
        froalaEditor({
          requestWithCORS: true,
          crossDomain: true,
          imageUploadURL: 'https://api.imgur.com/3/upload/',
          imageUploadMethod: 'POST',
          
        })
        .on('froalaEditor.image.beforeUpload', function (e, editor, img) {
            var clientId = "300fdfe500b1718";
            var xhr = new XMLHttpRequest();
            xhr.open('POST','https://api.imgur.com/3/upload', true);
            xhr.setRequestHeader('Authorization', 'Client-ID ' + clientId);
            xhr.onreadystatechange = function (){
              if (xhr.status === 200 && xhr.readyState === 4) {
                //console.log('subido');
                var url = JSON.parse(xhr.responseText)
                //console.log(url)
                //console.log(url.data.link);
                //pregunta.respuesta += 'La imagen subida se encuentra en este link: ' + url.data.link
                //$('#modalImagenSubida').modal('open');
              }
            }
            xhr.send(img);
          })
       

      })
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

var socket = io('/tomando_leccion')
socket.emit('hola', 'sdsads')

console.log(getCookie('connect.sid'));
function getCookie(name) {
  console.log('sd');
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
// socket.on('mi grupo', function(data) {
//   console.log(data);
// })

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
$.get({
  url: '/api/session/usuario_conectado',
  success: function(data) {
    console.log(data);
    socket.emit('usuario', data.datos)
  }
})
