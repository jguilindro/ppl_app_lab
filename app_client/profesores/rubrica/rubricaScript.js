const profesores = [
	'Florencio Pinela',
	'Jorge Roblero',
	'Luis del Pozo',
	'Jose Sacarelo',
	'Daniela Guzman',
	'Alex Romero',
	'Luis Pabon',
	'Luis Pinos',
	'Wilson Nieto',
	'Milton Cuenca',
	'Paul Daza',
	'Jose Jimenez'
];

const grupos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];

const paralelos = ['1', '2', '3', '4'];

const ejercicios = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15'];

const capitulos = ['21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

const idsInput = ['#', '#', '#', '#', '#', '#', '#', '#', '#', '#', '#'];


let rubricaApp = new Vue({
	el: '#rubricaApp',
	created: function(){

	},
	mounted: function(){
		this.inicializarDOM();
	},
	data: {
		profesores: profesores,
		grupos: grupos,
		paralelos: paralelos,
		ejercicios: ejercicios,
		capitulos: capitulos,
		ಠ_ಠ: '',
		Ѿ: 'butt',
		rubrica: {
			materia: '',
			paralelo: '',
			grupo: '',
			capitulo: '',
			ejercicio: '',
			calificacion: 0,
			evaluador: ''
		}

	},
	methods: {
		inicializarDOM: function(){
			let self = this;
			//Inicializaciones Materialize
			$('.button-collapse').sideNav();
    	$(".dropdown-button").dropdown({ hover: false });
    	//Funciones onChange
    	let selectMateria = $('#selectMateria');
    	selectMateria.change(function(){
    		self.rubrica.materia = $('#selectMateria option:selected').text();
    	});

    	let selectParalelo = $('#selectParalelo');
    	selectParalelo.change(function(){
    		self.rubrica.paralelo = $('#selectParalelo option:selected').text();
    	});

    	let selectGrupo = $('#selectGrupo');
    	selectGrupo.change(function(){
    		self.rubrica.grupo = $('#selectGrupo option:selected').text();
    	});

    	let selectCapitulo = $('#selectCapitulo');
    	selectCapitulo.change(function(){
    		self.rubrica.capitulo = $('#selectCapitulo option:selected').text();
    	});

		},
		//////////////////////////////////////
		//Helpers
		//////////////////////////////////////
		sumarCalificaciones: function(arrayInputs){
			let suma = 0;
			$.each(arrayInputs, function(index, input){
				let valor = input.val();
				suma += valor;
			});

			return suma;
		},
		validarRubrica(){
			let flag = true;
			return flag;
		},
		//////////////////////////////////////
		//Eventos
		//////////////////////////////////////
		calificar: function(){
			let self = this;
			self.rubrica.calificacion = this.sumarCalificaciones(idsInput);
			if(self.validar()){
				self.llamadaApi(self.rubrica);
			}else{
				//Mostar errores
			}
		},
		llamadaApi(data){
			$.ajax({
				type: 'POST',
				url: '/api/rubrica/',
				data: data,
				success: function(res){

				},
				error: function(err){

				}
			});
		}
	}
});

/*
	Cargar la navbar
*/
document.addEventListener("DOMContentLoaded", function(event) {
  $.get({
    url: "/../navbar/profesores",
    success: function(data) {
      document.getElementById('#navbar').innerHTML = data;
      $(".button-collapse").sideNav();
      $(".dropdown-button").dropdown();
    }
  })
});