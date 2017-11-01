let App = new Vue({
	created: function(){
		this.leccionId 		= window.location.href.toString().split('/')[6];
		this.estudianteId = window.location.href.toString().split('/')[7];
		this.grupoId   		= window.location.href.toString().split('/')[8];
		const urlApi		  = '/api/lecciones/datos/' + this.estudianteId + '/' + this.leccionId;
		this.obtenerDatosLeccion(this, urlApi);
	},
  mounted: function(){
    this.inicializarMaterialize();
  },
  el  : '#app',
  data: {
  	leccionId 	 				 : '',	//Id de la lección que se va a calificar
  	grupoId 		 				 : '',	//Id del grupo del estudiante que se va a calificar
  	estudianteId 				 : '',	//Id del estudiante que se va a calificar
    leccion   	 				 : {},	//json que tendrá toda la información de la lección a calificar
		preguntas 	 				 : [],	//array de todas las preguntas de la lección
		respuestas	 				 : [],	//array de las respuestas del estudiante a las preguntas de la lección
		estudiante	 				 : {},	//json del estudiante a calificar
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
	    $('select').material_select();
  	},
  	//////////////////////////////////////////////////////
    //LLAMADAS A LA API
    //////////////////////////////////////////////////////
  	obtenerDatosLeccion : function(self, urlApi){
  		$.get({
  			url 		: urlApi,
  			success : function(res){
  				self.leccion 		= res.datos.leccion;
  				self.estudiante = res.datos.estudiante;
  				self.respuestas = res.datos.respuestas;
  				console.log(self.leccion.preguntas)
  				console.log(self.respuestas)
  				self.preguntas  = self.armarArrayPreguntas(self.leccion.preguntas, self.respuestas);
  			},
  			error: function(err){
  				console.log(err)
  			}
  		});
  	},
  	/*
			Envía la calificación a la base de datos
			Si es exitosa, indica al profesor que se calificó correctamente
			Si hay un error, debe desbloquear el select/textarea/boton
  	*/
  	calificarSubRespuesta: function(data, pregunta, sub){
  		var urlApi = '/api/respuestas/calificar/sub/' + App.leccionId + '/pregunta/' + pregunta._id + '/grupo/' + App.grupoId;
  		$.ajax({
  			url  : urlApi,
  			type : 'PUT',
  			data : data,
  			success: function(res){
  				Materialize.toast('¡Su calificación ha sido enviada!', 1000, 'rounded');
  			},
  			error: function(err){
  				const idSelect 	 = '#calificacion-' + pregunta.orden + '-' + sub.orden;
					const idTextarea = '#fb-'  					+ pregunta.orden + '-' + sub.orden;
					const idBtn 		 = '#btn-'  				+ pregunta.orden + '-' + sub.orden;
  				sub.calificada 	 = false;
  				App.desbloquearElementos(idSelect, idTextarea, idBtn);
  				Materialize.toast('Error al enviar su calificación. Intente de nuevo!', 3000, 'rounded red');
  				console.log(err)
  			}
  		});
  	},
  	calificarRespuesta: function(data, pregunta){
			let urlApi = '/api/respuestas/calificar/leccion/' + App.leccionId + '/pregunta/' + pregunta._id + '/grupo/' + App.grupoId;
  		$.ajax({
  			url  : urlApi,
  			type : 'PUT',
  			data : data,
  			success: function(res){
  				Materialize.toast('¡Su calificación ha sido enviada!', 1000, 'rounded');
  			},
  			error: function(err){
  				const idSelect 	 		= '#calificacion-' + pregunta._id;	//Id del select de la calificacion
					const idTextarea 		= '#feedback-' 		+ pregunta._id;	//Id del textarea del feedback
					const idBtn 		 		= '#btn-' 					+ pregunta._id;	//Id del botón de calificar
  				pregunta.calificada = false;
  				App.desbloquearElementos(idSelect, idTextarea, idBtn);
  				Materialize.toast('Error al enviar su calificación. Intente de nuevo!', 3000, 'rounded red');
  				console.log(err)
  			}
  		});
  	},
  	//Esta funcion va a actualizar los registros de la colección de calificaciones con la nueva calificación
  	enviarCalificacion: function(){
			var urlApi = '/api/calificaciones/calificar/' + App.leccionId + '/' + App.grupoId;
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
    */
    armarArrayPreguntas: function(preguntasObtenidas, respuestasObtenidas){
      let arrayPreguntas = [];
      for( let i = 0; i < preguntasObtenidas.length; i++ ) {
      	//Asigno información de pregunta y el orden de la pregunta
        let preguntaActual   = preguntasObtenidas[i].pregunta;
        preguntaActual.orden = preguntasObtenidas[i].ordenPregunta;
        //Obtengo la respuesta del estudiante
        let respuestaActual  = $.grep(respuestasObtenidas, function(respuesta, i){
        	return preguntaActual._id == respuesta.pregunta;
        })[0];
        //Si la pregunta es una sección se añaden sus subpreguntas y subrespuestas
        preguntaActual.esSeccion = ( preguntaActual.subpreguntas != null && preguntaActual.subpreguntas.length > 0 );
        if( preguntaActual.esSeccion ){
        	preguntaActual.subpreguntas = App.armarArraySubpreguntas(preguntaActual, respuestaActual);
        }else{
        	if( respuestaActual == null ){
        		preguntaActual.calificada = true;
        		arrayPreguntas.push(preguntaActual);
        		continue;		
        	}
        	//Si no lo es, se asigna su respuesta y se aumenta la calificación total
        	App.asignarRespuesta(preguntaActual, respuestaActual);
        	App.modificarCalificacionLeccion(preguntaActual.calificacion, preguntaActual.puntaje);
        }
        //Se añade la pregunta al array que se va a devolver
        arrayPreguntas.push(preguntaActual);
      }
      return arrayPreguntas;
    },
    
    /*
			Devuelve el array de subpreguntas de la pregunta indicada
    */
    armarArraySubpreguntas: function(pregunta, respuesta){
    	let arraySubpreguntas = [];
    	for (var i = 0; i < pregunta.subpreguntas.length; i++) {
    		//Asigno información de subpregunta
    		let subActual    = pregunta.subpreguntas[i];
    		if( respuesta == null ){
    			subActual.calificada = true;
    			arraySubpreguntas.push(subActual);
    			continue;	
    		}
    		//Obtengo la subrespuesta del estudiante
    		let subResActual = $.grep(respuesta.subrespuestas, function(res, i){
    			return subActual.orden == res.ordenPregunta;
    		})[0];
    		//Asigno su respuesta y aumento la calificación total de la lección
    		App.asignarRespuesta(subActual, subResActual);
				App.modificarCalificacionLeccion(subActual.calificacion, subActual.puntaje);    		
				//Se añade la subpregunta al array que se va a devolver
    		arraySubpreguntas.push(subActual);
    	}
    	return arraySubpreguntas;
    },
    modificarCalificacionLeccion: function(calificacionPregunta, puntajePregunta){
    	let calPonderada 					= App.ponderarCalificacion(2, calificacionPregunta, puntajePregunta);
    	App.calificacionTotal 		= App.calificacionTotal + calPonderada;
    	App.calificacionPonderada = App.ponderarCalificacion(App.leccion.puntaje, App.calificacionTotal, 100).toFixed(2);
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
		bloquearElementos: function(idSelect, idTextarea, idBtn){
			$(idTextarea).prop('disabled', true);
			$(idBtn).prop('disabled', true);
			$(idSelect).prop('disabled', true);
			$(idSelect).material_select();
		},
		desbloquearElementos: function(idSelect, idTextarea, idBtn){
			$(idTextarea).prop('disabled', false);
			$(idBtn).prop('disabled', false);
			$(idSelect).prop('disabled', false);
			$(idSelect).material_select();
		},
		/*
			Añade los valores de respuesta al objeto de pregunta
			Vue automáticamente le añade los valores a los elementos correspondientes del  DOM
		*/
		asignarRespuesta: function(pregunta, respuesta){
    	pregunta.respuesta 		= respuesta.respuesta;
      pregunta.calificacion = respuesta.calificacion;
      pregunta.feedback 		= respuesta.feedback;
      pregunta.calificada 	= respuesta.calificada;
      //Asignar imagen
      if( respuesta.hasOwnProperty('imagen') ){
      	if( respuesta.imagen.indexOf('imgur') > 0 ){
	  			pregunta.imagen = respuesta.imagen;	
	  		}else{
	  			pregunta.imagen = '';
	  		}	
      }
      if( respuesta.hasOwnProperty('imagenes') ){
      	if( respuesta.imagenes.indexOf('imgur') > 0 ){
	  			pregunta.imagen = respuesta.imagenes;	
	  		}else{
	  			pregunta.imagen = '';
	  		}	
      }
    },
		//////////////////////////////////////////////////////
    //EVENTOS
    //////////////////////////////////////////////////////
		calificar: function(pregunta){
			const idSelect 	 = '#calificacion-' + pregunta._id;	//Id del select de la calificacion
			const idTextarea = '#feedback-' 		+ pregunta._id;	//Id del textarea del feedback
			const idBtn 		 = '#btn-' 					+ pregunta._id;	//Id del botón de calificar
			//Valido la calificación ingresada
			const calificacion = $(idSelect).val();	//Calificación dada a la pregunta: 0, 1 ó 2
			if ( calificacion > 2 || calificacion < 0 ) {
				Materialize.toast('La calificación debe estar entre 0 y 2. Vuelva a calificar.', 5000, 'red darken-4 rounded');
				return false;
			}	
			//Marco la pregunta como calificada y le asigno la calificación y el feedback
			const feedback     	  = $(idTextarea).val();
			pregunta.calificada   = true;
			pregunta.calificacion = calificacion;
			pregunta.feedback 		= feedback;
			//Deshabilito el select y el textarea manualmente porque Materialize no se lleva con Vue...
			App.bloquearElementos(idSelect, idTextarea, idBtn);
			//Actualizo los valores de la calificación total de la lección
			const calPonderada  			= App.ponderarCalificacion(2, calificacion, parseInt(pregunta.puntaje));
			App.calificacionTotal 		= App.calificacionTotal + calPonderada;
			App.calificacionPonderada = App.ponderarCalificacion(App.leccion.puntaje, App.calificacionTotal, 100).toFixed(2);
			//Envío la calificación a la base
			const data = {
				calificacion: calificacion,
				feedback 		: feedback
			};
			App.calificarRespuesta(data, pregunta);
		},
		/*
			Esta función se ejecuta cuando el profesor califica una pregunta de una sección (subpregunta)
			Se marca la pregunta como calificada y se le asigna la calificación
			Se bloquea el select, el textarea y el botón de calificar de la pregunta
			Se actualiza la calificación de la lección con la nueva calificación ingresada
			Se envía la calificación de la pregunta (subpregunta) a la base de datos
		*/
		calificarSub: function(pregunta, sub){
			const idSelect 	 = '#calificacion-' + pregunta.orden + '-' + sub.orden;
			const idTextarea = '#fb-'  					+ pregunta.orden + '-' + sub.orden;
			const idBtn 		 = '#btn-'  				+ pregunta.orden + '-' + sub.orden;
			//Valido la calificación ingresada
			let calificacion = $(idSelect).val();
			if ( calificacion > 2 || calificacion < 0 ) {
				Materialize.toast('La calificación debe estar entre 0 y 2. Vuelva a calificar.', 5000, 'red darken-4 rounded');
				return false;
			}
			//Marco la subpregunta como calificada y le asigno la calificación y el feedback
			const feedback     	  = $(idTextarea).val();
			sub.calificada   = true;
			sub.calificacion = calificacion
			sub.feedback 		 = feedback;
			//Deshabilito el select y el textarea manualmente porque Materialize no se lleva con Vue...
			App.bloquearElementos(idSelect, idTextarea, idBtn);
			//Actualizo los valores de la calificación total de la lección
			let calPonderada  			  = App.ponderarCalificacion(2, calificacion, sub.puntaje);
			App.calificacionTotal 		= App.calificacionTotal + calPonderada;
			App.calificacionPonderada = App.ponderarCalificacion(App.leccion.puntaje, App.calificacionTotal, 100).toFixed(2);
			//Envío la calificación a la base
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
