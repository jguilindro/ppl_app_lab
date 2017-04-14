var practica = new Vue({
	el: '#tutorial',
	data: {
		tutoriales: [],
		preguntas: []
	},
	mounted: function(){
		$('.button-collapse').sideNav();
		$('.scrollspy').scrollSpy();
		$(".dropdown-button").dropdown();
		$('#modalEliminarPregunta').modal();
		$('#modalNuevaPractica').modal();
		this.getPreguntas();
	},
	methods: {
		nuevaPregunta: function(){
			window.location.href = '/profesores/preguntas/nueva-pregunta'

		},
		eliminarPregunta: function(id){
			var url = '/api/preguntas/' + id;
			this.$http.delete(url).then(response => {
				console.log(response)
				//ELIMINAR LA PREGUNTA DE SELF.CAPITULOS
				self.tutoriales = [];
				self.preguntas = [];
				this.getPreguntas();
			}, response => {
				//error callback
				console.log(response)
			});
			
		},
		nuevaPractica: function(event){
			var nombrePractica = $('#nombrePractica').val();
			var idPractica = nombrePractica.replace(/\s+/g, '');
			var hrefPractica = '#' + idPractica;
			//console.log(nombrePractica)
			//console.log(idPractica)
			//console.log(hrefPractica)
			var practica = {
				nombre: nombrePractica,
				id:  idPractica,
				href: hrefPractica,
				preguntas: []
			}
			console.log(practica)
			this.practicas.push(practica)
		},
		crearModalEliminarPregunta: function(id){
			var self = this;
			var preguntaId = id;
			//Primero hay que eliminar el modal-content. Sino cada vez que abran el modal se añadirá un p más
			$('#modalEliminarPreguntaContent').empty();
			//Ahora si añadir las cosas
			var modalContentH4 = $('<h4/>').addClass('center-align').text('Eliminar');
			var modalContentP = $('<p/>').text('Seguro que desea eliminar la pregunta: ' + preguntaId)
			modalContentP.addClass('center-align')
			$('#modalEliminarPreguntaContent').append(modalContentH4, modalContentP);
			//Lo mismo con el footer
			$('#modalEliminarPreguntaFooter').empty();
			var btnEliminar = $('<a/>').attr({
				'href': '#!',
				'class': 'modal-action modal-close waves-effect waves-green btn-flat'
			});			
			btnEliminar.text('Eliminar');
			btnEliminar.click(function(){
				self.eliminarPregunta(preguntaId);
			})
			var btnCancelar = $('<a/>').attr({
				'href': '#!',
				'class': 'modal-action modal-close waves-effect waves-green btn-flat'
			});
			btnCancelar.text('Cancelar');
			$('#modalEliminarPreguntaFooter').append(btnEliminar, btnCancelar)
			$('#modalEliminarPregunta').modal('open');
		},
		getPreguntas: function(){
			/*
				Esta función hará lo siguiente:
					Hará una llamada a la api de preguntas
					Obtendrá todas las preguntas de la base de datos
					Escogerá solamente las que son de Tutorial
					Las dividirá por tutoriales para poder mostrarlas al usuario
			*/
			var c = 0;
			var self = this;
			var flag = false;
			console.log('Inicialmente self.tutoriales: ')
			console.log(self.tutoriales)
			//Llamada a la api			
			this.$http.get('/api/preguntas').then(response => {
				//success callback				
				self.preguntas = response.body.datos;		//Se almacenarán temporalmente todas las preguntas de la base de datos
				$.each(self.preguntas, function(index, pregunta){
					//pregunta['show'] = true;
					if (pregunta.tipoLeccion.toLowerCase()=='tutorial') {
						//Si la pregunta es de tutorial entonces se tiene que almacenar para mostrarla al usuario
						c++
						console.log('Pregunta #' + c);
						console.log(pregunta.nombre);
						console.log(pregunta.capitulo);
						$.each(self.tutoriales, function(index, tutorial){
							//Recorre el array de tutoriales del script. Si encuentra el tutorial al que pertenece la pregunta, lo añade.
							console.log('Se recorre self.tutoriales para ver si pertenece a alguno')
							console.log('Revisando el tutorial: ' + tutorial.nombre)
							if (tutorial.nombre.toLowerCase()==pregunta.capitulo.toLowerCase()) {
								console.log('Encontró el tutorial dentro de self.laboratorios. Se añadirá la pregunta...')
								tutorial.preguntas.push(pregunta);
								flag = true;	//Cambia la bandera indicando que encontro el tutorial
								
								return;
							}else{
								flag=false;
							}
						});
						//Si no encontro el tutorial, la bandera sigue en falso indicando que el tutorial no existe. Entonces se crea el tutorial y se agrega la pregunta
						if (!flag) {
							console.log('No se encontro el tutorial en self.laboratorios... Se procede a crearlo')
							self.crearTutorial(pregunta)
						}
					}

				})
				console.log("Finalmente self.tutoriales: ")
				console.log(self.tutoriales)
			}, response => {
				//error callback
				console.log(response)
			})
		},
		crearTutorial: function(pregunta){
			var self = this;
			//console.log(pregunta)
			/*
				Esta funcion se va a utilizar cuando al momento de hacer el requerimiento a /api/preguntas obtengamos todas las preguntas
				Se revisará a cada pregunta el tutorial al que pertenece
				Si pertenece a un tutorial que ya se encuentra en self.laboratorios entonces no entrará a esta función
				Si no pertenece a un tutorial que ya se encuentra en self.laboratorios entones hay que crear ese tutorial y añadirlo al array self.laboratorios
				Luego se añadirá la pregunta al tutorial ya creado
				Formato de tutorial:
				tutorial = {
					nombre: 'Laboratorio 1: Electrodinámica',
					id: 'laboratorio1'.
					href: '#laboratorio1',
					preguntas: []
				}
			*/
			var nombreTutorial = pregunta.capitulo;
			var idTutorial = nombreTutorial.toLowerCase();
			idTutorial = idTutorial.split(":")[0];
			idTutorial - idTutorial.replace(/\s+/g, '');
			var hrefTutorial = '#' + idTutorial;
			var tutorial = {
				nombre: nombreTutorial,
				id:  idTutorial,
				href: hrefTutorial,
				preguntas: []
			}
			tutorial.preguntas.push(pregunta);
			self.tutoriales.push(tutorial);
		}
	}
});

$('body').on("click", '#btnPracticaNueva', function(){
	//console.log('Esto va a funcionar carajo');
	//console.log($(this).attr('id'))
	$('#modalNuevaPractica').modal('open');
})
