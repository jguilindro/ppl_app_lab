var pregunta = new Vue({
	el: '#pregunta',
	mounted: function(){
		this.getPregunta();
		$('.button-collapse').sideNav();
		$('.myEditor').materialnote();
		$(".note-editor").find("button").attr("type", "button");		//No borrar. Corrige el error estupido de materialNote
		$('select').material_select();
		 $('.modal').modal();
	},
	data: {
		aux: true,
		preguntaObtenida: {},
		preguntaEditar: {},
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
			//Hago visible la parte de editar pregunta e invisible la parte de ver pregunta
			var self = this;
			self.aux = !self.aux;
			//Copio los valores de la pregutaObtenida en preguntaEditar que será un temporal
			self.preguntaEditar = self.preguntaObtenida;
			console.log(self.preguntaEditar.tipoPregunta)
			//$('.myEditor').materialnote('code', self.preguntaEditar.descripcion)
			$('#firstEditor').code(self.preguntaEditar.descripcion);
			//$('#select-editar-tipo-pregunta').material_select('destroy');
			//$('#select-editar-tipo-pregunta').material_select();
			$('#select-editar-tipo-pregunta option:selected').val('opcion')
			$('.lblEditar').addClass('active')
		},
		prueba: function(){
			console.log($('#firstEditor').code())
			$('select').material_select();
			//$('#select-editar-tipo-pregunta').val(self.preguntaEditar.tipoPregunta)
		},
		actualizarPregunta: function(){
			var self = this;
			console.log('Pregunta actualizada: ');
			console.log(self.preguntaEditar);
			var preguntaId = window.location.href.toString().split('/')[6]
			var url = '/api/preguntas/' + preguntaId;
			this.$http.put(url, self.preguntaEditar).then(response => {
				//success callback
				console.log(response);
				location.reload();
			}, response => {
				//error callback
			});
		},
		eliminarPregunta: function(){
			var self = this;
			var url = '/api/preguntas/'
			var preguntaId = window.location.href.toString().split('/')[6];
			url = url + preguntaId;
			this.$http.delete(url).then(response => {
				//Successful callback
				console.log(response);
				window.location.href = '../';
			}, response => {
				console.log(response)
			});
		}
	}
});


$('#select-editar-tipo-pregunta').change(function(){ 
	//console.log('asdfsdfsd')
	pregunta.$data.preguntaEditar.tipoPregunta = $('#select-editar-tipo-pregunta option:selected').text();
	console.log(pregunta.$data.preguntaEditar.tipoPregunta)
	console.log($('#select-editar-tipo-pregunta option:selected').text())	
	//app.set('select', $('#jurisdiction').val()); 
	//console.log( 'Text: ' + $('#tipo-leccion option:selected').text())
	//console.log('Antes: ' + app.$data.pregunta.tipoLeccion)
	//app.$data.pregunta.tipoLeccion = $('#tipo-leccion option:selected').text();
	//console.log('Despues: ' + app.$data.pregunta.tipoLeccion)
});

$('#firstEditor').on('materialnote.change', function(we, contents, $editable) {
 	pregunta.$data.preguntaEditar.descripcion = contents;
  
})
/*


*/