var app = new Vue({
	mounted: function(){
		$('.button-collapse').sideNav();
		$(".dropdown-button").dropdown({ hover: false });
		$('.scrollspy').scrollSpy();
		$('#modalEliminarLeccion').modal();
		//$('#modalNuevoCapitulo').modal();
		this.obtenerLogeado();
		this.misParalelos();
		this.getLecciones();

	},

	el: '#preguntas',
	data: {
		lecciones: [],
		profesor: {},
		paralelos: []
	},
	methods: {
		nuevaPregunta: function(){

			window.location.href = '/profesores/leccion/crear'

		},
		eliminarLeccion: function(id){
			var self = this;
			var url = '/api/lecciones/' + id;
			this.$http.delete(url).then(response => {
				self.lecciones= [];
				this.getLecciones();			
			}, response => {
				//error callback
				console.log(response)
			});
		},
		
		crearModalEliminarLeccion: function(id, nombre){
			var self = this;
			var leccionId = id;
			//Primero hay que eliminar el modal-content. Sino cada vez que abran el modal se añadirá un p más
			$('#modalEliminarLeccionContent').empty();
			//Ahora si añadir las cosas
			var modalContentH4 = $('<h4/>').addClass('center-align').text('Eliminar');
			var modalContentP = $('<p/>').text('¿Seguro que desea eliminar la leccion: ' + nombre + ' con id: ' + id + '?')
			modalContentP.addClass('center-align')
			$('#modalEliminarLeccionContent').append(modalContentH4, modalContentP);
			//Lo mismo con el footer
			$('#modalEliminarLeccionFooter').empty();
			var btnEliminar = $('<a/>').attr({
				'href': '#!',
				'class': 'modal-action modal-close waves-effect waves-green btn-flat'
			});			
			btnEliminar.text('Eliminar');
			btnEliminar.click(function(){
				self.eliminarLeccion(leccionId);

			})
			var btnCancelar = $('<a/>').attr({
				'href': '#!',
				'class': 'modal-action modal-close waves-effect waves-green btn-flat'
			});
			btnCancelar.text('Cancelar');
			$('#modalEliminarLeccionFooter').append(btnEliminar, btnCancelar)
			$('#modalEliminarLeccion').modal('open');
		},
		getLecciones: function(){
			var self = this;
			this.$http.get('/api/lecciones').then(response => {
				//success callback				
				var leccionesObtenidas = response.body.datos;
				self.filtrarLecciones(leccionesObtenidas)
			}, response => {
				//error callback
				console.log(response)
			})

		},
		obtenerLogeado: function() {
      var self = this;
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
            self.profesor = res.body.datos;
          }
        });
    },
    filtrarLecciones: function(arrayLecciones){
    	var self = this;
    	$.each(arrayLecciones, function(index, leccion){
    		if(leccion.creador==self.profesor._id){
    			self.lecciones.push(leccion);
    		}
    	})
    },
    tomarLeccion: function(paralelo, id){
    	var self = this;
    	var url1 = '/api/lecciones/tomar/' + id;
    	//Actualizo el estado de la lección a 'tomando'
    	self.$http.post(url1).then(response => {
    		//Success callback
    		//Actualizo el estado del paralelo a dando leccion
    		if(response.body.estado){
    			var url2 = '/api/paralelos/' + paralelo + '/leccion/' + id;
    			self.$http.post(url2).then(response => {
    				//Success callback
    				if(response.body.estado){
    					var url3 = '/profesores/leccion-panel/' + id + '/paralelo/' + paralelo;
    					window.location.href = url3;
    				}
    			}, response => {
    				//Error callback
    				console.log('Error')
    				console.log(response)
    			})
    		}
    	}, response => {
    		//Error callback
    		console.log('Error')
    		console.log(response)
    	})
    },
    calificarLeccion: function(id){
    	//Completar esto luego de que Julio termine su parte
    },
    tomandoLeccion(paralelo, id_leccion) {
      window.location.href = `/profesores/leccion-panel/${id_leccion}/paralelo/${paralelo}`
    },
    misParalelos() {
      this.$http.get(`/api/paralelos/profesores/mis_paralelos`).then(response => {
        if (response.body.estado) {
          this.paralelos = response.body.datos
          console.log(this.paralelos)
        }
      }, response => {
        console.error('error')
      });
    }
		
	}
});

$('body').on("click", '#btnCapituloNuevo', function(){
	$('#modalNuevoCapitulo').modal('open');
})
