var laboratorio = new Vue({
	el: '#laboratorio',
	data: {
		laboratorios: [],
		preguntas: []
	},
	mounted: function(){
		$('.button-collapse').sideNav();
		$(".dropdown-button").dropdown({ hover: false });
		$('.scrollspy').scrollSpy();
		$('#modalEliminarPregunta').modal();
		$('#modalNuevoLab').modal();
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
				self.laboratorios = [];
				self.preguntas = [];
				this.getPreguntas();
			}, response => {
				//error callback
				console.log(response)
			});
			
		},
		nuevoLab: function(event){
			var nombreLab = $('#nombreLab').val();
			var idLab = nombreLab.replace(/\s+/g, '');
			var hrefLab = '#' + idLab;
			//console.log(nombreLab)
			//console.log(idLab)
			//console.log(hrefLab)
			var laboratorio = {
				nombre: nombreLab,
				id:  idLab,
				href: hrefLab,
				preguntas: []
			}
			console.log(laboratorio)
			this.laboratorios.push(laboratorio)
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
					Escogerá solamente las que son de Laboratorio
					Las dividirá por laboratorios para poder mostrarlas al usuario
			*/
			var c = 0;
			var self = this;
			var flag = false;
			console.log('Inicialmente self.laboratorios: ')
			console.log(self.laboratorios)
			//Llamada a la api			
			this.$http.get('/api/preguntas').then(response => {
				//success callback				
				self.preguntas = response.body.datos;		//Se almacenarán temporalmente todas las preguntas de la base de datos
				$.each(self.preguntas, function(index, pregunta){
					//pregunta['show'] = true;
					if (pregunta.tipoLeccion.toLowerCase()=='laboratorio') {
						//Si la pregunta es de laboratorio entonces se tiene que almacenar para mostrarla al usuario
						c++
						console.log('Pregunta #' + c);
						console.log(pregunta.nombre);
						console.log(pregunta.laboratorio);
						$.each(self.laboratorios, function(index, laboratorio){
							//Recorre el array de laboratorios del script. Si encuentra el laboratorio al que pertenece la pregunta, lo añade.
							console.log('Se recorre self.laboratorios para ver si pertenece a alguno')
							console.log('Revisando el laboratorio: ' + laboratorio.nombre)
							if (laboratorio.nombre.toLowerCase()==pregunta.laboratorio.toLowerCase()) {
								console.log('Encontró el laboratorio dentro de self.laboratorios. Se añadirá la pregunta...')
								laboratorio.preguntas.push(pregunta);
								flag = true;	//Cambia la bandera indicando que encontro el laboratorio
								
								return false;
							}else{
								flag=false;
							}
						});
						//Si no encontro el laboratorio, la bandera sigue en falso indicando que el laboratorio no existe. Entonces se crea el laboratorio y se agrega la pregunta
						if (!flag) {
							console.log('No se encontro el laboratorio en self.laboratorios... Se procede a crearlo')
							self.crearLaboratorio(pregunta)
						}
					}

				})
				console.log("Finalmente self.laboratorios: ")
				console.log(self.laboratorios)
			}, response => {
				//error callback
				console.log(response)
			})
		},
		crearLaboratorio: function(pregunta){
			var self = this;
			//console.log(pregunta)
			/*
				Esta funcion se va a utilizar cuando al momento de hacer el requerimiento a /api/preguntas obtengamos todas las preguntas
				Se revisará a cada pregunta el laboratorio al que pertenece
				Si pertenece a un laboratorio que ya se encuentra en self.laboratorios entonces no entrará a esta función
				Si no pertenece a un laboratorio que ya se encuentra en self.laboratorios entones hay que crear ese laboratorio y añadirlo al array self.laboratorios
				Luego se añadirá la pregunta al laboratorio ya creado
				Formato de laboratorio:
				laboratorio = {
					nombre: 'Laboratorio 1: Electrodinámica',
					id: 'laboratorio1'.
					href: '#laboratorio1',
					preguntas: []
				}
			*/
			var nombreLaboratorio = pregunta.laboratorio;
			var idLaboratorio = nombreLaboratorio.toLowerCase();
			idLaboratorio = idLaboratorio.split(":")[0];
			idLaboratorio - idLaboratorio.replace(/\s+/g, '');
			var hrefLaboratorio = '#' + idLaboratorio;
			var laboratorio = {
				nombre: nombreLaboratorio,
				id:  idLaboratorio,
				href: hrefLaboratorio,
				preguntas: []
			}
			laboratorio.preguntas.push(pregunta);
			self.laboratorios.push(laboratorio);
		}
	}
});

$('body').on("click", '#btnLabNuevo', function(){
	//console.log('Esto va a funcionar carajo');
	//console.log($(this).attr('id'))
	$('#modalNuevoLab').modal('open');
})
