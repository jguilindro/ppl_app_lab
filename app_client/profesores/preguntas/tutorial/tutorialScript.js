var tutorial = new Vue({
	el: '#tutorial',
	data: {
		tutoriales: [
			{
				nombre: 'Tutorial #1',
				id: 'tutorial1',
				href: '#tutorial1',
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
				nombre: 'Tutorial #2',
				id: 'tutorial2',
				href: '#tutorial2',
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
				nombre: 'Tutorial #3',
				id: 'tutorial3',
				href: '#tutorial3',
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
		$(".dropdown-button").dropdown();
	}
});