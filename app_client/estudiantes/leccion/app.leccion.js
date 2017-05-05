/*
  Flujos:
    Responder:
      1. El estudiante escribe su respuesta en el wysiwyg.
      2. Selecciona el botón de enviar respuesta.
      3. Se ejecuta el método responder().
        3.1 Se verifica si es la primera vez que va a responder a esa pregunta
          3.1.1 De ser asi, envia la respuesta. enviarRespuesta()
          3.1.2 Para eso, tiene que crear el objeto de respuesta que se va a enviar a la base de datos. crearRespuseta()
          3.1.3 Ya creado el objeto respuesta lo envía a la base de datos.
          3.1.4 Se marca a la pregunta como respondida y se bloquea el wysiwyg para que no pueda corregir la respuesta haste que termine de hacer la lección.
*/


var App = new Vue({
  el: '#app',
  mounted: function(){
    this.obtenerLogeado();
    //Inicializaciones de Materializecss
    $('ul.tabs').tabs();
    $('.modal').modal();{
    $('.myEditor').materialnote({
        height: "50vh",
        onImageUpload: function(files, editor, $editable) {
        var clientId = "300fdfe500b1718";
        var xhr = new XMLHttpRequest();
        xhr.open('POST', 'https://api.imgur.com/3/upload', true);
        xhr.setRequestHeader('Authorization', 'Client-ID ' + clientId);
        app.loading(true);
         xhr.onreadystatechange = function () {
            if (xhr.status === 200 && xhr.readyState === 4) {
              console.log('subido');
              app.loading(false);
              var url = JSON.parse(xhr.responseText)
              console.log(url.data.link);
              $('.myEditor').materialnote('editor.insertImage', url.data.link);
            }
         }
         xhr.send(files[0]);
      }
    });
    $(".note-editor").find("button").attr("type", "button");

    }
  },
  methods: {
    obtenerLogeado: function() {
      var self = this;
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
            self.estudiante = res.body.datos;
            self.obtenerGrupoDeEstudiante();
            self.obtenerParaleloDeEstudiante();
          }
        });
    },
    obtenerGrupoDeEstudiante: function(){
      var self = this;
      var url = '/api/grupos/estudiante/'
      url = url + self.estudiante._id;
      this.$http.get(url).then(response => {
        //Success callback
        self.estudiante.grupo = response.body.datos._id;
      }, response => {
        //Error callback
        console.log(response);
      });
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
        self.obtenerPreguntas(leccionId);
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
      //FALTA PROBAR ESTO, SON LAS 2 DE LA MAÑANA, LO HARÉ CUANDO ESTÉ MÁS CONSCIENTE DE LO QUE HAGO AHORA
      //Obviamente hubo un error y se descubrió durante la presentación como es costumbre...
      //console.log(res)
      var self = this;
      var pregunta = res.body.datos;
      pregunta.respuesta = ''
      //console.log(pregunta)
      //Busca si la pregunta ya fue respondida, busca en la base de datos si existe una respuesta del estudiante a la pregunta escogida
      var url = '/api/respuestas/buscar/leccion/' + self.leccion._id + '/pregunta/' + pregunta._id + '/estudiante/' + self.estudiante._id;
      self.$http.get(url).then(response => {
        //SUCCESS CALLBACK
        //Si la respuesta existe
        if (response.body.datos!=null) {
          pregunta.respuesta = response.body.datos.respuesta;
          pregunta.respondida = true;
        }else{ //Si la respuesta no existe
          pregunta.respuesta = '';
          pregunta.respondida = false;
        }
        console.log(response)

      }, response => {
        //ERROR CALLBACK
        pregunta.respuesta = '';
        pregunta.respondida = false;
      });
      return pregunta;
    },
    responder: function(pregunta, event){
      var self = this;
      //Durante la leccion, mientras está respondiendo una pregunta y aún quedan más por responder
      if(!pregunta.respondida&&!self.corregirHabilitado){
        console.log('Va a responder por primera vez a la pregunta: ')
        console.log(pregunta)
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
        console.log('Respuesta enviada... Se procede a bloquear el textarea y a verificar si ha respondido a todas las preguntas')
        pregunta.respondida = true;
        self.bloquearBtnRespuesta(event);
        //self.bloquearTextAreaRespondida(pregunta);
        self.bloquearEditor(pregunta);
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
      var respuestaEditor = $(idEditor).code(); //Obtengo la respuesta escrita
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
    }
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

// socket.on('pregunta actual', function(pregunta) {
//   console.log(pregunta);
// })
