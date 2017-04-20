
var app = new Vue({
	mounted: function(){
		$('#summernote').summernote();


	},
	el: '#preguntaNueva',
	data: {
		pregunta: {
			nombre: '',
			descripcion: '',
			//imagenes: [],	//Es opcional añadir imágenes a la pregunta
			tipoPregunta: '',	//v_f, justifiacación u opcion
			//opciones: [],		//Se llena solo si tipoPregunta=='Opcion multiplie'
			tipoLeccion: '',	// estimacion, tutorial o laboratorio
			tiempoEstimado: 0,
			//tiempoBandera: 0,	// Tiempo en que la bandera cambiará de color para el Real Time
			creador: '',		//Se deberia llenar con las sesiones, trabajo de Julio Guilindro
			capitulo: '',		//Se llena solo si tipoLeccion=='leccion'
			tutorial: '',		//Se llena solo si tipoLeccion=='tutorial'
			laboratorio: '',	//Se llena solo si tipoLeccion=='Laboratorio'
			puntaje: 2

		}
	},
	methods: {
		cancelar: function(){
			window.location.href = '/profesores/preguntas/estimacion'
		},
		crearPregunta: function(){
			var self = this;
			console.log(this.pregunta);
			var url = '/api/preguntas';
			this.$http.post(url, self.pregunta).then(response => {
				//success callback
				console.log(response)
			}, response => {
				//error callback
				console.log(response)
			});
			$('#myModal').modal()

		},
		ok: function(){
			window.location.href = '/profesores/preguntas/estimacion'
		}
	}
});

/*
$('#tipo-leccion').change(function(){ 
	//console.log('asdfsdfsd')
	console.log(app.$data.pregunta.tipoLeccion)
	console.log($('#tipo-leccion option:selected').text())	
	//app.set('select', $('#jurisdiction').val()); 
	//console.log( 'Text: ' + $('#tipo-leccion option:selected').text())
	//console.log('Antes: ' + app.$data.pregunta.tipoLeccion)
	//app.$data.pregunta.tipoLeccion = $('#tipo-leccion option:selected').text();
	//console.log('Despues: ' + app.$data.pregunta.tipoLeccion)
});

$('#tipo-pregunta').change(function(){ 
	//app.set('select', $('#jurisdiction').val()); 
	//console.log( 'Text: ' + $('#tipo-pregunta option:selected').text())
	//console.log('Antes: ' + app.$data.pregunta.tipoPregunta)
	app.$data.pregunta.tipoPregunta = $('#tipo-pregunta option:selected').text();
	//console.log('Despues: ' + app.$data.pregunta.tipoPregunta)
});*/
/*
$('#aaa').click(function(){
	console.log($('#summernote').summernote('code'))

	//console.log('asdfafsd')
})*/

$('#summernote').on('summernote.change', function(we, contents, $editable) {
 	app.$data.pregunta.descripcion = contents;
  
})