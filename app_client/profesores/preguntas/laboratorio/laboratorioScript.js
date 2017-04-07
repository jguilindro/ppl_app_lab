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
						id: '1-1'
					},
					{
						titulo: 'Pregunta #2',
						id: '1-2'
					},
					{
						titulo: 'Pregunta #3',
						id: '1-3'
					},
					{
						titulo: 'Pregunta #4',
						id: '1-4'
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
						id: '2-1'
					},
					{
						titulo: 'Pregunta #2',
						id: '2-2'
					},
					{
						titulo: 'Pregunta #3',
						id: '2-3'
					},
					{
						titulo: 'Pregunta #4',
						id: '2-4'
					},
					{
						titulo: 'Pregunta #5',
						id: '2-5'
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
						id: '3-1'
					},
					{
						titulo: 'Pregunta #2',
						id: '3-2'
					},
					{
						titulo: 'Pregunta #3',
						id: '3-3'
					}
				]
			},

		]
	},
	mounted: function(){
		$('.button-collapse').sideNav();
		$('.scrollspy').scrollSpy();
	}
});