var App = new Vue({
  mounted: function(){
    $('.button-collapse').sideNav();
    $(".dropdown-button").dropdown({ hover: false });
    $('.scrollspy').scrollSpy();
    $('#modalEliminarPregunta').modal();
    $('#modalNuevoCapitulo').modal();
	this.getLeccion();
	this.getEstudiante();
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
	estudiante: {
	nombres: '',
	apellidos: '',
	correo: '',
	grupo: ''
	},
	feedback: [],
	calificaciones: []
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
		self.respuestas.push(res.body.datos);
		
	});
	},
	
	getEstudiante: function(){
	var estudianteId = window.location.href.toString().split('/')[7];
	var obtenerEstudianteURL = '/api/estudiantes/' + estudianteId;
	this.$http.get(obtenerEstudianteURL).then(res => {
		console.log("Estudiante get: ");
		console.log(res.body.datos);
		App.estudiante.nombres=res.body.datos.nombres;
		App.estudiante.apellidos=res.body.datos.apellidos;
		App.estudiante.correo=res.body.datos.correo;
		App.estudiante.grupo=res.body.datos.grupo;
		console.log(App.estudiante);
	});
	}
	
      }
});

function regresar(){
	window.location.href = '/profesores/leccion/'
}

function enviarFeedback(){

	var leccionId = window.location.href.toString().split('/')[6];
	var grupoId = window.location.href.toString().split('/')[8];
	
	$("input").each(function(index, calificacion){
		App.calificaciones.push($(calificacion).val());
		console.log(App.calificaciones);
	});
	$("textarea").each(function(index, feedback){
		
		App.feedback.push($(feedback).val());
		console.log(App.feedback);
	});

	$.each(App.leccion.preguntas, function(index, pregunta){
		var calificarURL = '/api/respuestas/calificar/leccion/'+ leccionId+ '/pregunta/'+pregunta.pregunta+ '/grupo/'+grupoId;
	    var bodyEnviar= {
		calificacion:''
		};
		bodyEnviar.calificacion= App.calificaciones[index];
	    console.log(bodyEnviar);
	    App.$http.put(calificarURL, bodyEnviar).then(res => {
	    	console.log("Calificacion lista "+ index);

		});


	});
	//window.location.href = '/profesores/leccion/'
}
// document.getElementById('datePicker').valueAsDate = new Date();
// document.getElementById('datePicker').setAttribute('min', "2017-04-09")
