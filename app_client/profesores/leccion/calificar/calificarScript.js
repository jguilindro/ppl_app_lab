var App = new Vue({
	created: function(){
		this.getLeccion();
		this.getEstudiante();
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
  el: '#app',
  data: {
    leccion: {},
		preguntas: [],
		respuestas: [],
		estudiante: {
			nombres: '',
			apellidos: '',
			correo: '',
			grupo:  ''
		},
		feedback: [],
		calificaciones: [],
		calificacionTotal: 0.00,
		calificacionPonderada: 0.00
  },
  methods: {
		getLeccion: function(){
			//carga la lección que se quiere va a calificar con cada pregunta
			var self = this;
			var leccionId = window.location.href.toString().split('/')[6];
			var obtenerLeccionURL = '/api/lecciones/'+ leccionId;
			$.get({
				url: obtenerLeccionURL,
				success: function(res){
					self.leccion = res.datos
					self.obtenerPreguntas();
					self.grupo = window.location.href.toString().split('/')[8]
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
						self.preguntas.push(res.datos);
					}
				});
				self.getRespuesta(preguntaId);
			});
			self.preguntas.sort(function(p1, p2){
				return ( (p1.ordenPregunta < p2.ordenPregunta) ? -1 : ( (p1.ordenPregunta > p2.ordenPregunta) ? 1 : 0) );
			});
		},
		getRespuesta: function(preguntaId){
			//Obtiene la respuesta del estudiante a cada pregunta
			var self = this;
			var leccionId = window.location.href.toString().split('/')[6];
			var estudianteId = window.location.href.toString().split('/')[7];
			var obtenerRespuestaURL = '/api/respuestas/buscar/leccion/'+ leccionId+ '/pregunta/'+preguntaId+ '/estudiante/'+estudianteId;
			//console.log(obtenerRespuestaURL)
			$.get({
				url: obtenerRespuestaURL,
				success: function(res){
					if(res.estado&&res.datos!=null){
						self.respuestas.push(res.datos)
					}
					
					//console.log(res)
				}
			});
			
		},
		getEstudiante: function(){
			var estudianteId = window.location.href.toString().split('/')[7];
			var obtenerEstudianteURL = '/api/estudiantes/' + estudianteId;
			this.$http.get(obtenerEstudianteURL).then(res => {
				//console.log("Estudiante get: ");
				//console.log(res.body.datos);
				App.estudiante.nombres=res.body.datos.nombres;
				App.estudiante.apellidos=res.body.datos.apellidos;
				App.estudiante.correo=res.body.datos.correo;
				App.estudiante.grupo=res.body.datos.grupo;
				//console.log(App.estudiante);
			});
		},
		calificar: function(pregunta){
			var self = this;
			
			var leccionId = window.location.href.toString().split('/')[6];
			var urlApi = '/api/respuestas/calificar/leccion/' + leccionId + '/pregunta/' + pregunta._id + '/grupo/' + self.grupo;
			
			var calificacionId = '#calificacion-' + pregunta._id;
			var calificacion_pregunta = $(calificacionId).val();
			var puntaje_pregunta = parseInt(pregunta.puntaje);
			
			var feedbackId = '#feedback-' + pregunta._id;
			var feedback_nuevo = $(feedbackId).val();
			if (calificacion_pregunta > 2) {
				Materialize.toast('La calificación debe estar entre 0 y 2. Vuelva a calificar.', 5000, 'red darken-4 rounded');
				return false;
			}
			//Ponderacion por cada pregunta
			/*
				2  									->	puntaje completo de la pregunta
				calificacion_nueva	->	puntaje ponderado de pregunta

				puntaje ponderado de pregunta = (calificacion_nueva * puntaje completo)/2
			*/
			//Ponderacion de la leccion
			/*
				calificacion total = suma de calificaciones de cada pregunta (calificacion_nueva)

				puntaje completo de leccion 	->	100
				calificacion total 						->	calificacion ponderada de leccion

				calificacion ponderada de leccion = (calificacion total * 100 ) / puntaje completo de leccion
			*/
			var calificacion_nueva = ( (calificacion_pregunta * puntaje_pregunta) / 2 );
			$.ajax({
				url: urlApi,
				method: 'PUT',
				data: {
					calificacion: calificacion_nueva,
					feedback: feedback_nuevo
				},
				success: function(res){
					if (res.estado) {
						console.log(res);
						self.calificacionTotal += calificacion_nueva;
						self.calificacionPonderada = parseFloat( ( self.calificacionTotal * 100 ) / parseInt(self.leccion.puntaje) ).toFixed(2);
						self.bloquearTextArea(pregunta._id);
						self.bloquearBtnResponder(pregunta._id);
						self.bloquearInput(pregunta._id);
						Materialize.toast('¡Su calificación ha sido enviada!', 1000, 'rounded');
					}else{
						$('modalErrorCalificar').modal('open');
					}
					
				}
			})
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
		enviarCalificacion: function(){
			//Esta funcion va a actualizar los registros de la colección de calificaciones con la nueva calificación
			var self = this;
			var leccionId = window.location.href.toString().split('/')[6];
			var estudianteId = window.location.href.toString().split('/')[7];
			console.log('El id del estudiante es: ' + estudianteId);
			var urlApi = '/api/calificaciones/calificar/' + leccionId + '/' + self.grupo;
			console.log('Se va a enviar un requerimiento a la url: ' + urlApi + ' con la calificacion: ' + self.calificacionPonderada);
			$.ajax({
				method: 'PUT',
				url: urlApi,
				data: {
					calificacion: self.calificacionPonderada,
					estudiante: estudianteId
				},
				success: function(res){
					console.log(res)
					if(res.estado){
						$('#myModal').modal('open');
					}else{
						$('#modalErrorLeccion').modal('open');
					}
				}
			})
		},
		regresar: function(){
			var leccionId = window.location.href.toString().split('/')[6];
			window.location.href = '/profesores/leccion/calificar/grupos/' + leccionId
		}
  }
});

/*
function enviarFeedback(){

	var leccionId = window.location.href.toString().split('/')[6];
	var grupoId = window.location.href.toString().split('/')[8];
	var calificacionGrupal= 0;
	var bodyEnviar= {
		calificacion:''
		};

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
		bodyEnviar.calificacion= App.calificaciones[index];
		calificacionGrupal= calificacionGrupal + parseInt(bodyEnviar.calificacion);
	    console.log("calificacion individual");
	    console.log(bodyEnviar.calificacion);
	    App.$http.put(calificarURL, bodyEnviar).then(res => {
	    	console.log("Calificacion lista "+ index);
		});
	});

	bodyEnviar.calificacion= calificacionGrupal;
	
	App.$http.put('/api/calificaciones/calificar/'+leccionId+'/'+grupoId, bodyEnviar).then (res=> {
		$('#myModal').modal('open');
	});


	
}*/
