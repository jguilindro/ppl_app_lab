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
	'Jose Jimenez',
	'Carlos Moreno',
	'Bolivar Flores',
	'Jose Chimbo'
];

const materias = ['Física 2', 'Física 3'];

const grupos = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16'];

const paralelos = ['1', '2', '3', '4', '5'];

const ejercicios = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17'];

const capitulos = ['15', '16', '17-18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];

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
//ARRAY QUE CONTIENE A LOS ARRAYS DE CALIFICACIONES DE CADA EJERCICIO
let arrayCalificaciones = [
	[],				//calificacionE1
	[],				//calificacionE2
	[],				//calificacionE3
	[],				//calificacionE4
	[],				//calificacionE5
	[],				//calificacionE6
	[],				//calificacionE7
	[],				//calificacionE8
	[],				//calificacionE9
	[],				//calificacionE10
	[],				//calificacionE11
	[],				//calificacionE12
	[],				//calificacionE13
	[],				//calificacionE14
	[],				//calificacionE15
];

let rubricaApp = new Vue({
	el: '#rubricaApp',
	created: function(){
		this.obtenerLogeado(this);
	},
	mounted: function(){
		this.inicializarDOM(this);
		this.esconderDivs();
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
			evaluador: '',
			calificaciones: []
		}
	},
	methods: {
		//////////////////////////////////////
		//Llamadas a la base de datos
		//////////////////////////////////////
		obtenerLogeado: function(self) {
  		this.$http.get('/api/session/usuario_conectado').then(response => {
	    	self.profesor = response.body.datos;
	  	});
  	},
  	obtenerRegistros: function(self, urlApi){
  		$.ajax({
  			type: 'GET',
  			url: urlApi,
  			success: function(res){
  				//console.log(res)
  				if(res.estado){
  					const noHayRegistros = (res.datos.length === 0);
  					if(noHayRegistros){
  						console.log('No hay registros en la base de datos.');
  						//Si no hay registros en la base de datos entonces todo se inicializa en 0
  					}else{
  						//Si hay registros, hay que llenar los arrays de calificaciones con las calificaciones obtenidas
  						self.armarArrayCalificaciones(res.datos, arrayCalificaciones);
  					}
  				}
  			},
  			error: function(res){

  			}
  		});
  	},
		//////////////////////////////////////
		//Inicializadores
		//////////////////////////////////////
		inicializarDOM: function(self){
			//Inicializaciones Materialize
			$('.button-collapse').sideNav();
    	$(".dropdown-button").dropdown({ hover: false });
    	$('select').material_select();
    	$('.modal').modal({
    		dismissible: false, // Modal can be dismissed by clicking outside of the modal
      	opacity: .5, // Opacity of modal background
    	});
    	self.bloquearSelects();
    	/* Funciones onChange */
    	$('#selectMateria').change(function(){
    		self.rubrica.materia = $('#selectMateria option:selected').text();
    		self.desbloquearSelectMaterialize('#selectCapitulo');
    	});

    	$('#selectCapitulo').change(function(){
    		self.rubrica.capitulo = $('#selectCapitulo option:selected').text();
    		self.desbloquearSelectMaterialize('#selectParalelo');
    	});

    	$('#selectParalelo').change(function(){
    		self.rubrica.paralelo = $('#selectParalelo option:selected').text();
    		self.desbloquearSelectMaterialize('#selectGrupo');
    	});

			//Al seleccionar el grupo, se debe llamar a la base de datos para obtener los registros de todos los ejercicios
    	$('#selectGrupo').change(function(){
    		self.rubrica.grupo = $('#selectGrupo option:selected').text();
    		let urlApi = '/api/rubrica/paralelo/' + self.rubrica.paralelo + '/grupo/' + self.rubrica.grupo + '/capitulo/' + self.rubrica.capitulo;
    		self.obtenerRegistros(self, urlApi);
    		self.desbloquearSelectMaterialize('#selectEjercicio');
    	});

    	$('#selectEjercicio').change(function(){
    		let ejercicioSeleccionado =  $('#selectEjercicio option:selected').text();
    		self.rubrica.ejercicio = ejercicioSeleccionado;
    		self.mostrarCalificacionesEjercicioSeleccionado(self, ejercicioSeleccionado - 1, arrayCalificaciones, idsInput);
    		self.mostrarDivs();
    	});

    	$('.calificacion').on('change paste', function(){
    		//Cada vez que el profesor ingresa una calificación a una regla de la rúbrica se debe actualizar el valor del total
    		let calificacionNoPonderada = self.sumarCalificaciones(idsInput);
    		self.rubrica.calificacion = self.ponderarCalificacion(calificacionNoPonderada).toFixed(2);
    	});
		},
		/*
			@Descripción:
				Inicializa los valores de los inputs del ejercicio indicado con los valores almacenados de las calificaciones del ejercicio
			@Params:
				numEjercicio -> número del ejercicio seleccionado, el cual se va a calificar o recalificar
				arrayCalificaciones -> array que contiene las calificaciones de todos los 15 ejercicios
		*/
		mostrarCalificacionesEjercicioSeleccionado: function(self, numEjercicio, arrayCalificaciones, idsInput){
			//console.log('Inicializando calificaciones del ejercicio: ' + numEjercicio)
			//Primero selecciono el ejercicio que se quiere mostrar del array de calificaciones
			let calificacionesEjercicio = arrayCalificaciones[numEjercicio];	//Array que contiene las calificaciones de los input del ejercicio seleccionado
			//console.log(calificacionesEjercicio)
			if(calificacionesEjercicio.length > 0){
				//Luego inicializo todos los inputs con los valores indicados en el array seleccionado
				for(let i = 0; i < calificacionesEjercicio.length; i++) {
					let idInput = '#' + calificacionesEjercicio[i].regla;
					$(idInput).val(calificacionesEjercicio[i].calificacion);
				}
				
				let calificacionNoPonderada = self.sumarCalificaciones(idsInput);
	    	self.rubrica.calificacion = self.ponderarCalificacion(calificacionNoPonderada).toFixed(2);
			}else{
				console.log('Este ejercicio no tiene registros de calificaciones en la base de datos');
				$.each(idsInput, function(index, idInput){
					$(idInput).val(0);
				});
			}

		},
		//////////////////////////////////////
		//Helpers
		//////////////////////////////////////
		bloquearSelects: function(){
			$("#selectCapitulo").prop('disabled',true);
			$("#selectParalelo").prop('disabled',true);
			$("#selectGrupo").prop('disabled',true);
			$("#selectEjercicio").prop('disabled',true);
			$('select').material_select();
		},
		/*
			@Params: id del select que se desea desbloquear, con el #
		*/
		desbloquearSelectMaterialize: function(idSelect){
			$(idSelect).prop('disabled', false);
			$(idSelect).material_select();
		},
		esconderDivs: function(){
			$('#seccionReglas').css('display', 'none');
			$('#seccionBotones').css('display', 'none');
		},
		mostrarDivs: function(){
			$('#seccionReglas').css('display', 'block');
			$('#seccionBotones').css('display', 'block');
		},
		/*
			@Descripción: Arma el array de calificaciones global con los datos de la base de datos
				Recorre el array de registros obtenidos de la base de datos
				Añade cada registro al array en la posición correspondiente según su # de ejercicio
			@Params:
				arrayRegistrosBDD -> array de registros de ejercicios obtenidos de la base de datos
				arrayCalificaciones -> array de calificaciones global
		*/
		armarArrayCalificaciones: function(arrayRegistrosBDD, arrayCalificaciones){
			$.each(arrayRegistrosBDD, function(index, registro){
				let indiceArray = registro.ejercicio - 1;
				arrayCalificaciones[indiceArray] = registro.calificaciones;
			});
		},
		/*
			@Descripción: 
				Recorre el array de inputs y suma sus valores actuales del DOM
		*/
		sumarCalificaciones: function(arrayIdsInputs){
			let suma = 0;
			$.each(arrayIdsInputs, function(index, input){
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
			let calificacionPonderada = ( ( calificacionNoPonderada * 15 ) / calificacionMaxima );
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
			let ejercicioSeleccionado = self.rubrica.ejercicio;
			$.each(idsInput, function(index, id){
				let regla 				= id.split("#")[1];
				let calificacion 	= $(id).val();
				if( calificacion != '' ){
					calificacion = parseInt(calificacion);
				}else{
					calificacion = 0;
				}
				let obj = {
					regla 				: regla,
					calificacion 	: calificacion
				};
				
				arrayCalificaciones[ejercicioSeleccionado-1][index] = obj;
			});
			self.rubrica.calificaciones = arrayCalificaciones[ejercicioSeleccionado-1];

			var rubrica = {
				materia 	: self.rubrica.materia,
				paralelo 	: self.rubrica.paralelo,
				grupo 		: self.rubrica.grupo,
				capitulo 	: self.rubrica.capitulo,
				ejercicio : self.rubrica.ejercicio,
				total 		: self.rubrica.calificacion,
			};
			rubrica 						= JSON.stringify(rubrica);
			var calificaciones 	= JSON.stringify(self.rubrica.calificaciones);

			var obj = {
				rubrica : rubrica,
				calificaciones : calificaciones
			};
			self.llamadaApi(obj);
		},
		llamadaApi(data){
			$.ajax({
				type: 'POST',
				url: '/api/rubrica/',
				data: data,
				success: function(res){
					console.log('Exito')
					console.log(res)
					if(res.estado){
						$('#modalCalificacionExitosa').modal('open');
					}
					//Actualizar los valores el array
				},
				error: function(err){
					console.log('Error')
					console.log(err)
				}
			});
		},
	}
});
