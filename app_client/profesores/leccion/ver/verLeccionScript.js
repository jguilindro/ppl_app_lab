var appVerLeccion = new Vue({
	el: '#appVerLeccion',
	mounted: function(){
		this.obtenerLeccionActual()
	},
	methods: {
		obtenerLeccionActual: function(){
			var self = this;
			var pathname = window.location.pathname;
			var idLeccion = pathname.split('/')[3];
			var url = '/api/lecciones/' + idLeccion;
			self.$http.get(url).then(response => {
				if(response.body.datos!=null){
					self.leccion = response.body.datos;
					self.obtenerPreguntas();
				}
			}, response => {
				console.log(response)
			});
		},
		obtenerPreguntas: function(){
			var self = this;
			var url = '/api/preguntas/'
			$.each(self.leccion.preguntas, function(index, pregunta){	//Recorro todas las preguntas de la leccion
				url = url + pregunta.pregunta;
				self.$http.get(url).then(response => {		//hago una llamada a la api para que me devuelva toda la info de cada pregunta
					self.preguntas.push(response.body.datos)
				});
				url = '/api/preguntas/';
			});

		},
		prueba: function(){
			var self = this;
			console.log(self.preguntas)
		},
		editar: function(){
			var self = this;
			var pathname = window.location.pathname;
			var idLeccion = pathname.split('/')[3];
			var url = '/profesores/leccion/modificar/' + idLeccion;
			window.location.href = url;
		}
	},
	data: {
		leccion: {},
		preguntas: []
	}
});

