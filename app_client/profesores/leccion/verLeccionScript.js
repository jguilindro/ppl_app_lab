var app = new Vue({
	mounted: function(){
		$('.button-collapse').sideNav();
		$(".dropdown-button").dropdown({ hover: false });
		$('.scrollspy').scrollSpy();
		$('#modalEliminarPregunta').modal();
		$('#modalNuevoCapitulo').modal();
		this.getLecciones();

	},

	el: '#preguntas',
	data: {
		lecciones: []
	},
	methods: {
		nuevaPregunta: function(){

			window.location.href = '/profesores/leccion/crear'

		},
		eliminarLeccion: function(id){
			var self = this;

			var url = '/api/lecciones/' + id;
			this.$http.delete(url).then(response => {
				console.log(response)
				//ELIMINAR LA PREGUNTA DE SELF.CAPITULOS
				self.leccion= [];
				this.getLeccion();			
			}, response => {
				//error callback
				console.log(response)
			});
			
		},
		
		crearModalEliminarLeccion: function(id){
			var self = this;
			var leccionId = id;
			//Primero hay que eliminar el modal-content. Sino cada vez que abran el modal se añadirá un p más
			$('#modalEliminarPreguntaContent').empty();
			//Ahora si añadir las cosas
			var modalContentH4 = $('<h4/>').addClass('center-align').text('Eliminar');
			var modalContentP = $('<p/>').text('Seguro que desea eliminar la leccion: ' + leccionId)
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
				self.eliminarLeccion(leccionId);

			})
			var btnCancelar = $('<a/>').attr({
				'href': '#!',
				'class': 'modal-action modal-close waves-effect waves-green btn-flat'
			});
			btnCancelar.text('Cancelar');
			$('#modalEliminarPreguntaFooter').append(btnEliminar, btnCancelar)
			$('#modalEliminarPregunta').modal('open');
		},
		getLecciones: function(){

			var self = this;
			var flag = false;
			console.log('Inicialmente self.capitulos: ')
			console.log(self.capitulos)
			//Llamada a la api			
			this.$http.get('/api/lecciones').then(response => {
				//success callback				
				self.lecciones = response.body.datos;		//Se almacenarán temporalmente todas las preguntas de la base de datos
				$.each(self.lecciones, function(index, leccion){
						lecciones.push(leccion);
				});
			}, response => {
				//error callback
				console.log(response)
			})
		},
		
	}
});

$('body').on("click", '#btnCapituloNuevo', function(){
	//console.log('Esto va a funcionar carajo');
	//console.log($(this).attr('id'))
	$('#modalNuevoCapitulo').modal('open');
})
