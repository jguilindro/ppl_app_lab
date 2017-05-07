var laboratorio = new Vue({
	el: '#laboratorio',
	data: {
		laboratoriosObtenidos: [],
		laboratorios: [],
		preguntas: [],
		preguntasLaboratorio: [],
		profesor: {},
		laboratorio: {
			nombre: '',
			tipo: 'laboratorio',
			nombreMateria: '',
			codigoMateria: ''
		},
		laboratoriosFisica2: [],
		laboratoriosFisica3: []
	},
	mounted: function(){
		//Materialize
		$('.button-collapse').sideNav();
		$(".dropdown-button").dropdown({ hover: false });
		$('.scrollspy').scrollSpy();
		$('#modalEliminarPregunta').modal();
		$('#modalNuevoLab').modal();
		$('select').material_select();
		//Flujo:  obtiene el usuario loggeado -> obtiene los laboratorios de la base de datos -> obtiene las preguntas de la base de datos -> clasifica las preguntas por laboratorios
		this.obtenerLogeado();
		this.obtenerLaboratorios();
	},
	methods: {
		obtenerLogeado: function() {
      var self = this;
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
          	self.profesor = res.body.datos;
          }
        });
    },
    obtenerLaboratorios: function(){
    	var self = this;
    	var url = '/api/capitulos';
    	self.$http.get(url).then(response => {
    		self.laboratoriosObtenidos = response.body.datos;
    		$.each(self.laboratoriosObtenidos, function(index, laboratorio){
    			if(laboratorio.tipo.toLowerCase()=='laboratorio'&&laboratorio.codigoMateria=='FISG1002'){
    				self.laboratoriosFisica2.push(laboratorio);
    			}else if(laboratorio.tipo.toLowerCase()=='laboratorio'&&laboratorio.codigoMateria=='FISG1003'){
    				self.laboratoriosFisica3.push(laboratorio);
    			}
    		});
    		self.obtenerPreguntas();
    	}, response => {
    		console.log('Hubo un error al obtener los laboratorios de la base de datos.');
    		console.log(response);
    	});
    },
    obtenerPreguntas: function(){
    	var self = this;
    	var url = '/api/preguntas/';
    	self.$http.get(url).then(response => {
    		self.preguntas = response.body.datos;
    		//Selecciono solo las que son de laboratorio
    		$.each(self.preguntas, function(index, pregunta){
    			if(pregunta.tipoLeccion.toLowerCase()=='laboratorio'){
    				self.preguntasLaboratorio.push(pregunta);
    			}
    		});
    		self.dividirPreguntasEnLaboratorios();
    	}, response => {
    		console.log('Hubo un error al obtener las preguntas de la base de datos');
    		console.log(response);
    	})
    },
    dividirPreguntasEnLaboratorios: function(){
    	var self = this;
    	$.each(self.preguntasLaboratorio, function(index, pregunta){
    		$.each(self.laboratoriosFisica2, function(j, laboratorio){
    			if(pregunta.laboratorio.toLowerCase()==laboratorio.nombre.toLowerCase()){
    				laboratorio.preguntas.push(pregunta);
    				return false;
    			}
    		});
    		$.each(self.laboratoriosFisica3, function(j, laboratorio){
    			if(pregunta.laboratorio.toLowerCase()==laboratorio.nombre.toLowerCase()){
    				laboratorio.preguntas.push(pregunta);
    				return false;
    			}
    		});
    	});
    	$.each(self.laboratoriosFisica2, function(index, laboratorio){
    		laboratorio.preguntas.sort(function(a, b){
    			 return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    		});
    	});
    	$.each(self.laboratoriosFisica3, function(index, laboratorio){
    		laboratorio.preguntas.sort(function(a, b){
    			 return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    		});
    	});
    },
    //Funciones
    crearLaboratorio: function(){
    	var self = this;
    	var url = '/api/capitulos/';
    	self.$http.post(url, self.laboratorio).then(response => {
    		self.laboratorios.push(self.laboratorio);
    		self.laboratorio.nombre = '';
    	}, response => {
    		console.log('Hubo un error al crear el laboratorio.')
    		console.log(response);
    	});
    },
		nuevaPregunta: function(){
			
			window.location.href = '/profesores/preguntas/nueva-pregunta'

		},
		eliminarPregunta: function(id){
			var url = '/api/preguntas/' + id;
			this.$http.delete(url).then(response => {
				console.log(response)
				//ELIMINAR LA PREGUNTA DE SELF.CAPITULOS
				self.laboratorios = [];
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
			//if(pregunta.creador=='') return true;
			if(pregunta.creador==self.profesor._id) return true;
			return false
		},

	}
});

$('body').on("click", '#btnLabNuevo', function(){
	$('#modalNuevoLab').modal('open');
})

document.addEventListener("DOMContentLoaded", function(event) {
  $.get({
    url: "/../navbar/profesores",
    success: function(data) {
      document.getElementById('#navbar').innerHTML = data;
      $(".button-collapse").sideNav();
      $(".dropdown-button").dropdown();
    }
  })
});

$('#select-materia').change(function(){
	laboratorio.laboratorio.nombreMateria = $('#select-materia option:selected').text();
	laboratorio.laboratorio.codigoMateria = $('#select-materia option:selected').val();
});

$('#select-materia-laboratorio').change(function(){
	//app.materiaEscogida.nombreMateria = $('#select-materia-laboratorio option:selected').text();
	//app.materiaEscogida.codigoMateria = $('#select-materia-laboratorio option:selected').val();
	if($('#select-materia-laboratorio option:selected').val()=='FISG1002'){
		laboratorio.laboratorios = [];
		laboratorio.laboratorios = laboratorio.laboratoriosFisica2;
		console.log(laboratorio.laboratorios)
	}else if($('#select-materia-laboratorio option:selected').val()=='FISG1003'){
		laboratorio.laboratorios = [];
		laboratorio.laboratorios = laboratorio.laboratoriosFisica3;
		console.log(laboratorio.laboratorios)
	}
});