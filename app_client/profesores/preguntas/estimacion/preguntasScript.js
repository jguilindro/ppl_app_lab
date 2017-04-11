var app = new Vue({
	mounted: function(){
		$('.button-collapse').sideNav();
		$(".dropdown-button").dropdown({ hover: false });
		$('.scrollspy').scrollSpy();
		$('#modalEliminar').modal();

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
						id: '1-1'
					},	{ 
						titulo: 'pregunta #2',
						id: '1-2'
					},	{ 
						titulo: 'pregunta #3',
						id: '1-3'
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
						id: '2-1'
					},					{ 
						titulo: 'pregunta #2',
						id: '2-2'
					},					{ 
						titulo: 'pregunta #3',
						id: '2-3'
					},					{ 
						titulo: 'pregunta #4',
						id: '2-4'
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
						id: '3-1'
					},					{ 
						titulo: 'pregunta #2',
						id: '3-2'
					} 
				]
			},
		]
	},
	methods: {
		nuevaPregunta: function(){
			window.location.href = '/profesores/preguntas/nueva-pregunta'

		},
		eliminarPregunta: function(event){
			console.log(this)
			console.log(event)
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
