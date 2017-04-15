var app = new Vue({
	mounted: function(){
		$('.button-collapse').sideNav();
		$(".dropdown-button").dropdown({ hover: false });
		$('.scrollspy').scrollSpy();
		$('#modalEliminarPregunta').modal();
		$('#modalNuevoCapitulo').modal();
		this.getPreguntas();

	},
	el: '#preguntas',
	data: {
		preguntas: [],
		capitulos: [
			
		],
		aux: true
	},
methods: {
			getPreguntas: function(){
			/*
				Esta función hará lo siguiente:
					Hará una llamada a la api de preguntas
					Obtendrá todas las preguntas de la base de datos
					Escogerá solamente las que son de Estimación
					Las dividirá por capítulos para poder mostrarlas al usuario
			*/
			var c = 0;
			var self = this;
			var flag = false;
			console.log('Inicialmente self.capitulos: ')
			console.log(self.capitulos)
			//Llamada a la api			
			this.$http.get('/api/preguntas').then(response => {
				//success callback				
				self.preguntas = response.body.datos;		//Se almacenarán temporalmente todas las preguntas de la base de datos
				$.each(self.preguntas, function(index, pregunta){
					pregunta['show'] = true;
					if (pregunta.tipoLeccion.toLowerCase()=='estimacion') {
						//Si la pregunta es de estimacion entonces se tiene que almacenar para mostrarla al usuario
						c++
						console.log('Pregunta #' + c);
						console.log(pregunta.nombre);
						console.log(pregunta.capitulo);
						$.each(self.capitulos, function(index, capitulo){
							//Recorre el array de capitulos del script. Si encuentra el capitulo al que pertenece la pregunta, lo añade.
							console.log('Se recorre self.capitulos para ver si pertenece a alguno')
								console.log('Revisando el capitulo: ' + capitulo.nombre)
							if (capitulo.nombre.toLowerCase()==pregunta.capitulo.toLowerCase()) {
								console.log('Encontró el capítulo dentro de self.capitulos. Se añadirá la pregunta...')
								capitulo.preguntas.push(pregunta);
								flag = true;	//Cambia la bandera indicando que encontro el capitulo
								
								return;
							}else{
								flag=false;
							}
						});
						//Si no encontro el capitulo, la bandera sigue en falso indicando que el capitulo no existe. Entonces se crea el capitulo y se agrega la pregunta
						if (!flag) {
							console.log('No se encontro el capitulo en self.capitulos... Se procede a crearlo')
							self.crearCapitulo(pregunta)
						}
					}

				})
				console.log("Finalmente self.capitulos: ")
				console.log(self.capitulos)
			}, response => {
				//error callback
				console.log(response)
			})
		};
}