var App = new Vue({
  mounted: function(){
    $('.button-collapse').sideNav();
    $(".dropdown-button").dropdown({ hover: false });
    $('.scrollspy').scrollSpy();
    $('#modalEliminarPregunta').modal();
    $('#modalNuevoCapitulo').modal();
	this.getLeccion();
  },
  el: '#app',
  data: {
    leccion: {
      nombre: '',
      tiempoEstimado: '',
      tipo: '',
      fechaInicio: '',
      preguntas: [],
      puntaje: 0
    },
	preguntas: [],
	respuestas: [],
	estudiante:{
	nombre: ''
	}
  },
  methods: {
	//carga la lección que se quiere va a calificar con cada pregunta
	getLeccion: function(){
	var self = this;
	var leccionId = window.location.href.toString().split('/')[6];
	var obtenerLeccionURL = '/api/lecciones/'+ leccionId;
    this.$http.get(obtenerLeccionURL).then(res => {
	self.leccion = res.body.datos;
	leccion= self.leccion;
	//Saca las preguntas de la base de datos
	$.each(self.leccion.preguntas, function(index, pregunta){
	pregunta['show'] = true;
	 var id= pregunta.pregunta;
		self.$http.get('/api/preguntas/'+id).then(res => {
		self.preguntas.push(res.body.datos);
		
        })
		self.getRespuesta(id);
	});
        });
		
	
},
//Obtiene la respuesta del estudiante a dada pregunta
	getRespuesta: function(preguntaId){
	var self = this;
	var leccionId = window.location.href.toString().split('/')[6];
	var estudianteId = window.location.href.toString().split('/')[7];
	var obtenerRespuestaURL = '/api/respuestas/buscar/leccion/'+ leccionId+ '/pregunta/'+preguntaId+ '/estudiante/'+estudianteId;
    this.$http.get(obtenerRespuestaURL).then(res => {
		console.log(res.body.datos);
		self.respuestas.push(res.body.datos);
		
	});
	},
	
	getEstudiante: function(){
	var estudianteId = window.location.href.toString().split('/')[7];
	
	}
	
      }
});

function regresar(){
	window.location.href = '/profesores/grupos/'
}

function enviarFeedback(){
	window.location.href = '/profesores/grupos/'
}
// document.getElementById('datePicker').valueAsDate = new Date();
// document.getElementById('datePicker').setAttribute('min', "2017-04-09")
