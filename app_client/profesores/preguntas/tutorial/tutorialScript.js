var practica = new Vue({
	el: '#practica',
	data: {
		practicas: [
			{
				nombre: 'Práctica #1',
				id: 'practica1',
				href: '#practica1',
				preguntas: [
					{
						titulo: 'Pregunta #1',
						id: '1-1',
						show: false
					},
					{
						titulo: 'Pregunta #2',
						id: '1-2',
						show: false
					},
					{
						titulo: 'Pregunta #3',
						id: '1-3',
						show: false
					},
					{
						titulo: 'Pregunta #4',
						id: '1-4',
						show: false
					}
				]
			},
			{
				nombre: 'Práctica #2',
				id: 'practica2',
				href: '#practica2',
				preguntas: [
					{
						titulo: 'Pregunta #1',
						id: '2-1',
						show: false
					},
					{
						titulo: 'Pregunta #2',
						id: '2-2',
						show: false
					},
					{
						titulo: 'Pregunta #3',
						id: '2-3',
						show: false
					},
					{
						titulo: 'Pregunta #4',
						id: '2-4',
						show: false
					},
					{
						titulo: 'Pregunta #5',
						id: '2-5',
						show: false
					}
				]
			},
			{
				nombre: 'Práctica #3',
				id: 'practica3',
				href: '#practica3',
				preguntas: [
					{
						titulo: 'Pregunta #1',
						id: '3-1',
						show: false
					},
					{
						titulo: 'Pregunta #2',
						id: '3-2',
						show: false
					},
					{
						titulo: 'Pregunta #3',
						id: '3-3',
						show: false
					}
				]
			},

		]
	},
	mounted: function(){
		$('.button-collapse').sideNav();
		$('.scrollspy').scrollSpy();
		$(".dropdown-button").dropdown();
		$('#modalEliminarPregunta').modal();
		$('#modalNuevaPractica').modal();
	},
	methods: {
		nuevaPregunta: function(){
			window.location.href = '/profesores/preguntas/nueva-pregunta'

		},
		eliminarPregunta: function(id){
			var self = this;
			var idPregunta = id;
			$.each(self.practicas, function(index, practica){
				$.each(practica.preguntas, function(j, pregunta){
					if (pregunta.id==id) {
						console.log("Edison no te olvides de conectar esto al backend")
					}
				})
			})
			
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
		}
	}
});

$('body').on("click", '#btnPracticaNueva', function(){
	//console.log('Esto va a funcionar carajo');
	//console.log($(this).attr('id'))
	$('#modalNuevaPractica').modal('open');
})
