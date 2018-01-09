var practica = new Vue({
	el: '#tutorial',
	data: {
		capitulosObtenidos: [],
		tutoriales: [],
		preguntas: [],
		preguntasTutorial: [],
		profesor: {},
		tutorial: {
			nombre: '',
			tipo: 'tutorial',
			codigoMateria: '',
			nombreMateria: ''
		},
		capitulosF2: [],
		capitulosF3: [],
		materiaSeleccionada: '',
		tipoPreguntaSel: '',
		preguntasMostrar: [],
		capitulosMostrar: []
	},
	created: function(){
		this.obtenerUsuario(this);
		this.obtenerCapitulos(this);
	},
	mounted: function(){
		this.inicializarMaterialize(this);
	},
	methods: {
		inicializarMaterialize: function(self){
			$('.button-collapse').sideNav();
			$('.scrollspy').scrollSpy();
			$('.dropdown-button').dropdown();
			$('.modal').modal();
			$('select').material_select();
			//Escondo el banco de preguntas hasta que se seleccione una materia y un tipo
			$('#bancoPreguntas').css('display', 'none');
			/* Funciones on change */
			$('#select-materia').change(function(){
				self.materiaSeleccionada = $('#select-materia').val();
				if( $('#select-tipo-pregunta').val() != null ){
					self.tipoPreguntaSel = $('#select-tipo-pregunta').val();
					self.preguntasMostrar = self.filtrarPreguntasPorMateria(self.preguntas, self.materiaSeleccionada);
					self.preguntasMostrar = self.filtrarPreguntasPorTipoLeccion(self.preguntasMostrar, self.tipoPreguntaSel);
					self.capitulosMostrar = self.filtrarCapitulosPorMateria(self.capitulosObtenidos, self.materiaSeleccionada);
					self.dividirPreguntasEnCapitulos(self, self.preguntasMostrar, self.capitulosMostrar);
					$('#bancoPreguntas').css('display', 'block');
				} 
			});
			$('#select-tipo-pregunta').change(function(){
				self.tipoPreguntaSel = $('#select-tipo-pregunta').val();
				self.preguntasMostrar = self.filtrarPreguntasPorMateria(self.preguntas, self.materiaSeleccionada);
				self.preguntasMostrar = self.filtrarPreguntasPorTipoLeccion(self.preguntasMostrar, self.tipoPreguntaSel);
				self.capitulosMostrar = self.filtrarCapitulosPorMateria(self.capitulosObtenidos, self.materiaSeleccionada);
				self.dividirPreguntasEnCapitulos(self, self.preguntasMostrar, self.capitulosMostrar);
				$('#bancoPreguntas').css('display', 'block');
			});
		},
		obtenerUsuario: function(self) {
      this.$http.get('/api/session/usuario_conectado').
      then(res => {
        if (res.body.estado) {
        	self.profesor = res.body.datos;
        }
      });
    },
    obtenerCapitulos: function(self){
    	var url = '/api/capitulos/'
    	self.$http.get(url).then(response => {
    		self.capitulosObtenidos = response.body.datos;
    		$.each(self.capitulosObtenidos, function(index, capitulo){
    			if( capitulo.codigoMateria === 'FISG1002' ){
    				self.capitulosF2.push(capitulo);
    			}else if( capitulo.codigoMateria === 'FISG1003' ){
    				self.capitulosF3.push(capitulo);
    			}
    		});
    		self.obtenerPreguntas(self);
    	}, response => {
    		console.log('Hubo un error al obtener los tutoriales de la base de datos.');
    		console.log(response);
    	})
    },
    obtenerPreguntas: function(self){
    	var url = '/api/preguntas/';
    	self.$http.get(url).then(response => {
    		self.preguntas = response.body.datos;
    	}, response => {
    		console.log('Hubo un error al obtener las preguntas de la base de datos');
    	});
    },
    filtrarPreguntasPorMateria: function(arrayPreguntas, codigoMateria){
    	return $.grep( arrayPreguntas, function(pregunta, index){
    		if(pregunta.capitulo !== null)
    			return pregunta.capitulo.codigoMateria === codigoMateria;
    	});
    },
    filtrarPreguntasPorTipoLeccion: function(arrayPreguntas, tipoLeccion){
    	return $.grep( arrayPreguntas, function(pregunta, index){
    		return pregunta.tipoLeccion == tipoLeccion;
    	});
    },
    filtrarCapitulosPorMateria: function(arrayCapitulos, codigoMateria){
    	return $.grep( arrayCapitulos, function(capitulo, index){
    		return capitulo.codigoMateria === codigoMateria;
    	});
    },
    dividirPreguntasEnCapitulos: function(self, arrayPreguntas, arrayCapitulos){
    	$.each(self.capitulosMostrar, function(index, cap){
					cap.preguntas = [];
				});
    	$.each( arrayPreguntas, function(index, pregunta){
    		$.each( arrayCapitulos, function(j, capitulo){
    			if( pregunta.capitulo.nombre.toLowerCase() === capitulo.nombre.toLowerCase() ){
    				capitulo.preguntas.push(pregunta);
    				return false;
    			}
    		});
    	});
    },
    crearTutorial: function(){
    	var self = this;
    	var url = '/api/capitulos/';
    	self.$http.post(url, self.tutorial).then(response => {
    		self.tutoriales.push(self.tutorial);
    		self.tutorial.nombre = '';
    	}, response => {
    		console.log('Hubo un error al crear el tutorial.')
    		console.log(response);
    	})
    },
		nuevaPregunta: function(){
			window.location.href = '/profesores/preguntas/nueva-pregunta'

		},
		eliminarPregunta: function(id){
			var url = '/api/preguntas/' + id;
			// console.log(this.preg)
			this.$http.delete(url).then(response => {
				console.log(response)
				//ELIMINAR LA PREGUNTA DE SELF.CAPITULOS
				self.tutoriales = [];
				self.preguntas = [];
				this.getPreguntas();
			}, response => {
				//error callback
				console.log(response)
			});
			
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
		checkCreador: function(pregunta){
			var self = this;
			if(pregunta.creador==self.profesor._id) return true;
			return false
		},
		moment: function (date) {
      return moment(date);
    },
    date: function (date) {
      let es = moment().locale('es');
      if (date == undefined || date == '') {
        return '----'
      }
      return moment(date).format('DD MMMM HH:mm');
    },
	}
});

$('body').on('click', '#btnTutorialNuevo', function(){
	$('#modalNuevoTutorial').modal('open');
})

$('#select-materia').change(function(){
	practica.tutorial.nombreMateria = $('#select-materia option:selected').text();
	practica.tutorial.codigoMateria = $('#select-materia option:selected').val();
});


$('#select-materia-tutorial').change(function(){
	if($('#select-materia-tutorial option:selected').val()=='FISG1002'){
		practica.tutoriales = [];
		practica.tutoriales = practica.capitulosF2;
		console.log(practica.tutoriales)
	}else if($('#select-materia-tutorial option:selected').val()=='FISG1003'){
		practica.tutoriales = [];
		practica.tutoriales = practica.capitulosF3;
		console.log(practica.tutoriales)
	}
});