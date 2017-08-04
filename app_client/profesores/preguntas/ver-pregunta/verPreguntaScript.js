var pregunta = new Vue({
	el: '#pregunta',
	mounted: function(){
		this.obtenerLogeado();
		//this.getPregunta();
		//Inicializadores de Materialize y MaterialNote		
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
			opciones: [],		//Se llena solo si tipoPregunta=='Opcion multiplie'
			tipoLeccion: '',	// Lección, tutorial o laboratorio
			tiempoEstimado: 0,
			creador: '',		//Se deberia llenar con las sesiones, trabajo de Julio Guilindro
			capitulo: '',		//Se llena solo si tipoLeccion=='leccion'
			tutorial: '',		//Se llena solo si tipoLeccion=='tutorial'
			laboratorio: '',	//Se llena solo si tipoLeccion=='Laboratorio'
			puntaje: 0
		},
		profesor: {},
		editable: false,
		eliminable: false
	},
	methods: {
		getPregunta: function(){
			var self = this;
			var preguntaId = window.location.href.toString().split('/')[6]
			var urlApi = '/api/preguntas/' + preguntaId;
			this.$http.get(urlApi).then(response => {
				//success callback
				this.preguntaObtenida = response.body.datos
				self.checkCreador();
				//$('#tipo-pregunta').val(this.preguntaObtenida.tipoPregunta)
			}, response => {
				//error callback
				console.log(response)
			})
		},
		mostrarEditar: function(){
			//Hago visible la parte de editar pregunta e invisible la parte de ver pregunta
			var self = this;
			if(self.editable){
				self.aux = !self.aux;
				//Copio los valores de la pregutaObtenida en preguntaEditar que será un temporal
				self.preguntaEditar = self.preguntaObtenida;
				console.log(self.preguntaEditar.tipoPregunta)
				//$('.myEditor').materialnote('code', self.preguntaEditar.descripcion)
				$('#firstEditor').code(self.preguntaEditar.descripcion);
				//$('#select-editar-tipo-pregunta').material_select('destroy');
				$('#select-editar-tipo-pregunta').material_select();
				$('#select-editar-tipo-pregunta option:selected').val(self.preguntaObtenida.tipoPregunta)
				$('.lblEditar').addClass('active')
			}
			else{
				alert('Usted no puede editar ni eliminar esta pregunta.');
			}			
		},
		prueba: function(){
			console.log($('#firstEditor').code())
			$('select').material_select();
			//$('#select-editar-tipo-pregunta').val(self.preguntaEditar.tipoPregunta)
		},
		mostrarModal: function(imageUrl){
			$("#myModal .modal-content").empty();
			$("<img>",{'src': imageUrl }).appendTo("#myModal .modal-content")
			$('#myModal').modal('open');
		},
		actualizarPregunta: function(){
			var self = this;
			if(self.editable){
				console.log('Pregunta actualizada: ');
				console.log(self.preguntaEditar);
				var preguntaId = window.location.href.toString().split('/')[6]
				var url = '/api/preguntas/' + preguntaId;
				this.$http.put(url, self.preguntaEditar).then(response => {
					//success callback
					//console.log(response);
					location.reload();
				}, response => {
					//error callback
					console.log(response)
				});
			}else{
				alert('Usted no puede editar ni eliminar esta pregunta.');
			}
			
		},
		eliminarPregunta: function(){
			var self = this;
			if(self.eliminable){
				var url = '/api/preguntas/'
				var preguntaId = window.location.href.toString().split('/')[6];
				url = url + preguntaId;
				this.$http.delete(url).then(response => {
					//Success callback
					window.location.href = '../';
				}, response => {
					console.log(response)
				});
			}else{
				alert('Usted no puede editar ni eliminar esta pregunta.');
			}
		},
		checkCreador: function(){
			var self = this;
			if(self.preguntaObtenida.creador==self.profesor._id){
				self.editable = true;
				self.eliminable = true;
			}
		},
		obtenerLogeado: function() {
      var self = this;
      this.$http.get('/api/session/usuario_conectado').
        then(res => {
          if (res.body.estado) {
          	self.profesor = res.body.datos;
          	self.getPregunta();
          }
        });
    }
	}
});


$('#select-editar-tipo-pregunta').change(function(){ 
	pregunta.$data.preguntaEditar.tipoPregunta = $('#select-editar-tipo-pregunta option:selected').val();
	//console.log(pregunta.$data.preguntaEditar.tipoPregunta)
	//console.log($('#select-editar-tipo-pregunta option:selected').text())
	//console.log(pregunta.$data.preguntaEditar)
});

$('#select-editar-tipo-leccion').change(function(){
	pregunta.$data.preguntaEditar.tipoLeccion = $('#select-editar-tipo-leccion option:selected').val();
});

$('#firstEditor').on('materialnote.change', function(we, contents, $editable) {
 	pregunta.$data.preguntaEditar.descripcion = contents;
  
})

document.addEventListener("DOMContentLoaded", function(event) {
  $.get({
    url: "../../navbar/profesores",
    success: function(data) {
      document.getElementById('#navbar').innerHTML = data;
      $(".button-collapse").sideNav();
      $(".dropdown-button").dropdown();
    }
  })
});

$('body').on('click','img',function(){
	pregunta.mostrarModal($(this).attr('src'));
})