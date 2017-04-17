var pregunta = new Vue({
	el: '#pregunta',
	mounted: function(){
		
		//$('#summernote').summernote();
		this.getPregunta();
		$('.button-collapse').sideNav();
		$('.myEditor').materialnote();
		$(".note-editor").find("button").attr("type", "button");		//No borrar. Corrige el error estupido de materialNote
	},
	data: {
		aux: true,
		preguntaObtenida: {},
		pregunta: {
			nombre: '',
			descripcion: '',
			//imagenes: [],	//Es opcional añadir imágenes a la pregunta
			tipoPregunta: '',	//V/F, justifiacación u opción múltiple
			//opciones: [],		//Se llena solo si tipoPregunta=='Opcion multiplie'
			tipoLeccion: '',	// Lección, tutorial o laboratorio
			tiempoEstimado: 0,
			//tiempoBandera: 0,	// Tiempo en que la bandera cambiará de color para el Real Time
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
				//$('#summernote').summernote('code', this.preguntaObtenida.descripcion)
				console.log('Pregunta obtenida: ')
				console.log(this.preguntaObtenida)
				console.log(this.preguntaObtenida.tipoLeccion);
				//$('#tipo-pregunta').val(this.preguntaObtenida.tipoPregunta)
			}, response => {
				//error callback
				console.log(response)
			})
		},
		mostrarEditar: function(){
			var self = this;
			self.aux = !self.aux;

		}
	}
});

/*


*/