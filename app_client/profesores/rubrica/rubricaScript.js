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

const idsInput = [
	'#presentacion-1', 
	'#trabajoEnGrupo-1', 
	'#trabajoEnGrupo-2', 
	'#trabajoEnGrupo-3', 
	'#introduccion-1', 
	'#introduccion-2', 
	'#introduccion-3', 
	'#contenidoIndividual-1', 
	'#contenidoIndividual-2', 
	'#contenidoIndividual-3', 
	'#contenidoIndividual-4'
];


let rubricaApp = new Vue({
	el: '#rubricaApp',
	created: function(){

	},
	mounted: function(){
		this.inicializarDOM();
	    $('select').material_select();
		this.obtenerLogeado();
	},
	data: {
		profesores: profesores,
		profesor: {},
		grupos: grupos,
		paralelos: paralelos,
		ejercicios: ejercicios,
		capitulos: capitulos,
		ಠ_ಠ: '',
		Ѿ: moment().format("DD/MM/YYYY"),
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

    	$('.calificacion').on('change paste', function(){
    		let calificacionNoPonderada = self.sumarCalificaciones(idsInput);
    		self.rubrica.calificacion = self.ponderarCalificacion(calificacionNoPonderada).toFixed(2);
    	});

		},
		//////////////////////////////////////
		//Helpers
		//////////////////////////////////////
		sumarCalificaciones: function(arrayInputs){
			let suma = 0;
			$.each(arrayInputs, function(index, input){
				let valor = 0;
				let valorInput = $(input).val();
				if( valorInput != '' ){
					valor = parseInt( valorInput );
				}
				suma += valor;
			});
			return suma;
		},
		ponderarCalificacion: function(calificacionNoPonderada){
			const calificacionMaxima = 22;
			let calificacionPonderada = ( ( calificacionNoPonderada * 20 ) / calificacionMaxima );
			return calificacionPonderada;
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
			let calificacionNoPonderada = this.sumarCalificaciones(idsInput);
			self.rubrica.calificacion = this.ponderarCalificacion(calificacionNoPonderada).toFixed(2);
			console.log(self.rubrica.calificacion)
			/*if(self.validar()){
				self.llamadaApi(self.rubrica);
			}else{
				//Mostar errores
			}*/
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
		},
		obtenerLogeado: function() {
      		this.$http.get('/api/session/usuario_conectado').then(response => {
        	this.profesor = response.body.datos;
      	})}
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