var app = new Vue({
	el: '#grupos',
	data: {
		grupos: [
			/*GRUPO #1*/
			{
				nombre: 'Grupo #1',
				integrantes: [
					{
						nombre: 'Xavier Idrovo',
						matricula: '201304613',
						correo: 'xidrovo@espol.edu.ec'
					},
					{
						nombre: 'Edison Mora',
						matricula: '201304614',
						correo: 'edanmora@espol.edu.ec'
					},
					{
						nombre: 'Julio Guilindro',
						matricula: '201304612',
						correo: 'julio@espol.edu.ec'
					}
				]
			},
			/*GRUPO #2*/
			{
				nombre: 'Grupo #2',
				integrantes: [
					{
						nombre: 'Joel Rodriguez',
						matricula: '201304617',
						correo: 'joel@espol.edu.ec'
					},
					{
						nombre: 'Jaminson Riascos',
						matricula: '201304616',
						correo: 'jamytafy@espol.edu.ec'
					},
					{
						nombre: 'Jose Viteri',
						matricula: '201404619',
						correo: 'viteri@espol.edu.ec'
					}
				]
			},
			/*Grupo #3*/
			{
				nombre: 'Grupo #3',
				integrantes: [
					{
						nombre: 'Carlos Manosalvas',
						matricula: '201304631',
						correo: 'cmanosalvass@espol.edu.ec'
					},
					{
						nombre: 'Julian Adams',
						matricula: '201304624',
						correo: 'jadams@espol.edu.ec'
					},
					{
						nombre: 'Erick Perez',
						matricula: '201304620',
						correo: 'erick@espol.edu.ec'
					}
				]
			}
		]
	}
});