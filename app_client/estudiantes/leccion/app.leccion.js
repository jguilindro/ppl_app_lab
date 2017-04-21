var App = new Vue({
  el: '#app',
  mounted: function(){
    this.obtenerLogeado();
    // this.obtenerLeccion();
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
          }
        });
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
      //Como la api solo devuelve el id de cada pregunta dentro de la leccion, necesitamos hacer llamadas a la api por cada pregunta para obtener su info
      var self = this;
      var id = '';
      var apiPreguntasUrl = '/api/preguntas/'
      $.each(self.leccion.preguntas, function(index, pregunta){
        //Recorro las preguntas de la leccion y obtengo el id de cada una de ellas. Para cada una armo la url de la api con su id
        id = pregunta.pregunta;
        apiPreguntasUrl = apiPreguntasUrl + id;
        //Hago la llamada a la api por cada pregunta
        self.$http.get(apiPreguntasUrl).then(response => {
          //successful callback
          //Añado cada pregunta al array preguntas.
          var pregunta = response.body.datos
          pregunta.respuesta = '';
          pregunta.respondida = false;
          self.preguntas.push(pregunta);
          var respuesta = {
            respuesta: '',
            feedback: '',
            calificacion: 0,
            fechaRespuesta: '',
            grupo: '',
            pregunta: pregunta.pregunta,
            leccion: leccionId
          }
          self.respuestas.push(respuesta);
        }, response => {
          //error callback
          consle.log('ERROR');
          console.log(response);
        });
        apiPreguntasUrl = '/api/preguntas/';    //Vuelvo a instanciar la url
      });
    },
    obtenerGrupoDeEstudiante: function(){
      var self = this;
      var url = '/api/grupos/estudiante/'
      url = url + self.estudiante._id;
      this.$http.get(url).then(response => {
        //Success callback
        console.log('mira lo siguiente')
        console.log(response)
        self.estudiante.grupo = response.datos._id;
      }, response => {
        //Error callback
      });
    },
    responder: function(pregunta){
      var self = this;
      if(!pregunta.respondida){
        var respuesta = {
          estudiante: self.estudiante._id,
          leccion: self.leccion._id,
          pregunta: pregunta._id,
          paralelo: '',
          grupo: self.estudiante.grupo,
          contestado: true,
          respuesta: pregunta.respuesta,
          feedback: '',
          calificacion: 0
          //fechaRespuesta: new Date($.now())
        }
        console.log(respuesta);
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
  window.location.href = `/estudiantes`
	console.log('se ha terminado la leccion')
})
socket.on('leccion id', function(id_leccion) {
  App.obtenerLeccion(id_leccion)
})

socket.on('pregunta actual', function(pregunta) {
  console.log(pregunta);
})
