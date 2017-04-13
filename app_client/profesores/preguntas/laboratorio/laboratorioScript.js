var laboratorio = new Vue({
	el: '#laboratorio',
	data: {
		laboratorios: [
			{
				nombre: 'Laboratorio #1',
				id: 'laboratorio1',
				href: '#laboratorio1',
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
				nombre: 'Laboratorio #2',
				id: 'laboratorio2',
				href: '#laboratorio2',
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
				nombre: 'Laboratorio #3',
				id: 'laboratorio3',
				href: '#laboratorio3',
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
		$(".dropdown-button").dropdown({ hover: false });
		$('.scrollspy').scrollSpy();
		$('#modalEliminarPregunta').modal();
		$('#modalNuevoLab').modal();
	},
	methods: {
		nuevaPregunta: function(){
			window.location.href = '/profesores/preguntas/nueva-pregunta'

		},
		eliminarPregunta: function(id){
			var self = this;
			var idPregunta = id;
			$.each(self.laboratorios, function(index, lab){
				$.each(lab.preguntas, function(j, pregunta){
					if (pregunta.id==id) {
						console.log("Edison no te olvides de conectar esto al backend")
					}
				})
			})
			
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
		}
	}
});

$('body').on("click", '#btnLabNuevo', function(){
	//console.log('Esto va a funcionar carajo');
	//console.log($(this).attr('id'))
	$('#modalNuevoLab').modal('open');
})
