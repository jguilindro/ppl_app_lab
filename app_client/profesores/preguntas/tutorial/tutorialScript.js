var practica = new Vue({
	el: '#tutorial',
	data: {
		tutoriales: [],
		preguntas: [],
		profesor: {}
	},
	mounted: function(){
		$('.button-collapse').sideNav();
		$('.scrollspy').scrollSpy();
		$(".dropdown-button").dropdown();
		$('#modalEliminarPregunta').modal();
		$('#modalNuevaPractica').modal();
		this.getPreguntas();
		this.obtenerLogeado();
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
			var practica = {
				nombre: nombrePractica,
				id:  idPractica,
				href: hrefPractica,
				preguntas: []
			}
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
			var self = this;
			var flag = false;
			this.$http.get('/api/preguntas').then(response => {
				//success callback				
				self.preguntas = response.body.datos;		//Se almacenarán temporalmente todas las preguntas de la base de datos
				$.each(self.preguntas, function(index, pregunta){
					pregunta['show'] = true;
					if (pregunta.tipoLeccion.toLowerCase()=='tutorial') {
						$.each(self.tutoriales, function(index, tutorial){
							if (tutorial.nombre.toLowerCase()==pregunta.tutorial.toLowerCase()) {
								tutorial.preguntas.push(pregunta);
								flag = true;	//Cambia la bandera indicando que encontro el tutorial
								return false;
							}else{
								flag=false;
							}
						});
						if (!flag) {
							self.crearTutorial(pregunta)
						}
					}

				})
			}, response => {
				//error callback
				console.log(response)
			})
		},
		crearTutorial: function(pregunta){
			var self = this;
			var nombreTutorial = pregunta.tutorial;
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
		},
		checkCreador: function(pregunta){
			var self = this;
			if(pregunta.creador==self.profesor.correo) return true;
			return false
		},
		obtenerLogeado: function() {
      var self = this;
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
          	self.profesor = res.body.datos;
          }
        });
    }
	}
});

$('body').on("click", '#btnPracticaNueva', function(){
	$('#modalNuevaPractica').modal('open');
})
