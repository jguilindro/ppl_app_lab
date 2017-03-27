var app = new Vue({
	mounted: function(){
		$('.button-collapse').sideNav();
	},

	el: '#preguntas',
	data: {
		capitulos: [
			{
				nombre: 'Capitulo 1',
				preguntas: [
					'pregunta #1',
					'pregunta #2',
					'pregunta #3'
				]
			},
			{
				nombre: 'Capitulo 2',
				preguntas: [
					'pregunta #1',
					'pregunta #2',
					'pregunta #3',
					'pregunta #4'
				]
			},
			{
				nombre: 'Capitulo 3',
				preguntas: [
					'pregunta #1',
					'pregunta #2'
				]
			},
		]
	}
});