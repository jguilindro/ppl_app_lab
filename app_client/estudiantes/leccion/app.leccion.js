var App = new Vue({
  el: '#app',
  mounted: function(){
    this.obtenerLogeado();
    //Inicializaciones de Materializecss
    $('ul.tabs').tabs();
    $('.modal').modal();
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
      var pregunta = res.body.datos;
      pregunta.respuesta = '';
      pregunta.respondida = false;
      return pregunta;
    },
    responder: function(pregunta){
      var self = this;
      if(!pregunta.respondida){
        var respuesta = self.crearRespuesta(pregunta);
        var url = '/api/respuestas/'
        this.$http.post(url, respuesta).then(response => {
          //Success callback
          console.log(response);
          pregunta.respondida = true;
        }, response => {
          //Error callback
          console.log(response);
        });

      }else{
        console.log('La pregunta ya fue respondida');
        $('#modal1').modal('open');
      }
    },
    crearRespuesta: function(pregunta){
      var self = this;
      var respuesta = {
        estudiante: self.estudiante._id,
        leccion: self.leccion._id,
        pregunta: pregunta._id,
        paralelo: self.estudiante.paralelo,
        grupo: self.estudiante.grupo,
        contestado: true,
        respuesta: pregunta.respuesta,
        feedback: '',
        calificacion: 0
      }
      return respuesta;
    },
    responderTodas: function(){
      var self = this;
      $.each(self.preguntas, function(index, pregunta){
        if(!pregunta.respondida){
          self.responder(pregunta);
        }
      });
      window.location.href = "/estudiantes";
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
    respuestas: []
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

socket.on('pregunta actual', function(pregunta) {
  console.log(pregunta);
})
