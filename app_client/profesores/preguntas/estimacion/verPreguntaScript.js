var app = new Vue({
	mounted: function(){
		$('.button-collapse').sideNav();
		$(".dropdown-button").dropdown({ hover: false });
		$('.scrollspy').scrollSpy();
		$('#modalEliminarPregunta').modal();
		$('#modalNuevoCapitulo').modal();
		this.getPreguntas();
		this.obtenerLogeado();

	},

	el: '#preguntas',
	data: {
		preguntas: [],
		capitulos: [],
		profesor: {}
	},
	methods: {
		nuevaPregunta: function(){

			window.location.href = '/profesores/preguntas/nueva-pregunta'

		},
		eliminarPregunta: function(id){
			var self = this;
			var url = '/api/preguntas/' + id;
			this.$http.delete(url).then(response => {
				//ELIMINAR LA PREGUNTA DE SELF.CAPITULOS
				self.capitulos = [];
				self.preguntas = []	;
				this.getPreguntas();			
			}, response => {
				//error callback
				console.log(response)
			});
			
		},
		nuevoCapitulo: function(event){
			var nombreCapitulo = $('#nombreCapitulo').val();
			var idCapitulo = nombreCapitulo.replace(/\s+/g, '');
			var hrefCapitulo = '#' + idCapitulo;
			var capitulo = {
				nombre: nombreCapitulo,
				id:  idCapitulo,
				href: hrefCapitulo,
				preguntas: []
			}
			this.capitulos.push(capitulo)
		},
		crearModalEliminarPregunta: function(id){
			var self = this;
			var preguntaId = id;
			//Primero hay que eliminar el modal-content. Sino cada vez que abran el modal se añadirá un p más
			$('#modalEliminarPreguntaContent').empty();
			//Ahora si añadir las cosas
			var modalContentH4 = $('<h4/>').addClass('center-align').text('Eliminar');
			var modalContentP = $('<p/>').text('Seguro que desea eliminar la pregunta: ' + preguntaId)
			modalContentP.addClass('center-align')
			$('#modalEliminarPreguntaContent').append(modalContentH4, modalContentP);
			//Lo mismo con el footer
			$('#modalEliminarPreguntaFooter').empty();
			var btnEliminar = $('<a/>').attr({
				'href': '#!',
				'class': 'modal-action modal-close waves-effect waves-green btn-flat'
			});			
			btnEliminar.text('Eliminar');
			btnEliminar.click(function(){
				self.eliminarPregunta(preguntaId);

			})
			var btnCancelar = $('<a/>').attr({
				'href': '#!',
				'class': 'modal-action modal-close waves-effect waves-green btn-flat'
			});
			btnCancelar.text('Cancelar');
			$('#modalEliminarPreguntaFooter').append(btnEliminar, btnCancelar)
			$('#modalEliminarPregunta').modal('open');
		},
		getPreguntas: function(){
			var self = this;
			var encontroCapitulo = false;
			this.$http.get('/api/preguntas').then(response => {
				//success callback
				self.preguntas = response.body.datos
				$.each(self.preguntas, function(index, pregunta){
					pregunta['show'] = true;
					if (pregunta.tipoLeccion.toLowerCase()=='estimacion') {
						$.each(self.capitulos, function(index, capitulo){
							if (capitulo.nombre.toLowerCase()==pregunta.capitulo.toLowerCase()) {
								capitulo.preguntas.push(pregunta);
								encontroCapitulo = true;
								return false;
							}else{
								encontroCapitulo=false;
							}
						});
						if (!encontroCapitulo) {
							self.crearCapitulo(pregunta)
						}
					}

				})
			}, response => {
				//error callback
				console.log(response)
			})
		},
		crearCapitulo: function(pregunta){
			var self = this;
			var nombreCapitulo = pregunta.capitulo;
			var idCapitulo = nombreCapitulo.toLowerCase();
			idCapitulo = idCapitulo.split(":")[0];
			idCapitulo - idCapitulo.replace(/\s+/g, '');
			var hrefCapitulo = '#' + idCapitulo;
			var capitulo = {
				nombre: nombreCapitulo,
				id:  idCapitulo,
				href: hrefCapitulo,
				preguntas: []
			}
			capitulo.preguntas.push(pregunta);
			self.capitulos.push(capitulo);
		},
		prueba: function(){
			var self = this;
			console.log(self.capitulos)
			console.log(self.preguntas)
		},
		checkCreador: function(pregunta){
			var self = this;
			if(pregunta.creador==self.profesor._id) return true;
			return false
		},
		obtenerLogeado: function() {
      var self = this;
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
          	self.profesor = res.body.datos;
          }
        });
    }

	}
});

$('body').on("click", '#btnCapituloNuevo', function(){
	$('#modalNuevoCapitulo').modal('open');
})
