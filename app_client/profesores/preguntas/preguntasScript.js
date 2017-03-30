var app = new Vue({
	mounted: function(){
		$('.button-collapse').sideNav();
		$('.scrollspy').scrollSpy();
	},

	el: '#preguntas',
	data: {
		capitulos: [
			{
				nombre: 'Capitulo 1',
				id: 'capitulo1',
				href:'#capitulo1',
				preguntas: [
					'pregunta #1',
					'pregunta #2',
					'pregunta #3'
				]
			},
			{
				nombre: 'Capitulo 2',
				id: 'capitulo2',
				href:'#capitulo2',
				preguntas: [
					'pregunta #1',
					'pregunta #2',
					'pregunta #3',
					'pregunta #4'
				]
			},
			{
				nombre: 'Capitulo 3',
				id: 'capitulo3',
				href:'#capitulo3',
				preguntas: [
					'pregunta #1',
					'pregunta #2'
				]
			},
		]
	},
	methods: {
		nuevaPregunta: function(){
			window.location.href = '/profesores/preguntas/nueva-pregunta'

		}
	}
});