var App = new Vue({
	el: '#app',
	created: function(){
		this.getLeccion()
	},
	mounted: function(){
		//Inicializadores de materialize
    $('.button-collapse').sideNav();
    $(".dropdown-button").dropdown({ hover: false });
    $('.scrollspy').scrollSpy();
    $('.modal').modal();
    $('.tooltipped').tooltip({delay: 50});
    //Navbar
    $.get({
      url: "/navbar/profesores",
      success: function(data) {
        document.getElementById('#navbar').innerHTML = data;
        $(".button-collapse").sideNav();
        $(".dropdown-button").dropdown();
      }
    });
	},
	data: {
		leccion: {},
		grupo: '',
		preguntas: [],
		leccionId: '',
		estudianteId: '',
		estudiante: {},
		registroCalificacion: {},
		calificacionTotal: 0.00,
		calificacionPonderada: 0.00
	},
	methods: {
		getLeccion: function(){
			//carga la lección que se quiere va a calificar con cada pregunta
			var self = this;
			self.leccionId = window.location.href.toString().split('/')[6];
			self.estudianteId = window.location.href.toString().split('/')[7];
			var obtenerLeccionURL = '/api/lecciones/'+ self.leccionId;
			$.get({
				url: obtenerLeccionURL,
				success: function(res){
					self.leccion = res.datos;
					self.obtenerPreguntas();
					self.getEstudiante();
					self.grupo = window.location.href.toString().split('/')[8];
					self.getRegistroCalificacion();
				}
			});
		},
		obtenerPreguntas: function(){
			//Busca la información completa de cada pregunta de la lección y la guarda en el array preguntas
			var self = this;
			$.each(self.leccion.preguntas, function(index, pregunta){
				var preguntaId = pregunta.pregunta;
				var urlApiPreguntas = '/api/preguntas/' + preguntaId;
				$.get({
					url: urlApiPreguntas,
					success: function(res){
						self.getRespuesta(res.datos)
						self.preguntas.push(res.datos);
					}
				});
			});
		},
		getRespuesta: function(pregunta){
			//Obtiene la respuesta del estudiante a cada pregunta
			var self = this;
			pregunta.respuesta = {};
			var preguntaId = pregunta._id;
			var obtenerRespuestaURL = '/api/respuestas/buscar/leccion/'+ self.leccionId+ '/pregunta/'+preguntaId+ '/estudiante/'+ self.estudianteId;
			$.get({
				url: obtenerRespuestaURL,
				success: function(res){
					if(res.estado&&res.datos!=null){
						pregunta.respuesta = res.datos;
					}
				}
			});
		},
		getEstudiante: function(){
			var self = this;
			var obtenerEstudianteURL = '/api/estudiantes/' + self.estudianteId;
			this.$http.get(obtenerEstudianteURL).then(res => {
				self.estudiante = res.body.datos;
			});
		},
		getRegistroCalificacion: function(){
			var self = this;
			var urlApi = '/api/calificaciones/' + self.leccionId + '/' + self.grupo;
			//console.log(urlApi);
			$.get({
				url: urlApi,
				success: function(res){
					self.registroCalificacion = res.datos[0];
					self.calificacionPonderada = self.registroCalificacion.calificacion;
				}
			})
		},
		//Eventos
		enviarCalificacion: function(){

		},
		regresar: function(){
		},
		recalificar: function(pregunta){
			console.log(pregunta);
		}
	}
});