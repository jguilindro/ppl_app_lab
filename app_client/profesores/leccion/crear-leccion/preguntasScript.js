var app = new Vue({
	mounted: function(){
		$('.button-collapse').sideNav();
		$(".dropdown-button").dropdown({ hover: false });
		$('.scrollspy').scrollSpy();
		$('#modalEliminarPregunta').modal();
		$('#modalNuevoCapitulo').modal();

	},

	el: '#preguntas',
	data: {
		capitulos: [
			{
				nombre: 'Capitulo 1',
				id: 'capitulo1',
				href:'#capitulo1',
				preguntas: [
					{ 
						titulo: 'pregunta #1',
						id: '1-1',
						show: false
					},	{ 
						titulo: 'pregunta #2',
						id: '1-2',
						show: false
					},	{ 
						titulo: 'pregunta #3',
						id: '1-3',
						show: false
					} 
				]
			},
			{
				nombre: 'Capitulo 2',
				id: 'capitulo2',
				href:'#capitulo2',
				preguntas: [
					{ 
						titulo: 'pregunta #1',
						id: '2-1',
						show: false
					},					{ 
						titulo: 'pregunta #2',
						id: '2-2',
						show: false
					},					{ 
						titulo: 'pregunta #3',
						id: '2-3',
						show: false
					},					{ 
						titulo: 'pregunta #4',
						id: '2-4',
						show: false
					} 
				]
			},
			{
				nombre: 'Capitulo 3',
				id: 'capitulo3',
				href:'#capitulo3',
				preguntas: [
					{ 
						titulo: 'pregunta #1',
						id: '3-1',
						show: false
					},					{ 
						titulo: 'pregunta #2',
						id: '3-2',
						show: false
					} 
				]
			},
		]
	},
	methods: {
		nuevaPregunta: function(){
			window.location.href = '/profesores/preguntas/nueva-pregunta'

		},
		eliminarPregunta: function(id){
			var self = this;
			var idPregunta = id;
			$.each(self.capitulos, function(index, capitulo){
				$.each(capitulo.preguntas, function(j, pregunta){
					if (pregunta.id==id) {
						console.log("Edison no te olvides de conectar esto al backend")
					}
				})
			})
			
		},
		nuevoCapitulo: function(event){
			var nombreCapitulo = $('#nombreCapitulo').val();
			var idCapitulo = nombreCapitulo.replace(/\s+/g, '');
			var hrefCapitulo = '#' + idCapitulo;
			//console.log(nombreCapitulo)
			//console.log(idCapitulo)
			//console.log(hrefCapitulo)
			var capitulo = {
				nombre: nombreCapitulo,
				id:  idCapitulo,
				href: hrefCapitulo,
				preguntas: []
			}
			console.log(capitulo)
			this.capitulos.push(capitulo)
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

/*
function crearModal(){
	var modal = $('<div/>').attr({
		'id': 'modalEliminar',
		'class': 'modal'
	});
	var modalContent = $('<div/>').attr({'class': 'modal-content'});
	var modalText = $('<p/>').text('Holaaaa');
	modalContent.append(modalText);
	modal.append(modalContent);
}*/
/*
$('#preguntas').on("click", '.btn-eliminar', function(){
	console.log('Esto va a funcionar carajo');
	//crearModal();
	$('#modalEliminar').modal('open');
})*/

$('body').on("click", '#btnCapituloNuevo', function(){
	//console.log('Esto va a funcionar carajo');
	//console.log($(this).attr('id'))
	$('#modalNuevoCapitulo').modal('open');
})
