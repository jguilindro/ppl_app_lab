var App = new Vue({
  el: '#app',
  mounted: function(){
    this.obtenerLogeado();
    this.obtenerLeccion();
    //Inicializaciones de Materializecss
    $('ul.tabs').tabs();
  },
  methods: {
    obtenerLogeado: function() {
      var self = this;
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
            self.estudiante = res.body.datos;
            console.log(self.estudiante)
          }
        });
    },
    obtenerLeccion: function(){
      var self = this;
      var leccionId = 'Byz7_vE0l'   //reemplazar esto luego
      var url = '/api/lecciones/' + leccionId;
      this.$http.get(url).then(response => {
        //succcess callback
        self.leccion = response.body.datos;
        self.obtenerPreguntas();
      }, response => {
        //error callback
        
      });
    },
    obtenerPreguntas: function(){
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
          self.preguntas.push(response.body.datos);
        }, response => {
          //error callback
          consle.log('ERROR');
          console.log(response);
        });
        apiPreguntasUrl = '/api/preguntas/';    //Vuelvo a instanciar la url
      });

    }
  },
  data: {
    tiempo: '',
    leccion: {},
    preguntas: [],
    estudiante: {}
  }
});
/*
var socket = io('/tomando_leccion')
socket.emit('hola', 'sdsads')

socket.on('mi grupo', function(data) {
  console.log(data);
})

socket.on('tiempo restante', function(tiempo) {
  App.tiempo = tiempo
})

socket.on('terminado leccion', function(match) {
  window.location.href = `/estudiantes`
	console.log('se ha terminado la leccion')
})
*/