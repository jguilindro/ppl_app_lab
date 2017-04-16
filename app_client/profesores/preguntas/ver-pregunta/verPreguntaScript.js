var pregunta = new Vue({
	el: '#pregunta',
	created: function(){
		$('#summernote').summernote();
		this.getPregunta();

	},
	data: {
		preguntaObtenida: {},
		pregunta: {
			titulo: '',
			descripcion: '',
			imagenes: [],	//Es opcional añadir imágenes a la pregunta
			tipoPregunta: '',	//V/F, justifiacación u opción múltiple
			opciones: [],		//Se llena solo si tipoPregunta=='Opcion multiplie'
			tipoLeccion: '',	// Lección, tutorial o laboratorio
			tiempoEstimado: 0,
			tiempoBandera: 0,	// Tiempo en que la bandera cambiará de color para el Real Time
			creador: '',		//Se deberia llenar con las sesiones, trabajo de Julio Guilindro
			capitulo: '',		//Se llena solo si tipoLeccion=='leccion'
			tutorial: '',		//Se llena solo si tipoLeccion=='tutorial'
			laboratorio: '',	//Se llena solo si tipoLeccion=='Laboratorio'
			puntaje: 0

		}
	},
	methods: {
		getPregunta: function(){
			var preguntaId = window.location.href.toString().split('/')[6]
			console.log('Id de la pregunta: ' + preguntaId)
			var urlApi = '/api/preguntas/' + preguntaId;
			this.$http.get(urlApi).then(response => {
				//success callback
				this.preguntaObtenida = response.body.datos
				console.log('Pregunta obtenida: ')
				console.log(this.preguntaObtenida)
				console.log(this.preguntaObtenida.tipoLeccion);
				//$('#tipo-pregunta').val(this.preguntaObtenida.tipoPregunta)
			}, response => {
				//error callback
				console.log(response)
			})
		}
	}
});

/*


*/