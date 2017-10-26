let App = new Vue({
	created: function(){
		this.leccionId 		= window.location.href.toString().split('/')[6];
		this.grupo   			= window.location.href.toString().split('/')[8];
		this.estudianteId = window.location.href.toString().split('/')[7];
		this.grupoId   		= window.location.href.toString().split('/')[8];
		this.obtenerDatosLeccion(this);
	},
  mounted: function(){
    this.inicializarMaterialize();
  },
  el: '#app',
  data: {
  	leccionId : '',
  	grupoId 	: '',
    leccion   : {},
		preguntas : [],
		respuestas: [],
		estudiante: {
			nombres	 : '',
			apellidos: '',
			correo 	 : '',
			grupo 	 :  ''
		},
		feedback 	: [],
		calificacionTotal		 : 0.00,		//Va a ser la suma de las calificaciones (sobre 2) de las preguntas, sobre el puntaje de la lección
		calificacionPonderada: 0.00	//Va a ser la calificación ponderada, sobre 100
  },
  methods: {
  	inicializarMaterialize: function(){
  		$('.button-collapse').sideNav();
	    $(".dropdown-button").dropdown({ hover: false });
	    $('.scrollspy').scrollSpy();
	    $('.modal').modal();
	    $('.tooltipped').tooltip({delay: 50});
  	},
  	//////////////////////////////////////////////////////
    //LLAMADAS A LA API
    //////////////////////////////////////////////////////
  	obtenerDatosLeccion : function(self){
  		$.get({
  			url : '/api/lecciones/datos/' + self.estudianteId + '/' + self.leccionId,
  			success : function(res){
  				self.leccion 		= res.datos.leccion;
  				self.estudiante = res.datos.estudiante;
  				self.respuestas = res.datos.respuestas;
  				self.preguntas  = self.armarArrayPreguntas(res.datos.leccion.preguntas, self.respuestas);
  				console.log(res.datos);
  			},
  			error: function(err){
  				console.log(err)
  			}
  		});
  	},
  	calificarSubRespuesta: function(data, pregunta, sub){
  		var urlApi = '/api/respuestas/calificar/sub/' + App.leccionId + '/pregunta/' + pregunta._id + '/grupo/' + App.grupo;
  		$.ajax({
  			url  : urlApi,
  			type : 'PUT',
  			data : data,
  			success: function(res){
  				console.log(res)
  				Materialize.toast('¡Su calificación ha sido enviada!', 1000, 'rounded');
  			},
  			error: function(err){
  				Materialize.toast('Error al enviar su calificación. Intente de nuevo!', 3000, 'rounded red');
  				sub.calificada = false;
  				//App.desbloquearCalificacion(pregunta, sub);
  				console.log(err)
  			}
  		});
  	},
  	//Esta funcion va a actualizar los registros de la colección de calificaciones con la nueva calificación
  	enviarCalificacion: function(){
			var urlApi = '/api/calificaciones/calificar/' + App.leccionId + '/' + App.grupo;
			$.ajax({
				method: 'PUT',
				url 	: urlApi,
				data 	: {
					calificacion: App.calificacionPonderada,
					estudiante  : App.estudianteId
				},
				success: function(res){
					$('#myModal').modal('open');
				},
				error: function(err){
					console.log(err)
					$('#modalErrorLeccion').modal('open');	
				}
			})
		},
  	//////////////////////////////////////////////////////
    //HELPERS
    //////////////////////////////////////////////////////
    /*
      Devuelve el array de preguntas que se va a mostrar al usuario
      Cada pregunta tendrá la información completa de la pregunta y un boolean indicando si tiene subpreguntas
    */
    armarArrayPreguntas: function(preguntasObtenidas, respuestasObtenidas){
      let arrayPreguntas = [];
      for( let i = 0; i < preguntasObtenidas.length; i++ ) {
        let preguntaActual               = preguntasObtenidas[i].pregunta;
        let respuestaActual 						 = $.grep(respuestasObtenidas, function(respuesta, i){
        	return preguntaActual._id == respuesta.pregunta;
        })[0];
        preguntaActual.orden             = preguntasObtenidas[i].ordenPregunta;
        preguntaActual.subpreguntas 		 = App.armarArraySubpreguntas(preguntaActual, respuestaActual);
        preguntaActual.tieneSubpreguntas = ( preguntaActual.subpreguntas != null && preguntaActual.subpreguntas.length > 0 );
        arrayPreguntas.push(preguntaActual);
      }
      return arrayPreguntas;
    },
    armarArraySubpreguntas: function(pregunta, respuesta){
    	let array = [];
    	for (var i = 0; i < pregunta.subpreguntas.length; i++) {
    		let subActual    = pregunta.subpreguntas[i];
    		let subResActual = $.grep(respuesta.subrespuestas, function(res, i){
    			return subActual.orden == res.ordenPregunta;
    		})[0];

    		subActual.respuesta 	 = subResActual.respuesta;
    		subActual.calificacion = subResActual.calificacion;
    		subActual.feedback 		 = subResActual.feedback;
    		subActual.calificada   = subResActual.calificada;
    		if(subResActual.imagen.indexOf('imgur') > 0){
    			subActual.imagen 		 = subResActual.imagen;	
    		}else{
    			subActual.imagen 		 = '';
    		}
 
    		let calPonderada 					= App.ponderarCalificacion(2, subActual.calificacion, subActual.puntaje);
    		App.calificacionTotal 		= App.calificacionTotal + calPonderada;
    		App.calificacionPonderada = App.ponderarCalificacion(App.leccion.puntaje, App.calificacionTotal, 100).toFixed(2);

    		array.push(subActual);
    	}
    	return array;
    },
    /*
			puntajeMax 			-> ponderacion
			puntajeObtenido -> x

			x = puntajeObtenido * ponderacion / puntajeMax
		*/
		ponderarCalificacion: function(puntajeMax, puntajeObtenido, ponderacion){
			return ( (puntajeObtenido * ponderacion) / puntajeMax );
		},
    //////////////////////////////////////////////////////
    //MODIFICACIONES DOM
    //////////////////////////////////////////////////////
    bloquearCalificacion: function(pregunta, sub){
    	const idInput 	 = '#calificacion-' + pregunta.orden + '-' + sub.orden;
			const idTextarea = '#fb-'  					+ pregunta.orden + '-' + sub.orden;
			const idBtn			 = '#btn-' 					+ pregunta.orden + '-' + sub.orden;
			$(idInput).attr('disabled', true);
			$(idTextarea).attr('disabled', true);
			$(idBtn).attr('disabled', true);
    },
    desbloquearCalificacion: function(pregunta, sub){
    	const idInput 	 = '#calificacion-' + pregunta.orden + '-' + sub.orden;
			const idTextarea = '#fb-'  					+ pregunta.orden + '-' + sub.orden;
			const idBtn			 = '#btn-' 					+ pregunta.orden + '-' + sub.orden;
			$(idInput).attr('disabled', false);
			$(idTextarea).attr('disabled', false);
			$(idBtn).attr('disabled', false);
    },
		bloquearTextArea: function(preguntaId){
			var textareaId = '#feedback-' + preguntaId;
			$(textareaId).attr('disabled', true);
		},
		bloquearBtnResponder: function(preguntaId){
			var btnId = '#btn-' + preguntaId;
			$(btnId).attr('disabled', true);
		},
		bloquearInput: function(preguntaId){
			var inputId = '#calificacion-' + preguntaId;
			$(inputId).attr('disabled', true);
		},
		//////////////////////////////////////////////////////
    //EVENTOS
    //////////////////////////////////////////////////////
		calificar: function(pregunta){
			var self = this;

			var urlApi = '/api/respuestas/calificar/leccion/' + self.leccionId + '/pregunta/' + pregunta._id + '/grupo/' + self.grupo;

			var calificacionId = '#calificacion-' + pregunta._id;
			var calificacion_pregunta = $(calificacionId).val();	//Calificación dada a la pregunta: 0, 1 ó 2
			var puntaje_pregunta = parseInt(pregunta.puntaje);		//Puntaje de la pregunta al momento de crearla.
			var feedbackId = '#feedback-' + pregunta._id;
			var feedback_nuevo = $(feedbackId).val();
			//No se permite darle una calificación mayor a 2. Puede ser 0, 1 ó 2.
			if (calificacion_pregunta > 2 || calificacion_pregunta < 0) {
				Materialize.toast('La calificación debe estar entre 0 y 2. Vuelva a calificar.', 5000, 'red darken-4 rounded');
				return false;
			}
			//Ponderacion por cada pregunta
			/*
				2  									->	puntaje completo de la pregunta
				calificacion_pregunta	->	calificación ponderada de la pregunta

				puntaje ponderado de pregunta = (calificacion_pregunta * puntaje completo)/2
			*/
			//Ponderacion de la leccion
			/*
				calificacion total = suma de calificaciones de cada pregunta (calificacion_pregunta)

				puntaje completo de leccion 	->	100
				calificacion total 						->	calificacion ponderada de leccion

				calificacion ponderada de leccion = (calificacion total * 100 ) / puntaje completo de leccion
			*/
			//var calificacion_nueva = ( (calificacion_pregunta * puntaje_pregunta) / 2 );
			var calificacion_ponderada = ( ( calificacion_pregunta * puntaje_pregunta ) / 2 );	//Ponderación de la calificación de la pregunta. Dada por la regla de 3.
			$.ajax({
				url: urlApi,
				method: 'PUT',
				data: {
					calificacion: calificacion_ponderada,
					feedback: feedback_nuevo
				},
				success: function(res){
					if (res.estado) {
						console.log(res);
						self.calificacionTotal += calificacion_ponderada;
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
		calificarSub: function(pregunta, sub){
			const idInput 	 = '#calificacion-' + pregunta.orden + '-' + sub.orden;
			const idTextarea = '#fb-'  					+ pregunta.orden + '-' + sub.orden;

			//App.bloquearCalificacion(pregunta, sub);

			sub.calificacion = $(idInput).val();
			sub.calificada   = true;

			let calificacion 					= $(idInput).val();
			let calPonderada 					= App.ponderarCalificacion(2, calificacion, sub.puntaje);

			App.calificacionTotal 		= App.calificacionTotal + calPonderada;
			App.calificacionPonderada = App.ponderarCalificacion(App.leccion.puntaje, App.calificacionTotal, 100).toFixed(2);

			let data = {
				ordenPregunta 		: sub.orden,
				calificacionNueva : calificacion,
				feedbackNuevo 		: $(idTextarea).val()
			};
			App.calificarSubRespuesta(data, pregunta, sub);	//AJAX
		},
		regresar: function(){
			window.location.href = '/profesores/leccion/calificar/grupos/' + App.leccionId;
		}
  }
});
