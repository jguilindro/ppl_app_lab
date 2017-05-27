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
		calificacionTotal: 0,
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
					console.log(self.leccion)
					$.when($.ajax(self.obtenerPreguntas())).then(function(){
						self.sumarCalificaciones();
					});
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
						res.datos.ordenPregunta = pregunta.ordenPregunta;
						self.getRespuesta(res.datos);
						self.preguntas.push(res.datos);
					}
				});
			});
			self.preguntas.sort(function(p1, p2){
				return ( (p1.ordenPregunta < p2.ordenPregunta) ? -1 : ( (p1.ordenPregunta > p2.ordenPregunta) ? 1 : 0) );
			});
		},
		getRespuesta: function(pregunta){
			//Obtiene la respuesta del estudiante a cada pregunta
			var self = this;
			pregunta.respuesta = {
				calificacion: 0,
				feedback: ''
			};
			var preguntaId = pregunta._id;
			var obtenerRespuestaURL = '/api/respuestas/buscar/leccion/'+ self.leccionId+ '/pregunta/'+preguntaId+ '/estudiante/'+ self.estudianteId;
			$.get({
				url: obtenerRespuestaURL,
				success: function(res){
					if(res.estado&&res.datos!=null){
						pregunta.respuesta = res.datos;
					}
					if(res.estado&&res.datos==null){
						//Si la respuesta es null entonces el estudiante no respondió esa pregunta.
						//Se bloquean los elementos y la calificación es automáticamente 0
						self.bloquearInput(pregunta._id);
						self.bloquearTextArea(pregunta._id);
						self.bloquearBtnResponder(pregunta._id);
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
					//self.calificacionPonderada = self.registroCalificacion.calificacion;
					self.calificacionPonderada = ( ( self.calificacionTotal * 100 ) / self.leccion.puntaje );
				}
			})
		},
		//Eventos
		enviarCalificacion: function(){
			var self = this;
			var urlApi = '/api/calificaciones/recalificar/leccion/' + self.leccionId + '/grupo/' + self.grupo;
			console.log(urlApi);
			$.ajax({
				method: 'PUT',
				url: urlApi,
				data: {
					calificacion: self.calificacionPonderada,
					estudiante: self.estudianteId
				},
				success: function(res){
					console.log(res);
					if(res.estado){
						$('#myModal').modal('open');
					}else{
						$('#modalErrorLeccion').modal('open');
					}
				}
			});
		},
		regresar: function(){
		},
		recalificar: function(pregunta){
			var self = this;
			var urlApi = '/api/respuestas/calificar/leccion/' + self.leccionId + '/pregunta/' + pregunta._id + '/grupo/' + self.grupo;

			var calificacionId = '#calificacion-' + pregunta._id
			var calificacionPregunta = $(calificacionId).val();

			var feedbackId = '#feedback-' + pregunta._id;
			var feedbackPregunta = $(feedbackId).val();

			var puntajePregunta = parseInt(pregunta.puntaje);

			var calificacionPreguntaPonderada = ( (calificacionPregunta * puntajePregunta) / 2 );

			$.ajax({
				method: 'PUT',
				url: urlApi,
				data: {
					calificacion: calificacionPreguntaPonderada,
					feedback: feedbackPregunta
				},
				success: function(res){
					if(res.estado){
						self.sumarCalificaciones();
						Materialize.toast('¡Su calificación ha sido enviada!', 1000, 'rounded');
					}
				}
			});
		},
		sumarCalificaciones: function(){
			var self = this;
			self.calificacionTotal = 0;
			$.each(self.preguntas, function(index, pregunta){
				console.log(pregunta.respuesta.calificacion)
				self.calificacionTotal += parseInt(pregunta.respuesta.calificacion);
			});
			self.ponderarCalificacionLeccion();
		},
		ponderarCalificacionLeccion: function(){
			this.calificacionPonderada = ( ( this.calificacionTotal * 100 ) / this.leccion.puntaje );
		},
		bloquearTextArea: function(preguntaId){
			var self = this;
			var textareaId = '#feedback-' + preguntaId;
			$(textareaId).attr('disabled', true);
		},
		bloquearBtnResponder: function(preguntaId){
			var self = this;
			var btnId = '#btn-' + preguntaId;
			$(btnId).attr('disabled', true);
		},
		bloquearInput: function(preguntaId){
			var self = this;
			var inputId = '#calificacion-' + preguntaId;
			$(inputId).attr('disabled', true);
		},
	}
});